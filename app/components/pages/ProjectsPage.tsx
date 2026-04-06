"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "../icons/Icon";

const ProjectsEmptyIcon = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-(--foreground)"
  >
    <rect x="10" y="10" width="26" height="26" rx="2" />
    <rect x="44" y="10" width="26" height="26" rx="2" />
    <rect x="10" y="44" width="26" height="26" rx="2" />
    <rect x="44" y="44" width="26" height="26" rx="2" />
    <g transform="translate(46, 46)">
      <path d="M8 2C8 2 8 12 8 16C8 18 10 20 12 20C14 20 16 18 16 16L16 10" strokeLinecap="round" />
      <path d="M8 16C8 16 4 18 4 22C4 26 6 30 8 32" strokeLinecap="round" />
      <line x1="10" y1="10" x2="10" y2="4" strokeLinecap="round" />
      <line x1="12" y1="10" x2="12" y2="3" strokeLinecap="round" />
      <line x1="14" y1="10" x2="14" y2="4" strokeLinecap="round" />
      <line x1="16" y1="10" x2="16" y2="5" strokeLinecap="round" />
    </g>
  </svg>
);

type SortOption = "activite" | "modification" | "creation";

const SORT_LABELS: Record<SortOption, string> = {
  activite: "Activité récente",
  modification: "Dernière modification",
  creation: "Créé.e.s récemment",
};

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("activite");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sortOpen) return;
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sortOpen]);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-(--foreground)">Projets</h1>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-(--foreground) text-(--background) text-sm font-medium hover:opacity-80 transition-opacity">
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

        {/* Sort */}
        <div className="flex items-center justify-end gap-2 text-sm text-(--muted) mb-8">
          <span>Trier par</span>
          <div ref={sortRef} className="relative">
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
              <div className="absolute right-0 mt-1 z-50 bg-(--input-bg) border border-(--border) rounded-xl shadow-lg py-1 w-52">
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

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <ProjectsEmptyIcon />
          <h2 className="text-base font-semibold text-(--foreground)">
            Vous souhaitez démarrer un projet ?
          </h2>
          <p className="text-sm text-(--muted) max-w-sm leading-relaxed">
            Téléchargez vos documents, définissez des instructions personnalisées et organisez vos
            conversations dans un seul espace.
          </p>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-(--border) text-(--foreground) text-sm font-medium hover:bg-(--hover-bg) transition-colors mt-2">
            <Icon size={14}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </Icon>
            Nouveau projet
          </button>
        </div>
      </div>
    </div>
  );
}
