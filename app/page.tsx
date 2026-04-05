"use client";

import { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import DiscussionsPage from "./components/DiscussionsPage";
import SearchModal from "./components/SearchModal";
import PersonnalisePage from "./components/PersonnalisePage";

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

type View = "chat" | "discussions" | "personnaliser";

export default function Home() {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>(
    "glaude-conversations",
    []
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [view, setView] = useState<View>("chat");
  const [searchOpen, setSearchOpen] = useState(false);

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
    setView("chat");
  };

  const handleSelectConversation = (id: string) => {
    setActiveId(id);
    setView("chat");
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

  const handleEditMessage = (messageId: string, newContent: string) => {
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

  const handleTruncate = (keepUpToId: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== activeId) return conv;
        const idx = conv.messages.findIndex((m) => m.id === keepUpToId);
        return { ...conv, messages: conv.messages.slice(0, idx + 1) };
      })
    );
  };

  const handleAssistantReply = (convId: string, delay: number) => {
    const proutCount = Math.min(6, Math.max(1, Math.round((delay - 500) / 500) + 1));
    const randomProut = () => "pro" + "u".repeat(Math.ceil(Math.random() * 3)) + "t";
    const assistantMessage: Message = {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      content: Array.from({ length: proutCount }, randomProut).join(" "),
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
        activeView={view}
        onNavigate={setView}
        onOpenSearch={() => setSearchOpen(true)}
      />
      {searchOpen && (
        <SearchModal
          conversations={conversations}
          onSelect={(id) => {
            handleSelectConversation(id);
            setSearchOpen(false);
          }}
          onClose={() => setSearchOpen(false)}
        />
      )}
      <main className="flex-1 flex flex-col overflow-hidden">
        {view === "discussions" ? (
          <DiscussionsPage
            conversations={conversations}
            onNewConversation={handleNewConversation}
            onSelectConversation={handleSelectConversation}
          />
        ) : view === "personnaliser" ? (
          <PersonnalisePage />
        ) : (
          <ChatArea
            conversationId={activeId}
            messages={activeConversation?.messages ?? []}
            onUserMessage={handleUserMessage}
            onAssistantReply={handleAssistantReply}
            onTruncate={handleTruncate}
            onEditMessage={handleEditMessage}
            userName="Juju"
          />
        )}
      </main>
    </div>
  );
}
