import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CallPage() {
  const { sessionId } = useParams(); // /call/:sessionId
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const wsRef = useRef(null);
  const localStreamRef = useRef(null);

  const [mediaReady, setMediaReady] = useState(false);
  const [wsReady, setWsReady] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  // UI 상태 (추가)
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  //  환경변수/기본값 세팅
  const WS_URL = useMemo(() => {
    const u =
      import.meta.env.VITE_WS_URL ||
      `${location.protocol === "https:" ? "wss" : "ws"}://${
        location.host
      }/ws/signaling`;
    return u;
  }, []);

  const TURN_HOST = import.meta.env.VITE_TURN_HOST || "43.201.38.71:3478"; // 내 EC2 퍼블릭 IP:포트
  const TURN_USER = import.meta.env.VITE_TURN_USER || "user"; //  coturn user
  const TURN_PASS = import.meta.env.VITE_TURN_PASS || "pass"; //  coturn pass

  // coturn + 구글 STUN을 함께 사용
  const rtcConfig = useMemo(
    () => ({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: [
            `turn:${TURN_HOST}?transport=udp`,
            `turn:${TURN_HOST}?transport=tcp`,
          ],
          username: TURN_USER,
          credential: TURN_PASS,
        },
      ],
    }),
    [TURN_HOST, TURN_USER, TURN_PASS]
  );

  //  초기화
  useEffect(() => {
    if (!sessionId) {
      alert("세션 정보가 없습니다.");
      navigate("/main", { replace: true });
      return;
    }

    let closed = false;

    const pc = new RTCPeerConnection(rtcConfig);
    pcRef.current = pc;

    // 연결 상태 변화 로그/표시 (추가)
    pc.onconnectionstatechange = () => {
      const st = pc.connectionState;
      // console.log("[PC] state:", st);
      if (st === "connected") setConnected(true);
      if (st === "disconnected" || st === "failed" || st === "closed") {
        setConnected(false);
      }
    };

    // 원격 트랙
    pc.ontrack = (e) => {
      if (remoteVideoRef.current)
        remoteVideoRef.current.srcObject = e.streams[0];
    };

    // 로컬 ICE 후보를 WS로 보냄
    pc.onicecandidate = (e) => {
      if (!e.candidate || !wsRef.current) return;
      if (wsRef.current.readyState !== WebSocket.OPEN) return;
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

    // 협상 필요 시 (상대가 늦게 들어와도 자동 offer)
    pc.onnegotiationneeded = async () => {
      try {
        if (
          !wsRef.current ||
          wsRef.current.readyState !== WebSocket.OPEN ||
          !mediaReady
        )
          return;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        wsRef.current.send(
          JSON.stringify({
            type: "offer",
            sdp: pc.localDescription,
            sessionId,
          })
        );
      } catch (e) {
        console.error("negotiationneeded error:", e);
      }
    };

    // 로컬 미디어
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true, // 필요시 false
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        if (pc.connectionState !== "closed" && pc.signalingState !== "closed") {
          stream.getTracks().forEach((t) => {
            try {
              pc.addTrack(t, stream);
            } catch (e) {
              console.warn("addTrack skipped:", e);
            }
          });
        }
        setMediaReady(true);

        // 초기 UI 상태 반영 (추가)
        const v = stream.getVideoTracks()[0];
        const a = stream.getAudioTracks()[0];
        setCamOn(!v || v.enabled);
        setMicOn(!a || a.enabled);
      } catch (e) {
        console.error("Media error:", e);
        setError("마이크/카메라 권한을 허용해주세요.");
      }
    })();

    // WS 연결
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
        const t = String(msg.type || "").toLowerCase();

        if (t === "ack") {
          // 방 입장 확인
        } else if (t === "joined") {
          // 상대도 방에 들어옴 → 내가 caller 쪽이면 offer 생성
          if (pcRef.current && mediaReady && wsReady) {
            const offer = await pcRef.current.createOffer();
            await pcRef.current.setLocalDescription(offer);
            wsRef.current?.send(
              JSON.stringify({
                type: "offer",
                sdp: pcRef.current.localDescription,
                sessionId,
              })
            );
          }
        } else if (t === "offer") {
          if (!pcRef.current) return;
          await pcRef.current.setRemoteDescription(msg.sdp);
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          wsRef.current?.send(
            JSON.stringify({
              type: "answer",
              sdp: pcRef.current.localDescription,
              sessionId,
            })
          );
          setConnected(true);
        } else if (t === "answer") {
          if (!pcRef.current) return;
          await pcRef.current.setRemoteDescription(msg.sdp);
          setConnected(true);
        } else if (t === "ice") {
          if (msg.candidate && pcRef.current) {
            try {
              await pcRef.current.addIceCandidate(msg.candidate);
            } catch (e) {
              console.warn("addIceCandidate error:", e);
            }
          }
        } else if (t === "left") {
          setConnected(false);
        }
      } catch (e) {
        console.warn("WS message parse error:", e);
      }
    };

    ws.onerror = () => setError("시그널링 서버 연결 오류가 발생했습니다.");
    ws.onclose = () => {
      if (!closed) setConnected(false);
    };

    // 종료/이탈 시 정리
    const onUnload = () => {
      try {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "leave", sessionId }));
        }
      } catch {}
      try {
        wsRef.current?.close();
      } catch {}
      try {
        pcRef.current
          ?.getSenders()
          .forEach((s) => s.track && s.replaceTrack(null));
        pcRef.current?.close();
      } catch {}
      try {
        const s = localStreamRef.current;
        s?.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      } catch {}
      try {
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      } catch {}
    };
    window.addEventListener("beforeunload", onUnload);

    // cleanup
    return () => {
      closed = true;
      window.removeEventListener("beforeunload", onUnload);
      onUnload();
    };
  }, [sessionId, WS_URL, rtcConfig, navigate, mediaReady, wsReady]);

  // 수동 “통화 시작” 버튼 (원하면 자동만 써도 됨)
  const startManually = async () => {
    try {
      if (!pcRef.current || !wsRef.current || !mediaReady) return;
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      wsRef.current.send(
        JSON.stringify({
          type: "offer",
          sdp: pcRef.current.localDescription,
          sessionId,
        })
      );
    } catch (e) {
      console.error(e);
    }
  };

  //  카메라 토글
  const toggleCamera = () => {
    const s = localStreamRef.current;
    if (!s) return;
    const v = s.getVideoTracks()[0];
    if (!v) return;
    v.enabled = !v.enabled; // 레이아웃/연결 유지하면서 화면만 끔
    setCamOn(v.enabled);

    // 완전 전송중단 원할 땐 아래 주석 사용 (대역폭 절약):
    // const sender = pcRef.current?.getSenders().find(sd => sd.track?.kind === "video");
    // sender?.replaceTrack(v.enabled ? v : null);
  };

  //  마이크 토글
  const toggleMic = () => {
    const s = localStreamRef.current;
    if (!s) return;
    const a = s.getAudioTracks()[0];
    if (!a) return;
    a.enabled = !a.enabled;
    setMicOn(a.enabled);
  };

  //  통화 종료
  const endCall = () => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "leave", sessionId }));
      }
    } catch {}
    try {
      wsRef.current?.close();
    } catch {}
    try {
      pcRef.current
        ?.getSenders()
        .forEach((s) => s.track && s.replaceTrack(null));
      pcRef.current?.close();
      pcRef.current = null;
    } catch {}
    try {
      const s = localStreamRef.current;
      s?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    } catch {}
    navigate("/main", { replace: true });
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>익명 통화</h2>

      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "45%", border: "1px solid #ccc", background: "#000" }}
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: "45%", border: "1px solid #ccc", background: "#000" }}
        />
      </div>

      {/* 컨트롤 바 (추가) */}
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          marginTop: 16,
        }}
      >
        <button
          onClick={toggleMic}
          style={{ padding: "10px 16px", borderRadius: 8 }}
        >
          {micOn ? "마이크 끄기" : "마이크 켜기"}
        </button>
        <button
          onClick={toggleCamera}
          style={{ padding: "10px 16px", borderRadius: 8 }}
        >
          {camOn ? "카메라 끄기" : "카메라 켜기"}
        </button>
        <button
          onClick={endCall}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            background: "#e53935",
            color: "#fff",
          }}
        >
          통화 종료
        </button>
      </div>

      <button
        onClick={startManually}
        disabled={!wsReady || !mediaReady}
        style={{ marginTop: 16 }}
      >
        {connected ? "연결됨" : wsReady ? "통화 시작(수동)" : "WS 연결 중..."}
      </button>

      {error && (
        <p style={{ color: "crimson", marginTop: 12, fontSize: 14 }}>{error}</p>
      )}
    </div>
  );
}
