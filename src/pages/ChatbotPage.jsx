import React, { useEffect, useState, useRef } from "react";
import ChatBox from "../components/chatbot/ChatBox";
import { postChat } from "../api/chatbot";
import { postOcrSticker } from "../api/client";

const toServerMessages = (history) =>
  history
    .filter((m) => ["user", "assistant", "me"].includes(m.role))
    .map((m) => ({
      role: m.role === "me" ? "user" : m.role,
      content: (m.text ?? m.content ?? "").toString(),
    }));

const ChatbotPage = () => {
  const [height, setHeight] = useState(() =>
    Math.max(
      520,
      (typeof window !== "undefined" ? window.innerHeight : 800) - 120
    )
  );
  const abortRef = useRef(null);

  useEffect(() => {
    const handle = () => setHeight(Math.max(520, window.innerHeight - 120));
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 940, display: "grid", gap: 16 }}>
        <ChatBox
          title="SafeTag Chatbot"
          height={height}
          onSend={async (_text, history, file) => {
            try {
              if (abortRef.current) abortRef.current.abort();
              abortRef.current = new AbortController();

              // 파일 업로드일 때: OCR + 발급
              if (file) {
                const jwt =
                  localStorage.getItem("access_token") ||
                  localStorage.getItem("jwt") ||
                  "";
                if (!jwt) return "로그인이 필요합니다.";

                // 1차: 저장된 차량번호로 시도
                let carNumber = localStorage.getItem("carNumber") || undefined;

                let res = await postOcrSticker(file, jwt, { carNumber });

                // 차량번호 미검출 실패 시 → 한 번 물어보고 재시도
                if (
                  res?.status === "FAILED" &&
                  /차량번호/.test(res?.reason || "")
                ) {
                  const input = window.prompt(
                    "차량번호를 입력해주세요. (예: 12가3456)"
                  );
                  if (!input)
                    return "차량번호가 없어 발급을 진행할 수 없습니다.";
                  carNumber = input.trim();
                  localStorage.setItem("carNumber", carNumber);
                  res = await postOcrSticker(file, jwt, { carNumber });
                }

                // 임산부인데 분만예정일을 못 찾은 경우만 한 번 더 질문 후 재시도
                if (res?.status === "SUCCESS") {
                  const isPregnant =
                    (res?.sticker?.type || res?.stickerType) === "PREGNANT";
                  const dueMissing =
                    !res?.debug?.dueDateFromForm &&
                    !res?.debug?.pregDueFromKeywords &&
                    !res?.debug?.pickedFutureDate;

                  if (isPregnant && dueMissing) {
                    const due = window.prompt(
                      "분만예정일을 입력해주세요 (예: 2026-08-22 또는 2026.08.22). 입력을 취소하면 기본 규정으로 발급됩니다."
                    );
                    if (due && due.trim()) {
                      res = await postOcrSticker(file, jwt, {
                        carNumber,
                        dueDate: due.trim(),
                      });
                    }
                  }
                }

                // 최종 분기
                if (res?.status !== "SUCCESS") {
                  return (
                    res?.reason ||
                    "발급에 실패했습니다. 잠시 후 다시 시도해주세요."
                  );
                }

                const s = res.sticker ?? {};
                const payload = {
                  stickerId: s.stickerId ?? "",
                  type: s.type ?? res?.stickerType ?? "PREGNANT",
                  carNumber: s.carNumber ?? carNumber ?? "",
                  issuedAt: s.issuedAt ?? new Date().toISOString(),
                  expiresAt: s.expiresAt ?? null,
                  imageUrl: s.imageUrl ?? "/Sticker.png",
                  issuer: s.issuer ?? "SAFETAG",
                };

                localStorage.setItem(
                  "safetag_my_sticker",
                  JSON.stringify(payload)
                );
                window.opener?.postMessage(
                  { type: "STICKER_ISSUED", payload },
                  "*"
                );
                window.parent?.postMessage(
                  { type: "STICKER_ISSUED", payload },
                  "*"
                );

                return "서류 접수 및 발급이 완료되었습니다. 스티커 화면으로 이동합니다.";
              }

              // 파일 없으면: 일반 대화
              const msgs = toServerMessages(history);
              if (
                _text &&
                (!msgs.length ||
                  msgs[msgs.length - 1].role !== "user" ||
                  msgs[msgs.length - 1].content !== _text)
              ) {
                msgs.push({ role: "user", content: _text });
              }

              const res = await postChat(msgs);
              return res.content ?? "";
            } catch (e) {
              console.error("[chatbot error]", e);
              return "잠시 후 다시 시도해주세요.";
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatbotPage;
