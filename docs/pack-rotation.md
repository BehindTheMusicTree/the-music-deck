# Pack Rotation Rules

Defines how content packs rotate over time and how legacy packs can still be accessed.

## Scope

This document covers:

- active pack duration
- booster eligibility by pack state
- legacy pack access options
- return conditions for inactive packs

## Core Model

- A single `active pack` is live at any given time.
- Standard boosters only pull cards from the active pack.
- Previous packs become `legacy packs` when a new pack launches.

## Rotation Cadence (MVP Baseline)

- Active pack duration target: 8 weeks.
- New pack release switches the active booster pool immediately.
- Legacy packs remain in collection, battles, and marketplace.

## Legacy Pack Access

Players can access legacy cards through:

- marketplace trading and purchases
- direct player-to-player exchanges
- limited legacy booster windows (optional events)

Default legacy booster rule (MVP baseline):

- no permanent legacy booster queue
- optional weekend legacy event once per month
- event includes one selected legacy pack

## Return Conditions for Legacy Packs

A legacy pack can return as a featured pack when one of the following is true:

- seasonal event tie-in
- major artist anniversary window
- community vote winner
- content gap before next new pack

When a legacy pack returns:

- it becomes temporarily active for the event window
- booster odds follow current system-level rarity rules
- event duration should be time-boxed (example: 3 to 7 days)

## Economy and Fairness Notes

- Rotation should avoid hard paywalls around old cards.
- Marketplace access is the default long-tail route for old content.
- Legacy event frequency should be predictable to reduce FOMO spikes.

## See Also

- [Card System](./card-system.md)
- [Economy and Marketplace](./economy-marketplace.md)
- [Decisions](./decisions.md)
- [Open Questions](./open-questions.md)
- [Documentation Index](./INDEX.md)
