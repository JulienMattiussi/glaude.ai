import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
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

function buildIconPaths(s: number): { ellipses: string[]; ring: string } {
  const vb = 24;
  const scale = s / vb;
  const centerX = 12;
  const centerY = 12;

  const ellipses = PETALS.map(({ angle, cy, ry, rx }) => {
    const rad = (angle * Math.PI) / 180;
    const points = [];
    for (let i = 0; i <= 32; i++) {
      const t = (i / 32) * 2 * Math.PI;
      const ex = centerX + rx * Math.cos(t);
      const ey = cy + ry * Math.sin(t);
      const dx = ex - centerX;
      const dy = ey - centerY;
      const rx2 = dx * Math.cos(rad) - dy * Math.sin(rad) + centerX;
      const ry2 = dx * Math.sin(rad) + dy * Math.cos(rad) + centerY;
      points.push(`${i === 0 ? "M" : "L"}${(rx2 * scale).toFixed(2)},${(ry2 * scale).toFixed(2)}`);
    }
    return points.join(" ") + " Z";
  });

  const cr = 3;
  const sw = 2.2 / 2;
  const outerR = (cr + sw) * scale;
  const innerR = (cr - sw) * scale;
  const cx2 = centerX * scale;
  const cy2 = centerY * scale;
  const ring =
    `M${cx2 + outerR},${cy2} A${outerR},${outerR} 0 1,0 ${cx2 - outerR},${cy2} A${outerR},${outerR} 0 1,0 ${cx2 + outerR},${cy2} Z ` +
    `M${cx2 + innerR},${cy2} A${innerR},${innerR} 0 1,1 ${cx2 - innerR},${cy2} A${innerR},${innerR} 0 1,1 ${cx2 + innerR},${cy2} Z`;

  return { ellipses, ring };
}

export default function OgImage() {
  const iconSize = 160;
  const { ellipses, ring } = buildIconPaths(iconSize);
  const accent = "#d97757";
  const bg = "#f5f0e8";
  const fg = "#2d2926";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* Logo + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <svg
          width={iconSize}
          height={iconSize}
          viewBox={`0 0 ${iconSize} ${iconSize}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {ellipses.map((d, i) => (
            <path key={i} d={d} fill={accent} />
          ))}
          <path d={ring} fill={accent} fill-rule="evenodd" />
        </svg>
        <span
          style={{
            fontSize: 120,
            fontWeight: 700,
            color: fg,
            letterSpacing: "-2px",
            fontFamily: "serif",
          }}
        >
          Glaude
        </span>
      </div>

      {/* Byline */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: fg,
          opacity: 0.4,
          fontSize: 22,
          letterSpacing: "4px",
          fontFamily: "sans-serif",
        }}
      >
        BY YavaDeus
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
