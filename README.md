# request-triage

Group incoming product requests into themes and turn each theme into a requirement doc.

Built with Next.js 15 (App Router), TypeScript and Tailwind CSS. No database — data lives in `data/*.json`.

## Pages

| Route | Description |
| --- | --- |
| `/` | Board – themes grouped by status |
| `/requests` | Inbox table of all incoming requests |
| `/requirement/[themeId]` | Requirement doc for a theme with its source requests |
| `/about` | How it works + decisions log |

## Data

- `data/requests.json` – incoming requests (`themeId` links a request to a theme, `null` = untriaged)
- `data/themes.json` – themes with status and requirement content
- `data/decisions.json` – decisions log shown on `/about`

## Development

```bash
npm install
npm run dev
```
