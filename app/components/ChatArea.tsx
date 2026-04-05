"use client";

import { useState, useRef, useEffect } from "react";
import GlaudeIcon from "./GlaudeIcon";
import AnimatedGlaudeIcon from "./AnimatedGlaudeIcon";
import { Icon } from "./ui";

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

// Reusable SVG paths
const CopyPaths = () => (
  <>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </>
);
const RetryPaths = () => (
  <>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
  </>
);

const CheckPaths = () => <polyline points="20 6 9 17 4 12" />;

const CopyButton = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      title={copied ? "Copié !" : "Copier"}
      className="p-1.5 rounded-md text-(--muted) hover:text-(--foreground) hover:bg-(--hover-bg) transition-colors"
    >
      <Icon>{copied ? <CheckPaths /> : <CopyPaths />}</Icon>
    </button>
  );
};

const ToolIcons = () => (
  <div className="flex items-center gap-1.5 text-xs text-(--muted)">
    {["G", "G", "A", "C", "A", "C", "●"].map((icon, i) => (
      <span
        key={i}
        className="w-5 h-5 rounded-full bg-(--hover-bg) flex items-center justify-center text-[10px] font-bold text-(--muted)"
      >
        {icon}
      </span>
    ))}
    <span className="ml-0.5">›</span>
  </div>
);

const EditMessageUI = ({
  value,
  onChange,
  onSave,
  onCancel,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) => (
  <div className="flex flex-col gap-2 w-full max-w-lg">
    <textarea
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSave();
        }
        if (e.key === "Escape") onCancel();
      }}
      rows={3}
      className="w-full resize-none rounded-xl border-2 border-blue-400 bg-(--input-bg) px-3 py-2 text-sm text-(--foreground) focus:outline-none"
    />
    <div className="flex justify-end gap-2">
      <button
        onClick={onCancel}
        className="px-3 py-1.5 rounded-lg text-sm text-(--foreground) hover:bg-(--hover-bg) transition-colors border border-(--border)"
      >
        Annuler
      </button>
      <button
        onClick={onSave}
        className="px-3 py-1.5 rounded-lg text-sm text-white bg-(--foreground) hover:opacity-80 transition-opacity"
      >
        Enregistrer
      </button>
    </div>
  </div>
);

const UserMessageActions = ({
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
        <RetryPaths />
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

const FEEDBACK_OPTIONS = [
  "Bogue de l'interface utilisateur",
  "Refus excessif",
  "N'a pas entièrement respecté ma demande",
  "Incorrect.e.s sur le plan factuel",
  "Réponse incomplète",
  "Aurait dû effectuer une recherche web",
  "Signaler le contenu.",
  "Non conforme à la Constitution de Glaude",
  "Autre",
];

const FeedbackModal = ({
  title,
  placeholder,
  withDropdown,
  onClose,
}: {
  title: string;
  placeholder: string;
  withDropdown?: boolean;
  onClose: () => void;
}) => {
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-(--input-bg) rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-(--foreground)">{title}</h2>

        {withDropdown && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-(--foreground)">
              Quel type de problème souhaitez-vous signaler ?{" "}
              <span className="text-(--muted)">(facultatif)</span>
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded-lg border border-(--border) bg-(--input-bg) px-3 py-2 text-sm text-(--foreground) focus:outline-none focus:border-blue-400 pr-8"
              >
                <option value="">Sélectionner...</option>
                {FEEDBACK_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-(--muted)">
                <Icon size={14}>
                  <polyline points="6 9 12 15 18 9" />
                </Icon>
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-(--foreground)">
            Veuillez fournir des détails : <span className="text-(--muted)">(facultatif)</span>
          </label>
          <textarea
            autoFocus
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full resize-none rounded-lg border border-(--border) bg-(--input-bg) px-3 py-2 text-sm text-(--foreground) placeholder:text-(--muted) focus:outline-none focus:border-blue-400"
          />
        </div>

        <p className="text-xs text-(--muted) italic leading-relaxed">
          En soumettant ce rapport, vous envoyez l&apos;intégralité de la conversation actuelle à
          Glaude pour nous aider à améliorer nos modèles.{" "}
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-white bg-(--foreground) hover:opacity-80 transition-opacity"
          >
            Envoyer
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-(--foreground) hover:bg-(--hover-bg) transition-colors border border-(--border)"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

const AssistantMessageActions = ({
  content,
  onRetry,
}: {
  content: string;
  onRetry: () => void;
}) => {
  const [modal, setModal] = useState<"positive" | "negative" | null>(null);
  return (
    <>
      <div className="flex items-center gap-1 mt-2 ml-1">
        <CopyButton content={content} />
        <button
          onClick={() => setModal("positive")}
          className="p-1.5 rounded-md text-(--muted) hover:text-(--foreground) hover:bg-(--hover-bg) transition-colors"
          title="Donner un retour positif"
        >
          <Icon>
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </Icon>
        </button>
        <button
          onClick={() => setModal("negative")}
          className="p-1.5 rounded-md text-(--muted) hover:text-(--foreground) hover:bg-(--hover-bg) transition-colors"
          title="Donner un retour négatif"
        >
          <Icon>
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
            <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
          </Icon>
        </button>
        <button
          onClick={onRetry}
          className="p-1.5 rounded-md text-(--muted) hover:text-(--foreground) hover:bg-(--hover-bg) transition-colors"
          title="Réessayer"
        >
          <Icon>
            <RetryPaths />
          </Icon>
        </button>
      </div>
      {modal === "positive" && (
        <FeedbackModal
          title="Donner un retour positif"
          placeholder="Dans quelle mesure cette réponse était-elle satisfaisante ?"
          onClose={() => setModal(null)}
        />
      )}
      {modal === "negative" && (
        <FeedbackModal
          title="Donner un retour négatif"
          placeholder="Dans quelle mesure cette réponse était-elle insatisfaisante ?"
          withDropdown
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
};

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

  const isEmpty = messages.length === 0 && !isThinking;

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

  if (isEmpty) {
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

function ChatInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  onInput,
  textareaRef,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onInput: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  disabled?: boolean;
}) {
  return (
    <div
      className={`bg-(--input-bg) rounded-2xl shadow-sm border border-(--border) ${disabled ? "opacity-60" : ""}`}
    >
      <div className="px-4 pt-3 pb-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onInput={onInput}
          placeholder="Comment puis-je vous aider ?"
          rows={1}
          disabled={disabled}
          className="w-full resize-none bg-transparent text-sm text-(--foreground) placeholder:text-(--muted) focus:outline-none min-h-6 max-h-50 disabled:cursor-not-allowed"
        />
      </div>
      <div className="flex items-center justify-between px-3 pb-3">
        <button className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-(--hover-bg) text-(--muted) transition-colors">
          <Icon>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </Icon>
        </button>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs text-(--muted) hover:text-(--foreground) transition-colors px-2 py-1 rounded-md hover:bg-(--hover-bg)">
            <span>Bombé 4.6</span>
            <Icon size={12}>
              <polyline points="6 9 12 15 18 9" />
            </Icon>
          </button>
          <button className="text-(--muted) hover:text-(--foreground) transition-colors">
            <Icon>
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </Icon>
          </button>
          {value.trim() && !disabled && (
            <button
              onClick={onSubmit}
              className="w-7 h-7 rounded-full bg-(--foreground) flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between px-3 pb-2.5 border-t border-(--border) pt-2">
        <span className="text-xs text-(--muted)">Connectez vos outils à Glaude</span>
        <ToolIcons />
      </div>
    </div>
  );
}
