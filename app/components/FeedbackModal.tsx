"use client";

import { useState } from "react";
import { Icon } from "./ui";

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

export const FeedbackModal = ({
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
