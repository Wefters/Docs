# Contributing to Wefter Documentation

The official Wefter documentation portal is published at [wefter.dev](https://wefter.dev). It is built with [Next.js](https://nextjs.org) and [Fumadocs](https://fumadocs.dev), with content authored in MDX.

## Code of conduct

Please adhere to the [code of conduct](https://github.com/Wefters/.github/blob/main/CODE_OF_CONDUCT.md).

## Content organization

Documentation content lives in the `content/` directory:

- `content/docs/`: Core documentation, environment setup, and architecture guides.
- `content/cli/`: CLI command reference documentation.
- `content/plugin/`: Plugin authoring and native development guides.

Each folder contains a `meta.json` file that defines page titles and navigation ordering in the sidebar.

## Local development

Prerequisites: Node.js 18 or later and pnpm 9.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` in your browser to inspect documentation changes in real time.

## Writing guidelines

- Use clear, direct, and factual technical explanations.
- Avoid decorative emojis and promotional adjectives.
- Do not use em dashes or en dashes in prose.
- Keep code examples complete and verified against actual package APIs.
- Update `meta.json` when adding or moving pages to maintain correct sidebar ordering.

## Pull requests

1. Fork the repository and create a branch.
2. Verify that `pnpm build` succeeds with no MDX compilation errors.
3. Open a pull request against the `main` branch.

## License

[MIT](LICENSE) © 2026 Sandip Ghimire
