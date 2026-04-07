"use client";

import { useMemo } from "react";

interface Props {
  active: boolean;
  boltCount: number;
}

export function LightningEffect({ active, boltCount }: Props) {
  // Random offset + tilt per trigger, stable for the duration of the animation
  const offsets = useMemo(
    () =>
      Array.from({ length: 5 }, () => ({
        x: (Math.random() * 2 - 1) * 30, // ±30% horizontal
        y: (Math.random() * 2 - 1) * 15, // ±15% vertical
        tilt: (Math.random() * 2 - 1) * 10, // ±10° rotation
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active]
  );

  if (!active) return null;

  const count = Math.min(boltCount, 5);

  return (
    <div key={Date.now()} className="fixed inset-0 pointer-events-none z-9999">
      <div
        className="absolute inset-0"
        style={{
          background: "white",
          animation: "lightning-screen-flash-anim 1.1s ease-out forwards",
        }}
      />

      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            animation: `lightning-bolt-anim 1.1s ease-out ${i * 90}ms forwards`,
            transform: `translate(${offsets[i].x}%, ${offsets[i].y}%) rotate(${offsets[i].tilt}deg)`,
            transformOrigin: "50% 0%",
          }}
        >
          <img
            src="/crack-lightning.svg"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ))}
    </div>
  );
}
