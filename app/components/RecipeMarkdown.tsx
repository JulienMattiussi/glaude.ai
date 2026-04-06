"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Components, ExtraProps } from "react-markdown";

type LiElement = React.ReactElement<React.LiHTMLAttributes<HTMLLIElement> & ExtraProps>;

const InteractiveOl = ({ children }: { children: React.ReactNode }) => {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  let index = 0;

  const styledChildren = Array.isArray(children)
    ? children.map((child) => {
        if (!child || typeof child !== "object" || (child as LiElement).type !== "li") {
          return child;
        }
        const liChild = child as LiElement;
        const i = index++;
        const done = !!checked[i];
        return (
          <li
            key={i}
            onClick={() => setChecked((prev) => ({ ...prev, [i]: !prev[i] }))}
            className="flex items-start gap-3 py-2 cursor-pointer select-none group/step list-none"
          >
            <span
              className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-200 ${
                done
                  ? "bg-(--foreground) border-(--foreground) text-(--background)"
                  : "border-(--border) text-(--muted) group-hover/step:border-(--foreground) group-hover/step:text-(--foreground)"
              }`}
            >
              {done ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span className={`text-sm leading-relaxed pt-0.5 transition-all duration-200 ${done ? "line-through text-(--muted)" : "text-(--foreground)"}`}>
              {liChild.props.children}
            </span>
          </li>
        );
      })
    : children;

  return <ol className="flex flex-col gap-1 my-3 pl-0">{styledChildren}</ol>;
};

const components: Components = {
  ol: ({ children }) => <InteractiveOl>{children}</InteractiveOl>,
};

export const RecipeMarkdown = ({ content }: { content: string }) => (
  <div className="text-sm leading-relaxed max-w-lg text-(--foreground) prose prose-sm prose-neutral px-1">
    <ReactMarkdown components={components}>{content}</ReactMarkdown>
  </div>
);
