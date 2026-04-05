"use client";

import { Icon } from "./ui";

const UfoIcon = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Dome */}
    <path d="M28 38 C28 28 52 28 52 38" />
    <ellipse cx="40" cy="30" rx="10" ry="9" />
    {/* Saucer body */}
    <ellipse cx="40" cy="38" rx="24" ry="8" />
    {/* Beam */}
    <path d="M32 46 L26 60" strokeDasharray="3 3" />
    <path d="M40 47 L40 62" strokeDasharray="3 3" />
    <path d="M48 46 L54 60" strokeDasharray="3 3" />
    {/* Lights */}
    <circle cx="28" cy="38" r="2" fill="currentColor" stroke="none" />
    <circle cx="40" cy="41" r="2" fill="currentColor" stroke="none" />
    <circle cx="52" cy="38" r="2" fill="currentColor" stroke="none" />
  </svg>
);

const CardIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-9 h-9 rounded-lg bg-(--hover-bg) flex items-center justify-center shrink-0 text-(--muted)">
    {children}
  </div>
);

export default function PersonnalisePage() {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-8 py-12">
      <div className="max-w-lg w-full flex flex-col items-center gap-6">
        {/* Hero */}
        <span className="text-(--foreground) opacity-70">
          <UfoIcon size={150} />
        </span>
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-(--foreground)">Personnaliser Glaude</h1>
          <p className="text-sm text-(--muted) leading-relaxed max-w-sm mx-auto">
            Les compétences, connecteurs et plugins façonnent la manière dont Glaude travaille avec vous.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-3 w-full mt-2">
          <button className="flex items-start gap-4 p-4 rounded-2xl border border-(--border) bg-(--input-bg) hover:bg-(--hover-bg) transition-colors text-left w-full">
            <CardIcon>
              <Icon>
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8" />
                <path d="M12 17v4" />
                <path d="M7 8h2" />
                <path d="M11 8h6" />
                <path d="M7 12h2" />
                <path d="M11 12h6" />
              </Icon>
            </CardIcon>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-(--foreground)">Connectez vos applications</span>
              <span className="text-sm text-(--muted) leading-relaxed">
                Permettez à Glaude de lire et d&apos;écrire dans les outils que vous utilisez déjà.
              </span>
            </div>
          </button>

          <button className="flex items-start gap-4 p-4 rounded-2xl border border-(--border) bg-(--input-bg) hover:bg-(--hover-bg) transition-colors text-left w-full">
            <CardIcon>
              <Icon>
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </Icon>
            </CardIcon>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-(--foreground)">Créer de nouvelles compétences</span>
              <span className="text-sm text-(--muted) leading-relaxed">
                Apprenez à Glaude vos processus, normes d&apos;équipe et expertise.
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
