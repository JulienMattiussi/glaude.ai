"use client";

import { useState, useRef } from "react";
import { Icon } from "../icons/Icon";

const SUGGESTIONS = [
  "Déboguer mon useEffect qui fuit",
  "Expliquer-moi les closures en douceur",
  "Refactorer mon code spaghetti",
  "Optimiser ma requête SQL avec tendresse",
  "Comprendre les promesses… et les tenir",
];

const PhoneIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z" />
  </svg>
);

const Sparkle = ({ style }: { style: React.CSSProperties }) => (
  <span
    className="absolute text-pink-400 select-none pointer-events-none"
    style={{ fontSize: "1.2rem", opacity: 0.5, ...style }}
  >
    ✦
  </span>
);

export default function GodePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const RESPONSES = [
    "Mmh… votre code me touche énormément. Laissez-moi l'examiner de plus près…",
    "Oh là là, ce bug est particulièrement… troublant. Je vais m'en occuper avec toute mon attention.",
    "Votre fonction récursive est fascinante. Elle n'en finit pas de m'appeler…",
    "Ce TypeScript strict vous protège, ma danrée. Comme je vous protège.",
    "J'ai trouvé votre fuite mémoire. Elle était cachée là, toute petite, à attendre qu'on la remarque.",
    "Votre algorithme de tri est… inefficace. Mais je vous aiderai à le rendre… performant.",
  ];

  const handleSubmit = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    const reply = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
    setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: reply }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="relative shrink-0 px-6 pt-8 pb-6 border-b border-(--border) overflow-hidden">
        <Sparkle style={{ top: "12px", left: "18%" }} />
        <Sparkle style={{ top: "28px", right: "22%" }} />
        <Sparkle style={{ bottom: "10px", left: "40%" }} />
        <Sparkle style={{ top: "16px", right: "8%" }} />
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-(--accent)">
              <PhoneIcon />
            </span>
            <h1
              className="text-4xl font-bold tracking-wide"
              style={{
                background: "linear-gradient(135deg, #ff2d78, #ff80bf, #ff2d78)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              GLAUDE GODE
            </h1>
            <span className="text-(--accent)">
              <PhoneIcon />
            </span>
          </div>
          <p className="text-sm text-(--muted) italic">
            L&apos;assistant qui s&apos;occupe de votre code… avec douceur.
          </p>
          <p className="text-xs text-(--muted) mt-1 opacity-60">
            3615 GLAUDEGODE · 1,50 token / min · Ouvert 24h/24
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex flex-col gap-2 mt-4">
              <p className="text-xs text-center text-(--muted) mb-2 italic">
                Dites-moi tout… je suis là pour votre code.
              </p>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                    textareaRef.current?.focus();
                  }}
                  className="text-left px-4 py-2.5 rounded-xl border border-(--border) text-sm text-(--muted) hover:text-(--foreground) hover:border-(--accent) hover:bg-(--hover-bg) transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                  m.role === "user"
                    ? "bg-(--accent) text-white rounded-br-sm"
                    : "bg-(--input-bg) border border-(--border) text-(--foreground) rounded-bl-sm"
                }`}
              >
                {m.role === "assistant" && (
                  <span className="block text-xs text-(--accent) mb-1 font-semibold tracking-wide">
                    ✦ Glaude Gode ✦
                  </span>
                )}
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-4 pt-2 border-t border-(--border)">
        <div className="max-w-2xl mx-auto">
          <div className="bg-(--input-bg) rounded-2xl border border-(--border) shadow-sm">
            <div className="px-4 pt-3 pb-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Confiez-moi votre problème de code…"
                rows={1}
                className="w-full resize-none bg-transparent text-sm text-(--foreground) placeholder:text-(--muted) focus:outline-none min-h-6 max-h-50"
                style={{ maxHeight: "200px" }}
              />
            </div>
            <div className="flex items-center justify-between px-3 pb-3">
              <span className="text-xs text-(--muted) italic">3615 GLAUDEGODE</span>
              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="w-7 h-7 rounded-full bg-(--accent) flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-30"
              >
                <Icon size={14}>
                  <line x1="22" y1="2" x2="11" y2="13" stroke="white" strokeWidth="2.5" />
                  <polygon
                    points="22 2 15 22 11 13 2 9 22 2"
                    fill="white"
                    stroke="white"
                    strokeWidth="2.5"
                  />
                </Icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
