<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Project: glaude-code

A simplified clone of claude.ai built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

## What it is

- UI replica of claude.ai — sidebar + chat interface
- All chat responses return `"prout"` (hardcoded, no real AI backend)
- French locale, greeter uses the user's name "Juju"

## Dev server

- Runs on **port 4321** (not 3000)
- `make start` or `npm run dev`

## Structure

- `app/page.tsx` — root page, holds all conversation state + `view` state (`"chat"` | `"discussions"`) + `searchOpen` state
- `app/components/Sidebar.tsx` — animated collapsible sidebar; props: `onNewConversation`, `conversations`, `activeConversationId`, `onSelectConversation`, `activeView`, `onNavigate`, `onOpenSearch`
- `app/components/ChatArea.tsx` — welcome screen + message thread orchestrator (lean, delegates to sub-components)
- `app/components/ChatInput.tsx` — bottom textarea toolbar with model picker, mic, send button, tool icons row
- `app/components/CopyButton.tsx` — clipboard copy button with checkmark feedback
- `app/components/EditMessageUI.tsx` — inline edit textarea with Annuler/Enregistrer
- `app/components/UserMessageActions.tsx` — hover-reveal row under user messages (timestamp, retry, pencil, copy)
- `app/components/AssistantMessageActions.tsx` — action row under assistant messages (copy, thumbs up/down, retry) + manages FeedbackModal state
- `app/components/FeedbackModal.tsx` — feedback modal; `withDropdown` prop adds category selector for negative feedback
- `app/components/DiscussionsPage.tsx` — full-page conversation list with search input and relative timestamps
- `app/components/SearchModal.tsx` — spotlight-style search modal; shows last 3 convs when empty, filters by title+content when typing; keyboard nav (↑↓ Enter Escape)
- `app/components/GlaudeIcon.tsx` — static anus-like icon (11 thin ellipses + animated circle, `cy+ry=10.7` keeps inner tips fixed)
- `app/components/AnimatedGlaudeIcon.tsx` — pulsating version; `fast` prop (0.6s thinking vs 2.4s idle)
- `app/components/ui.tsx` — shared primitives: `Icon` (SVG wrapper, default size 16), `IconBtn`
- `app/globals.css` — CSS custom properties for the beige/cream color palette

## Navigation / view model

`page.tsx` owns a `view: "chat" | "discussions"` state. Selecting a conversation always switches to `"chat"`. The "Discussions" sidebar item sets view to `"discussions"`. The "Rechercher" item opens `SearchModal` as an overlay (no view change).

## Sidebar animation

Collapse/expand is animated via a single render path: `transition-[width] duration-300` on the wrapper div (inline style `width: collapsed ? "3rem" : "14rem"`), labels use `w-0 opacity-0` ↔ `w-auto opacity-100` transitions. No conditional mount/unmount.


## Naming conventions

- Claude → **Glaude** everywhere in UI
- Sonnet → **Bombé** everywhere in UI (e.g. model picker shows "Bombé 4.6")

## Makefile

Follows the pattern of other repos in `/home/julien/Documents/MyRepos/` — `make help` lists targets, standard `install / start / build / lint / typecheck / format / format-check` targets.
