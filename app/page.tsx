"use client";

import { useState } from "react";
import { useConversations } from "./hooks/useConversations";
import type { View } from "./types";
import Sidebar from "./components/sidebar/Sidebar";
import ChatArea from "./components/chat/ChatArea";
import DiscussionsPage from "./components/pages/DiscussionsPage";
import PersonnalisePage from "./components/pages/PersonnalisePage";
import SearchModal from "./components/sidebar/SearchModal";

export default function Home() {
  const store = useConversations();
  const [view, setView] = useState<View>("chat");
  const [searchOpen, setSearchOpen] = useState(false);

  const selectAndNavigate = (id: string) => {
    store.selectConversation(id);
    setView("chat");
  };

  const newAndNavigate = () => {
    store.newConversation();
    setView("chat");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-(--background)">
      <Sidebar
        conversations={store.conversations}
        activeConversationId={store.activeId}
        activeView={view}
        onNewConversation={newAndNavigate}
        onSelectConversation={selectAndNavigate}
        onDeleteConversation={store.deleteConversation}
        onRenameConversation={store.renameConversation}
        onToggleFavoriteConversation={store.toggleFavorite}
        onNavigate={setView}
        onOpenSearch={() => setSearchOpen(true)}
      />
      {searchOpen && (
        <SearchModal
          conversations={store.conversations}
          onSelect={(id) => {
            selectAndNavigate(id);
            setSearchOpen(false);
          }}
          onClose={() => setSearchOpen(false)}
        />
      )}
      <main className="flex-1 flex flex-col overflow-hidden">
        {view === "discussions" && (
          <DiscussionsPage
            conversations={store.conversations}
            onNewConversation={newAndNavigate}
            onSelectConversation={selectAndNavigate}
          />
        )}
        {view === "personnaliser" && <PersonnalisePage />}
        {view === "chat" && (
          <ChatArea
            conversationId={store.activeId}
            messages={store.activeConversation?.messages ?? []}
            onUserMessage={store.addUserMessage}
            onAssistantReply={store.addAssistantReply}
            onTruncate={store.truncate}
            onEditMessage={store.editMessage}
            userName="ma danrée"
          />
        )}
      </main>
    </div>
  );
}
