"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────── */

export interface QuickChip {
  label: string;
  prompt: string;
  icon?: string;  // Material Symbol name
  iconColor?: "primary" | "secondary" | "tertiary";
}

export interface ChatInputProps {
  /** Current input value (controlled). If omitted, ChatInput manages its own state internally. */
  value?: string;
  /** Called when user submits a message */
  onSend: (message: string) => void;
  /** Called when user clicks a quick chip */
  onChipClick?: (prompt: string) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Loading / streaming state */
  isLoading?: boolean;
  /** Language for labels */
  language?: "id" | "en";
  /** Placeholder text */
  placeholder?: string;
  /** Quick prompt chips to show above input */
  quickChips?: QuickChip[];
}

/* ──────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────── */

const DEFAULT_CHIPS_ID: QuickChip[] = [
  {
    label: "Bandingkan dgn BBRI",
    prompt: "Bandingkan valuasi BBCA dengan BBRI",
    icon: "compare_arrows",
    iconColor: "primary",
  },
  {
    label: "Cek Dividen Yield",
    prompt: "Berapa estimasi dividen yield BBCA tahun ini?",
    icon: "payments",
    iconColor: "tertiary",
  },
  {
    label: "Foreign Net Flow",
    prompt: "Bagaimana akumulasi Foreign Net Flow pada saham BBCA 1 bulan terakhir?",
    icon: "trending_up",
    iconColor: "secondary",
  },
];

const DEFAULT_CHIPS_EN: QuickChip[] = [
  {
    label: "Compare with BBRI",
    prompt: "Compare BBCA valuation with BBRI",
    icon: "compare_arrows",
    iconColor: "primary",
  },
  {
    label: "Check Dividend Yield",
    prompt: "What's the estimated dividend yield for BBCA this year?",
    icon: "payments",
    iconColor: "tertiary",
  },
  {
    label: "Foreign Net Flow",
    prompt: "How has Foreign Net Flow accumulated for BBCA over the past month?",
    icon: "trending_up",
    iconColor: "secondary",
  },
];

const DEFAULT_PLACEHOLDER_ID = "Tanyakan sesuatu tentang saham IDX...";
const DEFAULT_PLACEHOLDER_EN = "Ask about IDX stocks...";

export default function ChatInput({
  value: externalValue,
  onSend,
  onChipClick,
  disabled,
  isLoading,
  language = "id",
  placeholder,
  quickChips,
}: ChatInputProps) {
  const chips = quickChips ?? (language === "id" ? DEFAULT_CHIPS_ID : DEFAULT_CHIPS_EN);
  const placeholderText = placeholder ?? (language === "id" ? DEFAULT_PLACEHOLDER_ID : DEFAULT_PLACEHOLDER_EN);
  const inputRef = useRef<HTMLInputElement>(null);

  // Internal state when value is uncontrolled
  const [internalValue, setInternalValue] = useState("");
  const value = externalValue !== undefined ? externalValue : internalValue;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (externalValue === undefined) {
      setInternalValue(e.target.value);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled || isLoading) return;
    onSend(trimmed);
    if (externalValue === undefined) setInternalValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function handleChipClick(prompt: string) {
    onChipClick?.(prompt);
    if (inputRef.current) {
      inputRef.current.value = prompt;
      if (externalValue === undefined) setInternalValue(prompt);
    }
  }

  const canSend = value.trim().length > 0 && !disabled && !isLoading;

  return (
    <div className="flex flex-col gap-space-sm">
      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 px-margin">
        {chips.map((chip) => (
          <button
            key={chip.prompt}
            type="button"
            onClick={() => handleChipClick(chip.prompt)}
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              "bg-surface-container-high text-on-surface",
              "hover:text-primary active:scale-95 transition-all"
            )}
          >
            {chip.icon && (
              <span
                className={cn(
                  "material-symbols-outlined text-[14px]",
                  chip.iconColor === "secondary" && "text-secondary",
                  chip.iconColor === "tertiary" && "text-tertiary",
                  (!chip.iconColor || chip.iconColor === "primary") && "text-primary"
                )}
              >
                {chip.icon}
              </span>
            )}
            <span className="font-body-sm font-body-sm whitespace-nowrap">{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="w-full flex items-center gap-2 p-1.5 pl-3 rounded-full bg-surface-container-high shadow-lg mx-margin">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0">search</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          disabled={disabled || isLoading}
          data-testid="chat-input"
          className={cn(
            "flex-1 bg-transparent text-on-surface font-body-md text-body-md",
            "placeholder:text-on-surface-variant focus:outline-none",
            "min-w-0"
          )}
        />
        <button
          type="submit"
          disabled={!canSend}
          onClick={handleSubmit}
          className={cn(
            "w-10 h-10 rounded-full bg-primary text-on-primary",
            "flex items-center justify-center shrink-0 shadow-md",
            "active:scale-90 transition-transform",
            !canSend && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="material-symbols-outlined text-[20px] font-bold">arrow_upward</span>
        </button>
      </div>
    </div>
  );
}
