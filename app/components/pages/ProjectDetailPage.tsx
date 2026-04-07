"use client";

import { useState, useRef } from "react";
import { Icon } from "../icons/Icon";
import { ChatInput } from "../chat/ChatInput";
import { ProjectConvRow } from "./ProjectConvRow";
import type { Conversation } from "../../types";

const PROJECT_ID = "danree";

const PROJECT = {
  title: "Contacter la danrée",
  description:
    "Il est nécéssaire de trouver un moyen pour contacter la danrée afin d'obtenir les réponses de l'univers",
  instructions: "Faire des pets plus puissants et plus longs",
};

export { PROJECT_ID };

interface Props {
  onBack: () => void;
  favorite: boolean;
  onToggleFavorite: () => void;
  conversations: Conversation[];
  onStartConversation: (text: string) => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  onToggleFavoriteConversation: (id: string) => void;
  onRemoveFromProject: (id: string) => void;
  onMoveToProject: (id: string, projectId: string) => void;
  projects: { id: string; title: string }[];
}

export default function ProjectDetailPage({
  onBack,
  favorite,
  onToggleFavorite,
  conversations,
  onStartConversation,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onToggleFavoriteConversation,
  onRemoveFromProject,
  onMoveToProject,
  projects,
}: Props) {
  const [input, setInput] = useState("");
  const [lightbox, setLightbox] = useState<{ src: string; name: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    onStartConversation(text);
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

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-(--muted) hover:text-(--foreground) transition-colors mb-6"
        >
          <Icon size={14}>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </Icon>
          Tous les projets
        </button>

        <div className="flex gap-6 items-start">
          {/* Left column */}
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-start justify-between gap-4 mb-1">
              <h1 className="text-3xl font-semibold text-(--foreground)">{PROJECT.title}</h1>
              <div className="flex items-center gap-2 mt-1 shrink-0">
                <button
                  onClick={onToggleFavorite}
                  title={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                  className="p-1.5 rounded-lg hover:bg-(--hover-bg) transition-colors text-(--muted) cursor-pointer"
                >
                  <Icon size={16}>
                    <polygon
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                      fill={favorite ? "currentColor" : "none"}
                    />
                  </Icon>
                </button>
              </div>
            </div>

            <p className="text-sm text-(--foreground) mb-1">{PROJECT.description}</p>
            <p className="text-xs text-(--muted) mb-6 flex items-center gap-1">
              Partagé avec vous
              <span>·</span>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="inline"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Privé
            </p>

            {/* Chat input */}
            <div className="mb-6">
              <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                textareaRef={textareaRef}
              />
            </div>

            {/* Conversations tabs */}
            <div className="flex items-center gap-4 mb-4">
              <button className="px-3 py-1.5 rounded-full text-sm bg-(--hover-bg) text-(--foreground) font-medium">
                Vos conversations
              </button>
              <p className="text-xs text-(--muted) flex items-center gap-1">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="inline shrink-0"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Vos conversations restent privées jusqu&apos;à ce qu&apos;elles soient partagées.
              </p>
            </div>

            {/* Conversation list */}
            {conversations.length === 0 ? (
              <div className="rounded-2xl border border-(--border) bg-(--input-bg) px-6 py-8 text-center">
                <p className="text-sm text-(--muted)">
                  Démarrez une conversation pour organiser les échanges et réutiliser les
                  connaissances du projet.
                </p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-(--border) border border-(--border) rounded-2xl overflow-hidden">
                {conversations.map((conv) => (
                  <ProjectConvRow
                    key={conv.id}
                    conv={conv}
                    onSelect={() => onSelectConversation(conv.id)}
                    onDelete={() => onDeleteConversation(conv.id)}
                    onRename={(title) => onRenameConversation(conv.id, title)}
                    onToggleFavorite={() => onToggleFavoriteConversation(conv.id)}
                    onRemoveFromProject={() => onRemoveFromProject(conv.id)}
                    onMoveToProject={(projectId) => onMoveToProject(conv.id, projectId)}
                    projects={projects}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="w-72 shrink-0 flex flex-col gap-3">
            {/* Instructions */}
            <div className="rounded-2xl border border-(--border) bg-(--input-bg) p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-(--foreground)">Instructions</span>
              </div>
              <p className="text-sm text-(--muted)">{PROJECT.instructions}</p>
            </div>

            {/* Fichiers */}
            <div className="rounded-2xl border border-(--border) bg-(--input-bg) p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-(--foreground)">Fichiers</span>
              </div>
              <div className="mb-3">
                <div className="w-full h-1.5 rounded-full bg-(--border) overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: "15%" }} />
                </div>
                <p className="text-xs text-blue-500 mt-1">15 % de la capacité du projet utilisée</p>
              </div>
              <div className="flex gap-2">
                {[
                  { src: "/soucoupe.jpg", name: "soucoupe.jpg" },
                  { src: "/danree.png", name: "danree.png" },
                ].map((img) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.name}
                    onClick={() => setLightbox(img)}
                    className="w-24 h-24 rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <Icon size={24}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </Icon>
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.name}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[80vw] max-h-[80vh] rounded-2xl object-contain"
          />
          <p className="text-white/70 text-sm mt-3">{lightbox.name}</p>
        </div>
      )}
    </div>
  );
}
