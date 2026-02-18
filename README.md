# Smart Bookmark App

Simple bookmark manager using Next.js App Router, Supabase Auth/DB/Realtime, and Tailwind CSS.

## Features

- Google OAuth login only
- Add, edit, delete bookmarks (title + URL)
- Bookmarks are private per user (RLS)
- Realtime updates across tabs

## Tech Stack

- Next.js (App Router)
- Supabase (Auth, PostgreSQL, Realtime)
- Tailwind CSS

## Setup

1. Install dependencies

```bash
npm install
```

2. Create `.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

3. Supabase: Google OAuth

- Supabase Dashboard -> Authentication -> Providers -> Google
- Create OAuth client in Google Cloud Console
- Add redirect URI:

```
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

4. Supabase: Database schema + RLS

Run this in Supabase SQL Editor:

```sql
CREATE TABLE bookmarks (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	url TEXT NOT NULL,
	created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks"
	ON bookmarks FOR SELECT
	USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
	ON bookmarks FOR INSERT
	WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks"
	ON bookmarks FOR UPDATE
	USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
	ON bookmarks FOR DELETE
	USING (auth.uid() = user_id);

CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);
```

5. Supabase: Enable Realtime

Supabase Dashboard -> Database -> Replication -> enable Realtime for `bookmarks`.

## Run Locally

```bash
npm run dev
```

Open http://localhost:3000

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in Vercel
3. Add env vars:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

4. Update Google OAuth redirect URI to include Vercel domain:

```
https://YOUR_VERCEL_DOMAIN/auth/v1/callback
```

## Problems Faced + Fixes

- OAuth redirect issues: fixed by adding correct callback URL in Google OAuth.
- RLS insert failures: solved by inserting `user_id` when creating bookmarks.
- Realtime not updating: enabled Replication/Realtimes for `bookmarks` table.
- Hydration warning with inputs: removed email/password inputs because Google-only login is required.
