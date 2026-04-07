"use client";

import { useMemo, useState, useEffect } from "react";

interface Props {
  active: boolean;
  onDismiss: () => void;
  side?: "left" | "right";
  departing?: boolean;
}

const UfoSvg = () => (
  <svg
    width="500"
    height="210"
    viewBox="0 0 500 210"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "min(500px, 90vw)", height: "auto" }}
  >
    {/* Ground shadow */}
    <ellipse cx="250" cy="202" rx="130" ry="10" fill="#1f2937" opacity="0.25" />

    {/* ── Saucer body ──────────────────────────────── */}
    {/* Underside belly (darker) */}
    <path
      d="M 68 136 C 125 158 195 167 250 168 C 305 167 375 158 432 136 C 390 154 305 164 250 165 C 195 164 110 154 68 136 Z"
      fill="#4b5563"
    />
    {/* Main saucer volume */}
    <path
      d="M 68 136 C 120 110 195 99 250 97 C 305 99 380 110 432 136 C 380 158 305 165 250 166 C 195 165 120 158 68 136 Z"
      fill="#9ca3af"
    />
    {/* Top-surface metallic sheen */}
    <path
      d="M 115 120 C 185 104 315 104 385 120"
      fill="none"
      stroke="#d1d5db"
      strokeWidth="14"
      strokeLinecap="round"
      opacity="0.38"
    />
    {/* Saucer rim highlight line */}
    <path
      d="M 68 136 C 120 110 195 99 250 97 C 305 99 380 110 432 136"
      fill="none"
      stroke="#e5e7eb"
      strokeWidth="2"
      opacity="0.5"
    />
    {/* Rim edge outline */}
    <path
      d="M 68 136 C 120 110 195 99 250 97 C 305 99 380 110 432 136 C 380 158 305 165 250 166 C 195 165 120 158 68 136 Z"
      fill="none"
      stroke="#374151"
      strokeWidth="3"
    />
    {/* Saucer equator band */}
    <ellipse cx="250" cy="136" rx="182" ry="30" fill="none" stroke="#6b7280" strokeWidth="3" />

    {/* ── Cockpit bubble (monoplace) ───────────────── */}
    {/* Collar ring at base of bubble */}
    <ellipse cx="250" cy="99" rx="36" ry="7" fill="#7f8c99" stroke="#4b5563" strokeWidth="1.5" />
    {/* Bubble body — transparent hemisphere */}
    <path d="M 214 99 A 36 34 0 0 1 286 99 Z" fill="#93c5fd" opacity="0.35" />
    <path d="M 214 99 A 36 34 0 0 1 286 99" fill="none" stroke="#4b5563" strokeWidth="2" />
    {/* Bubble glass fill with depth */}
    <path d="M 216 99 A 34 32 0 0 1 284 99 Z" fill="#bfdbfe" opacity="0.45" />
    {/* Bubble outer highlight (glint top-left) */}
    <path
      d="M 222 90 Q 229 76 244 72"
      fill="none"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.7"
    />
    {/* Bubble inner reflection */}
    <path
      d="M 226 94 Q 232 84 243 81"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.4"
    />

    {/* ── Underside hub ────────────────────────────── */}
    <ellipse cx="250" cy="161" rx="40" ry="11" fill="#374151" />
    <ellipse cx="250" cy="159" rx="30" ry="8" fill="#4b5563" />
    <ellipse cx="250" cy="157" rx="16" ry="4" fill="#6b7280" />

    {/* ── Rim lights ───────────────────────────────── */}
    <circle cx="110" cy="150" r="6" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" />
    <circle cx="155" cy="158" r="6" fill="#6ee7b7" stroke="#10b981" strokeWidth="1.5" />
    <circle cx="204" cy="163" r="6" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" />
    <circle cx="250" cy="164" r="6" fill="#a5b4fc" stroke="#6366f1" strokeWidth="1.5" />
    <circle cx="296" cy="163" r="6" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" />
    <circle cx="345" cy="158" r="6" fill="#6ee7b7" stroke="#10b981" strokeWidth="1.5" />
    <circle cx="390" cy="150" r="6" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" />
  </svg>
);

export function UfoEffect({ active, onDismiss, side: sideProp, departing }: Props) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const randomSide = useMemo(() => (Math.random() < 0.5 ? "left" : "right"), [active]);
  const side = sideProp ?? randomSide;
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    if (!active) {
      setLanded(false);
      return;
    }
    if (departing) return; // departure auto-dismissed by parent
    const t = setTimeout(() => setLanded(true), 5000);
    return () => clearTimeout(t);
  }, [active, departing]);

  if (!active) return null;

  const animationName = side === "left" ? "ufo-fly-left" : "ufo-fly-right";
  const animation = departing
    ? `${animationName} 5s linear reverse forwards`
    : `${animationName} 5s linear forwards`;

  return (
    <div
      key={String(active) + String(departing)}
      className="fixed inset-x-0 z-40"
      style={{
        bottom: "96px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        pointerEvents: "none",
      }}
    >
      <div
        onClick={landed && !departing ? onDismiss : undefined}
        style={{
          animation,
          pointerEvents: landed && !departing ? "auto" : "none",
          cursor: landed && !departing ? "pointer" : "default",
        }}
      >
        <UfoSvg />
      </div>
    </div>
  );
}
