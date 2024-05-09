# Lingo - Duolingo Clone
This is a clone of the popular language learning app Duolingo. It is a web application that allows users to learn a new language by completing lessons and quizzes. Users can track their progress and earn points by completing lessons and quizzes. The app also includes a leaderboard feature that allows users to compete with friends and other users.

> It's a tutorial project for exploring Clerk, ShadCDN, Drizzle, and Neon Database.

## Screenshots
<div style="display:flex;gap:5px;">
<img src="/docs/1.png" height="200" />
<img src="/docs/2.png" height="200" />
<img src="/docs/3.png" height="200" />
<img src="/docs/4.png" height="200" />
<img src="/docs/5.png" height="200" />
<img src="/docs/6.png" height="200" />
<img src="/docs/7.png" height="200" />
</div>

## Features
- User authentication
- Leaderboard
- Progress tracking
- Shop
- Subscription

## Tech Stack
- Next.js
- Clerk (Auth)
- ShadCDN, TailwindCSS (UI)
- Zustand (State Management)
- Drizzle (ORM)
- Neon Database (Database)
- Vercel (Deployment)
- Stripe (Subscription)

## Development
1. Clone the repository
2. Install dependencies
```bash
pnpm install
```
3. Copy the `.env.example` file to `.env.local`
```bash
cp .env.example .env.local
```
4. Setup Clerk
Go to [Clerk](https://clerk.dev) and create an account. Create a new application and copy the API key. Update `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in the `.env.local` file.
5. Setup Neon Database
Go to [Neon Database](https://neondb.com) and create an account. Create a new database and copy the API key. Update `DATABASE_URL` in the `.env.local` file.
6. Setup Stripe
Go to [Stripe](https://stripe.com) and create an account. Copy the API key. Update `STRIPE_SECRET_KEY` in the `.env.local` file. Also don't forget to follow official stripe's guide to setup webhook and update `STRIPE_WEBHOOK_SECRET`.
7. Now its time to open multiple terminals:
* Run the drizzle studio:
```bash
pnpm run db:studio
```
* Run the stripe webhook listener:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
* Run the development server:
```bash
pnpm run dev
```
8. Open the browser and go to `http://localhost:3000`
9. Enjoy!

## Todo
- [ ] Type-safe for process.env
- [ ] Setup @trivago/prettier-plugin-sort-imports to sort imports
- [ ] Reduce duplicated usage for `StickyWrapper`
- [ ] If its possible, attach userSubscription to Clerk's user object

## License
There is no license. Feel free to use it for your own project. If you have any questions, feel free to ask me. Tutorial's real owner is [CodeWithAntonio](https://www.youtube.com/@codewithantonio), I just followed his tutorial and added some features. 
