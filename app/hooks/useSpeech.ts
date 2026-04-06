"use client";

import { useState, useRef, useCallback, useEffect } from "react";

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    continuous: boolean;
    start(): void;
    stop(): void;
    onresult: ((e: SpeechRecognitionEvent) => void) | null;
    onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
  }
  interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }
  interface SpeechRecognitionResultList {
    readonly length: number;
    [index: number]: SpeechRecognitionResult;
  }
  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    [index: number]: SpeechRecognitionAlternative;
  }
  interface SpeechRecognitionAlternative {
    readonly transcript: string;
  }
}

export type SpeechStatus = "idle" | "recording" | "unavailable";

const BLOCKING_ERRORS = ["network", "service-not-allowed", "not-allowed"];

export function useSpeech(onTranscript: (text: string) => void) {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [apiSupported, setApiSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const stoppedManuallyRef = useRef(false);
  // Always call the latest onTranscript, avoiding stale closure in recognition callbacks
  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  });

  useEffect(() => {
    setApiSupported("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  }, []);

  const startRecording = useCallback(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      setStatus("unavailable");
      return;
    }
    const recognition = new SR();
    recognition.lang = "fr-FR";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;
    stoppedManuallyRef.current = false;

    recognition.onresult = (e) => {
      let finalText = "";
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interimText += r[0].transcript;
      }
      const text = (finalText || interimText).trim();
      if (text) onTranscriptRef.current(text);
    };

    recognition.onerror = (e) => {
      stoppedManuallyRef.current = true;
      if (BLOCKING_ERRORS.includes(e.error)) setStatus("unavailable");
      else setStatus("idle");
    };

    recognition.onend = () => {
      if (!stoppedManuallyRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch {
            setStatus("idle");
          }
        }, 100);
      }
    };

    recognition.start();
    setStatus("recording");
  }, []);

  const stopRecording = useCallback(() => {
    stoppedManuallyRef.current = true;
    recognitionRef.current?.stop();
    setStatus("idle");
  }, []);

  return { status, apiSupported, startRecording, stopRecording };
}
