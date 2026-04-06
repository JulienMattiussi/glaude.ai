"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import GlaudeIcon from "./GlaudeIcon";
import { Icon } from "./ui";
import type { View } from "../types";

const NavItem = ({
  icon,
  label,
  onClick,
  active,
  collapsed,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  collapsed?: boolean;
}) => (
  <button
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors w-full text-left overflow-hidden ${
      active ? "bg-(--hover-bg) text-(--foreground)" : "text-(--foreground) hover:bg-(--hover-bg)"
    }`}
  >
    <span className="text-(--muted) shrink-0">{icon}</span>
    <span
      className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${
        collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
      }`}
    >
      {label}
    </span>
  </button>
);

const Divider = () => <div className="h-px bg-(--border) mx-3 my-2" />;

const ConversationItem = ({
  label,
  active,
  collapsed,
  onClick,
  onDelete,
  onRename,
  onToggleFavorite,
  favorite,
}: {
  label: string;
  active: boolean;
  collapsed: boolean;
  favorite?: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
  onToggleFavorite: () => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(label);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const openMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) setMenuPos({ top: rect.bottom + 4, left: rect.left - 160 });
    setMenuOpen((o) => !o);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors w-full group/conv ${
          active ? "bg-(--hover-bg) text-(--foreground)" : "text-(--foreground) hover:bg-(--hover-bg)"
        }`}
      >
        <button
          onClick={onClick}
          title={collapsed ? label : undefined}
          className="flex-1 text-left overflow-hidden"
        >
          <span
            className={`block whitespace-nowrap transition-all duration-300 overflow-hidden text-ellipsis ${
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            {label}
          </span>
        </button>
        {!collapsed && (
          <button
            ref={btnRef}
            onClick={openMenu}
            className={`shrink-0 p-1 rounded text-(--muted) hover:text-(--foreground) transition-colors ${active ? "opacity-100" : "opacity-0 group-hover/conv:opacity-100"}`}
            title="Options"
          >
            <Icon size={16}>
              <circle cx="5" cy="12" r="2" fill="currentColor" stroke="none" />
              <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
              <circle cx="19" cy="12" r="2" fill="currentColor" stroke="none" />
            </Icon>
          </button>
        )}
      </div>

      {menuOpen && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
          className="z-50 bg-(--input-bg) border border-(--border) rounded-xl shadow-lg py-1 w-48"
        >

          <button onClick={() => { setMenuOpen(false); onToggleFavorite(); }} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-(--foreground) hover:bg-(--hover-bg) transition-colors">
            <span className="text-(--muted)"><Icon size={14}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={favorite ? "currentColor" : "none"} /></Icon></span>
            {favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          </button>
          <button onClick={() => { setMenuOpen(false); setRenameValue(label); setRenaming(true); }} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-(--foreground) hover:bg-(--hover-bg) transition-colors">
            <span className="text-(--muted)"><Icon size={14}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></Icon></span>
            Renommer
          </button>
          <button onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-(--foreground) hover:bg-(--hover-bg) transition-colors">
            <span className="text-(--muted)"><Icon size={14}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></Icon></span>
            Ajouter au projet
          </button>
          <div className="h-px bg-(--border) mx-3 my-1" />
          <button
            onClick={() => { setMenuOpen(false); setConfirmDelete(true); }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-500 hover:bg-(--hover-bg) transition-colors"
          >
            <span><Icon size={14}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></Icon></span>
            Supprimer
          </button>
        </div>,
        document.body
      )}

      {renaming && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setRenaming(false)}>
          <div className="bg-(--input-bg) rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-(--foreground)">Renommer la conversation</h2>
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && renameValue.trim()) { onRename(renameValue.trim()); setRenaming(false); }
                if (e.key === "Escape") setRenaming(false);
              }}
              className="w-full rounded-lg border-2 border-blue-400 bg-(--input-bg) px-3 py-2 text-sm text-(--foreground) focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setRenaming(false)} className="px-4 py-2 rounded-lg text-sm text-(--foreground) hover:bg-(--hover-bg) transition-colors border border-(--border)">
                Annuler
              </button>
              <button
                onClick={() => { if (renameValue.trim()) { onRename(renameValue.trim()); setRenaming(false); } }}
                className="px-4 py-2 rounded-lg text-sm text-white bg-(--foreground) hover:opacity-80 transition-opacity"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {confirmDelete && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setConfirmDelete(false)}>
          <div className="bg-(--input-bg) rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-(--foreground)">Supprimer la conversation</h2>
            <p className="text-sm text-(--muted)">Êtes-vous sûr de vouloir supprimer cette conversation ?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 rounded-lg text-sm text-(--foreground) hover:bg-(--hover-bg) transition-colors border border-(--border)">
                Annuler
              </button>
              <button onClick={() => { setConfirmDelete(false); onDelete(); }} className="px-4 py-2 rounded-lg text-sm text-white bg-red-500 hover:bg-red-600 transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

interface SidebarProps {
  onNewConversation: () => void;
  conversations: { id: string; title: string; favorite?: boolean }[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  onToggleFavoriteConversation: (id: string) => void;
  activeView: string;
  onNavigate: (view: View) => void;
  onOpenSearch: () => void;
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
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

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

  return (
    <div
      style={{ width: collapsed ? "3rem" : "14rem" }}
      className="flex flex-col h-full bg-(--sidebar-bg) border-r border-(--border) transition-[width] duration-300 ease-in-out overflow-hidden shrink-0"
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
          onClick={onNewConversation}
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
          onClick={onOpenSearch}
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
          onClick={() => onNavigate("personnaliser")}
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
          onClick={() => onNavigate("discussions")}
          active={activeView === "discussions"}
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

      {conversations.some((c) => c.favorite) && (
        <>
          <Divider />
          <div
            className={`px-4 py-1 overflow-hidden transition-all duration-300 ${
              collapsed ? "h-0 opacity-0 py-0" : "opacity-100"
            }`}
          >
            <span className="text-xs text-(--muted) font-medium whitespace-nowrap">Favoris</span>
          </div>
          <div className="px-2 flex flex-col gap-0.5">
            {conversations.filter((c) => c.favorite).map((conv) => (
              <ConversationItem
                key={conv.id}
                label={conv.title}
                active={activeConversationId === conv.id}
                collapsed={collapsed}
                favorite={conv.favorite}
                onClick={() => onSelectConversation(conv.id)}
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
            className={`px-4 py-1 overflow-hidden transition-all duration-300 ${
              collapsed ? "h-0 opacity-0 py-0" : "opacity-100"
            }`}
          >
            <span className="text-xs text-(--muted) font-medium whitespace-nowrap">Récents</span>
          </div>
          <div className="px-2 flex flex-col gap-0.5 overflow-y-auto">
            {conversations.filter((c) => !c.favorite).map((conv) => (
              <ConversationItem
                key={conv.id}
                label={conv.title}
                active={activeConversationId === conv.id}
                collapsed={collapsed}
                favorite={conv.favorite}
                onClick={() => onSelectConversation(conv.id)}
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
}
