// The site's public origin, with no trailing slash. NEXT_PUBLIC_SITE_URL is
// set in Vercel's production environment (https://tk-coding.com); the
// localhost fallback keeps the sitemap, robots.txt and social-preview URLs
// resolvable in development. Read at build time — changing it needs a redeploy.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
