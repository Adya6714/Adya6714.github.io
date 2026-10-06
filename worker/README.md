# Guardian AI worker

Without this worker, the guardian answers from the question bank in `js/content.js` and always replies with the closest answer. With it, questions the bank does not cover get a short AI answer written from those same notes.

## Deploy (free Cloudflare account)
```
cd worker
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler deploy
```
Copy the printed URL, add `/ask`, and paste it as `GUARDIAN_API` in `js/config.js`, for example `https://adya-guardian.<you>.workers.dev/ask`. Commit and push.

Each visitor IP gets 20 questions per hour. Only `adya6714.github.io` and local preview addresses can call it.
