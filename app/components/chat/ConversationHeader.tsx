"use client";

import { Icon } from "../icons/Icon";
import { ConversationMenu } from "../ConversationMenu";

interface ConversationHeaderProps {
  title: string;
  favorite?: boolean;
  onRename: (title: string) => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  projectName?: string;
  onNavigateToProject?: () => void;
  onRemoveFromProject?: () => void;
  projects: { id: string; title: string }[];
  currentProjectId?: string;
  onMoveToProject: (projectId: string) => void;
}

export function ConversationHeader({
  title,
  favorite,
  onRename,
  onDelete,
  onToggleFavorite,
  projectName,
  onNavigateToProject,
  onRemoveFromProject,
  projects,
  currentProjectId,
  onMoveToProject,
}: ConversationHeaderProps) {
  return (
    <div className="flex items-center pl-12 pr-4 md:px-4 py-2 bg-(--background) shrink-0">
      {projectName && onNavigateToProject && (
        <>
          <button
            onClick={onNavigateToProject}
            className="px-2 py-1 rounded-md hover:bg-(--hover-bg) transition-colors text-sm text-(--muted) hover:text-(--foreground)"
          >
            {projectName}
          </button>
          <span className="text-(--muted) text-sm mx-0.5">/</span>
        </>
      )}
      <ConversationMenu
        title={title}
        favorite={favorite}
        projectId={currentProjectId}
        projects={projects}
        onDelete={onDelete}
        onRename={onRename}
        onToggleFavorite={onToggleFavorite}
        onRemoveFromProject={onRemoveFromProject}
        onMoveToProject={onMoveToProject}
        getMenuPos={(rect) => ({ top: rect.bottom + 4, left: rect.left + rect.width / 2 - 96 })}
        renderTrigger={(ref, onClick) => (
          <button
            ref={ref}
            onClick={onClick}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-(--hover-bg) transition-colors text-sm font-medium text-(--foreground)"
          >
            {title}
            <span className="text-(--muted)">
              <Icon size={14}>
                <polyline points="6 9 12 15 18 9" />
              </Icon>
            </span>
          </button>
        )}
      />
    </div>
  );
}
