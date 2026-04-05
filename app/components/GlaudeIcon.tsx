// cy + ry = 10.7 kept constant → inner tip stays fixed at 1.3 from center
// varying cy/ry moves only the outer tip
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

export default function GlaudeIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      {PETALS.map(({ angle, cy, ry, rx }) => (
        <ellipse key={angle} cx="12" cy={cy} rx={rx} ry={ry} transform={`rotate(${angle} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}
