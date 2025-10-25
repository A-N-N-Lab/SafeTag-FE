import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

const STORAGE_KEY = "safetag_my_sticker";
const CHATBOT_URL = "/chatbot";
const ChatbotLauncher = forwardRef(function ChatbotLauncher(
  { onIssued = () => {}, renderButton = true },
  ref
) {
  const winRef = useRef(null);

  useEffect(() => {
    const onMessage = (e) => {
      const data = e.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "STICKER_ISSUED" && data.payload) {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              stickerId: data.payload.stickerId || data.payload.id || "",
              type: data.payload.type || data.payload.stickerType || "PREGNANT",
              carNumber:
                data.payload.carNumber || data.payload.vehicleNumber || "",
              issuedAt: data.payload.issuedAt || new Date().toISOString(),
              expiresAt: data.payload.expiresAt || null,
              imageUrl: data.payload.imageUrl || "/Sticker.png",
              issuer: data.payload.issuer || "SAFETAG",
            })
          );
        } catch {}
        onIssued();
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onIssued]);

  const openChat = () => {
    if (!winRef.current || winRef.current.closed) {
      winRef.current = window.open(
        CHATBOT_URL,
        "_blank",
        "width=420,height=700"
      );
    } else {
      winRef.current.focus();
    }
  };

  useImperativeHandle(ref, () => ({ open: openChat }), []);

  if (!renderButton) return null;
  return (
    <button onClick={openChat} style={{ width: "100%", height: 44 }}>
      챗봇 열기 (서류 제출/발급)
    </button>
  );
});

export default ChatbotLauncher;
