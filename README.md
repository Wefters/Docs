<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/Logo/Dark/Logo.svg">
    <source media="(prefers-color-scheme: light)" srcset="public/Logo/Light/Logo.svg">
    <img alt="Wefter Docs" src="public/Logo/Light/Logo.svg" width="420">
  </picture>

  <p><strong>Documentation site for Wefter, live at <a href="https://wefter.dev">wefter.dev</a>.</strong></p>

  <p>
    <a href="https://github.com/Wefters/Wefter">Wefter source</a> ·
    <a href="https://discord.gg/wefter">Discord</a>
  </p>
</div>

---

Built with [Next.js](https://nextjs.org) and [Fumadocs](https://fumadocs.dev),
content authored in MDX.

## What's here

The site has three content sections, each its own tab:

| Section          | Route     | Source                             |
| ---------------- | --------- | ---------------------------------- |
| Docs             | `/docs`   | [`content/docs`](content/docs)     |
| CLI reference    | `/cli`    | [`content/cli`](content/cli)       |
| Plugin authoring | `/plugin` | [`content/plugin`](content/plugin) |

Layout for each section lives under [`app/`](app) (`app/docs`, `app/cli`,
`app/plugin`, plus `app/(home)` for the landing page), with shared chrome in
[`layouts/`](layouts) and [`components/`](components).

## Getting started

Requires Node 18+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

The site runs at [localhost:3000](http://localhost:3000).

## Scripts

| Command      | What it does                 |
| ------------ | ---------------------------- |
| `pnpm dev`   | Start the Next.js dev server |
| `pnpm build` | Production build             |
| `pnpm start` | Serve the production build   |

## Contributing

Docs content is plain MDX under [`content/`](content), each section has its
own `meta.json` controlling sidebar order. Fix a typo, clarify a page, or add
a missing one, then open a PR against
[github.com/Wefters/Docs](https://github.com/Wefters/Docs).

For questions or discussion about Wefter itself, join
[discord.gg/wefter](https://discord.gg/wefter).
</content>
