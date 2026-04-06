"use client";

const PETALS = [
  { angle: 0, cy: 7.2, ry: 3.5, rx: 0.65 },
  { angle: 28, cy: 6.3, ry: 4.4, rx: 0.6 },
  { angle: 65, cy: 7.8, ry: 2.9, rx: 0.7 },
  { angle: 95, cy: 6.0, ry: 4.7, rx: 0.6 },
  { angle: 131, cy: 7.9, ry: 2.8, rx: 0.7 },
  { angle: 160, cy: 6.5, ry: 4.2, rx: 0.55 },
  { angle: 198, cy: 7.6, ry: 3.1, rx: 0.65 },
  { angle: 227, cy: 5.9, ry: 4.8, rx: 0.6 },
  { angle: 263, cy: 7.4, ry: 3.3, rx: 0.7 },
  { angle: 291, cy: 6.2, ry: 4.5, rx: 0.58 },
  { angle: 330, cy: 7.7, ry: 3.0, rx: 0.63 },
];

export default function AnimatedGlaudeIcon({
  size = 24,
  fast = false,
}: {
  size?: number;
  fast?: boolean;
}) {
  const dur = fast ? "0.6s" : "2.4s";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <style>{`
        @keyframes glaude-pulse {
          0%, 100% { transform: scale(1);    opacity: 1; }
          50%       { transform: scale(1.18); opacity: 0.85; }
        }
        .glaude-petals-slow  { transform-origin: 12px 12px; animation: glaude-pulse 2.4s ease-in-out infinite; }
        .glaude-petals-fast  { transform-origin: 12px 12px; animation: glaude-pulse 0.6s ease-in-out infinite; }
      `}</style>
      <g className={fast ? "glaude-petals-fast" : "glaude-petals-slow"}>
        {PETALS.map(({ angle, cy, ry, rx }) => (
          <ellipse
            key={angle}
            cx="12"
            cy={cy}
            rx={rx}
            ry={ry}
            transform={`rotate(${angle} 12 12)`}
          />
        ))}
      </g>
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2.2">
        <animate
          attributeName="r"
          values="3;5;3"
          dur={dur}
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
        />
      </circle>
    </svg>
  );
}
