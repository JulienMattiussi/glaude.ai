"use client";

import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { generateProutContent } from "../lib/prout";
import type { Conversation, Message } from "../types";

export function useConversations() {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>(
    "glaude-conversations",
    []
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  const newConversation = () => {
    const id = Date.now().toString();
    setConversations((prev) => [{ id, title: "Nouvelle conversation", messages: [] }, ...prev]);
    setActiveId(id);
  };

  const selectConversation = (id: string) => setActiveId(id);

  const addUserMessage = (text: string): string => {
    let convId = activeId;
    if (!convId) {
      convId = Date.now().toString();
      const title = text.length > 30 ? text.slice(0, 30) + "…" : text;
      setConversations((prev) => [{ id: convId!, title, messages: [] }, ...prev]);
      setActiveId(convId);
    }

    const userMessage: Message = { id: `${Date.now()}-user`, role: "user", content: text };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== convId) return conv;
        const title =
          conv.messages.length === 0
            ? text.length > 30
              ? text.slice(0, 30) + "…"
              : text
            : conv.title;
        return { ...conv, title, messages: [...conv.messages, userMessage] };
      })
    );

    return convId;
  };

  const editMessage = (messageId: string, newContent: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== activeId) return conv;
        return {
          ...conv,
          messages: conv.messages.map((m) =>
            m.id === messageId ? { ...m, content: newContent } : m
          ),
        };
      })
    );
  };

  const truncate = (keepUpToId: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== activeId) return conv;
        const idx = conv.messages.findIndex((m) => m.id === keepUpToId);
        return { ...conv, messages: conv.messages.slice(0, idx + 1) };
      })
    );
  };

  const addAssistantReply = (convId: string, delay: number) => {
    const assistantMessage: Message = {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      content: generateProutContent(delay),
    };
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === convId ? { ...conv, messages: [...conv.messages, assistantMessage] } : conv
      )
    );
  };

  return {
    conversations,
    activeId,
    activeConversation,
    newConversation,
    selectConversation,
    addUserMessage,
    editMessage,
    truncate,
    addAssistantReply,
  };
}
