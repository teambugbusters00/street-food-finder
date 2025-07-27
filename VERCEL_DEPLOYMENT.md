# Vercel Deployment Guide for Street Food Marketplace

## Free Deployment Steps:

### 1. Setup Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (free)
3. Connect your GitHub account

### 2. Push to GitHub
1. Create a new repository on GitHub
2. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - Street Food Marketplace"
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

### 3. Deploy on Vercel
1. In Vercel dashboard, click "Add New Project"
2. Import your GitHub repository
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

### 4. Environment Variables
Add these in Vercel dashboard under Settings > Environment Variables:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NODE_ENV`: `production`

### 5. Database Setup (Free Options)

#### Option A: Neon Database (Recommended - Free)
1. Go to [neon.tech](https://neon.tech)
2. Create free account
3. Create new database
4. Copy connection string to Vercel env vars

#### Option B: Supabase (Alternative - Free)
1. Go to [supabase.com](https://supabase.com)
2. Create free project
3. Get PostgreSQL connection string
4. Add to Vercel env vars

### 6. Custom Build Configuration

The `vercel.json` file is already configured for:
- Static file serving from `dist/public`
- API routes through serverless functions
- Automatic builds and deployments

### 7. Domain
- Vercel provides free `.vercel.app` domain
- Custom domains available (free with some limitations)

## Current Project Structure:
```
├── client/src/          # React frontend
├── server/              # Express backend
├── shared/              # Shared types/schema
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies
```

## Features Ready for Deployment:
✅ Team Zipp Up welcome page with LinkedIn links
✅ Multi-role authentication (Vendor/Supplier/Admin)
✅ PostgreSQL database integration
✅ Beautiful UI with background images
✅ Complete marketplace functionality
✅ Responsive design

## Post-Deployment:
1. Test all authentication flows
2. Verify database connections
3. Check all LinkedIn links work
4. Test marketplace features

Your Street Food Marketplace will be live at: `https://your-project-name.vercel.app`