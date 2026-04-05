"use client";

import GlaudeIcon from "./GlaudeIcon";
import { EditMessageUI } from "./EditMessageUI";
import { UserMessageActions } from "./UserMessageActions";
import { AssistantMessageActions } from "./AssistantMessageActions";
import { formatTime } from "../lib/time";
import type { Message } from "../types";

interface MessageBubbleProps {
  msg: Message;
  isLast: boolean;
  isThinking: boolean;
  streamingId: string | null;
  streamedText: string;
  editingId: string | null;
  editingText: string;
  onRetry: () => void;
  onEdit: () => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onEditChange: (v: string) => void;
}

export const MessageBubble = ({
  msg,
  isLast,
  isThinking,
  streamingId,
  streamedText,
  editingId,
  editingText,
  onRetry,
  onEdit,
  onEditSave,
  onEditCancel,
  onEditChange,
}: MessageBubbleProps) => {
  const isStreaming = msg.id === streamingId;
  const displayContent = isStreaming ? streamedText : msg.content;
  const isEditing = msg.role === "user" && editingId === msg.id;

  return (
    <div className={`flex gap-2 group ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
      <div className="flex flex-col">
        {isEditing ? (
          <EditMessageUI
            value={editingText}
            onChange={onEditChange}
            onSave={onEditSave}
            onCancel={onEditCancel}
          />
        ) : (
          <div
            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-lg ${
              msg.role === "user" ? "bg-(--hover-bg) text-(--foreground)" : "text-(--foreground)"
            }`}
          >
            {displayContent}
          </div>
        )}

        {msg.role === "user" && !isEditing && (
          <UserMessageActions
            timestamp={formatTime(msg.id)}
            content={msg.content}
            onRetry={onRetry}
            onEdit={onEdit}
          />
        )}

        {msg.role === "assistant" && !isStreaming && (
          <>
            <AssistantMessageActions content={msg.content} onRetry={onRetry} />
            {isLast && !isThinking && (
              <span className="text-(--accent) mt-2 ml-1">
                <GlaudeIcon size={48} />
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};
