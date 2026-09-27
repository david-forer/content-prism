# Content Prism

Content Prism is a desktop app that turns one idea into several LinkedIn post drafts, each written from a different angle. Type a sentence, pick the angles you want (a story, a myth to bust, a quick tip, a checklist) and get one draft per angle to edit, copy or export.

It runs with Claude or OpenAI when you add an API key. With no key, a built-in template engine writes the drafts offline.

## What it does

- 31 angles: 7 base angles plus 24 extended ones in 6 groups (cognitive, power, tactical, narrative, strategic, social)
- Two input modes: expand an idea into posts, or rewrite something you already wrote
- Context settings for audience, voice, domain, goal and length. The shortest length writes a LinkedIn comment instead of a post.
- 5 hook styles and 6 calls to action matched to the goal
- A health check on every draft that flags posts that run long, overused phrases and a missing call to action
- Session history, plus export to Markdown or CSV

## How it works

With an API key set, the app sends one request per angle. Each request carries the idea, the context and the angle's own instructions. The Anthropic path uses `claude-opus-5-5` and the OpenAI path uses `gpt-5.6-sol`. Both are set in `src/lib/ai-service.ts`.

Without a key, drafts come from templates and a seeded random number generator, so the same idea always gives the same drafts. Spice mode adds variation.

Everything is stored in the app's localStorage. The only network traffic is the AI requests, which go straight from the app to the provider.

## Setup

You need Node 18 or newer.

```bash
npm install
cp .env.example .env
```

Add your keys to `.env` if you want AI drafts. Both are optional:

```
VITE_ANTHROPIC_API_KEY=
VITE_OPENAI_API_KEY=
```

You can also leave `.env` empty and paste a key into Settings inside the app. Pick the provider in Settings either way.

**About keys:** Vite compiles any `VITE_` variable into the built app. That is fine for a copy you run on your own machine. Do not share a build made with keys in `.env`. Use the Settings field instead if you plan to hand the app to anyone.

## Run it

| Command | What it does |
|---|---|
| `npm run dev` | Runs in the browser at http://localhost:5173 |
| `npm run electron:dev` | Builds and opens the desktop window |
| `npm run electron:build` | Builds an unpacked Windows app in `dist-electron/win-unpacked` |
| `npm run electron:installer` | Builds a Windows installer |
| `npm test` | Runs the unit tests |

## Project layout

```
src/
  components/   React UI (input, drafts, settings, layout)
  lib/          Generation, AI calls, health check, storage, export
  data/         Angles, hooks, calls to action, templates, banned phrases
  types/        TypeScript types
electron/       Desktop wrapper
tests/          Vitest tests
```

## License

MIT. See LICENSE.
