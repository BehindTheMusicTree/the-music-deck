# Booster Pack Opening Animation — Prompt

## Context

Animation played when the player clicks the Season One booster pack.
The pack is sliced open along the top tear-notch, from left to right.

## Video / Animation Prompt

```
Short seamless animation of a premium foil booster pack being opened.
Duration: ~1.2 seconds. No sound cue needed.

Starting frame: the sealed Season One booster pack, front-facing,
identical to the static asset — black background, gold holographic foil surface,
vinyl record artwork, "THE MUSIC DECK / SEASON ONE" typography.

Action: a clean horizontal cut appears at the tear-notch line (~15% from the top),
travelling from left to right across the full width of the pack in ~0.6 seconds.
The cut is a crisp, bright gold flash line (like a blade catching light),
leaving a glinting gold edge on both sides of the tear.

After the cut reaches the right edge:
- The top strip peels upward slightly (5–10° curl), revealing a dark interior.
- A burst of warm amber-gold light spills out from the opening — particles
  of golden dust and light scatter upward and outward for ~0.3 seconds.
- The pack body remains static; only the torn top strip curls away.

Ending frame: pack with top torn open, golden light glow fading,
ready to transition to card reveal screen.

Camera: completely static, dead-on front view. No camera movement.
Background: pure black (#09080d) throughout.
Style: photorealistic foil material, same lighting as the static pack asset.
No motion blur. Crisp, premium feel — like opening a luxury product.
Loop: no. Play once, hold on end frame for 0.2s.
```

## Frame-by-frame breakdown (for sprite sheet / sequence)

| Frame | Description |
|---|---|
| 0 | Static sealed pack |
| 1–8 | Cut line travels left → right (8 frames at ~75ms each) |
| 9–10 | Top strip begins to curl upward |
| 11–12 | Gold light burst at the opening |
| 13–15 | Light fades, hold on open pack |

## Implementation in prototype

Option A — Video file:
Save as `assets/ui/booster-pack-opening-v1.webm` (or `.mp4`).
Play on click via `<video>` tag, then trigger card reveal on `ended` event.

Option B — PNG sprite sheet:
Save frames as `assets/ui/booster-pack-opening-spritesheet-v1.png`
and step through with `background-position` in JS at ~75ms per frame.

Option C — CSS only (fallback if no video):
Animate a gold `clip-path` line sweeping across the top of the static image,
followed by a `filter: brightness` flash and upward translate of the top strip
using a pseudo-element overlay.
```

## See Also

- [Static booster pack asset](./booster-pack-season1-v1.png)
- [Card back asset](./card-back-v1.png)
