﻿# street-food-finder
🍜 Street Food Finder
A modern full-stack web application to connect food vendors with street food lovers. Built with performance, scalability, and user experience in mind.
Developed as part of a Hackathon project by Team Bug Busters.

🔗 Live Demo: https://street-food-finder-app.onrender.com

🚀 Features
🔐 Secure authentication for Admin, Vendor, and User roles

🗺️ Location-based food vendor discovery

📋 Vendor dashboard for profile and product management

📊 Admin dashboard to manage platform

📱 Fully responsive with mobile-first design

✨ Toast notifications, error handling, and form validations

📷 Image support and upload (attached assets)
📁 Project Structure
pgsql
Copy
Edit
📦 StreetFoodFinder
├── 📁 attached_assets       → UI assets/images
├── 📁 client                → Frontend (React + TypeScript + TailwindCSS)
│   └── 📁 src
│       ├── 📁 components/ui → Reusable UI elements
│       ├── 📁 hooks         → Custom hooks (e.g., useToast, useMobile)
│       ├── 📁 lib           → Auth, Query client, utils
│       └── 📁 pages         → All pages (home, login, dashboards)
├── 📁 server                → Backend (Node + Express + Drizzle ORM)
│   ├── db.ts, seed.ts      → DB connection and seeding
│   ├── routes.ts           → Backend API routes
│   └── vite.ts             → Dev server config
├── 📁 shared                → Shared schema/types
├── .gitignore              → Git ignored files
├── package.json            → Project dependencies
├── tailwind.config.ts      → Tailwind CSS setup
└── tsconfig.json           → TypeScript configuration
🛠️ Tech Stack
Frontend:

React (with TypeScript)

Tailwind CSS

Vite

React Router DOM

Backend:

Node.js + Express

Drizzle ORM + SQLite (or PostgreSQL)

RESTful APIs
Others:

Toast notifications

Protected routes

Mobile responsive

Vercel/Render Deployment
🧠 How to Run Locally
bash
Copy
Edit
# Clone the repository
git clone https://github.com/teambugbusters00/street-food-finder.git
cd street-food-finder

# Install dependencies
npm install

# Start dev server
npm run dev
