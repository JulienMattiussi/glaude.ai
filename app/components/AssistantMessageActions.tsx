"use client";

import { useState } from "react";
import { Icon } from "./ui";
import { CopyButton } from "./CopyButton";
import { FeedbackModal } from "./FeedbackModal";

export const AssistantMessageActions = ({
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
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
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
