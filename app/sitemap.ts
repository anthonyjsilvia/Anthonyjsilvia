import { MetadataRoute } from 'next'
import { recommendations } from '@/lib/recommendations'

/**
 * Sitemap - multi-page version. Each top-level route is its own entry,
 * plus a dedicated detail page for every recommendation under
 * `/recommendations/<slug>` so they're individually crawlable, shareable,
 * and indexable. New recommendations added to `lib/recommendations.ts`
 * appear here automatically on the next build.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://anthonysilvia.com'
  const lastModified = new Date()

  const recommendationEntries: MetadataRoute.Sitemap = recommendations.map((r) => ({
    url: `${baseUrl}/recommendations/${r.slug}`,
    lastModified,
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [
    { url: baseUrl, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/experience`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/portfolio`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/evidence`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/resume`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    ...recommendationEntries,
  ]
}
