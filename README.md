# Anthony Silvia - Portfolio Website

A premium, accessible portfolio website built with Next.js 15.1.6, featuring WCAG 2.2 AAA accessibility compliance, Firebase integration, and modern design patterns.

## Features

- ✨ **Smooth Animations**: Built with Framer Motion with reduced-motion support
- ♿ **WCAG 2.2 AAA Compliant**: Full accessibility support including AAA contrast ratios, keyboard navigation, ARIA labels, and proper focus management
- 🎨 **Premium Design**: Enterprise-focused design with high-contrast, accessible color palette
- 📱 **Fully Responsive**: Optimized for all device sizes
- ⚡ **Next.js 15.1.6**: Built with the latest stable Next.js App Router
- 🔥 **Firebase Ready**: Configured for Firebase Hosting with optional Firestore integration
- 🎯 **Performance Optimized**: Fast loading and smooth scrolling
- 🔍 **SEO Optimized**: Complete metadata, OpenGraph, Twitter cards, sitemap, and robots.txt

## Tech Stack

- **Next.js 15.1.6** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling with AAA contrast tokens
- **Framer Motion** - Animations with reduced-motion fallbacks
- **Firebase** - Modular Web SDK for hosting and optional Firestore
- **Lucide React** - Accessible icon library

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: Node.js 20+)
- npm or yarn
- Firebase account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Anthonyjsilvia
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables) section below)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables for Firebase integration:

```env
# Firebase Configuration (required for Firestore contact form and Google Analytics)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
# Google Analytics via Firebase (optional but recommended)
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Getting Firebase Configuration Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Go to Project Settings (gear icon) > General tab
4. Scroll down to "Your apps" section
5. Click on the web app icon (`</>`) or "Add app" if you haven't created one
6. Copy the configuration values from the `firebaseConfig` object

**Note**: The contact form will work without Firebase (it will fall back to a mailto link), but for storing form submissions in Firestore, Firebase configuration is required. For **Google Analytics** (Firebase Analytics) site-wide, set `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` to your measurement ID (e.g. `G-XXXXXXXXXX`) from Firebase Console → Project Settings → General → Your apps → SDK setup and configuration.

### Firestore Setup (Optional - for contact form)

If you want to store contact form submissions in Firestore:

1. In Firebase Console, go to Firestore Database
2. Create a database (start in test mode for development)
3. Create a collection named `contacts`
4. Update Firestore security rules (recommended for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contacts/{document=**} {
      allow create: if request.resource.data.keys().hasAll(['name', 'email', 'message', 'timestamp']);
      allow read: if false; // Only allow writes, not reads (for security)
    }
  }
}
```

## Firebase Hosting Deployment

### Prerequisites

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

### Initial Setup

1. Initialize Firebase in your project:
```bash
firebase init hosting
```

2. When prompted:
   - **Select an existing project** or create a new one
   - **What do you want to use as your public directory?** → `.next` (for static export) or use Next.js with Firebase Hosting
   - **Configure as a single-page app?** → No
   - **Set up automatic builds and deploys with GitHub?** → Optional

### Deploy with Next.js (Recommended)

Firebase Hosting supports Next.js with the web frameworks feature:

1. Enable the web frameworks experiment:
```bash
firebase experiments:enable webframeworks
```

2. Initialize hosting again (this will detect Next.js):
```bash
firebase init hosting
```

3. Firebase CLI will automatically:
   - Detect Next.js
   - Configure `firebase.json` and `.firebaserc`
   - Set up build and deployment scripts

4. Build and deploy:
```bash
npm run build
firebase deploy --only hosting
```

### Manual Configuration

If you need to configure manually, your `firebase.json` should look like:

```json
{
  "hosting": {
    "source": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "frameworksBackend": {
      "region": "us-central1"
    }
  }
}
```

### Environment Variables in Firebase

For production deployment, set environment variables in Firebase:

1. Go to Firebase Console > Project Settings > Environment Variables
2. Add your `NEXT_PUBLIC_*` variables
3. Or use Firebase CLI:
```bash
firebase functions:config:set public.api_key="your-value"
```

**Note**: For Next.js static exports, environment variables are baked into the build at build time, so ensure your `.env.local` is set before building.

## Accessibility Features

This portfolio meets **WCAG 2.2 AAA standards** where applicable:

- ✅ **AAA Text Contrast**: All text meets 7:1 contrast ratio (normal text) and 4.5:1 (large text)
- ✅ **Skip to Main Content**: Keyboard-accessible skip link
- ✅ **Keyboard Navigation**: Full keyboard navigation support with visible focus indicators
- ✅ **ARIA Labels**: Comprehensive ARIA labels and roles
- ✅ **Semantic HTML**: Proper use of semantic HTML elements
- ✅ **Reduced Motion**: All animations respect `prefers-reduced-motion`
- ✅ **Focus Management**: Clear, visible focus states on all interactive elements
- ✅ **Screen Reader Support**: Proper heading hierarchy and landmark regions

### Testing Accessibility

1. **Keyboard Navigation**: Tab through the entire site using only the keyboard
2. **Screen Reader**: Test with NVDA (Windows), VoiceOver (Mac), or JAWS
3. **Contrast Checker**: Use tools like WebAIM Contrast Checker or browser DevTools
4. **Lighthouse**: Run Lighthouse audit (target: 100 accessibility score)

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles with AAA contrast tokens
│   ├── layout.tsx           # Root layout with SEO metadata
│   ├── page.tsx             # Main page component
│   ├── robots.ts            # Robots.txt configuration
│   └── sitemap.ts           # Sitemap configuration
├── components/
│   ├── About.tsx            # About section (LinkedIn Summary)
│   ├── Contact.tsx          # Contact section with form
│   ├── Education.tsx        # Education section
│   ├── Experience.tsx       # Experience section
│   ├── Hero.tsx             # Hero section with CTAs
│   ├── Navigation.tsx       # Navigation component
│   └── Skills.tsx           # Skills, languages, certifications
├── lib/
│   └── firebase.ts          # Firebase configuration
├── public/
│   └── resume.pdf           # Resume PDF (replace with your resume)
└── package.json
```

## Content

All professional content matches Anthony Silvia's LinkedIn export **word-for-word**. The following sections are included:

- **Hero**: Name, headline, location, and CTA buttons (View Resume, LinkedIn, Email)
- **About**: Complete LinkedIn Summary
- **Experience**: All LinkedIn experience entries with exact bullet points
- **Skills**: Top skills, languages, certifications, honors & awards
- **Education**: All education entries
- **Contact**: Contact information and optional Firebase-powered contact form

## Resume

The Resume link in the navigation opens `/resume.pdf` in a new tab. 

**To add your resume:**
1. Replace `/public/resume.pdf` with your actual resume PDF file
2. The link will automatically work

## SEO

The site includes comprehensive SEO optimization:

- Meta titles and descriptions
- OpenGraph tags for social sharing
- Twitter Card metadata
- Structured data (via semantic HTML)
- Sitemap (`/sitemap.xml`)
- Robots.txt (`/robots.txt`)
- Canonical URLs

## Performance

- Optimized images and assets
- Code splitting with Next.js
- Static generation where possible
- Minimal JavaScript bundle
- Efficient animations with reduced-motion support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## License

This project is private and proprietary.

## Support

For questions or issues, contact: contact@anthonyjsilvia.com

---

**Quick Checklist:**

- ✅ Next.js 15.1.6 with App Router
- ✅ TypeScript and ESLint configured
- ✅ Firebase modular SDK setup
- ✅ AAA accessibility compliance
- ✅ Reduced motion support
- ✅ Exact LinkedIn content (word-for-word)
- ✅ Resume link configured
- ✅ SEO metadata complete
- ✅ Sitemap and robots.txt
- ✅ Firebase Hosting ready
