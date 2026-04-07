"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import GlaudeIcon from "../icons/GlaudeIcon";
import { Icon } from "../icons/Icon";
import { NavItem } from "./NavItem";
import { ConversationItem } from "./ConversationItem";
import type { Conversation, View } from "../../types";

const Divider = () => <div className="h-px bg-(--border) mx-3 my-2" />;

interface SidebarProps {
  onNewConversation: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  onToggleFavoriteConversation: (id: string) => void;
  activeView: string;
  onNavigate: (view: View) => void;
  onOpenSearch: () => void;
  projectFavorite: boolean;
  onNavigateToProject: () => void;
}

export default function Sidebar({
  onNewConversation,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onToggleFavoriteConversation,
  activeView,
  onNavigate,
  onOpenSearch,
  projectFavorite,
  onNavigateToProject,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => {
      setIsMobile(mq.matches);
      if (mq.matches) setCollapsed(true);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const closeOnMobile = (fn?: () => void) => () => {
    fn?.();
    if (isMobile) setCollapsed(true);
  };

  const sidebarIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1" y="1" width="14" height="14" rx="2" />
      <line x1="5.5" y1="1" x2="5.5" y2="15" />
    </svg>
  );

  const content = (
    <div
      style={isMobile ? undefined : { width: collapsed ? "3rem" : "18rem" }}
      className={`flex flex-col h-full bg-(--sidebar-bg) border-r border-(--border) overflow-hidden shrink-0
        ${
          isMobile
            ? `fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out ${collapsed ? "-translate-x-full" : "translate-x-0"}`
            : "transition-[width] duration-300 ease-in-out"
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-(--accent) shrink-0">
            <GlaudeIcon size={30} />
          </span>
          <span
            className={`font-semibold text-sm text-(--foreground) whitespace-nowrap transition-all duration-300 overflow-hidden ${
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            Glaude
          </span>
        </div>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1.5 rounded-md hover:bg-(--hover-bg) text-(--muted) transition-colors shrink-0"
          title={collapsed ? "Développer" : "Réduire"}
        >
          {sidebarIcon}
        </button>
      </div>

      <nav className="px-2 flex flex-col gap-0.5">
        <NavItem
          collapsed={collapsed}
          icon={
            <Icon>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </Icon>
          }
          label="Nouvelle conversation"
          shortcut="Ctrl+⇧+O"
          onClick={closeOnMobile(onNewConversation)}
        />
        <NavItem
          collapsed={collapsed}
          icon={
            <Icon>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </Icon>
          }
          label="Rechercher"
          shortcut="Ctrl+K"
          onClick={closeOnMobile(onOpenSearch)}
        />
        <NavItem
          collapsed={collapsed}
          icon={
            <Icon>
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </Icon>
          }
          label="Personnaliser"
          onClick={closeOnMobile(() => onNavigate("personnaliser"))}
          active={activeView === "personnaliser"}
        />
      </nav>

      <Divider />

      <nav className="px-2 flex flex-col gap-0.5">
        <NavItem
          collapsed={collapsed}
          icon={
            <Icon>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </Icon>
          }
          label="Discussions"
          onClick={closeOnMobile(() => onNavigate("discussions"))}
          active={activeView === "discussions"}
        />
        <NavItem
          collapsed={collapsed}
          icon={
            <Icon>
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </Icon>
          }
          label="Projets"
          onClick={closeOnMobile(() => onNavigate("projets"))}
          active={activeView === "projets"}
        />
        <NavItem
          collapsed={collapsed}
          icon={
            <Icon>
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </Icon>
          }
          label="Artéfacts"
        />
        <NavItem
          collapsed={collapsed}
          icon={
            <Icon>
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </Icon>
          }
          label="Code"
        />
      </nav>

      {(conversations.some((c) => c.favorite) || projectFavorite) && (
        <>
          <Divider />
          <div
            className={`px-4 py-1 overflow-hidden transition-all duration-300 ${collapsed ? "h-0 opacity-0 py-0" : "opacity-100"}`}
          >
            <span className="text-xs text-(--muted) font-medium whitespace-nowrap">Favoris</span>
          </div>
          <div className="px-2 flex flex-col gap-0.5">
            {projectFavorite && (
              <NavItem
                collapsed={collapsed}
                icon={
                  <Icon size={14}>
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </Icon>
                }
                label="Contacter la danrée"
                onClick={closeOnMobile(onNavigateToProject)}
                active={activeView === "projets"}
              />
            )}
            {conversations
              .filter((c) => c.favorite)
              .map((conv) => (
                <ConversationItem
                  key={conv.id}
                  label={conv.title}
                  active={activeConversationId === conv.id}
                  collapsed={collapsed}
                  favorite={conv.favorite}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    if (isMobile) setCollapsed(true);
                  }}
                  onDelete={() => onDeleteConversation(conv.id)}
                  onRename={(newTitle) => onRenameConversation(conv.id, newTitle)}
                  onToggleFavorite={() => onToggleFavoriteConversation(conv.id)}
                />
              ))}
          </div>
        </>
      )}
      {conversations.some((c) => !c.favorite) && (
        <>
          <Divider />
          <div
            className={`px-4 py-1 overflow-hidden transition-all duration-300 ${collapsed ? "h-0 opacity-0 py-0" : "opacity-100"}`}
          >
            <span className="text-xs text-(--muted) font-medium whitespace-nowrap">Récents</span>
          </div>
          <div className="px-2 flex flex-col gap-0.5 overflow-y-auto">
            {conversations
              .filter((c) => !c.favorite)
              .map((conv) => (
                <ConversationItem
                  key={conv.id}
                  label={conv.title}
                  active={activeConversationId === conv.id}
                  collapsed={collapsed}
                  favorite={conv.favorite}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    if (isMobile) setCollapsed(true);
                  }}
                  onDelete={() => onDeleteConversation(conv.id)}
                  onRename={(newTitle) => onRenameConversation(conv.id, newTitle)}
                  onToggleFavorite={() => onToggleFavoriteConversation(conv.id)}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile: backdrop + floating open button */}
      {isMobile &&
        !collapsed &&
        createPortal(
          <div className="fixed inset-0 z-30 bg-black/30" onClick={() => setCollapsed(true)} />,
          document.body
        )}
      {isMobile &&
        collapsed &&
        createPortal(
          <button
            onClick={() => setCollapsed(false)}
            className="fixed top-3 left-3 z-30 p-1.5 rounded-md bg-(--sidebar-bg) hover:bg-(--hover-bg) text-(--muted) transition-colors"
            title="Ouvrir le menu"
          >
            {sidebarIcon}
          </button>,
          document.body
        )}
      {content}
    </>
  );
}
