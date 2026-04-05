"use client";

import { ReactNode, useState } from "react";
import GlaudeIcon from "./GlaudeIcon";
import { Icon } from "./ui";

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

interface SidebarProps {
  onNewConversation: () => void;
  conversations: { id: string; title: string }[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenSearch: () => void;
}

export default function Sidebar({
  onNewConversation,
  conversations,
  activeConversationId,
  onSelectConversation,
  activeView,
  onNavigate,
  onOpenSearch,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
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
          icon={<Icon><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>}
          label="Nouvelle conversation"
          onClick={onNewConversation}
        />
        <NavItem
          collapsed={collapsed}
          icon={<Icon><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>}
          label="Rechercher"
          onClick={onOpenSearch}
        />
        <NavItem
          collapsed={collapsed}
          icon={<Icon><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></Icon>}
          label="Personnaliser"
          onClick={() => onNavigate("personnaliser")}
          active={activeView === "personnaliser"}
        />
      </nav>

      <Divider />

      <nav className="px-2 flex flex-col gap-0.5">
        <NavItem
          collapsed={collapsed}
          icon={<Icon><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>}
          label="Discussions"
          onClick={() => onNavigate("discussions")}
          active={activeView === "discussions"}
        />
        <NavItem
          collapsed={collapsed}
          icon={<Icon><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></Icon>}
          label="Artéfacts"
        />
        <NavItem
          collapsed={collapsed}
          icon={<Icon><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></Icon>}
          label="Code"
        />
      </nav>

      {conversations.length > 0 && (
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
            {conversations.map((conv) => (
              <NavItem
                key={conv.id}
                collapsed={collapsed}
                icon={null}
                label={conv.title}
                onClick={() => onSelectConversation(conv.id)}
                active={activeConversationId === conv.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
