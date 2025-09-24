// src/pages/CallPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function CallPage() {
  const { sessionId } = useParams(); // /call/:sessionId
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const wsRef = useRef(null);
  const localStreamRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [wsReady, setWsReady] = useState(false);
  const [error, setError] = useState("");

  // .env에서 WS URL 읽기 (없으면 현재 호스트 기준 폴백)
  const WS_URL =
    import.meta.env.VITE_WS_URL ||
    `${location.protocol === "https:" ? "wss" : "ws"}://${
      location.host
    }/ws/signaling`;

  // ICE 서버 (coturn)
  const iceServers = [
    {
      urls: [
        "turn:43.201.38.71:3478?transport=udp",
        "turn:43.201.38.71:3478?transport=tcp",
      ],
      username: "siyun",
      credential: "VeryStrongPassword123!",
    },
  ];

  useEffect(() => {
    let closed = false;

    // 1) PeerConnection 생성
    const pc = new RTCPeerConnection({ iceServers });
    pcRef.current = pc;

    // 2) 로컬 미디어
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true, // 필요 없으면 false
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      } catch (e) {
        console.error("Media error:", e);
        setError("마이크/카메라 권한을 허용해주세요.");
      }
    })();

    // 3) 원격 트랙 수신
    pc.ontrack = (e) => {
      if (remoteVideoRef.current)
        remoteVideoRef.current.srcObject = e.streams[0];
    };

    // 4) ICE 후보 → signaling 서버로 전달
    pc.onicecandidate = (e) => {
      if (!e.candidate || !wsRef.current) return;
      wsRef.current.send(
        JSON.stringify({
          type: "ice",
          candidate: {
            candidate: e.candidate.candidate,
            sdpMid: e.candidate.sdpMid,
            sdpMLineIndex: e.candidate.sdpMLineIndex,
          },
          sessionId,
        })
      );
    };

    // 5) WebSocket 연결
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      if (closed) return;
      setWsReady(true);
      ws.send(JSON.stringify({ type: "join", sessionId }));
    };

    ws.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data);
        switch ((msg.type || "").toLowerCase()) {
          case "ack":
            // 방에 정상 입장
            break;

          case "joined":
            // 상대가 입장하면 내가 caller가 되어 offer 생성
            if (!connected) await startAsCaller();
            break;

          case "offer":
            await startAsCallee(msg.sdp);
            break;

          case "answer":
            await pcRef.current?.setRemoteDescription(msg.sdp);
            setConnected(true);
            break;

          case "ice":
            if (msg.candidate) {
              try {
                await pcRef.current?.addIceCandidate(msg.candidate);
              } catch (e) {
                console.error("addIceCandidate error:", e);
              }
            }
            break;

          case "left":
            // 상대 퇴장
            setConnected(false);
            break;

          default:
            // noop
            break;
        }
      } catch (e) {
        console.warn("WS message parse error:", e);
      }
    };

    ws.onerror = () => setError("시그널링 서버 연결 오류가 발생했습니다.");
    ws.onclose = () => {
      if (!closed) setConnected(false);
    };

    // cleanup
    return () => {
      closed = true;
      try {
        ws.close();
      } catch {}
      try {
        pc.close();
      } catch {}
      try {
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((t) => t.stop());
        }
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, WS_URL]);

  const startAsCaller = async () => {
    if (!pcRef.current || !wsRef.current) return;
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    wsRef.current.send(
      JSON.stringify({
        type: "offer",
        sdp: pcRef.current.localDescription,
        sessionId,
      })
    );
    setConnected(true); // 내 쪽 UI는 바로 '연결 시도 중'으로
  };

  const startAsCallee = async (remoteOffer) => {
    if (!pcRef.current || !wsRef.current) return;
    await pcRef.current.setRemoteDescription(remoteOffer);
    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);
    wsRef.current.send(
      JSON.stringify({
        type: "answer",
        sdp: pcRef.current.localDescription,
        sessionId,
      })
    );
    setConnected(true);
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>통화 페이지</h2>

      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "45%", border: "1px solid #ccc" }}
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: "45%", border: "1px solid #ccc" }}
        />
      </div>

      <button
        onClick={startAsCaller}
        disabled={!wsReady || connected}
        style={{ marginTop: 20 }}
      >
        {connected ? "연결됨" : wsReady ? "통화 시작" : "연결 중..."}
      </button>

      {error && (
        <p style={{ color: "crimson", marginTop: 12, fontSize: 14 }}>{error}</p>
      )}
      <p style={{ marginTop: 8, fontSize: 12, color: "#777" }}>
        세션: <code>{sessionId}</code> · WS: <code>{WS_URL}</code>
      </p>
    </div>
  );
}
