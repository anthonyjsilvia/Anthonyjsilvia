# Anthony Silvia Portfolio - Next.js Version

This is a 1:1 conversion of the Anthony Silvia portfolio website to Next.js React.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js app router pages
  - `page.tsx` - Home page
  - `about/page.tsx` - About page
  - `portfolio/page.tsx` - Portfolio page
  - `resume/page.tsx` - Resume page
  - `contact/page.tsx` - Contact page
- `components/` - React components
  - `Header.tsx` - Navigation header
  - `Footer.tsx` - Footer component
  - `Testimonials.tsx` - Testimonials section
  - `PortfolioContent.tsx` - Portfolio projects display
  - `ResumeContent.tsx` - Resume content
  - `ContactForm.tsx` - Contact form with verification
- `hooks/` - Custom React hooks
  - `useTheme.ts` - Theme management hook
- `public/` - Static assets
  - `assets/` - Images and fonts
  - `data/` - JSON data files
  - `css/` - CSS stylesheets

## Features

- ✅ All pages converted to React components
- ✅ Theme switching (light/dark/system)
- ✅ Responsive design
- ✅ Mobile menu
- ✅ Contact form with math verification
- ✅ Portfolio projects display
- ✅ Resume with dynamic content
- ✅ Testimonials section

## Build for Production

```bash
npm run build
npm start
```

## Notes

- The CSS files are imported from the `public/css/` directory
- Assets are served from the `public/` directory
- Data files are in `public/data/`
- The theme system uses localStorage to persist preferences

