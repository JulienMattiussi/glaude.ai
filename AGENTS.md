<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

Breaking changes — APIs, conventions, and file structure may differ from training data. Read `node_modules/next/dist/docs/` before writing any code.
<!-- END:nextjs-agent-rules -->

# Project: glaude-code

A parody clone of claude.ai — **"Le Glaude"** — built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.

- French locale, user is **"ma danrée"** (reference to the film *La Soupe aux choux*)
- No real AI backend — responses are hardcoded (see below)
- Dev server on **port 4321**: `make start` or `npm run dev`
- Makefile targets: `install / start / build / lint / typecheck / format / format-check`

## Naming conventions

- Claude → **Glaude** / **Le Glaude**
- Sonnet → **Bombé** (model picker shows "Bombé 4.6")

## Architecture

### State & hooks (`app/hooks/`)

- `useConversations.ts` — all conversation CRUD; `addAssistantReply(convId, delay)` checks for recipe keywords before falling back to prout generation
- `useLocalStorage.ts` — generic hook; conversations persisted under key `"glaude-conversations"`
- `useTypewriter.ts` — streams assistant messages; char-by-char for short texts (≤200 chars, 20ms/char), word-by-word for long texts (30ms/word); uses `useLayoutEffect` to avoid flicker

### Pure logic (`app/lib/`)

- `prout.ts` — `generateProutContent(delay)`: 1–6 words of "pro[u]+t", u count random 1–3, count proportional to delay (500–3000ms)
- `recipes.ts` — `findRecipe(prompt)`: matches against 5 cabbage recipes by keyword array; returns markdown with title → image → content
- `greeting.ts` — `getGreeting()`: time-based French greeting
- `time.ts` — `formatTime(id)`, `relativeTime(timestamp)`
- `delay.ts` — `randomDelay()`: 500–3000ms

### Types (`app/types.ts`)

`Message`, `Conversation`, `View` ("chat" | "discussions" | "personnaliser") — imported everywhere, never redefined locally.

### Pages & routing (`app/page.tsx`)

Owns `view: View`, `searchOpen: boolean`. Uses `useConversations` as `store`. Navigation helper `selectAndNavigate(id)` switches view to "chat".

### Components (`app/components/`)

**Layout**
- `Sidebar.tsx` — animated collapse (single render path, `transition-[width]`, inline style width 3rem↔14rem, labels fade with `w-0 opacity-0`); props include `activeView`, `onNavigate: (view: View) => void`, `onOpenSearch`
- `ChatArea.tsx` — orchestrator: delegates to `WelcomeScreen` or `MessageList` + `ChatInput`
- `WelcomeScreen.tsx` — empty state with animated icon + greeting
- `MessageList.tsx` — scrollable list, owns `messagesEndRef`, auto-scrolls on new content
- `MessageBubble.tsx` — single message row; uses `RecipeMarkdown` for assistant, plain div for user

**Input**
- `ChatInput.tsx` — exports `ChatInputProps` interface; textarea + model picker ("Bombé 4.6") + send button
- `EditMessageUI.tsx` — inline edit with Annuler/Enregistrer, Enter saves, Escape cancels

**Message actions**
- `UserMessageActions.tsx` — hover-reveal: timestamp, retry, pencil, copy
- `AssistantMessageActions.tsx` — copy, thumbs up/down, retry; owns modal state
- `FeedbackModal.tsx` — `withDropdown` prop for negative feedback category selector
- `CopyButton.tsx` — clipboard + checkmark feedback

**Search & navigation**
- `SearchModal.tsx` — spotlight overlay; last 3 convs when empty, filters title+content; keyboard nav ↑↓ Enter Escape; resets highlight on input change (not in useEffect)
- `DiscussionsPage.tsx` — full-page list with relative timestamps
- `PersonnalisePage.tsx` — UFO icon (150px) + 2 cards; "Personnaliser Glaude"

**Markdown**
- `RecipeMarkdown.tsx` — renders assistant markdown; overrides `<ol>` with `InteractiveOl`: clickable numbered steps (circle → checkmark, strikethrough on done); uses `ExtraProps` from react-markdown for typing
- Uses `react-markdown` with custom `components` prop

**Icons**
- `GlaudeIcon.tsx` — static: 11 thin ellipses (anus-like, `cy+ry=10.7` keeps inner tips fixed) + circle
- `AnimatedGlaudeIcon.tsx` — pulsating: `fast` prop (0.6s thinking / 2.4s idle)
- `ui.tsx` — `Icon` (SVG wrapper, default size 16), `IconBtn`

### OG image (`app/opengraph-image.tsx`)

1200×630, cream background, Glaude icon + "Glaude" wordmark + "BY YavaDeus" byline.

## Special feature: cabbage recipes

When user prompt matches any keyword from 5 recipes, `addAssistantReply` returns the full recipe instead of prout. Recipes: Choucroute garnie, Chou farci, Gratin de chou-fleur, Potée auvergnate, Soupe aux choux. Each has multiple typo-tolerant keywords, a Wikimedia Commons image, and markdown content. The soupe aux choux image is the flying saucer prop from the Louis-de-Funès museum. 🛸

## CSS

`globals.css` — CSS custom properties (beige/cream palette) + `.prose` styles for markdown (headings, lists, bold, img with `border-radius: 0.75rem; max-height: 280px; object-fit: cover`).
