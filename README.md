# Porras CPA Website - CMS Enabled

A modern, fully manageable CPA firm website built with React, TypeScript, Tailwind CSS, and Supabase. This website includes a complete content management system that allows you to control every aspect of your site from a single admin dashboard.

## Features

### Public Website
- **Responsive Design**: Works perfectly on all devices (mobile, tablet, desktop)
- **Modern UI**: Clean, professional design with smooth animations
- **Contact Form**: Integrated contact form with database storage
- **Dynamic Content**: All content pulled from database
- **Service Showcase**: Featured services with detailed descriptions
- **Blog Section**: Featured, Popular, and Newest blog posts on homepage
- **Blog Pages**: Full blog listing and individual post pages
- **About Section**: Company values and credentials
- **Social Media Integration**: Links to Facebook and LinkedIn

### Admin Dashboard
Control everything from one place:
- **Site Settings**: Update colors, fonts, contact info, and branding
- **Services Management**: Add, edit, delete services; mark as featured
- **Blog Management**: Create and publish blog posts with AI assistance
- **Contact Submissions**: View and manage all contact form submissions
- **Real-time Updates**: Changes appear instantly on your website

## Getting Started

### Prerequisites
- Node.js 18+ installed
- A Supabase account (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already set up in `.env` file

3. (Optional) To enable AI blog assistant, add your Anthropic API key to `.env`:
```bash
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```
Get your API key from: https://console.anthropic.com/

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Admin Access

### Creating Your First Admin Account

To create an admin account, you'll need to sign up through Supabase:

1. Visit your website at `/admin`
2. Since there are no users yet, you'll need to create one through Supabase Dashboard:
   - Go to https://supabase.com
   - Open your project
   - Go to Authentication > Users
   - Click "Add User"
   - Enter your email and password
   - Click "Create User"

3. Now you can log in at `/admin` with your credentials

### Using the Admin Dashboard

Once logged in at `/admin/dashboard`, you have four main tabs:

#### 1. Site Settings
- **Basic Information**: Update site name and tagline
- **Colors**: Change primary, secondary, and accent colors using color pickers
- **Contact Information**: Update phone, fax, email, and address
- **Social Media**: Add/update Facebook and LinkedIn URLs
- **Footer**: Customize footer text

#### 2. Services
- **View Services**: See all services organized by category (Business, Tax, QuickBooks, Industries)
- **Add Service**: Click "Add Service" to create a new service offering
- **Edit Service**: Click the edit icon to modify existing services
- **Delete Service**: Remove services you no longer offer
- **Feature Services**: Mark services to appear on the homepage

Each service includes:
- Category
- Title and URL slug
- Short and long descriptions
- Display order
- Featured status

#### 3. Blog Posts
- **View Blog Posts**: See all blog posts (drafts and published)
- **Create Post**: Click "New Post" to create a blog entry
- **AI Assistant**: Use AI to brainstorm topics, research, or generate content
  - **Brainstorm Mode**: Get blog post ideas and titles
  - **Research Mode**: Get facts and insights about topics
  - **Generate Mode**: Create full blog content with HTML formatting
- **Rich Text Editing**: Format text with headings, bold, italic, lists, and links
- **Featured Images**: Upload images for blog posts
- **Featured Posts**: Mark posts to appear on homepage
- **Draft/Published**: Control visibility of posts
- **View Analytics**: Track view counts for each post

**Note**: AI assistance requires an Anthropic API key in your `.env` file. The blog editor works fully without AI - it's an optional enhancement.

#### 4. Contact Submissions
- **View All Submissions**: See all contact form submissions
- **New Badge**: New submissions are highlighted
- **Contact Details**: Name, email, phone, and message
- **Best Time to Call**: When they prefer to be contacted
- **Mark as Read**: Track which submissions you've handled
- **Real-time Updates**: New submissions appear automatically

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin dashboard components
│   ├── Header.tsx      # Site header
│   ├── Footer.tsx      # Site footer
│   ├── Hero.tsx        # Homepage hero section
│   ├── About.tsx       # About section
│   ├── Services.tsx    # Services showcase
│   └── Contact.tsx     # Contact form
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── hooks/              # Custom React hooks
│   ├── useSiteSettings.ts
│   └── useServices.ts
├── lib/                # Utility libraries
│   ├── supabase.ts     # Supabase client
│   └── database.types.ts # TypeScript types
├── pages/              # Page components
│   ├── Home.tsx        # Public homepage
│   ├── AdminLogin.tsx  # Admin login page
│   └── AdminDashboard.tsx # Admin dashboard
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

## Database Schema

The website uses Supabase with the following tables:

- **site_settings**: Global site configuration (single row)
- **pages**: Website pages and metadata
- **page_sections**: Dynamic page content sections
- **services**: Service offerings
- **blog_posts**: Blog posts with view tracking
- **blog_categories**: Blog post categories
- **blog_post_categories**: Many-to-many relationship table
- **team_members**: Staff profiles
- **contact_submissions**: Contact form entries
- **navigation_items**: Custom navigation menus

All tables have Row Level Security (RLS) enabled:
- Public users can read published content
- Authenticated admins have full access
- Contact forms can be submitted anonymously

## Customization Guide

### Changing Colors
1. Log in to admin dashboard
2. Go to Site Settings tab
3. Click on color pickers or enter hex codes
4. Click "Save Changes"
5. Changes apply immediately

### Adding a New Service
1. Go to Services tab
2. Click "Add Service"
3. Fill in:
   - Category (Business, Tax, QuickBooks, Industries)
   - Title and URL-friendly slug
   - Short description (for cards)
   - Full content (detailed description)
   - Display order (for sorting)
   - Featured checkbox (to show on homepage)
4. Click "Save Service"

### Managing Contact Submissions
1. Go to Contact Submissions tab
2. View all submissions in chronological order
3. Click "Mark as Read" when handled
4. Contact submitters via email or phone

## Deployment

This website can be deployed to any static hosting service:

### Netlify
```bash
npm run build
# Deploy the 'dist' folder
```

### Vercel
```bash
npm run build
# Deploy the 'dist' folder
```

### Your Own Server
```bash
npm run build
# Copy the 'dist' folder to your web server
```

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v7
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **Hosting**: Any static host (Netlify, Vercel, etc.)

## Support

For technical support or questions:
- Email: cesar.porras@porrascpa.com
- Phone: (915) 774-0023

## License

Private website for Porras CPA, P.C.
