"use client";

import { useState, useRef, useEffect } from "react";
import GlaudeIcon from "./GlaudeIcon";
import AnimatedGlaudeIcon from "./AnimatedGlaudeIcon";
import { EditMessageUI } from "./EditMessageUI";
import { UserMessageActions } from "./UserMessageActions";
import { AssistantMessageActions } from "./AssistantMessageActions";
import { ChatInput } from "./ChatInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatAreaProps {
  conversationId: string | null;
  messages: Message[];
  onUserMessage: (text: string) => string;
  onAssistantReply: (convId: string) => void;
  onTruncate: (keepUpToId: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  userName?: string;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return "Bonne nuit";
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

const randomDelay = () => 500 + Math.random() * 2500;

function formatTime(id: string) {
  return new Date(parseInt(id)).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const triggerReply = (convId: string) => {
    setIsThinking(true);
    setTimeout(() => {
      onAssistantReply(convId);
      setIsThinking(false);
    }, randomDelay());
  };

  const handleEditSave = () => {
    if (!editingId || !editingText.trim() || !conversationId) return;
    onEditMessage(editingId, editingText.trim());
    onTruncate(editingId);
    setEditingId(null);
    triggerReply(conversationId);
  };

  const handleRetry = (msg: Message, index: number) => {
    if (isThinking || !conversationId) return;
    const keepUpToId = msg.role === "user" ? msg.id : messages[index - 1]?.id;
    if (!keepUpToId) return;
    onTruncate(keepUpToId);
    triggerReply(conversationId);
  };

  const handleSubmit = () => {
    if (!input.trim() || isThinking) return;
    const text = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    const convId = onUserMessage(text);
    triggerReply(convId);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const chatInput = (
    <ChatInput
      value={input}
      onChange={setInput}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      textareaRef={textareaRef}
      disabled={isThinking}
    />
  );

  if (messages.length === 0 && !isThinking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4">
        <div className="flex items-center gap-3">
          <span className="text-(--accent)">
            <AnimatedGlaudeIcon size={48} />
          </span>
          <h1 className="text-3xl font-medium text-(--foreground)">
            {getGreeting()}, {userName}.
          </h1>
        </div>
        <div className="w-full max-w-2xl">{chatInput}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {messages.map((msg, i) => {
            const isLast = i === messages.length - 1;
            return (
              <div
                key={msg.id}
                className={`flex gap-2 group ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex flex-col">
                  {msg.role === "user" && editingId === msg.id ? (
                    <EditMessageUI
                      value={editingText}
                      onChange={setEditingText}
                      onSave={handleEditSave}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-lg ${msg.role === "user" ? "bg-(--hover-bg) text-(--foreground)" : "text-(--foreground)"}`}
                    >
                      {msg.content}
                    </div>
                  )}
                  {msg.role === "user" && editingId !== msg.id && (
                    <UserMessageActions
                      timestamp={formatTime(msg.id)}
                      content={msg.content}
                      onRetry={() => handleRetry(msg, i)}
                      onEdit={() => {
                        setEditingId(msg.id);
                        setEditingText(msg.content);
                      }}
                    />
                  )}
                  {msg.role === "assistant" && (
                    <>
                      <AssistantMessageActions
                        content={msg.content}
                        onRetry={() => handleRetry(msg, i)}
                      />
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
          })}

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
      <div className="px-4 pb-4">
        <div className="max-w-2xl mx-auto">{chatInput}</div>
      </div>
    </div>
  );
}
