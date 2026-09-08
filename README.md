<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/logo/banner-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="public/logo/banner-light.svg">
    <img alt="Wefter Docs" src="public/logo/banner-light.svg" width="420">
  </picture>

  <p><strong>Documentation site for Wefter, live at <a href="https://wefter.dev">wefter.dev</a>.</strong></p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white">
    <img alt="pnpm" src="https://img.shields.io/badge/pnpm-workspace-F69220?style=flat-square&logo=pnpm&logoColor=white">
    <a href="https://discord.gg/wefter"><img alt="Discord" src="https://img.shields.io/badge/Discord-join-5865F2?style=flat-square&logo=discord&logoColor=white"></a>
  </p>

  <p>
    <a href="https://wefter.dev"><strong>wefter.dev</strong></a> ·
    <a href="https://github.com/Wefters/Wefter">Wefter source</a> ·
    <a href="https://discord.gg/wefter">Discord</a>
  </p>
</div>

---

The source code for the official Wefter documentation website published at [wefter.dev](https://wefter.dev). The site is built with [Next.js](https://nextjs.org) and [Fumadocs](https://fumadocs.dev), with documentation pages authored in MDX.

## Content sections

The site is organized into three primary documentation sections:

| Section | Route | Content source directory |
| --- | --- | --- |
| Guides and architecture | `/docs` | [`content/docs`](content/docs) |
| CLI command reference | `/cli` | [`content/cli`](content/cli) |
| Plugin authoring | `/plugin` | [`content/plugin`](content/plugin) |

Application page layouts are defined under [`app/`](app) (`app/docs`, `app/cli`, `app/plugin`, and `app/(home)` for the landing page). Shared layout components and chrome reside in [`layouts/`](layouts) and [`components/`](components).

## Getting started

Prerequisites: Node.js 18 or later and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

The development server starts at `http://localhost:3000`.

## Command scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Starts the Next.js development server with fast refresh. |
| `pnpm build` | Compiles the production build. |
| `pnpm start` | Serves the production build locally. |

## Contributing

Documentation content is written in MDX files under [`content/`](content). Each folder contains a `meta.json` file that defines page ordering and navigation hierarchy in the sidebar.

To propose edits or add new guides:

1. Edit the target MDX file under `content/`.
2. Verify local rendering with `pnpm dev`.
3. Open a pull request against [github.com/Wefters/Docs](https://github.com/Wefters/Docs).

## License

[MIT](LICENSE) © 2026 Sandip Ghimire
