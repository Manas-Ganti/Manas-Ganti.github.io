# manas-ganti — personal site

Astro Cactus template (Astro 7, Tailwind v4, TypeScript, Biome). Being converted from
the stock theme into Manas Ganti's portfolio + blog. Strategy and page structure live in
`../../markdown/WEBSITE_BLOG_PLAN.md`; the write-permission and proof rules live in
`../../markdown/CLAUDE.md`.

## Commands

`pnpm` is not on this machine despite `pnpm-lock.yaml` being present; use `npm`, or enable
pnpm with `corepack enable`. `.nvmrc` pins Node 22 (system Node is 24; both work).

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
- `src/site.config.ts` — `url` is a guess (`https://manasganti.dev/`). It feeds
  `astro.config.ts`, the sitemap, RSS, and canonical/OG URLs. Set the real domain.
- `src/components/SocialList.astro` — the LinkedIn URL is a guess; confirm the vanity slug.
- `public/icon.svg` and `public/social-card.png` are still the Cactus theme's branding.

Not blocking:

- `content/posts/markdown-elements/` is kept as `draft: true` — a live reference for
  frontmatter and markdown features. It's filtered out of the production build. Delete it
  once the first real post ships.
- No published posts yet, so Pagefind indexes nothing and `/posts` renders empty. Both
  resolve on the first real post. Per `WEBSITE_BLOG_PLAN.md`, the highest-leverage first
  post is the VLM-GRPO reward-hacking ablation — **which cannot be written until that
  ablation has actually been run.**
