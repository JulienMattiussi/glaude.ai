"use client";

import { useState } from "react";
import { Icon } from "../icons/Icon";

const CopyPaths = () => (
  <>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </>
);

const CheckPaths = () => <polyline points="20 6 9 17 4 12" />;

export const CopyButton = ({ content }: { content: string }) => {
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
