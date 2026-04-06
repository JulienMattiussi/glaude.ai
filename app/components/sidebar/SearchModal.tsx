"use client";

import { useState, useEffect, useRef } from "react";
import { Icon } from "../icons/Icon";
import { relativeTime } from "../../lib/time";
import type { Conversation } from "../../types";

function lastActivity(conversation: Conversation): number {
  const last = conversation.messages.at(-1);
  if (!last) return parseInt(conversation.id);
  return parseInt(last.id.split("-")[0]);
}

const ChatIcon = () => (
  <span className="text-(--muted) shrink-0">
    <Icon>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Icon>
  </span>
);

export default function SearchModal({
  conversations,
  onSelect,
  onClose,
}: {
  conversations: Conversation[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results =
    query.trim() === ""
      ? conversations.slice(0, 3)
      : conversations.filter(
          (c) =>
            c.title.toLowerCase().includes(query.toLowerCase()) ||
            c.messages.some((m) => m.content.toLowerCase().includes(query.toLowerCase()))
        );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && results[highlighted]) {
      onSelect(results[highlighted].id);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32" onClick={onClose}>
      <div
        className="bg-(--input-bg) rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-(--border)"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-(--border)">
          <span className="text-(--muted) shrink-0">
            <Icon>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </Icon>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlighted(0);
            }}
            placeholder="Rechercher dans les discussions."
            className="flex-1 bg-transparent text-sm text-(--foreground) placeholder:text-(--muted) focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-(--muted) hover:text-(--foreground) transition-colors"
          >
            <Icon size={14}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </Icon>
          </button>
        </div>

        <div className="py-2 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-sm text-(--muted) text-center py-6">Aucun résultat</p>
          ) : (
            results.map((conversation, i) => (
              <button
                key={conversation.id}
                onClick={() => onSelect(conversation.id)}
                onMouseEnter={() => setHighlighted(i)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors ${
                  i === highlighted ? "bg-(--hover-bg)" : ""
                }`}
              >
                <ChatIcon />
                <span className="flex-1 text-sm text-(--foreground) truncate">
                  {conversation.title}
                </span>
                <span className="text-xs text-(--muted) shrink-0">
                  {i === 0 && query.trim() === ""
                    ? "Entrée"
                    : relativeTime(lastActivity(conversation))}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
