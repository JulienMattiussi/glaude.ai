"use client";

export const EditMessageUI = ({
  value,
  onChange,
  onSave,
  onCancel,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) => (
  <div className="flex flex-col gap-2 w-full max-w-lg">
    <textarea
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSave();
        }
        if (e.key === "Escape") onCancel();
      }}
      rows={3}
      className="w-full resize-none rounded-xl border-2 border-blue-400 bg-(--input-bg) px-3 py-2 text-sm text-(--foreground) focus:outline-none"
    />
    <div className="flex justify-end gap-2">
      <button
        onClick={onCancel}
        className="px-3 py-1.5 rounded-lg text-sm text-(--foreground) hover:bg-(--hover-bg) transition-colors border border-(--border)"
      >
        Annuler
      </button>
      <button
        onClick={onSave}
        className="px-3 py-1.5 rounded-lg text-sm text-white bg-(--foreground) hover:opacity-80 transition-opacity"
      >
        Enregistrer
      </button>
    </div>
  </div>
);
