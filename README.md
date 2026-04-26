**Welcome to your Crozora project** 

**About**

This project contains the Crozora frontend app.

This project contains everything you need to run your app locally.

**Edit the code in your local development environment**

**Prerequisites:** 

1. Clone the repository using the project's Git URL 
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Create an `.env.local` file and set the right environment variables

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

e.g.
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Run the app: `npm run dev`

**Production auth email**

This repo also includes a Supabase Auth email setup script for Resend SMTP:

```powershell
npm run auth:email:dry-run
npm run auth:email:configure
```

See [supabase/README.md](C:\Users\opena\Downloads\crozora-trust-seal\supabase\README.md) for the exact setup details.
