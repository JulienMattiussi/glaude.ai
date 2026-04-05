import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

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

export default function Icon() {
  const color = "#d97757";
  const vb = 24;
  const s = 32;
  const scale = s / vb;

  const ellipsePaths = PETALS.map(({ angle, cy, ry, rx }) => {
    // Convert ellipse to path points scaled to 32x32, with rotation around center
    const rad = (angle * Math.PI) / 180;
    const cx = 12;
    const centerX = 12;
    const centerY = 12;

    // Approximate ellipse as a series of points, then rotate
    const points = [];
    for (let i = 0; i <= 32; i++) {
      const t = (i / 32) * 2 * Math.PI;
      const ex = cx + rx * Math.cos(t);
      const ey = cy + ry * Math.sin(t);
      // rotate around center
      const dx = ex - centerX;
      const dy = ey - centerY;
      const rx2 = dx * Math.cos(rad) - dy * Math.sin(rad) + centerX;
      const ry2 = dx * Math.sin(rad) + dy * Math.cos(rad) + centerY;
      points.push(`${i === 0 ? "M" : "L"}${(rx2 * scale).toFixed(2)},${(ry2 * scale).toFixed(2)}`);
    }
    return points.join(" ") + " Z";
  });

  // Circle stroke as two arcs (outer and inner radius)
  const cr = 3;
  const sw = 2.2 / 2;
  const outerR = (cr + sw) * scale;
  const innerR = (cr - sw) * scale;
  const cx2 = 12 * scale;
  const cy2 = 12 * scale;

  const ringPath =
    `M${cx2 + outerR},${cy2} A${outerR},${outerR} 0 1,0 ${cx2 - outerR},${cy2} A${outerR},${outerR} 0 1,0 ${cx2 + outerR},${cy2} Z ` +
    `M${cx2 + innerR},${cy2} A${innerR},${innerR} 0 1,1 ${cx2 - innerR},${cy2} A${innerR},${innerR} 0 1,1 ${cx2 + innerR},${cy2} Z`;

  return new ImageResponse(
    (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        {ellipsePaths.map((d, i) => (
          <path key={i} d={d} fill={color} />
        ))}
        <path d={ringPath} fill={color} fillRule="evenodd" />
      </svg>
    ),
    { width: s, height: s }
  );
}
