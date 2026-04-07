"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "../icons/Icon";
import ProjectDetailPage from "./ProjectDetailPage";

const LockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

type SortOption = "activite" | "modification" | "creation";

const SORT_LABELS: Record<SortOption, string> = {
  activite: "Activité récente",
  modification: "Dernière modification",
  creation: "Créé.e.s récemment",
};

type Tab = "vos" | "equipe" | "partage";

const PROJECT = {
  title: "Contacter la danrée",
  description:
    "Il est nécéssaire de trouver un moyen pour contacter la danrée afin d'obtenir les réponses de l'univers",
};

function NoNewProjectModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-(--input-bg) rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4">
        <p className="text-sm text-(--foreground) leading-relaxed">
          Un seul projet est disponible pour l&apos;instant. Il n&apos;est donc pas actuellement
          possible d&apos;en créer un nouveau.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-(--foreground) text-(--background) text-sm font-medium hover:opacity-80 transition-opacity"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

import type { Conversation } from "../../types";

interface Props {
  projectFavorite: boolean;
  onToggleProjectFavorite: () => void;
  conversations: Conversation[];
  onStartConversation: (text: string) => void;
  onSelectConversation: (id: string) => void;
  showDetail?: boolean;
  onOpenDetail: () => void;
  onCloseDetail: () => void;
}

export default function ProjectsPage({
  projectFavorite,
  onToggleProjectFavorite,
  conversations,
  onStartConversation,
  onSelectConversation,
  showDetail = false,
  onOpenDetail,
  onCloseDetail,
}: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("activite");
  const [sortOpen, setSortOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("partage");
  const [modalOpen, setModalOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sortOpen) return;
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sortOpen]);

  if (showDetail) {
    return (
      <ProjectDetailPage
        onBack={onCloseDetail}
        favorite={projectFavorite}
        onToggleFavorite={onToggleProjectFavorite}
        conversations={conversations}
        onStartConversation={onStartConversation}
        onSelectConversation={onSelectConversation}
      />
    );
  }

  const showProject =
    tab === "partage" &&
    (search === "" ||
      PROJECT.title.toLowerCase().includes(search.toLowerCase()) ||
      PROJECT.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8">
      {modalOpen && <NoNewProjectModal onClose={() => setModalOpen(false)} />}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-(--foreground)">Projets</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-(--foreground) text-(--background) text-sm font-medium hover:opacity-80 transition-opacity"
          >
            <Icon size={14}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </Icon>
            Nouveau projet
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)">
            <Icon>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </Icon>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher des projets..."
            className="w-full rounded-xl border-2 border-(--border) focus:border-blue-400 bg-(--input-bg) pl-10 pr-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted) focus:outline-none transition-colors"
          />
        </div>

        {/* Tabs + Sort */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1">
            {(
              [
                ["vos", "Vos projets"],
                ["equipe", "Équipe"],
                ["partage", "Partagé avec vous."],
              ] as [Tab, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  tab === key
                    ? "bg-(--hover-bg) text-(--foreground) font-medium"
                    : "text-(--muted) hover:text-(--foreground)"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div ref={sortRef} className="relative flex items-center gap-2 text-sm text-(--muted)">
            <span>Trier par</span>
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-(--border) text-(--foreground) hover:bg-(--hover-bg) transition-colors text-sm"
            >
              {SORT_LABELS[sort].split(" ")[0]}
              <Icon size={14}>
                <polyline points="6 9 12 15 18 9" />
              </Icon>
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-(--input-bg) border border-(--border) rounded-xl shadow-lg py-1 w-52">
                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSort(key);
                      setSortOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-(--foreground) hover:bg-(--hover-bg) transition-colors"
                  >
                    {label}
                    {sort === key && (
                      <Icon size={14}>
                        <polyline points="20 6 9 17 4 12" />
                      </Icon>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {tab !== "partage" ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-(--muted)">Aucun projet.</p>
          </div>
        ) : showProject ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={onOpenDetail}
              className="flex flex-col gap-1.5 p-4 rounded-xl border border-(--border) bg-(--input-bg) hover:bg-(--hover-bg) transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-(--foreground)">{PROJECT.title}</span>
                <span className="text-(--muted)">
                  <LockIcon />
                </span>
              </div>
              <p className="text-sm text-(--muted) line-clamp-2">{PROJECT.description}</p>
              <p className="text-xs text-(--muted) mt-1">Mis.e.s à jour il y a 18 heures</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-(--muted)">Aucun projet trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
}
