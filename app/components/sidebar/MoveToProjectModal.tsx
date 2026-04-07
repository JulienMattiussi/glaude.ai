"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../icons/Icon";

interface Project {
  id: string;
  title: string;
}

interface Props {
  projects: Project[];
  currentProjectId?: string;
  onSelect: (projectId: string) => void;
  onClose: () => void;
}

export function MoveToProjectModal({ projects, currentProjectId, onSelect, onClose }: Props) {
  const [search, setSearch] = useState("");
  const filtered = projects.filter(
    (p) => p.id !== currentProjectId && p.title.toLowerCase().includes(search.toLowerCase())
  );

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-(--input-bg) rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-(--foreground)">Déplacer la conversation</h2>
            <p className="text-sm text-(--muted) mt-0.5">
              Sélectionnez un projet dans lequel déplacer cette conversation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 mt-0.5 shrink-0 p-1.5 rounded-lg text-(--muted) hover:text-(--foreground) hover:bg-(--hover-bg) transition-colors"
          >
            <Icon size={16}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </Icon>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)">
              <Icon size={15}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </Icon>
            </span>
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher ou créer un projet"
              className="w-full rounded-xl border border-(--border) bg-(--background) pl-9 pr-3 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted) focus:outline-none focus:border-(--focus-ring) transition-colors"
            />
          </div>
        </div>

        {/* Project list */}
        <div className="flex flex-col px-3 pb-4 min-h-52 overflow-y-auto max-h-72">
          {filtered.map((project) => (
            <button
              key={project.id}
              onClick={() => {
                onSelect(project.id);
                onClose();
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-(--foreground) hover:bg-(--hover-bg) transition-colors text-left"
            >
              <span className="text-(--muted)">
                <Icon size={16}>
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </Icon>
              </span>
              {project.title}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
