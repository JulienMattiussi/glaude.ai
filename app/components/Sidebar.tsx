"use client";

import { ReactNode, useState } from "react";
import GlaudeIcon from "./GlaudeIcon";
import { Icon } from "./ui";

const NavItem = ({
  icon,
  label,
  onClick,
  active,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors w-full text-left ${
      active ? "bg-(--hover-bg) text-(--foreground)" : "text-(--foreground) hover:bg-(--hover-bg)"
    }`}
  >
    <span className="text-(--muted)">{icon}</span>
    {label}
  </button>
);

const Divider = () => <div className="h-px bg-(--border) mx-3 my-2" />;

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

  const squareIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="14" height="14" rx="2" />
    </svg>
  );

  if (collapsed) {
    return (
      <div className="w-12 flex flex-col items-center py-3 gap-3 border-r border-(--border) bg-(--sidebar-bg)">
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 rounded-md hover:bg-(--hover-bg) text-(--muted) transition-colors"
          title="Développer"
        >
          {squareIcon}
        </button>
      </div>
    );
  }

  return (
    <div className="w-56 flex flex-col h-full bg-(--sidebar-bg) border-r border-(--border)">
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-(--accent)">
            <GlaudeIcon size={30} />
          </span>
          <span className="font-semibold text-sm text-(--foreground)">Glaude</span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1.5 rounded-md hover:bg-(--hover-bg) text-(--muted) transition-colors"
          title="Réduire"
        >
          {squareIcon}
        </button>
      </div>

      <nav className="px-2 flex flex-col gap-0.5">
        <NavItem
          icon={<Icon><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>}
          label="Nouvelle conversation"
          onClick={onNewConversation}
        />
        <NavItem
          icon={<Icon><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>}
          label="Rechercher"
        />
        <NavItem
          icon={<Icon><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></Icon>}
          label="Personnaliser"
        />
      </nav>

      <Divider />

      <nav className="px-2 flex flex-col gap-0.5">
        <NavItem
          icon={<Icon><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>}
          label="Discussions"
        />
        <NavItem
          icon={<Icon><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></Icon>}
          label="Artéfacts"
        />
        <NavItem
          icon={<Icon><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></Icon>}
          label="Code"
        />
      </nav>

      {conversations.length > 0 && (
        <>
          <Divider />
          <div className="px-4 py-1">
            <span className="text-xs text-(--muted) font-medium">Récents</span>
          </div>
          <div className="px-2 flex flex-col gap-0.5 overflow-y-auto">
            {conversations.map((conv) => (
              <NavItem
                key={conv.id}
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
