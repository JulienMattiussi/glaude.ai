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
  onUserMessage: (text: string) => string;
  onAssistantReply: (convId: string) => void;
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

const MessageActions = () => (
  <div className="flex items-center gap-1 mt-2 ml-1">
    {/* Copy */}
    <button
      className="p-1.5 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
      title="Copier"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </button>
    {/* Thumbs up */}
    <button
      className="p-1.5 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
      title="Bonne réponse"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
    </button>
    {/* Thumbs down */}
    <button
      className="p-1.5 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
      title="Mauvaise réponse"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
        <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
      </svg>
    </button>
    {/* Retry */}
    <button
      className="p-1.5 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
      title="Régénérer"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
      </svg>
    </button>
  </div>
);

export default function ChatArea({
  conversationId,
  messages,
  onUserMessage,
  onAssistantReply,
  userName = "Juju",
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
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
    if (!input.trim() || isThinking) return;
    const text = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const convId = onUserMessage(text);
    setIsThinking(true);
    const delay = 500 + Math.random() * 2500;
    setTimeout(() => {
      onAssistantReply(convId);
      setIsThinking(false);
    }, delay);
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
  }, [messages, isThinking]);

  const isEmpty = messages.length === 0 && !isThinking;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {isEmpty ? (
        /* Welcome screen */
        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4">
          <div className="flex items-center gap-3">
            <span className="text-[var(--accent)]">
              <AnimatedGlaudeIcon size={48} />
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
              disabled={isThinking}
            />
          </div>
        </div>
      ) : (
        /* Conversation view */
        <>
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
              {messages.map((msg, i) => {
                const isLast = i === messages.length - 1;
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex flex-col">
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-lg ${
                          msg.role === "user"
                            ? "bg-[var(--hover-bg)] text-[var(--foreground)]"
                            : "text-[var(--foreground)]"
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.role === "assistant" && (
                        <>
                          <MessageActions />
                          {isLast && !isThinking && (
                            <span className="text-[var(--accent)] mt-2 ml-1">
                              <GlaudeIcon size={48} />
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Thinking indicator */}
              {isThinking && (
                <div className="flex gap-3 justify-start">
                  <span className="text-[var(--accent)]">
                    <AnimatedGlaudeIcon size={30} fast />
                  </span>
                </div>
              )}

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
                disabled={isThinking}
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
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onInput: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  disabled?: boolean;
}) {
  return (
    <div
      className={`bg-[var(--input-bg)] rounded-2xl shadow-sm border border-[var(--border)] ${disabled ? "opacity-60" : ""}`}
    >
      <div className="px-4 pt-3 pb-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onInput={onInput}
          placeholder="Comment puis-je vous aider ?"
          rows={1}
          disabled={disabled}
          className="w-full resize-none bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none min-h-[24px] max-h-[200px] disabled:cursor-not-allowed"
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
          {value.trim() && !disabled && (
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
