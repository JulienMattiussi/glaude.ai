"use client";

const BOLTS: [number, number][][] = [
  [
    [20, 0],
    [13, 13],
    [24, 26],
    [9, 40],
    [21, 54],
    [7, 68],
    [19, 82],
    [13, 100],
  ],
  [
    [50, 0],
    [58, 12],
    [43, 26],
    [55, 40],
    [45, 54],
    [57, 68],
    [47, 83],
    [52, 100],
  ],
  [
    [78, 0],
    [85, 14],
    [70, 27],
    [82, 41],
    [71, 56],
    [83, 70],
    [74, 84],
    [79, 100],
  ],
];

function pts(bolt: [number, number][]): string {
  return bolt.map(([x, y]) => `${x},${y}`).join(" ");
}

export function LightningEffect({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    // key forces a full remount (restarts CSS animations) on each trigger
    <div key={Date.now()} className="fixed inset-0 pointer-events-none z-9999">
      {/* Screen flash */}
      <div
        className="absolute inset-0"
        style={{
          background: "white",
          animation: "lightning-screen-flash-anim 1.1s ease-out forwards",
        }}
      />

      {/* One absolutely-positioned SVG per bolt so CSS animation targets a div */}
      {BOLTS.map((bolt, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            animation: `lightning-bolt-anim 1.1s ease-out ${i * 90}ms forwards`,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id={`halo-${i}`} x="-200%" y="-5%" width="500%" height="110%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id={`glow-${i}`} x="-100%" y="-5%" width="300%" height="110%">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Wide soft halo */}
            <polyline
              points={pts(bolt)}
              stroke="rgba(100,180,255,0.3)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#halo-${i})`}
            />
            {/* Electric blue glow */}
            <polyline
              points={pts(bolt)}
              stroke="rgba(140,210,255,0.85)"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#glow-${i})`}
            />
            {/* Bright white-blue */}
            <polyline
              points={pts(bolt)}
              stroke="rgba(220,240,255,0.95)"
              strokeWidth="0.7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Hot white core */}
            <polyline
              points={pts(bolt)}
              stroke="white"
              strokeWidth="0.25"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
