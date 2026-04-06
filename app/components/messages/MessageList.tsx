"use client";

import { useRef, useEffect } from "react";
import AnimatedGlaudeIcon from "../icons/AnimatedGlaudeIcon";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "../../types";

interface MessageListProps {
  messages: Message[];
  isThinking: boolean;
  streamingId: string | null;
  streamedText: string;
  editingId: string | null;
  editingText: string;
  onRetry: (msg: Message, index: number) => void;
  onEditStart: (msg: Message) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onEditChange: (v: string) => void;
}

export const MessageList = ({
  messages,
  isThinking,
  streamingId,
  streamedText,
  editingId,
  editingText,
  onRetry,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditChange,
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking, streamedText]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isLast={i === messages.length - 1}
            isThinking={isThinking}
            streamingId={streamingId}
            streamedText={streamedText}
            editingId={editingId}
            editingText={editingText}
            onRetry={() => onRetry(msg, i)}
            onEdit={() => onEditStart(msg)}
            onEditSave={onEditSave}
            onEditCancel={onEditCancel}
            onEditChange={onEditChange}
          />
        ))}

        {isThinking && (
          <div className="flex gap-3 justify-start">
            <span className="text-(--accent)">
              <AnimatedGlaudeIcon size={30} fast />
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
