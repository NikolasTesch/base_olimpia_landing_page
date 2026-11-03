---
name: astro-preview
description: Start or reopen the local Astro development preview for the BASE Vôlei Club project. Use when the user asks to run, start, or view the local site.
---

# BASE Astro Preview

Start the local site from the directory containing the `base-volei-club` `package.json`.

1. Confirm the project root and that `package.json` defines `dev` as `astro dev`.
2. If a BASE development server is already running, reuse its URL instead of starting a duplicate. Do not stop an existing process owned by the user.
3. If `node_modules` is missing and `package-lock.json` exists, run `npm ci`. Do not change dependency versions to make preview start.
4. Run `npm run dev` in a managed foreground terminal session and keep that session alive. Read the URL Astro reports and give it to the user.
5. If startup fails, report the actual error and make only a directly related local fix. Do not deploy or expose the server publicly.

Use `npm run preview` only when the user specifically asks to inspect the built production output; build first with `npm run build`. The ordinary local preview is the development server with hot reload.
