"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  const handleNewConversation = () => {
    const id = Date.now().toString();
    const newConv: Conversation = {
      id,
      title: "Nouvelle conversation",
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(id);
  };

  const handleSelectConversation = (id: string) => {
    setActiveId(id);
  };

  const handleUserMessage = (text: string): string => {
    let convId = activeId;
    if (!convId) {
      convId = Date.now().toString();
      const title = text.length > 30 ? text.slice(0, 30) + "…" : text;
      const newConv: Conversation = { id: convId, title, messages: [] };
      setConversations((prev) => [newConv, ...prev]);
      setActiveId(convId);
    }

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content: text,
    };

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

  const handleAssistantReply = (convId: string) => {
    const assistantMessage: Message = {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      content: "prout",
    };
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === convId ? { ...conv, messages: [...conv.messages, assistantMessage] } : conv
      )
    );
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-(--background)">
      <Sidebar
        onNewConversation={handleNewConversation}
        conversations={conversations}
        activeConversationId={activeId}
        onSelectConversation={handleSelectConversation}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatArea
          conversationId={activeId}
          messages={activeConversation?.messages ?? []}
          onUserMessage={handleUserMessage}
          onAssistantReply={handleAssistantReply}
          userName="Juju"
        />
      </main>
    </div>
  );
}
