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

> **All data in this repo is fictional demo data.** Operators and requests are made up.

- `data/requests.json` – 22 client requests from 6 fictional tour operators (Iceland, Italy, Australia, Greece, Czechia, UK)
- `data/themes.json` – themes (guide payouts, Bokun sync, pickup times, group bookings, VAT invoices, waitlist) with status, linked `requestIds` and requirement content; requests not linked to any theme are untriaged
- `data/decisions.json` – decisions log shown on `/about`

## Development

```bash
npm install
npm run dev
```
