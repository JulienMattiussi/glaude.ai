"use client";

import { useState, useRef, useEffect } from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import { MessageList } from "../messages/MessageList";
import { ChatInput } from "./ChatInput";
import { ConversationHeader } from "./ConversationHeader";
import { LightningEffect } from "../effects/LightningEffect";
import { useTypewriter } from "../../hooks/useTypewriter";
import { randomDelay } from "../../lib/delay";
import type { Message } from "../../types";

interface ChatAreaProps {
  conversationId: string | null;
  conversationTitle?: string;
  conversationFavorite?: boolean;
  messages: Message[];
  onUserMessage: (text: string) => string;
  onAssistantReply: (convId: string, delay: number) => void;
  onTruncate: (keepUpToId: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onRenameConversation?: (title: string) => void;
  onDeleteConversation?: () => void;
  onToggleFavoriteConversation?: () => void;
  userName?: string;
  conversationProjectName?: string;
  onNavigateToProject?: () => void;
}

export default function ChatArea({
  conversationId,
  conversationTitle,
  conversationFavorite,
  messages,
  onUserMessage,
  onAssistantReply,
  onTruncate,
  onEditMessage,
  onRenameConversation,
  onDeleteConversation,
  onToggleFavoriteConversation,
  userName = "Juju",
  conversationProjectName,
  onNavigateToProject,
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [lightning, setLightning] = useState(false);
  const [boltCount, setBoltCount] = useState(0);
  const lastLightningCountRef = useRef(0);
  const lightningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const count = messages
      .filter((m) => m.role === "assistant" && /^(prou+t\s*)+$/i.test(m.content.trim()))
      .reduce((sum, m) => sum + m.content.trim().split(/\s+/).length, 0);
    // First trigger at 20, then every 10
    const threshold = count < 20 ? 0 : 20 + Math.floor((count - 20) / 10) * 10;
    if (threshold > 0 && threshold !== lastLightningCountRef.current) {
      lastLightningCountRef.current = threshold;
      const newBoltCount = 1 + (threshold - 20) / 10;
      setBoltCount(newBoltCount);
      if (lightningTimerRef.current) clearTimeout(lightningTimerRef.current);
      setLightning(true);
      lightningTimerRef.current = setTimeout(() => setLightning(false), 1400);
    }
  }, [messages]);

  useEffect(
    () => () => {
      if (lightningTimerRef.current) clearTimeout(lightningTimerRef.current);
    },
    []
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { streamingId, streamedText } = useTypewriter(messages);

  const focusInput = () => textareaRef.current?.focus();

  // Refocus textarea whenever thinking ends (covers submit, send, retry, edit save)
  useEffect(() => {
    if (!isThinking) focusInput();
  }, [isThinking]);

  // Refocus when switching conversations
  useEffect(() => {
    focusInput();
  }, [conversationId]);

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

  const handleSend = (text: string) => {
    if (isThinking) return;
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
    return (
      <>
        <LightningEffect active={lightning} boltCount={boltCount} />
        <WelcomeScreen userName={userName} inputProps={inputProps} />
      </>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <LightningEffect active={lightning} boltCount={boltCount} />
      {conversationTitle &&
        onRenameConversation &&
        onDeleteConversation &&
        onToggleFavoriteConversation && (
          <ConversationHeader
            title={conversationTitle}
            favorite={conversationFavorite}
            onRename={onRenameConversation}
            onDelete={onDeleteConversation}
            onToggleFavorite={onToggleFavoriteConversation}
            projectName={conversationProjectName}
            onNavigateToProject={onNavigateToProject}
          />
        )}
      <MessageList
        messages={messages}
        isThinking={isThinking}
        streamingId={streamingId}
        streamedText={streamedText}
        editingId={editingId}
        editingText={editingText}
        onSend={handleSend}
        onRetry={handleRetry}
        onEditStart={(msg) => {
          setEditingId(msg.id);
          setEditingText(msg.content);
        }}
        onEditSave={handleEditSave}
        onEditCancel={() => {
          setEditingId(null);
          focusInput();
        }}
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
