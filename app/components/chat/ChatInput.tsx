"use client";

import { Icon } from "../icons/Icon";

const ToolIcons = () => (
  <div className="flex items-center gap-1.5 text-xs text-(--muted)">
    {["G", "G", "A", "C", "A", "C", "●"].map((icon, i) => (
      <span
        key={i}
        className="w-5 h-5 rounded-full bg-(--hover-bg) flex items-center justify-center text-[10px] font-bold text-(--muted)"
      >
        {icon}
      </span>
    ))}
    <span className="ml-0.5">›</span>
  </div>
);

export interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onInput: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  disabled?: boolean;
}

export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  onInput,
  textareaRef,
  disabled,
}: ChatInputProps) => (
  <div
    className={`bg-(--input-bg) rounded-2xl shadow-sm border border-(--border) ${disabled ? "opacity-60" : ""}`}
  >
    <div className="px-4 pt-3 pb-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onInput={onInput}
        placeholder="Comment puis-je vous aider ?"
        rows={1}
        disabled={disabled}
        className="w-full resize-none bg-transparent text-sm text-(--foreground) placeholder:text-(--muted) focus:outline-none min-h-6 max-h-50 disabled:cursor-not-allowed"
      />
    </div>
    <div className="flex items-center justify-between px-3 pb-3">
      <button className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-(--hover-bg) text-(--muted) transition-colors">
        <Icon>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </Icon>
      </button>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 text-xs text-(--muted) hover:text-(--foreground) transition-colors px-2 py-1 rounded-md hover:bg-(--hover-bg)">
          <span>Bombé 4.6</span>
          <Icon size={12}>
            <polyline points="6 9 12 15 18 9" />
          </Icon>
        </button>
        <button className="text-(--muted) hover:text-(--foreground) transition-colors">
          <Icon>
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </Icon>
        </button>
        {value.trim() && !disabled && (
          <button
            onClick={onSubmit}
            className="w-7 h-7 rounded-full bg-(--foreground) flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        )}
      </div>
    </div>
    <div className="flex items-center justify-between px-3 pb-2.5 border-t border-(--border) pt-2">
      <span className="text-xs text-(--muted)">Connectez vos outils au Glaude</span>
      <ToolIcons />
    </div>
  </div>
);
