"use client";

import { ConversationMenu } from "../ConversationMenu";

export const ConversationItem = ({
  label,
  active,
  collapsed,
  onClick,
  onDelete,
  onRename,
  onToggleFavorite,
  favorite,
  projectId,
  projects,
  onRemoveFromProject,
  onMoveToProject,
}: {
  label: string;
  active: boolean;
  collapsed: boolean;
  favorite?: boolean;
  projectId?: string;
  projects: { id: string; title: string }[];
  onClick: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
  onToggleFavorite: () => void;
  onRemoveFromProject?: () => void;
  onMoveToProject: (projectId: string) => void;
}) => {
  return (
    <div className="relative">
      <div
        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors w-full group/conv ${
          active
            ? "bg-(--hover-bg) text-(--foreground)"
            : "text-(--foreground) hover:bg-(--hover-bg)"
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
          <ConversationMenu
            title={label}
            favorite={favorite}
            projectId={projectId}
            projects={projects}
            onDelete={onDelete}
            onRename={onRename}
            onToggleFavorite={onToggleFavorite}
            onRemoveFromProject={onRemoveFromProject}
            onMoveToProject={onMoveToProject}
            getMenuPos={(rect) => ({ top: rect.bottom + 4, left: rect.left - 160 })}
            triggerClassName={`shrink-0 p-1 rounded text-(--muted) hover:text-(--foreground) transition-colors ${active ? "opacity-100" : "opacity-0 group-hover/conv:opacity-100"}`}
          />
        )}
      </div>
    </div>
  );
};
