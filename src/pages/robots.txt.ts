export const prerender = true;

export function GET() {
  return new Response([
    'User-agent: *',
    'Allow: /',
    'Sitemap: https://retirementshield.io/sitemap.xml',
    '',
  ].join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
