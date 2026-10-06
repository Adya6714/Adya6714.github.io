# Adya Srivastava, river portfolio

Scroll-driven portfolio: a camera flies down a painted forest river (WebGL flow-map shader). Seven stops on the River, plus Library / Writing / Other work tabs.

Plain HTML, CSS, and JavaScript. No framework. No build step for the site.

| | |
|---|---|
| **Live site** | https://adya6714.github.io/adya-portfolio/ |
| **Repo** | https://github.com/Adya6714/adya-portfolio |
| **Plan** | [`CURSOR_PLAN_v2.md`](./CURSOR_PLAN_v2.md) |

## Run locally

```bash
npm run dev
```

Open the printed URL. Do not open `index.html` from disk, textures will not load.

## Deploy (site)

Push to `main`. GitHub Actions publishes to Pages automatically.

## Live guardian (Cloudflare Worker)

GitHub Pages cannot run `api/ask.js`. The Interview room free-text box talks to a Worker instead.

1. Regenerate the knowledge base after editing interview answers:

```bash
npm run kb
```

2. From `worker/`:

```bash
cd worker
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler deploy
```

3. Copy the Worker URL into `js/config.js`:

```js
GUARDIAN_API: "https://adya-guardian.<your-subdomain>.workers.dev/ask"
```

CORS allows only `https://adya6714.github.io` (plus local dev). The browser never sees the API key. Rate limit: 20 questions per IP per hour.

If `GUARDIAN_API` is empty, free-text search offers the 3 closest interview-bank questions instead.

## Common edits

- Content / links → `js/content.js`
- Interview answers → `js/interview.js` then `npm run kb`
- Resume → replace `assets/Resume_Adya_Srivastava.pdf`
- Plan → `CURSOR_PLAN_v2.md`
