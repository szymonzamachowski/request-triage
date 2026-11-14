# Triage prompt

The prompt below produced `data/triage.json`. Input: `data/requests.json` (fictional demo data).

- Model: Claude Opus 5.5 (`claude-opus-5-5`), run in Claude Code
- Date: 2026-11-14

## Prompt (verbatim)

```text
Read /data/requests.json. Group requests into themes by meaning (not keywords).
For each theme output: id, name, one-line problem statement, requestIds, operatorsAsking,
totalBookings, pain (1–3, with a one-sentence reason), effort (S/M/L, with a one-sentence reason).
List requests that don't fit any theme separately as "unclustered".
Compute score = operatorsAsking * pain * log10(totalBookings) / effortWeight (S=1, M=2, L=3).
Save to /data/triage.json, sorted by score. Also save the exact prompt you used to /data/PROMPT.md.
```

## How the prompt was interpreted

- The model grouped requests into themes and wrote the problem statements and the pain and effort ratings with their reasons. These are judgment calls.
- `operatorsAsking` counts the distinct operators in a theme.
- `totalBookings` adds up `operatorSize` (bookings per month) for those distinct operators. An operator who sent several requests is counted only once.
- `operatorsAsking`, `totalBookings` and `score` were computed by a script from those judgments, not estimated by the model. Scores are rounded to 2 decimal places.
- Each request belongs to exactly one theme or to `unclustered`.
