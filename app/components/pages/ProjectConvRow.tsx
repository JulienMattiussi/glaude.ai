"use client";

import { ConversationMenu } from "../ConversationMenu";
import { relativeTime } from "../../lib/time";
import type { Conversation } from "../../types";

interface Props {
  conv: Conversation;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
  onToggleFavorite: () => void;
  onRemoveFromProject: () => void;
  onMoveToProject: (projectId: string) => void;
  projects: { id: string; title: string }[];
}

export function ProjectConvRow({
  conv,
  onSelect,
  onDelete,
  onRename,
  onToggleFavorite,
  onRemoveFromProject,
  onMoveToProject,
  projects,
}: Props) {
  return (
    <div className="group/conv flex items-center px-5 py-3 hover:bg-(--hover-bg) transition-colors text-left">
      <button onClick={onSelect} className="flex-1 flex flex-col items-start min-w-0">
        <span className="text-sm font-medium text-(--foreground) truncate w-full">
          {conv.title}
        </span>
        <span className="text-xs text-(--muted)">
          Dernier message {relativeTime(parseInt(conv.id))}
        </span>
      </button>

      <ConversationMenu
        title={conv.title}
        favorite={conv.favorite}
        projectId={conv.projectId}
        projects={projects}
        onDelete={onDelete}
        onRename={onRename}
        onToggleFavorite={onToggleFavorite}
        onRemoveFromProject={onRemoveFromProject}
        onMoveToProject={onMoveToProject}
        getMenuPos={(rect) => ({ top: rect.bottom + 4, left: rect.right - 192 })}
        triggerClassName="opacity-0 group-hover/conv:opacity-100 shrink-0 p-1.5 rounded-lg text-(--muted) hover:text-(--foreground) transition-colors"
      />
    </div>
  );
}
