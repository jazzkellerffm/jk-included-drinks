# JK Drinks Dashboard

A Next.js web app for drink orders in a jazz club. Guests order from the menu; bartenders see open orders on an iPad dashboard and move them to history when done.

## Tech

- **Next.js** (App Router), **TypeScript**, **Tailwind CSS**

## Pages

- **`/`** — Guest order page: enter table/name, pick drinks, send order
- **`/bar`** — Bartender dashboard: large cards for open orders, tap "Done" to complete
- **`/history`** — Completed orders list

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `/` for guests and `/bar` for the bar iPad. Orders are kept in memory (reset on server restart).

## Design

- Dark jazz-club theme (black/charcoal, gold accents, cream text)
- Large, touch-friendly controls for iPad
- Serif display font (Crimson Text), sans for UI (DM Sans)
