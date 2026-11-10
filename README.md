# yns.aid — Personal Portfolio

A bilingual personal portfolio showcasing my work in artificial intelligence, web and mobile development, and UI/UX design.

Built with React, TypeScript, and Vite, the website combines an interactive public portfolio with an authenticated dashboard for managing projects, skills, and certificates.

## Overview

The portfolio presents my background, services, technical skills, and selected work in one place.

Portfolio content is connected to Supabase, allowing projects, skills, and certificates to be updated through the dashboard rather than edited directly in the source code.

The application also includes an EmailJS contact form and a floating WhatsApp consultation link.

## Features

### Public Portfolio

- Hero section and personal introduction.
- About section with profile information.
- Services overview.
- Skills section connected to Supabase.
- Project gallery with category filters:
  - Websites
  - Mobile applications
  - AI applications
  - UI/UX design
- Project cards with technology tags, live links, and GitHub links.
- Responsive project grid with a Swiper carousel for larger collections.
- Certificate gallery with image and PDF previews.
- EmailJS-powered contact form with loading and notification states.
- Floating WhatsApp link for consultation requests.
- Responsive layouts and animated interface elements.

### Language and Appearance

- Arabic and English translations using i18next.
- Browser language detection.
- Automatic RTL layout direction for Arabic.
- Light and dark theme support.

### Administration

- Authentication through Supabase Auth.
- Client-side protected dashboard route.
- Skills creation, editing, and deletion.
- Project creation, editing, and deletion.
- Project image uploads to Supabase Storage.
- English and Arabic project descriptions.
- Certificate uploads and deletion.
- Dashboard access to stored messages.
- Visitor totals and charts:
  - Monthly activity for the current year.
  - Daily activity for the current month.
- Sign-out functionality.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript |
| Development and build | Vite, React SWC plugin |
| Styling | Tailwind CSS |
| UI components | shadcn/ui, Radix UI |
| Routing | React Router |
| Localization | i18next, react-i18next |
| Data, authentication, and storage | Supabase |
| Contact form | EmailJS |
| Animation | Framer Motion |
| Project carousel | Swiper |
| Dashboard charts | Recharts |
| Icons | Lucide React, React Icons |
| Notifications | Sonner and toast components |
| Code quality | ESLint |

## Application Routes

| Route | Purpose |
| --- | --- |
| `/` | Public portfolio |
| `/login` | Authentication page |
| `/admin` | Authenticated management dashboard |
| `/update-password` | Password update page |
| Any unmatched route | Not-found page |

## Project Structure

```text
yns.aid/
├── public/                     # Public static files
├── src/
│   ├── components/
│   │   ├── assets/             # Images and component assets
│   │   ├── portfolio/          # Public portfolio sections
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── FreeConsultation.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── MouseGlow.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Skills.tsx
│   │   │   └── UseTrackVisitor.tsx
│   │   ├── ui/                 # Shared UI components
│   │   └── ProtectedRoute.tsx
│   ├── contexts/               # Authentication and theme contexts
│   ├── hooks/                  # Shared hooks
│   ├── i18n/                   # Translation resources
│   ├── lib/                    # Supabase client and utilities
│   ├── pages/                  # Application pages
│   ├── App.tsx                 # Providers and routing
│   ├── i18n.ts                 # Localization configuration
│   ├── index.css               # Global styles
│   └── main.tsx                # Application entry point
├── index.html
├── package.json
├── tailwind.config.ts
├── vercel.json
└── vite.config.ts
```

## Running Locally

### Prerequisites

- A Node.js version compatible with Vite 5.
- npm.
- A Supabase project configured for this application.
- An EmailJS account to enable contact form delivery.

### 1. Clone the repository

```bash
git clone [https://github.com/Ynsaid/yns.aid.git](https://github.com/Ynsaid/yns.aid.git)
cd yns.aid
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

VITE_SERVICE=your_emailjs_service_id
VITE_TEMPLATE=your_emailjs_template_id
VITE_PUBLIC_KEY=your_emailjs_public_key
```

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase client-side anonymous key |
| `VITE_SERVICE` | EmailJS service identifier |
| `VITE_TEMPLATE` | EmailJS contact form template identifier |
| `VITE_PUBLIC_KEY` | EmailJS public key |

The contact form sends these template fields:

```text
user_name
user_email
message
```

Configure the corresponding variables in your EmailJS template.

### 4. Start the development server

```bash
npm run dev
```

The development server is configured to use:

```text
http://localhost:8080
```

Use the URL printed in the terminal if that port is unavailable.

## Supabase Configuration

The frontend expects an existing Supabase backend.

### Database Tables

The application references the following table names:

| Table | Purpose |
| --- | --- |
| `skills` | Skill names, categories, and proficiency levels |
| `projects` | Project details and associated links |
| `certificates` | Certificate metadata and storage filenames |
| `messages` | Messages displayed in the administration dashboard |
| `Visitors` | Visit records used by dashboard statistics |

Preserve the exact table names, including the capitalization of `Visitors`.

Project data includes fields such as:

```text
id
title
description
description_ar
image
technologies
liveUrl
githubUrl
type
created_at
```

### Storage Buckets

The application references these bucket names:

```text
project-images
Certificates
```

- `project-images` stores project images.
- `Certificates` stores certificate files.
- The frontend constructs public URLs for displaying these assets.

### Authentication and Access Control

Create and configure the appropriate account in Supabase Auth before using the administration dashboard.

The React protected route checks whether a user is authenticated. Database authorization must also be enforced through Supabase Row Level Security and Storage policies.

Do not rely on the frontend route guard alone to protect administrative data or write operations.

Only authorized administrators should be allowed to create, update, or delete portfolio content.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Generate the production build |
| `npm run build:dev` | Build using development mode |
| `npm run preview` | Preview the build locally |
| `npm run lint` | Run ESLint |

## Production Build

```bash
npm run build
```

The generated application is placed in:

```text
dist/
```

Preview the build with:

```bash
npm run preview
```

## Deployment

The repository includes a `vercel.json` rewrite configuration for client-side routing.

### Vercel Settings

```text
Framework preset: Vite
Build command: npm run build
Output directory: dist
```

Add the environment variables listed above to the hosting project's settings before building.

When deploying to another static hosting provider, configure an SPA fallback so routes such as `/login` and `/admin` load the application correctly when opened directly.

## Customization

| What to change | Where to look |
| --- | --- |
| Introductory content | `src/components/portfolio/Hero.tsx` |
| Biography and profile section | `src/components/portfolio/About.tsx` |
| Services | `src/components/portfolio/Services.tsx` |
| Contact details and email form | `src/components/portfolio/Contact.tsx` |
| WhatsApp consultation link | `src/components/portfolio/FreeConsultation.tsx` |
| Arabic and English text | `src/i18n/` |
| Global appearance | `src/index.css` and `tailwind.config.ts` |
| Routes | `src/App.tsx` |
| Supabase connection | `src/lib/supabase.tsx` |
| Projects, skills, and certificates | Administration dashboard and Supabase |


## Security Notes

- Never place a Supabase service-role key or other privileged credentials in frontend code.
- Treat client-side route protection as a user-interface mechanism, not as backend authorization.
- Review database and Storage policies before exposing administrative functionality.
- Configure the appropriate usage restrictions for the EmailJS integration.

## Author

GitHub: [@Ynsaid](https://github.com/Ynsaid)

Email: [younesaid2003@gmail.com](mailto:younesaid2003@gmail.com)

## License

No license file is currently included in this repository.
Add a license if you intend to grant explicit permissions for reuse or redistribution.
