"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../icons/Icon";

export const ConversationItem = ({
  label,
  active,
  collapsed,
  onClick,
  onDelete,
  onRename,
  onToggleFavorite,
  favorite,
}: {
  label: string;
  active: boolean;
  collapsed: boolean;
  favorite?: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
  onToggleFavorite: () => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(label);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const openMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) setMenuPos({ top: rect.bottom + 4, left: rect.left - 160 });
    setMenuOpen((o) => !o);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors w-full group/conv ${
          active
            ? "bg-(--hover-bg) text-(--foreground)"
            : "text-(--foreground) hover:bg-(--hover-bg)"
        }`}
      >
        <button
          onClick={onClick}
          title={collapsed ? label : undefined}
          className="flex-1 text-left overflow-hidden"
        >
          <span
            className={`block whitespace-nowrap transition-all duration-300 overflow-hidden text-ellipsis ${
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            {label}
          </span>
        </button>
        {!collapsed && (
          <button
            ref={btnRef}
            onClick={openMenu}
            className={`shrink-0 p-1 rounded text-(--muted) hover:text-(--foreground) transition-colors ${active ? "opacity-100" : "opacity-0 group-hover/conv:opacity-100"}`}
            title="Options"
          >
            <Icon size={16}>
              <circle cx="5" cy="12" r="2" fill="currentColor" stroke="none" />
              <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
              <circle cx="19" cy="12" r="2" fill="currentColor" stroke="none" />
            </Icon>
          </button>
        )}
      </div>

      {menuOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
            className="z-50 bg-(--input-bg) border border-(--border) rounded-xl shadow-lg py-1 w-48"
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                onToggleFavorite();
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-(--foreground) hover:bg-(--hover-bg) transition-colors"
            >
              <span className="text-(--muted)">
                <Icon size={14}>
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    fill={favorite ? "currentColor" : "none"}
                  />
                </Icon>
              </span>
              {favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                setRenameValue(label);
                setRenaming(true);
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-(--foreground) hover:bg-(--hover-bg) transition-colors"
            >
              <span className="text-(--muted)">
                <Icon size={14}>
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </Icon>
              </span>
              Renommer
            </button>
            <button
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-(--foreground) hover:bg-(--hover-bg) transition-colors"
            >
              <span className="text-(--muted)">
                <Icon size={14}>
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </Icon>
              </span>
              Ajouter au projet
            </button>
            <div className="h-px bg-(--border) mx-3 my-1" />
            <button
              onClick={() => {
                setMenuOpen(false);
                setConfirmDelete(true);
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-(--danger) hover:bg-(--hover-bg) transition-colors"
            >
              <span>
                <Icon size={14}>
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </Icon>
              </span>
              Supprimer
            </button>
          </div>,
          document.body
        )}

      {renaming &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            onClick={() => setRenaming(false)}
          >
            <div
              className="bg-(--input-bg) rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-(--foreground)">
                Renommer la conversation
              </h2>
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && renameValue.trim()) {
                    onRename(renameValue.trim());
                    setRenaming(false);
                  }
                  if (e.key === "Escape") setRenaming(false);
                }}
                className="w-full rounded-lg border-2 border-(--focus-ring) bg-(--input-bg) px-3 py-2 text-sm text-(--foreground) focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setRenaming(false)}
                  className="px-4 py-2 rounded-lg text-sm text-(--foreground) hover:bg-(--hover-bg) transition-colors border border-(--border)"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    if (renameValue.trim()) {
                      onRename(renameValue.trim());
                      setRenaming(false);
                    }
                  }}
                  className="px-4 py-2 rounded-lg text-sm text-white bg-(--foreground) hover:opacity-80 transition-opacity"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {confirmDelete &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            onClick={() => setConfirmDelete(false)}
          >
            <div
              className="bg-(--input-bg) rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-(--foreground)">
                Supprimer la conversation
              </h2>
              <p className="text-sm text-(--muted)">
                Êtes-vous sûr de vouloir supprimer cette conversation ?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 rounded-lg text-sm text-(--foreground) hover:bg-(--hover-bg) transition-colors border border-(--border)"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setConfirmDelete(false);
                    onDelete();
                  }}
                  className="px-4 py-2 rounded-lg text-sm text-white bg-(--danger) hover:bg-(--danger-hover) transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
