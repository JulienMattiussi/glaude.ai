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
- **Always run `make format` after editing any file.**

## Naming conventions

- Claude → **Glaude** / **Le Glaude**
- Sonnet → **Bombé** (model picker shows "Bombé 4.6")

## Architecture

### State & hooks (`app/hooks/`)

- `useConversations.ts` — all conversation CRUD; exports: `newConversation` (sets activeId to null — entry created on first message), `selectConversation`, `addUserMessage`, `editMessage`, `truncate`, `addAssistantReply`, `deleteConversation`, `renameConversation`, `toggleFavorite`
- `useLocalStorage.ts` — always starts with `initialValue` (SSR-safe), hydrates from localStorage in a `useEffect` to avoid hydration mismatch
- `useTypewriter.ts` — streams assistant messages; char-by-char for short texts (≤200 chars, 20ms/char), word-by-word for long texts (30ms/word); uses `useLayoutEffect` to avoid flicker
- `useSpeech.ts` — wraps `SpeechRecognition` / `webkitSpeechRecognition`; `lang: fr-FR`, `continuous: true`, `interimResults: true`; status: `"idle" | "recording" | "unavailable"`; `apiSupported` starts `false` (SSR-safe, set in `useEffect`); marks `unavailable` on blocking errors (`network`, `service-not-allowed`, `not-allowed`); auto-restarts on unexpected `onend` (100ms delay); uses `onTranscriptRef` to avoid stale closures in recognition callbacks

### Pure logic (`app/lib/`)

- `prout.ts` — `generateProutContent(delay)`: 1–6 words of "pro[u]+t", u count random 1–3, count proportional to delay (500–3000ms)
- `responses/index.ts` — `findRecipe(prompt)`: checks ALL_ENTRIES (recipes + characters + products); if prompt contains "chou" but no specific match, returns `CHOUX_MENU` (markdown list of 5 clickable recipe links using `recipe:%xx` encoded URLs); returns markdown with title → image → content on match
- `responses/recipes.ts` — 5 cabbage recipes (Choucroute garnie, Chou farci, Gratin de chou-fleur, Potée auvergnate, Soupe aux choux)
- `responses/characters.ts` — Le Glaude, Le Bombé character cards
- `responses/products.ts` — product entries
- `responses/types.ts` — `Entry { keywords, imageUrl, content }`
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
│   └── Icon.tsx                Icon (SVG wrapper, default size 16)
│
├── effects/
│   └── LightningEffect.tsx     full-screen lightning bolt overlay; 3 staggered bolts (SVG polylines
│                               with halo/glow/core layers); CSS keyframe animations inlined via
│                               style prop; triggered by active prop; @keyframes in globals.css
│
├── sidebar/
│   ├── Sidebar.tsx             desktop: width 3rem↔18rem animated; mobile: fixed overlay with backdrop + portal open button
│   ├── NavItem.tsx             button with icon + label + optional shortcut hint (hover-only)
│   ├── ConversationItem.tsx    item with portal dropdown menu (favorites, rename, project, delete) + rename/delete modals
│   └── SearchModal.tsx         spotlight overlay; last 3 convs when empty; keyboard nav ↑↓ Enter Escape
│
├── chat/
│   ├── ChatArea.tsx            orchestrator: delegates to WelcomeScreen or ConversationHeader + MessageList + ChatInput;
│                               owns lightning trigger (counts prout words across messages, fires at each multiple of 20,
│                               uses lightningTimerRef to avoid cleanup cancellation); refocuses textarea after every
│                               action (thinking end, conversation switch, edit cancel)
│   ├── ConversationHeader.tsx  fixed header showing conversation title with dropdown menu (same actions as ConversationItem)
│   ├── ChatInput.tsx           textarea + model picker ("Bombé 4.6") + send button + mic button;
│                               mic uses useSpeech; disabled with tooltip when unavailable; prefixRef
│                               saves textarea content at recording start so interim results replace cleanly
│   └── WelcomeScreen.tsx       empty state with animated icon + greeting
│
├── messages/
│   ├── MessageList.tsx         scrollable list, owns messagesEndRef, auto-scrolls; passes onSend down
│   ├── MessageBubble.tsx       single message row; RecipeMarkdown for assistant, plain div for user; passes onSend
│   ├── RecipeMarkdown.tsx      react-markdown with InteractiveOl (clickable steps) + custom `a` renderer:
│                               intercepts recipe: links → calls onSend(decodeURIComponent(query));
│                               urlTransform={(url) => url} to bypass react-markdown URL sanitization
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

### Focus management

`ChatArea` refocuses the textarea after every user action:

- `useEffect([isThinking])` — when thinking ends (covers submit, send, retry, edit save)
- `useEffect([conversationId])` — when switching conversations
- `onEditCancel` handler — direct `focusInput()` call

### OG image (`app/opengraph-image.tsx`)

1200×630, cream background, Glaude icon + "Glaude" wordmark + "BY YavaDeus" byline.

## Special feature: cabbage recipes

When user prompt matches any keyword from 5 recipes, `addAssistantReply` returns the full recipe instead of prout. If the prompt contains "chou" but no specific recipe matched, returns a menu of 5 clickable links (`recipe:` scheme, URL-encoded). Clicking a link calls `handleSend(query)` in `ChatArea`, which sends the recipe name as a new user message and triggers the full recipe response.

Recipe links use `recipe:%xx` encoded URLs (spaces → `%20`, accented chars encoded) because react-markdown strips URLs with unencoded spaces. `urlTransform={(url) => url}` bypasses sanitization. The custom `a` renderer in `RecipeMarkdown` intercepts `recipe:` hrefs and renders `<button>` elements instead.

## Special feature: lightning effect

Every time the cumulative count of individual prout words in the current conversation crosses a new multiple of 20, a full-screen lightning effect fires for ~1.4s. Counting uses `Math.floor(count / 20) * 20` to handle counts that skip over exact multiples. Timer is managed via `lightningTimerRef` (not useEffect cleanup) to prevent cancellation when messages update mid-animation.

## Voice dictation (mic button in ChatInput)

Uses browser Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`). Not available on Brave (blocked network requests to Google speech servers) — mic button shows as disabled with tooltip. `apiSupported` is `false` during SSR to avoid hydration mismatch. On blocking errors, status becomes `"unavailable"` and stays there for the session.

## CSS

`globals.css` — CSS custom properties (beige/cream palette) + `.prose` styles for markdown (headings, lists, bold, img with `border-radius: 0.75rem; max-height: 280px; object-fit: cover`) + `@keyframes` for lightning animations (`lightning-bolt-anim`, `lightning-screen-flash-anim`). All keyframes must include a `100%` stop to prevent `animation-fill-mode: forwards` from interpolating back to the element's default opacity.
