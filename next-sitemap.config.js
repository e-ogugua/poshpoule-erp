/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://poshpoulefarms.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ['/admin/*', '/api/*', '/server-sitemap.xml'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://poshpoulefarms.com'}/sitemap.xml`,
    ],
  },
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  outDir: 'public',
};
