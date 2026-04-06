"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import type { Message } from "../types";

const CHAR_DELAY_MS = 20;
const WORD_DELAY_MS = 30;
const LONG_TEXT_THRESHOLD = 200;

export function useTypewriter(messages: Message[]) {
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [streamedText, setStreamedText] = useState("");
  const lastSeenIdRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const lastMsg = messages.at(-1);
    if (!lastMsg || lastMsg.role !== "assistant") return;
    if (lastMsg.id === lastSeenIdRef.current) return;
    lastSeenIdRef.current = lastMsg.id;

    const fullText = lastMsg.content;
    setStreamingId(lastMsg.id);
    setStreamedText("");

    if (fullText.length <= LONG_TEXT_THRESHOLD) {
      // Character by character for short responses
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
    } else {
      // Word by word for long responses
      const words = fullText.split(" ");
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setStreamedText(words.slice(0, i).join(" "));
        if (i >= words.length) {
          clearInterval(interval);
          setStreamingId(null);
        }
      }, WORD_DELAY_MS);
      return () => clearInterval(interval);
    }
  }, [messages]);

  return { streamingId, streamedText };
}
