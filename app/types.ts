export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  favorite?: boolean;
}

export type View = "chat" | "discussions" | "personnaliser";
