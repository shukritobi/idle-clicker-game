# dot. ✳

A minimalist, surprisingly deep idle clicker built for phones and desktops.

**Play:** https://shukritobi.github.io/idle-clicker-game/

## Features

- Tap the energy orb, build a 75× combo streak, and land critical hits.
- Buy **20 escalating generators** with seven production milestones: 10, 25, 50, 100, 200, 400 and 800 units.
- Research **6 upgrade trees**: tapping, luck, combos, discounts, production and offline collection.
- Trigger **Overdrive** for 3× power, catch surprise meteors, and claim daily rewards.
- Earn **24 achievements**. Ascend after 1M run earnings to gain permanent stars. Each star adds 14% to production and taps.
- Automatic local saves, capped offline earnings, JSON save export/import, and reset.
- Custom procedural Web Audio click, purchase, critical, achievement, and prestige effects, with optional ambient melody.
- Responsive interface, reduced-motion support, installable PWA and offline caching.

## Run locally

No build tools or dependencies:

```sh
python3 -m http.server 5173
```

Visit http://localhost:5173

## GitHub Pages deployment

The workflow at `.github/workflows/pages.yml` publishes on every push to main.

**First-time setup if Pages is disabled:** Open **Settings → Pages → Build and deployment → Source: GitHub Actions**. Then rerun the workflow. The default GitHub Actions token cannot enable a disabled Pages site automatically.

## Manual test checklist

1. Tap, buy generators, test ×1, ×10, MAX and all lab upgrades.
2. Verify production milestones, saved progress and offline earnings.
3. Check audio on iPhone after the first tap and the separate ambient toggle.
4. Export, reset and import a save.
5. Earn 1M and prestige. Verify the permanent power bonus.
6. Install to home screen and test airplane mode after the first successful visit.

The game runs entirely in the browser. Save data stays in device localStorage.
