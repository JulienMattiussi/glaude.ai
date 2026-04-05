import { ReactNode } from "react";

export const Icon = ({
  size = 16,
  children,
}: {
  size?: number;
  children: ReactNode;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const IconBtn = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <button
    className="p-1.5 rounded-md text-(--muted) hover:text-(--foreground) hover:bg-(--hover-bg) transition-colors"
    title={title}
  >
    {children}
  </button>
);
