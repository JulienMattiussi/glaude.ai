"use client";

import { useState, useEffect } from "react";
import { useConversations } from "./hooks/useConversations";
import type { View } from "./types";
import Sidebar from "./components/sidebar/Sidebar";
import ChatArea from "./components/chat/ChatArea";
import DiscussionsPage from "./components/pages/DiscussionsPage";
import PersonnalisePage from "./components/pages/PersonnalisePage";
import ProjectsPage from "./components/pages/ProjectsPage";
import SearchModal from "./components/sidebar/SearchModal";

export default function Home() {
  const store = useConversations();
  const [view, setView] = useState<View>("chat");
  const [searchOpen, setSearchOpen] = useState(false);
  const [projectFavorite, setProjectFavorite] = useState(false);

  const selectAndNavigate = (id: string) => {
    store.selectConversation(id);
    setView("chat");
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key.toLowerCase() === "o" && e.shiftKey && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        store.newConversation();
        setView("chat");
      }
    };
    document.addEventListener("keydown", handler, { capture: true });
    return () => document.removeEventListener("keydown", handler, { capture: true });
  }, [store.newConversation]);

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
        projectFavorite={projectFavorite}
        onNavigateToProject={() => setView("projet-detail")}
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
        {(view === "projets" || view === "projet-detail") && (
          <ProjectsPage
            projectFavorite={projectFavorite}
            onToggleProjectFavorite={() => setProjectFavorite((f) => !f)}
            conversations={store.conversations.filter((c) => c.projectId === "danree")}
            onStartConversation={(text) => {
              const convId = store.addUserMessage(text, "danree");
              store.addAssistantReply(convId, 1500);
              selectAndNavigate(convId);
            }}
            onSelectConversation={selectAndNavigate}
            showDetail={view === "projet-detail"}
            onOpenDetail={() => setView("projet-detail")}
            onCloseDetail={() => setView("projets")}
          />
        )}
        {view === "personnaliser" && <PersonnalisePage />}
        {view === "chat" && (
          <ChatArea
            conversationId={store.activeId}
            conversationTitle={store.activeConversation?.title}
            conversationFavorite={store.activeConversation?.favorite}
            messages={store.activeConversation?.messages ?? []}
            onUserMessage={store.addUserMessage}
            onAssistantReply={store.addAssistantReply}
            onTruncate={store.truncate}
            onEditMessage={store.editMessage}
            onRenameConversation={
              store.activeId
                ? (title) => store.renameConversation(store.activeId!, title)
                : undefined
            }
            onDeleteConversation={
              store.activeId ? () => store.deleteConversation(store.activeId!) : undefined
            }
            onToggleFavoriteConversation={
              store.activeId ? () => store.toggleFavorite(store.activeId!) : undefined
            }
            userName="ma danrée"
            conversationProjectName={
              store.activeConversation?.projectId === "danree" ? "Contacter la danrée" : undefined
            }
            onNavigateToProject={
              store.activeConversation?.projectId === "danree"
                ? () => setView("projet-detail")
                : undefined
            }
          />
        )}
      </main>
    </div>
  );
}
