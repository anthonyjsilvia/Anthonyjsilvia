import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ThemeProvider from '@/components/ThemeProvider'

const manrope = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Anthony Silvia | UX Designer & Developer',
  description: 'A versatile UX generalist who crafts exceptional user experiences from research to implementation. Combining design expertise with development skills to bring ideas to life.',
  keywords: 'Anthony Silvia, UX Designer, Developer, Portfolio, User Experience, Web Design, Frontend Development',
  authors: [{ name: 'Anthony Silvia' }],
  openGraph: {
    type: 'website',
    url: 'https://anthonysilvia.com/',
    title: 'Anthony Silvia | UX Designer & Developer',
    description: 'A versatile UX generalist who crafts exceptional user experiences from research to implementation.',
    images: ['/assets/images/me.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anthony Silvia | UX Designer & Developer',
    description: 'A versatile UX generalist who crafts exceptional user experiences from research to implementation.',
    images: ['/assets/images/me.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/images/me.jpg" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const root = document.documentElement;
                  
                  if (savedTheme === 'light') {
                    root.classList.add('light-theme');
                    root.setAttribute('data-theme', 'light');
                    root.style.backgroundColor = '#ffffff';
                    document.body.style.backgroundColor = '#ffffff';
                  } else if (savedTheme === 'dark') {
                    root.classList.add('dark-theme');
                    root.setAttribute('data-theme', 'dark');
                    root.style.backgroundColor = '#000000';
                    document.body.style.backgroundColor = '#000000';
                  } else {
                    // System preference - check OS
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDark) {
                      root.classList.add('dark-theme');
                      root.setAttribute('data-theme', 'dark');
                      root.setAttribute('data-prefers-dark', 'true');
                      root.style.backgroundColor = '#000000';
                      document.body.style.backgroundColor = '#000000';
                    } else {
                      root.classList.add('light-theme');
                      root.setAttribute('data-theme', 'light');
                      root.style.backgroundColor = '#ffffff';
                      document.body.style.backgroundColor = '#ffffff';
                    }
                  }
                } catch (e) {
                  // Fallback to light if localStorage fails
                  document.documentElement.classList.add('light-theme');
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={manrope.className}>
        <ThemeProvider>
          <Header />
          <main style={{ paddingTop: 0 }}>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

