"use client";

import { useEffect, useRef } from "react";
import { Icon } from "../icons/Icon";
import { useSpeech } from "../../hooks/useSpeech";

const ToolIcons = () => (
  <div className="flex items-center gap-1.5 text-xs text-(--muted)">
    {["G", "G", "A", "C", "A", "C", "●"].map((icon, i) => (
      <span
        key={i}
        className="w-5 h-5 rounded-full bg-(--hover-bg) flex items-center justify-center text-[10px] font-bold text-(--muted)"
      >
        {icon}
      </span>
    ))}
    <span className="ml-0.5">›</span>
  </div>
);

export interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onInput: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  disabled?: boolean;
}

export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  onInput,
  textareaRef,
  disabled,
}: ChatInputProps) => {
  // Prefix = value at the moment recording started; speech replaces everything after it
  const prefixRef = useRef("");

  const { status, apiSupported, startRecording, stopRecording } = useSpeech((text) =>
    onChange(prefixRef.current ? prefixRef.current.trimEnd() + " " + text : text)
  );

  const isListening = status === "recording";

  const handleMicClick = () => {
    if (isUnavailable) return;
    if (isListening) {
      stopRecording();
      return;
    }
    prefixRef.current = value;
    startRecording();
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [value, textareaRef]);

  const isUnavailable = !apiSupported || status === "unavailable";

  const micTooltip = isUnavailable
    ? "Dictée non disponible sur ce navigateur"
    : isListening
      ? "Arrêter l'enregistrement"
      : "Dicter un message";

  return (
    <div
      className={`bg-(--input-bg) rounded-2xl shadow-sm border border-(--border) ${disabled ? "opacity-60" : ""}`}
    >
      <div className="px-4 pt-3 pb-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onInput={onInput}
          placeholder={isListening ? "À l'écoute..." : "Comment puis-je vous aider ?"}
          rows={1}
          disabled={disabled}
          className="w-full resize-none bg-transparent text-sm text-(--foreground) placeholder:text-(--muted) focus:outline-none min-h-6 max-h-50 disabled:cursor-not-allowed"
        />
      </div>
      <div className="flex items-center justify-between px-3 pb-3">
        <button className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-(--hover-bg) text-(--muted) transition-colors">
          <Icon>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </Icon>
        </button>
        <div className="flex items-center gap-2">
          {!isListening && (
            <button className="flex items-center gap-1.5 text-xs text-(--muted) hover:text-(--foreground) transition-colors px-2 py-1 rounded-md hover:bg-(--hover-bg)">
              <span>Bombé 4.6</span>
              <Icon size={12}>
                <polyline points="6 9 12 15 18 9" />
              </Icon>
            </button>
          )}
          <div className="relative group">
            <button
              onClick={handleMicClick}
              disabled={disabled}
              className={`transition-colors disabled:opacity-40 ${
                isUnavailable
                  ? "text-(--muted) opacity-40 cursor-not-allowed"
                  : isListening
                    ? "text-(--accent)"
                    : "text-(--muted) hover:text-(--foreground)"
              }`}
              title={micTooltip}
            >
              <Icon>
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </Icon>
            </button>
            {isUnavailable && (
              <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1.5 rounded-lg bg-(--foreground) text-(--background) text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Dictée non disponible sur ce navigateur
              </div>
            )}
          </div>
          {isListening && (
            <button
              onClick={stopRecording}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-(--hover-bg) text-(--foreground) text-xs font-medium hover:opacity-80 transition-opacity"
            >
              <span className="tracking-widest text-(--muted)">···</span>
              Arrêter
            </button>
          )}
          {value.trim() && !disabled && !isListening && (
            <button
              onClick={onSubmit}
              className="w-7 h-7 rounded-full bg-(--foreground) flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between px-3 pb-2.5 border-t border-(--border) pt-2">
        <span className="text-xs text-(--muted)">Connectez vos outils au Glaude</span>
        <ToolIcons />
      </div>
    </div>
  );
};
