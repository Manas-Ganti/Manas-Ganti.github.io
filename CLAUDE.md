# manas-ganti — personal site

Astro Cactus template (Astro 7, Tailwind v4, TypeScript, Biome). Being converted from
the stock theme into Manas Ganti's portfolio + blog. Strategy and page structure live in
`../../markdown/WEBSITE_BLOG_PLAN.md`; the write-permission and proof rules live in
`../../CLAUDE.md`.

**Before touching `src/data/projects.ts` or `/projects`, read [`SITE_UPDATE_BRIEF.md`](SITE_UPDATE_BRIEF.md)**
— an audit of every project directory as of 2026-09-04, with verified numbers and their sources.
`projects.ts` was re-synced against the project directories on 2026-09-25 (8 projects: self-play-highwayenv was removed and maze-navigation-drone added, grouped by
`area`); each `result` carries a comment naming the file its number came from.

## Commands

This project uses **npm** — `package-lock.json` is the only lockfile, and CI and the Pages
deploy both run `npm ci`. `.nvmrc` pins Node 22 (system Node is 24; both work).

| Command | Action |
|---|---|
| `npm run dev` | Dev server on `localhost:4321` (the README's "3000" is wrong) |
| `npm run build` | Production build to `./dist/` |
| `npm run postbuild` | Pagefind search index — only works after `build` |
| `npm run check` | `astro check` + `biome check` — run before considering work done |
| `npm run lint` | Biome autofix |

`npm run check` reports two **pre-existing** Biome findings inherited from the template
(a deprecated key in `biome.json`, a non-null assertion in `src/plugins/satteri.ts`).
Don't treat those as regressions; do keep your own files clean.

## Layout

Content lives in `content/` at the **project root**, not `src/content/` — the README is
out of date on this. `src/content.config.ts` is the schema source of truth.

```
content/posts/     blog posts (md/mdx). Folder-per-post for co-located images.
content/tags/      optional overrides for generated tag pages (empty; warns on build)
src/pages/         index, research, projects, about, 404, posts/, tags/
src/components/    ProjectCard.astro + theme components (blog/, layout/)
src/data/projects.ts  typed project list — the source of truth for /projects and the
                      home page's featured cards, including each project's status
src/layouts/       Base.astro, BlogPost.astro
src/site.config.ts site metadata + header/footer menu links
src/styles/        global.css holds the Tailwind theme + light/dark tokens
```

The template's `note` collection and its `/notes` routes were removed — the planned
structure has no notes section.

## Conventions

- **Post frontmatter**: `title` (≤60 chars), `description` (50–160 chars), `publishDate`
  required; `tags`, `coverImage`, `ogImage`, `draft`, `pinned` optional. The schema
  enforces these — a bad post fails the build.
- **OG images** are generated per-post by Satori (`src/pages/og-image/`) unless the post
  sets `ogImage`. Markup is in `_ogMarkup.ts`.
- Use `@/` for `src/` imports (tsconfig path alias).
- Adding a page means adding a file to `src/pages/`; add it to `menuLinks` in
  `src/site.config.ts` to get it into the header and footer.
- Tailwind v4 is configured in CSS (`src/styles/global.css`), not `tailwind.config.ts`.

## Still to do before this site goes live

Blocking:

- **`/research` is an empty container.** Manas writes this himself. Never draft the
  paper's abstract, claims, or venue status for him.
- **The home page's Research card is a placeholder.** Same rule.
- `src/site.config.ts` — `url` is `https://manas-ganti.github.io/`, the GitHub Pages user
  site, served at the domain root. If a custom domain is ever attached, change `url` here
  (it feeds `astro.config.ts`, the sitemap, RSS, and canonical/OG URLs) and add a `CNAME`.
- `src/components/SocialList.astro` — the LinkedIn URL is a guess; confirm the vanity slug.
- `public/icon.svg` is still the Cactus theme's cactus logo (favicon + webmanifest icon
  source). The default share card is now `public/og-default.png` — regenerate it with
  Satori if the title or tagline changes.

Not blocking:

- `content/posts/markdown-elements/` is kept as `draft: true` — a live reference for
  frontmatter and markdown features. It's filtered out of the production build. Delete it
  once the first real post ships.
- No published posts yet, so Pagefind indexes nothing and `/posts` renders empty. Both
  resolve on the first real post. Per `WEBSITE_BLOG_PLAN.md`, the highest-leverage first
  post is the VLM-GRPO reward-hacking ablation — **which cannot be written until that
  ablation has actually been run.**
