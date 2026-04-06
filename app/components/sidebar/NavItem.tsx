"use client";

import { ReactNode } from "react";

export const NavItem = ({
  icon,
  label,
  onClick,
  active,
  collapsed,
  shortcut,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  collapsed?: boolean;
  shortcut?: string;
}) => (
  <button
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors w-full text-left overflow-hidden ${
      active ? "bg-(--hover-bg) text-(--foreground)" : "text-(--foreground) hover:bg-(--hover-bg)"
    }`}
  >
    <span className="text-(--muted) shrink-0">{icon}</span>
    <span
      className={`flex-1 whitespace-nowrap transition-all duration-300 overflow-hidden ${
        collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
      }`}
    >
      {label}
    </span>
    {shortcut && !collapsed && (
      <span className="text-xs text-(--muted) shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {shortcut}
      </span>
    )}
  </button>
);
