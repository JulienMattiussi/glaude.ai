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
  projectId?: string;
}

export type View = "chat" | "discussions" | "projets" | "personnaliser";
