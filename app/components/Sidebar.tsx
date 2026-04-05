"use client";

import { useState } from "react";
import GlaudeIcon from "./GlaudeIcon";

const IconSquare = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconPlus = () => (
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
);

const IconSearch = () => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconSliders = () => (
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
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

const IconChat = () => (
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
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconCode = () => (
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
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconLayers = () => (
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
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

interface SidebarProps {
  onNewConversation: () => void;
  conversations: { id: string; title: string }[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export default function Sidebar({
  onNewConversation,
  conversations,
  activeConversationId,
  onSelectConversation,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="w-12 flex flex-col items-center py-3 gap-3 border-r border-[var(--border)] bg-[var(--sidebar-bg)]">
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 rounded-md hover:bg-[var(--hover-bg)] text-[var(--muted)] transition-colors"
          title="Développer"
        >
          <IconSquare />
        </button>
      </div>
    );
  }

  return (
    <div className="w-56 flex flex-col h-full bg-[var(--sidebar-bg)] border-r border-[var(--border)]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[var(--accent)]">
            <GlaudeIcon size={30} />
          </span>
          <span className="font-semibold text-sm text-[var(--foreground)]">Glaude</span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1.5 rounded-md hover:bg-[var(--hover-bg)] text-[var(--muted)] transition-colors"
          title="Réduire"
        >
          <IconSquare />
        </button>
      </div>

      {/* Nav items */}
      <nav className="px-2 flex flex-col gap-0.5">
        <button
          onClick={onNewConversation}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors w-full text-left"
        >
          <span className="text-[var(--muted)]">
            <IconPlus />
          </span>
          Nouvelle conversation
        </button>
        <button className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors w-full text-left">
          <span className="text-[var(--muted)]">
            <IconSearch />
          </span>
          Rechercher
        </button>
        <button className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors w-full text-left">
          <span className="text-[var(--muted)]">
            <IconSliders />
          </span>
          Personnaliser
        </button>
      </nav>

      {/* Divider */}
      <div className="h-px bg-[var(--border)] mx-3 my-2" />

      {/* Section links */}
      <nav className="px-2 flex flex-col gap-0.5">
        <button className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors w-full text-left">
          <span className="text-[var(--muted)]">
            <IconChat />
          </span>
          Discussions
        </button>
        <button className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors w-full text-left">
          <span className="text-[var(--muted)]">
            <IconLayers />
          </span>
          Artéfacts
        </button>
        <button className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors w-full text-left">
          <span className="text-[var(--muted)]">
            <IconCode />
          </span>
          Code
        </button>
      </nav>

      {/* Recent conversations */}
      {conversations.length > 0 && (
        <>
          <div className="h-px bg-[var(--border)] mx-3 my-2" />
          <div className="px-4 py-1">
            <span className="text-xs text-[var(--muted)] font-medium">Récents</span>
          </div>
          <div className="px-2 flex flex-col gap-0.5 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`flex items-center px-2.5 py-2 rounded-md text-sm transition-colors w-full text-left truncate ${
                  activeConversationId === conv.id
                    ? "bg-[var(--hover-bg)] text-[var(--foreground)]"
                    : "text-[var(--foreground)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                {conv.title}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
