"use client";

import { useState, useRef, useEffect } from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import { MessageList } from "../messages/MessageList";
import { ChatInput } from "./ChatInput";
import { ConversationHeader } from "./ConversationHeader";
import { LightningEffect } from "../effects/LightningEffect";
import { UfoEffect } from "../effects/UfoEffect";
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
  onRemoveConversationFromProject?: () => void;
  projects: { id: string; title: string }[];
  currentProjectId?: string;
  onMoveConversationToProject: (projectId: string) => void;
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
  onRemoveConversationFromProject,
  projects,
  currentProjectId,
  onMoveConversationToProject,
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [lightning, setLightning] = useState(false);
  const [boltCount, setBoltCount] = useState(0);
  const lastLightningCountRef = useRef(0);
  const lightningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ufo, setUfo] = useState(false);
  const [showMartian, setShowMartian] = useState(false);
  const [departing, setDeparting] = useState(false);
  const ufoSideRef = useRef<"left" | "right">("left");
  const departureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUfoCountRef = useRef(0);
  const replyAlreadyTriggeredRef = useRef(false);

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

    const ufoThreshold = count < 50 ? 0 : Math.floor(count / 50) * 50;
    if (ufoThreshold > 0 && ufoThreshold !== lastUfoCountRef.current) {
      lastUfoCountRef.current = ufoThreshold;
      ufoSideRef.current = Math.random() < 0.5 ? "left" : "right";
      setUfo(true);
    }
  }, [messages]);

  useEffect(
    () => () => {
      if (lightningTimerRef.current) clearTimeout(lightningTimerRef.current);
      if (departureTimerRef.current) clearTimeout(departureTimerRef.current);
    },
    []
  );

  const handleMartianDismiss = () => {
    setShowMartian(false);
    setDeparting(true);
    setUfo(true);
    departureTimerRef.current = setTimeout(() => {
      setUfo(false);
      setDeparting(false);
    }, 5200);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "u" && (e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        ufoSideRef.current = Math.random() < 0.5 ? "left" : "right";
        setUfo(true);
      }
    };
    document.addEventListener("keydown", handler, { capture: true });
    return () => document.removeEventListener("keydown", handler, { capture: true });
  }, []);
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

  // Auto-trigger reply when arriving on a conversation whose last message is from the user
  useEffect(() => {
    if (!conversationId || isThinking) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "user") {
      if (replyAlreadyTriggeredRef.current) {
        replyAlreadyTriggeredRef.current = false;
        return;
      }
      triggerReply(conversationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const triggerReply = (convId: string) => {
    replyAlreadyTriggeredRef.current = true;
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
    showMartian,
    onDismissMartian: handleMartianDismiss,
  };

  if (messages.length === 0 && !isThinking) {
    return (
      <>
        <LightningEffect active={lightning} boltCount={boltCount} />
        <UfoEffect
          active={ufo}
          onDismiss={() => setUfo(false)}
          side={ufoSideRef.current}
          departing={departing}
        />
        <WelcomeScreen userName={userName} inputProps={inputProps} />
      </>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <LightningEffect active={lightning} boltCount={boltCount} />
      <UfoEffect
        active={ufo}
        onDismiss={() => {
          setUfo(false);
          setShowMartian(true);
        }}
        side={ufoSideRef.current}
        departing={departing}
      />
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
            onRemoveFromProject={onRemoveConversationFromProject}
            projects={projects}
            currentProjectId={currentProjectId}
            onMoveToProject={onMoveConversationToProject}
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
        <div className="max-w-2xl mx-auto flex items-stretch gap-2">
          <div className="flex-1 min-w-0">
            <ChatInput {...inputProps} />
          </div>
        </div>
      </div>
    </div>
  );
}
