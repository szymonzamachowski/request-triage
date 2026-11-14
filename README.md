# request-triage

Group incoming product requests into themes and turn each theme into a requirement doc.

Built with Next.js 15 (App Router), TypeScript and Tailwind CSS. No database — data lives in `data/*.json`.

## Pages

| Route | Description |
| --- | --- |
| `/` | Board – Inbox → Next → Now, ranked by score; click a card to see its requests |
| `/requests` | Sortable table of all requests with their theme |
| `/requirement/[themeId]` | Requirement doc for a theme with its source requests |
| `/about` | How it works + decisions log |

## Data

> **All data in this repo is fictional demo data.** Operators and requests are made up.

- `data/requests.json` – 22 client requests from 6 fictional tour operators (Iceland, Italy, Australia, Greece, Czechia, UK)
- `data/triage.json` – requests grouped into themes with `operatorsAsking`, `totalBookings`, pain, effort and `score`, plus `unclustered` one-offs. Source of truth for the board.
- `data/PROMPT.md` – the exact prompt used to produce `triage.json`
- `data/requirements.json` – requirement doc per theme
- `data/decisions.json` – decisions log shown on `/about`

Score = `operatorsAsking × pain × log10(totalBookings) / effortWeight` (S=1, M=2, L=3).
Board: #1 → **Now**, #2–4 → **Next**, the rest + unclustered → **Inbox**.

## Development

```bash
npm install
npm run dev
```
