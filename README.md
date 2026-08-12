# Ask Her Out

A tiny Next.js app: a "Will you go out with me?" page with a dodging No button,
a confetti Yes state, and a plan with an open slot she can fill in and save.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Deploy to Vercel

**Option A — no GitHub needed (fastest):**
1. Install the Vercel CLI: `npm i -g vercel`
2. From this folder, run: `vercel`
3. Follow the prompts (log in, confirm project settings, accept defaults).
4. Run `vercel --prod` to get your live production URL.

**Option B — via GitHub:**
1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com/new, import the repo, keep default settings, click Deploy.

## Email notifications

`app/page.js` posts her saved suggestion to Formspree at:

```
https://formspree.io/raoui.taha03@gmail.com
```

The **first submission** triggers a one-time confirmation email from Formspree —
click the link in that email to activate it, otherwise later submissions won't
reach your inbox. Do a test run yourself once the site is live, before sending
it to her.

If you'd rather have a proper dashboard of every response, create a free
account at formspree.io, make a form there, and swap the endpoint for the
`https://formspree.io/f/your_form_id` URL it gives you.
