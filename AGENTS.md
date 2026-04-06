<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

Breaking changes — APIs, conventions, and file structure may differ from training data. Read `node_modules/next/dist/docs/` before writing any code.

<!-- END:nextjs-agent-rules -->

# Project: glaude-code

A parody clone of claude.ai — **"Le Glaude"** — built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.

- French locale, user is **"ma danrée"** (reference to the film _La Soupe aux choux_)
- No real AI backend — responses are hardcoded (see below)
- Dev server on **port 4321**: `make start` or `npm run dev`
- Makefile targets: `install / start / build / lint / typecheck / format / format-check`

## Naming conventions

- Claude → **Glaude** / **Le Glaude**
- Sonnet → **Bombé** (model picker shows "Bombé 4.6")

## Architecture

### State & hooks (`app/hooks/`)

- `useConversations.ts` — all conversation CRUD; exports: `newConversation` (sets activeId to null — entry created on first message), `selectConversation`, `addUserMessage`, `editMessage`, `truncate`, `addAssistantReply`, `deleteConversation`, `renameConversation`, `toggleFavorite`
- `useLocalStorage.ts` — always starts with `initialValue` (SSR-safe), hydrates from localStorage in a `useEffect` to avoid hydration mismatch
- `useTypewriter.ts` — streams assistant messages; char-by-char for short texts (≤200 chars, 20ms/char), word-by-word for long texts (30ms/word); uses `useLayoutEffect` to avoid flicker

### Pure logic (`app/lib/`)

- `prout.ts` — `generateProutContent(delay)`: 1–6 words of "pro[u]+t", u count random 1–3, count proportional to delay (500–3000ms)
- `recipes.ts` — `findRecipe(prompt)`: matches against 5 cabbage recipes by keyword array; returns markdown with title → image → content
- `greeting.ts` — `getGreeting()`: time-based French greeting
- `time.ts` — `formatTime(id)`, `relativeTime(timestamp)`
- `delay.ts` — `randomDelay()`: 500–3000ms

### Types (`app/types.ts`)

- `Message` — `{ id, role: "user"|"assistant", content }`
- `Conversation` — `{ id, title, messages, favorite?: boolean }`
- `View` — `"chat" | "discussions" | "projets" | "personnaliser"`

Imported everywhere, never redefined locally.

### Pages & routing (`app/page.tsx`)

Owns `view: View`, `searchOpen: boolean`. Uses `useConversations` as `store`.

- `selectAndNavigate(id)` — selects conversation + switches to "chat"
- `newAndNavigate()` — calls `store.newConversation()` + switches to "chat"
- Global keyboard shortcuts (registered with `{ capture: true }` to intercept browser shortcuts):
  - `Ctrl+K` / `Cmd+K` → open search modal
  - `Ctrl+Shift+O` / `Cmd+Shift+O` → new conversation (uses `e.key.toLowerCase()` to handle shift case)

### Component structure (`app/components/`)

Components are organized by domain. Each component has its own file; inline sub-components only if ≤4 lines and used once.

```
components/
├── icons/
│   ├── GlaudeIcon.tsx          static SVG: 11 thin ellipses + circle
│   ├── AnimatedGlaudeIcon.tsx  pulsating: fast prop (0.6s thinking / 2.4s idle)
│   └── Icon.tsx                Icon (SVG wrapper, default size 16) + IconBtn
│
├── sidebar/
│   ├── Sidebar.tsx             desktop: width 3rem↔18rem animated; mobile: fixed overlay with backdrop + portal open button
│   ├── NavItem.tsx             button with icon + label + optional shortcut hint (hover-only)
│   ├── ConversationItem.tsx    item with portal dropdown menu (favorites, rename, project, delete) + rename/delete modals
│   └── SearchModal.tsx         spotlight overlay; last 3 convs when empty; keyboard nav ↑↓ Enter Escape
│
├── chat/
│   ├── ChatArea.tsx            orchestrator: delegates to WelcomeScreen or ConversationHeader + MessageList + ChatInput
│   ├── ConversationHeader.tsx  fixed header showing conversation title with dropdown menu (same actions as ConversationItem)
│   ├── ChatInput.tsx           textarea + model picker ("Bombé 4.6") + send button; exports ChatInputProps
│   └── WelcomeScreen.tsx       empty state with animated icon + greeting
│
├── messages/
│   ├── MessageList.tsx         scrollable list, owns messagesEndRef, auto-scrolls
│   ├── MessageBubble.tsx       single message row; RecipeMarkdown for assistant, plain div for user
│   ├── RecipeMarkdown.tsx      react-markdown with InteractiveOl: clickable steps (circle→checkmark, strikethrough)
│   ├── EditMessageUI.tsx       inline edit: Annuler/Enregistrer, Enter saves, Escape cancels
│   ├── UserMessageActions.tsx  hover-reveal: timestamp, retry, pencil, copy
│   ├── AssistantMessageActions.tsx  copy, thumbs up/down, retry; owns modal state
│   ├── FeedbackModal.tsx       withDropdown prop for negative feedback category
│   └── CopyButton.tsx          clipboard + checkmark feedback
│
└── pages/
    ├── DiscussionsPage.tsx     full-page list with relative timestamps + search
    ├── PersonnalisePage.tsx    UFO icon (150px) + 2 cards
    └── ProjectsPage.tsx        search + sort dropdown (Activité récente / Dernière modification / Créé.e.s récemment) + empty state
```

### Sidebar behaviour

**Desktop:** static in flow, `transition-[width]`, inline style `3rem` (collapsed) ↔ `18rem` (expanded). Labels fade via `w-0 opacity-0`.

**Mobile (< 768px):** `position: fixed`, slides with `translateX`. Collapsed = off-screen (`-translate-x-full`). A portal button (top-left, fixed) reopens it. A portal backdrop closes it on click. Clicking any nav item or conversation collapses the sidebar.

**`ConversationHeader`:** shown at the top of the chat area when a conversation is active. Left-aligned. On mobile adds `pl-12` to avoid the floating open button. Contains the same dropdown menu as `ConversationItem`.

### Favorites

`Conversation.favorite?: boolean` — toggled by `toggleFavorite(id)`. Sidebar shows a "Favoris" section above "Récents" when any conversation is favorited. Both sidebar and `ConversationHeader` menu show "Retirer des favoris" when already favorited.

### OG image (`app/opengraph-image.tsx`)

1200×630, cream background, Glaude icon + "Glaude" wordmark + "BY YavaDeus" byline.

## Special feature: cabbage recipes

When user prompt matches any keyword from 5 recipes, `addAssistantReply` returns the full recipe instead of prout. Recipes: Choucroute garnie, Chou farci, Gratin de chou-fleur, Potée auvergnate, Soupe aux choux. Each has multiple typo-tolerant keywords, a Wikimedia Commons image, and markdown content. The soupe aux choux image is the flying saucer prop from the Louis-de-Funès museum. 🛸

## CSS

`globals.css` — CSS custom properties (beige/cream palette) + `.prose` styles for markdown (headings, lists, bold, img with `border-radius: 0.75rem; max-height: 280px; object-fit: cover`).
