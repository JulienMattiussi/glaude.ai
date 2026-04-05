"use client";

import { useState, useRef, useEffect } from "react";
import GlaudeIcon from "./GlaudeIcon";
import AnimatedGlaudeIcon from "./AnimatedGlaudeIcon";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatAreaProps {
  conversationId: string | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  userName?: string;
}


const ToolIcons = () => (
  <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
    {["G", "G", "A", "C", "A", "C", "●"].map((icon, i) => (
      <span
        key={i}
        className="w-5 h-5 rounded-full bg-[var(--hover-bg)] flex items-center justify-center text-[10px] font-bold"
        style={{ color: "var(--muted)" }}
      >
        {icon}
      </span>
    ))}
    <span className="ml-0.5">›</span>
  </div>
);

export default function ChatArea({
  conversationId,
  messages,
  onSendMessage,
  userName = "Juju",
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "Bonne nuit";
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {isEmpty ? (
        /* Welcome screen */
        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4">
          <div className="flex items-center gap-3">
            <span className="text-[var(--accent)]">
              <AnimatedGlaudeIcon size={32} />
            </span>
            <h1 className="text-3xl font-medium text-[var(--foreground)]">
              {getGreeting()}, {userName}.
            </h1>
          </div>
          <div className="w-full max-w-2xl">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              textareaRef={textareaRef}
            />
          </div>
        </div>
      ) : (
        /* Conversation view */
        <>
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex-shrink-0 flex items-center justify-center mt-0.5 text-white">
                      <GlaudeIcon size={14} />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-lg ${
                      msg.role === "user"
                        ? "bg-[var(--hover-bg)] text-[var(--foreground)]"
                        : "text-[var(--foreground)]"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="max-w-2xl mx-auto">
              <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                textareaRef={textareaRef}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ChatInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  onInput,
  textareaRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onInput: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <div className="bg-[var(--input-bg)] rounded-2xl shadow-sm border border-[var(--border)]">
      <div className="px-4 pt-3 pb-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onInput={onInput}
          placeholder="Comment puis-je vous aider ?"
          rows={1}
          className="w-full resize-none bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none min-h-[24px] max-h-[200px]"
        />
      </div>
      <div className="flex items-center justify-between px-3 pb-3">
        <button className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-[var(--hover-bg)] text-[var(--muted)] transition-colors">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors px-2 py-1 rounded-md hover:bg-[var(--hover-bg)]">
            <span>Bombé 4.6</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <button className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
          {value.trim() && (
            <button
              onClick={onSubmit}
              className="w-7 h-7 rounded-full bg-[var(--foreground)] flex items-center justify-center hover:opacity-80 transition-opacity"
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
      <div className="flex items-center justify-between px-3 pb-2.5 border-t border-[var(--border)] pt-2">
        <span className="text-xs text-[var(--muted)]">Connectez vos outils à Glaude</span>
        <ToolIcons />
      </div>
    </div>
  );
}
