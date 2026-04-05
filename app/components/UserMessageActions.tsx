"use client";

import { Icon } from "./ui";
import { CopyButton } from "./CopyButton";

export const UserMessageActions = ({
  timestamp,
  content,
  onRetry,
  onEdit,
}: {
  timestamp: string;
  content: string;
  onRetry: () => void;
  onEdit: () => void;
}) => (
  <div className="flex items-center gap-1 mt-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
    <span className="text-xs text-(--muted) mr-1">{timestamp}</span>
    <button
      onClick={onRetry}
      className="p-1.5 rounded-md text-(--muted) hover:text-(--foreground) hover:bg-(--hover-bg) transition-colors"
      title="Réessayer"
    >
      <Icon>
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
      </Icon>
    </button>
    <button
      onClick={onEdit}
      className="p-1.5 rounded-md text-(--muted) hover:text-(--foreground) hover:bg-(--hover-bg) transition-colors"
      title="Modifier"
    >
      <Icon>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </Icon>
    </button>
    <CopyButton content={content} />
  </div>
);
