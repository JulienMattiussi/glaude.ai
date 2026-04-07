"use client";

/* La Danrée — cartoon style, d'après le film La Soupe aux choux (1981)
   Combinaison jaune avec renforts rouges (épaules, coudes, oreilles, bottes)
   capuche jaune + antennes, visage humanoïde surpris */
export const MartianSvg = () => (
  <svg
    viewBox="0 0 120 320"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "100%", display: "block" }}
  >
    {/* ── Top head ball ────────────────────────── */}
    <circle cx="60" cy="17" r="15" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
    <circle cx="60" cy="17" r="7" fill="#dc2626" />
    <circle cx="55" cy="12" r="3" fill="#fca5a5" opacity="0.7" />

    {/* ── Ear pads (red, behind head) ──────────── */}
    <circle cx="19" cy="63" r="15" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
    <circle cx="101" cy="63" r="15" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
    <circle cx="19" cy="63" r="7" fill="#dc2626" />
    <circle cx="101" cy="63" r="7" fill="#dc2626" />

    {/* ── Head / hood ──────────────────────────── */}
    <ellipse cx="60" cy="62" rx="41" ry="45" fill="#fde68a" stroke="#d97706" strokeWidth="3" />
    {/* hood sheen */}
    <path
      d="M 36 40 Q 44 22 60 19 Q 76 22 82 40"
      fill="none"
      stroke="#fef9c3"
      strokeWidth="6"
      strokeLinecap="round"
      opacity="0.55"
    />

    {/* ── Face ─────────────────────────────────── */}
    {/* Eyes */}
    <circle cx="44" cy="57" r="10" fill="white" stroke="#374151" strokeWidth="2" />
    <circle cx="76" cy="57" r="10" fill="white" stroke="#374151" strokeWidth="2" />
    <circle cx="46" cy="59" r="6" fill="#1f2937" />
    <circle cx="78" cy="59" r="6" fill="#1f2937" />
    <circle cx="49" cy="56" r="2.5" fill="white" />
    <circle cx="81" cy="56" r="2.5" fill="white" />
    {/* Eyebrows (raised = surprised) */}
    <path
      d="M 36 44 Q 44 40 52 43"
      fill="none"
      stroke="#92400e"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M 68 43 Q 76 40 84 44"
      fill="none"
      stroke="#92400e"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Mouth — surprised O */}
    <ellipse cx="60" cy="78" rx="8" ry="9" fill="#1f2937" />
    <ellipse cx="60" cy="79" rx="5" ry="6" fill="#7f1d1d" opacity="0.85" />

    {/* ── Neck ─────────────────────────────────── */}
    <rect
      x="49"
      y="104"
      width="22"
      height="16"
      rx="4"
      fill="#fde68a"
      stroke="#d97706"
      strokeWidth="2"
    />

    {/* ── Body / combinaison ───────────────────── */}
    <path
      d="M 25 120 L 22 212 L 98 212 L 95 120 Z"
      fill="#fde68a"
      stroke="#d97706"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Body centre seam */}
    <line x1="60" y1="120" x2="60" y2="212" stroke="#d97706" strokeWidth="1.5" opacity="0.4" />

    {/* ── Shoulder pads (red) ──────────────────── */}
    <ellipse
      cx="27"
      cy="123"
      rx="21"
      ry="13"
      fill="#ef4444"
      stroke="#b91c1c"
      strokeWidth="2"
      transform="rotate(-22 27 123)"
    />
    <ellipse
      cx="93"
      cy="123"
      rx="21"
      ry="13"
      fill="#ef4444"
      stroke="#b91c1c"
      strokeWidth="2"
      transform="rotate(22 93 123)"
    />
    <ellipse
      cx="27"
      cy="122"
      rx="10"
      ry="6"
      fill="#dc2626"
      transform="rotate(-22 27 122)"
      opacity="0.6"
    />
    <ellipse
      cx="93"
      cy="122"
      rx="10"
      ry="6"
      fill="#dc2626"
      transform="rotate(22 93 122)"
      opacity="0.6"
    />

    {/* ── Left arm ─────────────────────────────── */}
    <path
      d="M 18 132 C 14 158 11 182 9 200 L 26 200 C 26 182 28 158 30 132 Z"
      fill="#fde68a"
      stroke="#d97706"
      strokeWidth="2"
    />
    {/* Left elbow patch */}
    <circle cx="17" cy="165" r="10" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
    <circle cx="17" cy="165" r="5" fill="#dc2626" opacity="0.6" />

    {/* ── Right arm ────────────────────────────── */}
    <path
      d="M 102 132 C 106 158 109 182 111 200 L 94 200 C 92 182 92 158 90 132 Z"
      fill="#fde68a"
      stroke="#d97706"
      strokeWidth="2"
    />
    {/* Right elbow patch */}
    <circle cx="103" cy="165" r="10" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
    <circle cx="103" cy="165" r="5" fill="#dc2626" opacity="0.6" />

    {/* ── Legs ─────────────────────────────────── */}
    <rect
      x="29"
      y="212"
      width="25"
      height="52"
      rx="5"
      fill="#fde68a"
      stroke="#d97706"
      strokeWidth="2"
    />
    <rect
      x="66"
      y="212"
      width="25"
      height="52"
      rx="5"
      fill="#fde68a"
      stroke="#d97706"
      strokeWidth="2"
    />

    {/* ── Boots (big red) ──────────────────────── */}
    <path
      d="M 14 256 L 18 300 L 62 300 L 58 256 Z"
      fill="#ef4444"
      stroke="#b91c1c"
      strokeWidth="2.5"
    />
    <path
      d="M 62 256 L 66 300 L 110 300 L 106 256 Z"
      fill="#ef4444"
      stroke="#b91c1c"
      strokeWidth="2.5"
    />
    {/* Boot highlights */}
    <path
      d="M 20 263 Q 35 256 52 262"
      fill="none"
      stroke="#fca5a5"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M 70 263 Q 85 256 102 262"
      fill="none"
      stroke="#fca5a5"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* ── Ground shadow ────────────────────────── */}
    <ellipse cx="60" cy="312" rx="44" ry="7" fill="#1f2937" opacity="0.2" />
  </svg>
);

export default function MartianPanel() {
  return (
    <div
      className="shrink-0"
      style={{
        maxHeight: "150px",
        alignSelf: "stretch",
        aspectRatio: "120 / 320",
        animation: "martian-enter 0.5s ease-out forwards",
      }}
    >
      <MartianSvg />
    </div>
  );
}
