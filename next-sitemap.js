/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://poshpoule.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ['/server-sitemap.xml', '/admin/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://poshpoule.com'}/sitemap.xml`,
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://poshpoule.com'}/server-sitemap.xml`,
    ],
  },
}
