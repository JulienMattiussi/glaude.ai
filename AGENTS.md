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

- `app/page.tsx` — root page, holds conversation state
- `app/components/Sidebar.tsx` — collapsible sidebar with nav items and recent conversations
- `app/components/ChatArea.tsx` — welcome screen + message thread + chat input
- `app/globals.css` — CSS custom properties for the beige/cream color palette

## Intentional omissions

- No "Projets" menu item
- No "Demandez à Marmelab" menu item
- Other menu items (Discussions, Artéfacts, Code, Rechercher, Personnaliser) exist but have no active links

## Makefile

Follows the pattern of other repos in `/home/julien/Documents/MyRepos/` — `make help` lists targets, standard `install / start / build / lint` targets.
