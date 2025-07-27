import { MetadataRoute } from 'next'

export function GET(): Response {
  const robots: MetadataRoute.Robots = {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://pgpgs.rollyparedes.net/sitemap.xml',
  }

  const robotsText = `User-agent: ${robots.rules.userAgent}
Allow: ${robots.rules.allow}
Disallow: ${robots.rules.disallow.join('\nDisallow: ')}
Sitemap: ${robots.sitemap}`

  return new Response(robotsText, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}