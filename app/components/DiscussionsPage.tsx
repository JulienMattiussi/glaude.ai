"use client";

import { useState } from "react";
import { Icon } from "./ui";
import { relativeTime } from "../lib/time";
import type { Conversation } from "../types";

function lastMessageTime(conversation: Conversation): string {
  const last = conversation.messages.at(-1);
  if (!last) return relativeTime(parseInt(conversation.id));
  return relativeTime(parseInt(last.id.split("-")[0]));
}

export default function DiscussionsPage({
  conversations,
  onNewConversation,
  onSelectConversation,
}: {
  conversations: Conversation[];
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-(--foreground)">Discussions</h1>
          <button
            onClick={onNewConversation}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-(--foreground) text-(--background) text-sm font-medium hover:opacity-80 transition-opacity"
          >
            <Icon size={14}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </Icon>
            Nouvelle conversation
          </button>
        </div>

        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)">
            <Icon>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </Icon>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher dans vos conversations..."
            className="w-full rounded-xl border-2 border-(--border) focus:border-blue-400 bg-(--input-bg) pl-10 pr-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted) focus:outline-none transition-colors"
          />
        </div>

        {conversations.length > 0 && (
          <p className="text-sm text-(--muted) mb-4">Vos conversations avec Glaude</p>
        )}

        <div className="flex flex-col">
          {filtered.length === 0 ? (
            <p className="text-sm text-(--muted) py-8 text-center">
              {search ? "Aucune conversation trouvée." : "Aucune conversation pour le moment."}
            </p>
          ) : (
            filtered.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className="flex flex-col items-start gap-0.5 py-4 border-b border-(--border) hover:bg-(--hover-bg) px-2 rounded-sm transition-colors text-left"
              >
                <span className="text-sm font-medium text-(--foreground)">
                  {conversation.title}
                </span>
                <span className="text-xs text-(--muted)">
                  Dernier message {lastMessageTime(conversation)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
