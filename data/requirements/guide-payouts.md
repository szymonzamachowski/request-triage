# Guide payouts

> **Fictional demo data.** The operators and quotes below come from the made-up requests in `data/requests.json`.

Theme `guide-payouts` · rank #1 · score 22.42 · requests REQ-001, REQ-006, REQ-011, REQ-016

## Problem

At the end of every month operators work out by hand what each guide, and sometimes each driver, is owed. Pay can be per tour, per guest or per hour, and tips come on top. The system already knows who led which departure and how many guests were on it, but it does not turn that into an amount. Operators rebuild the figures in spreadsheets, which takes days and leads to disagreements with freelance guides.

> "At the end of every month I spend two full days in spreadsheets working out what each guide is owed. Some are paid per tour, some per guest, and then there are tips on top."
> — Northern Trails Iceland, REQ-001

> "Can you give me a monthly report per guide? Which tours they led, how many hours, and how much we owe them. My accountant keeps asking for it and I have nothing to send."
> — Outback Loop Adventures, REQ-006

> "My guides are freelancers and send me an invoice at the end of the month. I'd love to send each of them a summary of the walks they did, so we agree on the amount before they invoice me."
> — Bohemia Walks, REQ-011

> "Tips collected on the card reader end up in one pot. How do we split them between the guide and the driver and show it on their monthly pay?"
> — Highland & Thames Tours, REQ-016

## Who is affected

| Operator | Country | Bookings / month | Main need |
| --- | --- | ---: | --- |
| Northern Trails Iceland | Iceland | 1,800 | Mixed per-tour and per-guest rates, plus tips |
| Outback Loop Adventures | Australia | 900 | Monthly report per guide for the accountant |
| Bohemia Walks | Czechia | 350 | Summary to agree amounts with freelancers before they invoice |
| Highland & Thames Tours | UK | 2,400 | Splitting tips between guide and driver |

4 operators with 5,450 bookings per month combined.

The people involved:

- **Operator admin or owner.** Calculates and approves payouts. This is the primary user.
- **Guides and drivers.** Often freelancers. They receive the summary and invoice against it.
- **Accountant.** Gets the numbers. They don't log in, they only receive an export.

## User story

**As an** operator admin,
**I want** to see what each guide and driver is owed for a chosen period, broken down by departure,
**so that** I can pay staff correctly without spreadsheets and agree the amount with them before they invoice.

## Scope

### In

- A pay rate per staff member: **per tour**, **per guest** or **per hour**, with an optional override per product.
- A payout summary per staff member for any date range, with one line per departure showing the date, product, basis, quantity, rate and amount, plus a total.
- **Tips** entered as a total per departure and split between the staff assigned to it. The split is equal by default and can be adjusted by hand.
- **Send summary**: email a staff member their itemised summary, and record when it was sent.
- **CSV export** of all payout lines for a period, for the accountant.
- Only users with the admin role can see payouts.

### Out (not in v1)

- Paying anyone: bank transfers, payroll runs, payslips.
- Tax, withholding or social-security calculations.
- Direct integration with accounting software. The CSV export covers this for now.
- Importing tips automatically from card readers.
- Guides creating or submitting invoices inside the product.
- Payouts in a currency other than the operator's account currency.

## Acceptance criteria

1. **Per-tour rate**
   - **Given** a guide with a per-tour rate of 80.00 who led 3 departures in October,
   - **when** the admin opens payouts for 1–31 October,
   - **then** the guide's summary shows 3 lines of 80.00 and a total of 240.00.

2. **Per-guest rate**
   - **Given** a guide with a per-guest rate of 5.00 and a departure with 12 participants (cancelled bookings excluded),
   - **when** the admin opens payouts for that period,
   - **then** the line for that departure shows quantity 12 and amount 60.00.

3. **Hourly rate**
   - **Given** a driver with an hourly rate of 20.00 assigned to a departure that lasts 4 hours,
   - **when** the admin opens payouts,
   - **then** the line shows 4 h and amount 80.00.

4. **Product override**
   - **Given** a guide with a default per-tour rate of 80.00 and an override of 120.00 for "Glacier Hike",
   - **when** the guide led one Glacier Hike and one other tour,
   - **then** the lines show 120.00 and 80.00.

5. **Tip split**
   - **Given** a departure with tips of 90.00 and one guide and one driver assigned,
   - **when** the admin saves the tips with the default split,
   - **then** each person's summary shows a separate "Tips" line of 45.00.
   - If the amount does not divide evenly, the extra cent goes to the first person listed, and the total of the shares always equals the tips entered.

6. **Date range**
   - **Given** departures on 30 September and 1 October,
   - **when** the admin selects 1–31 October,
   - **then** only the 1 October departure is included. Departures are matched by their start date in the operator's time zone.

7. **Missing rate**
   - **Given** a staff member assigned to a departure without any rate set,
   - **when** the admin opens payouts,
   - **then** the line shows "No rate set", the amount is not included in the total, and a warning at the top shows how many lines need a rate.

8. **Send summary**
   - **Given** a payout summary for a guide with an email address,
   - **when** the admin clicks "Send to guide",
   - **then** the guide receives an email with the itemised lines and total, and the summary shows "Sent on <date>".

9. **Changed after sending**
   - **Given** a summary was already sent,
   - **when** a departure in that period is edited or cancelled,
   - **then** the summary shows "Changed since sent" until it is sent again.

10. **CSV export**
    - **Given** payouts for a period,
    - **when** the admin exports CSV,
    - **then** the file has one row per line, with the columns staff, date, product, basis, quantity, rate and amount, and its totals match the screen.

11. **Permissions**
    - **Given** a user without the admin role,
    - **when** they open the payouts page or its URL,
    - **then** access is denied.

## Definition of Done

- All acceptance criteria are covered by automated tests, and the tests pass in CI.
- Money is calculated in integer minor units (cents), and rounding is covered by tests.
- A summary for one month loads in under 2 seconds for an operator with 5,000 bookings per month.
- Two of the requesting operators have tested the feature on their own data and confirmed that the totals match their spreadsheet for one past month.
- The feature is behind a feature flag and has been rolled out to the 4 requesting operators first.
- A help article explains rates, tips and the CSV export.
- Usage events are tracked: summary viewed, summary sent, CSV exported.
- Code review is done, there are no open bugs of high severity, and the feature is deployed to production.

## Success metric (30 days after launch)

**Primary:** at least **3 of the 4 requesting operators** close a full month of payouts in the product, meaning they view the summaries for every staff member and send them or export them.

**Supporting:**

- Time spent on monthly payouts, self-reported in a follow-up call, drops from about 2 days (the baseline from REQ-001) to **under 2 hours**.
- At least **50% of summaries** sent to staff come from operators who previously used spreadsheets.

**Guardrail:** no more than **1 support ticket per operator** about a wrong payout amount.

## Open questions for the client

1. Is per-guest pay based on **booked** participants or only those who **checked in**? How should no-shows count?
2. Can one guide have **different rates for different tours**, or for weekends and holidays?
3. How should tips be split by default: **equally**, **by role** (e.g. 70% guide and 30% driver) or by a **fixed percentage** you set?
4. Is entering one **tip total per departure** enough for now, or do you need tips imported from the card reader?
5. If a tour is **cancelled at short notice** (e.g. bad weather), does the guide still get paid, in full or in part?
6. Do any of your freelance guides charge **VAT** on their invoices, and should the summary show it?
7. Which **columns and format** does your accountant need in the export?
8. Besides the owner, who else should be able to **see payouts**?
