# AskMeAnon

AskMeAnon is an anonymous question submission platform with a Christian theme and Russian interface.

## Features

- Anonymous question submission
- Admin panel for question management
- Responsive minimal design with Christian symbolism
- Full Russian localization
- Persistent database with Supabase

## Database Setup with Supabase

This application uses Supabase for persistent database storage:

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Navigate to SQL Editor in your Supabase project
4. Run the SQL commands from the `supabase.sql` file in this repository
5. Get your Supabase URL and public API key from Project Settings → API
6. Add these to your `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## Development

To run the development server locally:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Admin Access

Default admin password: `imadminfrfrfr`

Access the admin panel at `/admin/login`

## Project Structure

```
askmeanon/
├── app/                  # Next.js app directory
│   ├── admin/            # Admin dashboard pages
│   ├── api/              # API routes
│   └── components/       # Reusable React components
├── db/                   # Database files
│   ├── askmeanon.db      # SQLite database
│   └── schema.sql        # Database schema
├── public/               # Static files
└── ...
```

## Deployment on Glitch

This application is configured to run on Glitch. When imported to Glitch, it will:

1. Install dependencies automatically
2. Build the Next.js application
3. Start the server using the custom server.js file
4. Store SQLite database in the Glitch-specific `.data` directory

### Important Notes for Glitch Deployment

- The application uses SQLite for data storage, which is stored in the `.data` directory on Glitch
- The first admin user must be created manually in the database
- Environment variables can be configured in the Glitch project settings

## Build

To create a production build:

```bash
npm run build
```

## Start Production Server

To start the production server:

```bash
npm start
```

## License

MIT
