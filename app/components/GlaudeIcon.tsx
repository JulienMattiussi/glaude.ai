const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export default function GlaudeIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      {ANGLES.map((angle) => (
        <ellipse
          key={angle}
          cx="12"
          cy="7.2"
          rx="1.1"
          ry="3.5"
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
    </svg>
  );
}
