export async function GET() {
  return new Response(`User-agent: *
Allow: /
Allow: /terms

Disallow: /admin
Disallow: /api/

Sitemap: https://pgpgs.rollyparedes.net/sitemap.xml`, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}