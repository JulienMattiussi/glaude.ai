"use client";

import { useState, useRef, useEffect } from "react";
import type { Message } from "../types";

const CHAR_DELAY_MS = 40;

export function useTypewriter(messages: Message[]) {
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [streamedText, setStreamedText] = useState("");
  const lastSeenIdRef = useRef<string | null>(null);

  useEffect(() => {
    const lastMsg = messages.at(-1);
    if (!lastMsg || lastMsg.role !== "assistant") return;
    if (lastMsg.id === lastSeenIdRef.current) return;
    lastSeenIdRef.current = lastMsg.id;

    const fullText = lastMsg.content;
    setStreamingId(lastMsg.id);
    setStreamedText("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setStreamedText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        setStreamingId(null);
      }
    }, CHAR_DELAY_MS);

    return () => clearInterval(interval);
  }, [messages]);

  return { streamingId, streamedText };
}
