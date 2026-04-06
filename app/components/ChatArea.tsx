"use client";

import { useState, useRef } from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useTypewriter } from "../hooks/useTypewriter";
import { randomDelay } from "../lib/delay";
import type { Message } from "../types";

interface ChatAreaProps {
  conversationId: string | null;
  messages: Message[];
  onUserMessage: (text: string) => string;
  onAssistantReply: (convId: string, delay: number) => void;
  onTruncate: (keepUpToId: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  userName?: string;
}

export default function ChatArea({
  conversationId,
  messages,
  onUserMessage,
  onAssistantReply,
  onTruncate,
  onEditMessage,
  userName = "Juju",
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { streamingId, streamedText } = useTypewriter(messages);

  const triggerReply = (convId: string) => {
    setIsThinking(true);
    const delay = randomDelay();
    setTimeout(() => {
      onAssistantReply(convId, delay);
      setIsThinking(false);
    }, delay);
  };

  const handleSubmit = () => {
    if (!input.trim() || isThinking) return;
    const text = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    triggerReply(onUserMessage(text));
  };

  const handleRetry = (msg: Message, index: number) => {
    if (isThinking || !conversationId) return;
    const keepUpToId = msg.role === "user" ? msg.id : messages[index - 1]?.id;
    if (!keepUpToId) return;
    onTruncate(keepUpToId);
    triggerReply(conversationId);
  };

  const handleEditSave = () => {
    if (!editingId || !editingText.trim() || !conversationId) return;
    onEditMessage(editingId, editingText.trim());
    onTruncate(editingId);
    setEditingId(null);
    triggerReply(conversationId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  };

  const inputProps = {
    value: input,
    onChange: setInput,
    onSubmit: handleSubmit,
    onKeyDown: handleKeyDown,
    onInput: handleInput,
    textareaRef,
    disabled: isThinking,
  };

  if (messages.length === 0 && !isThinking) {
    return <WelcomeScreen userName={userName} inputProps={inputProps} />;
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <MessageList
        messages={messages}
        isThinking={isThinking}
        streamingId={streamingId}
        streamedText={streamedText}
        editingId={editingId}
        editingText={editingText}
        onRetry={handleRetry}
        onEditStart={(msg) => {
          setEditingId(msg.id);
          setEditingText(msg.content);
        }}
        onEditSave={handleEditSave}
        onEditCancel={() => setEditingId(null)}
        onEditChange={setEditingText}
      />
      <div className="px-4 pb-4">
        <div className="max-w-2xl mx-auto">
          <ChatInput {...inputProps} />
        </div>
      </div>
    </div>
  );
}
