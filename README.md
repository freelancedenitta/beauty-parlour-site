# Veloura Beauty Studio

## Local development

```bash
npm install
npm run dev
```

The local API runs on port `3001` and Vite runs on port `5174`. Without Supabase variables, admin edits persist in the server-side `content-store.json` file for local development. They are no longer stored in browser localStorage.

## Vercel deployment

Vercel's filesystem is temporary, so production persistence requires a database and image storage service. This project is wired for Supabase.

1. Create a Supabase project.
2. Run [supabase-schema.sql](supabase-schema.sql) in the Supabase SQL editor.
3. Add these Vercel environment variables:

```text
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-strong-admin-password
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
SUPABASE_STORAGE_BUCKET=site-images
```

The service role key must only be configured in Vercel/server environment variables. Never expose it as a `VITE_` variable or commit it to the repository.

After deployment, `/api/content` reads and writes the shared `site_content` row in Supabase, so admin edits are visible to every visitor. Uploaded images are stored in the public `site-images` Supabase Storage bucket.
