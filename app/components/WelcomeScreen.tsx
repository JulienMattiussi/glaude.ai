"use client";

import AnimatedGlaudeIcon from "./AnimatedGlaudeIcon";
import { ChatInput } from "./ChatInput";
import { getGreeting } from "../lib/greeting";
import type { ChatInputProps } from "./ChatInput";

export const WelcomeScreen = ({
  userName,
  inputProps,
}: {
  userName: string;
  inputProps: ChatInputProps;
}) => (
  <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4">
    <div className="flex items-center gap-3">
      <span className="text-(--accent)">
        <AnimatedGlaudeIcon size={48} />
      </span>
      <h1 className="text-3xl font-medium text-(--foreground)">
        {getGreeting()}, {userName}.
      </h1>
    </div>
    <div className="w-full max-w-2xl">
      <ChatInput {...inputProps} />
    </div>
  </div>
);
