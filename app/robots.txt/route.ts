export function GET(): Response {
  const robotsText = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://pgpgs.rollyparedes.net/sitemap.xml`

  return new Response(robotsText, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}