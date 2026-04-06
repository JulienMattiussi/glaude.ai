"use client";

import { ReactNode } from "react";

export const NavItem = ({
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
