# request-triage

**Live:** https://request-triage.vercel.app

> **Data is fictional.** All tour operators, requests and quotes in this repo are made up for demonstration. Any resemblance to real companies is coincidental. Bokun is a real booking platform and is mentioned only as an integration clients talk about.

## What it is

A small tool that turns a pile of client requests into a ranked list of themes and a requirement doc for the top one. It shows the whole path from "what clients said" to "what we build next and how we'll know it worked". Every number on the board can be traced back to the requests behind it.

## Who it's for

- Product managers and founders of booking software for tour operators.
- Anyone who gets feature requests from many clients across support, sales and email and has to decide what comes first.
- Teams that want prioritisation decisions to be explainable: which clients asked, how much it hurts, and how hard it is to build.

## How it works

1. **Collect.** 22 client requests from 6 tour operators (Iceland, Italy, Australia, Greece, Czechia, UK) arrive by call, ticket and email. Each one records the operator, their size (bookings per month), the channel, the date and the client's own words.
2. **Group by meaning.** An LLM groups the requests into themes by what clients need, not by the words they use. Requests that match no other request stay `unclustered`.
3. **Score.** Each theme gets a pain rating (1–3) and an effort rating (S/M/L), each with a one-sentence reason. Code then computes:

   ```
   score = operatorsAsking × pain × log10(totalBookings) / effortWeight   (S=1, M=2, L=3)
   ```

4. **Prioritise.** The board shows theme #1 in **Now**, themes #2–4 in **Next**, and the rest plus unclustered requests in **Inbox**.
5. **Specify.** The top theme gets a full requirement doc: problem with client quotes, who is affected, user story, scope in/out, Given/When/Then acceptance criteria, Definition of Done, a 30-day success metric and open questions for the client.

### Pages

| Route | Description |
| --- | --- |
| `/` | Board: Inbox → Next → Now. Click a card to see its requests. |
| `/requests` | Sortable table of all requests with their theme |
| `/requirement/[themeId]` | Requirement doc for a theme, with its source requests |
| `/about` | What it is, how it works, the prompt, decisions and limitations |

### Data

| File | Contents |
| --- | --- |
| `data/requests.json` | Raw client requests (fictional) |
| `data/triage.json` | Themes with `requestIds`, `operatorsAsking`, `totalBookings`, pain, effort and `score`, plus `unclustered`. Single source of truth for the board. |
| `data/PROMPT.md` | The exact prompt used to produce `triage.json` |
| `data/requirements/<themeId>.md` | Full requirement doc (currently `guide-payouts`) |
| `data/requirements.json` | Short notes for themes without a full doc |
| `data/decisions.json` | Decisions log shown on `/about` |

## The prompt

The model wrote the grouping, problem statements and pain/effort ratings. A script computed the counts and the score. Notes on how the prompt was interpreted are in [`data/PROMPT.md`](data/PROMPT.md).

```text
Read /data/requests.json. Group requests into themes by meaning (not keywords).
For each theme output: id, name, one-line problem statement, requestIds, operatorsAsking,
totalBookings, pain (1–3, with a one-sentence reason), effort (S/M/L, with a one-sentence reason).
List requests that don't fit any theme separately as "unclustered".
Compute score = operatorsAsking * pain * log10(totalBookings) / effortWeight (S=1, M=2, L=3).
Save to /data/triage.json, sorted by score. Also save the exact prompt you used to /data/PROMPT.md.
```

## Decisions log

1. **No database. Data lives in JSON and Markdown files.** This is a prototype of the workflow. Everything in `/data` is read at build time and every page is prerendered as static HTML.
2. **Requests are grouped by meaning with an LLM, and the result is kept as a file.** Clients describe the same need in different words, so keyword matching misses the overlap. `triage.json` is the single source of truth, and raw requests are never edited.
3. **Ranking uses a transparent score, not request count.** Each operator counts once per theme, so a loud client can't outrank a need shared by many. `log10` keeps one very large operator from dominating. The model makes the judgments and code does the arithmetic.
4. **Board columns are derived from the ranking.** A status workflow (New → Done) doesn't say what to build first. #1 goes to Now, #2–4 to Next, the rest to Inbox.
5. **Full requirement docs are Markdown files.** They are long text that people review and edit as text. They are rendered on `/requirement/[themeId]`.

## Limitations

- Read-only. Changing anything means editing the files in `/data` and redeploying. You can't edit, re-triage or comment in the UI.
- The grouping and the pain and effort ratings were produced once by an LLM and saved. They are judgment calls, and a new run could produce different results.
- The dataset is tiny (22 requests) and the score has never been checked against real outcomes. `totalBookings` stands in for impact; it doesn't measure revenue.
- Only the top theme has a full requirement doc.
- No accounts or permissions. Everything is public.
- Country flags are emoji, so Windows shows them as letter codes.

## Tech

Next.js 15 (App Router, Server Components), TypeScript, Tailwind CSS v4, react-markdown. Deployed on Vercel.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```
