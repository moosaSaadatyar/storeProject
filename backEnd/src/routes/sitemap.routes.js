const express = require('express');
const Project = require('../modules/projects/project.model');

/**
 * sitemap.xml پویا — مانت روی /sitemap.xml
 * شامل صفحات ثابت + همه‌ی پروژه‌های منتشرشده (با lastmod)
 * مبدأ URLها از متغیر محیطی SITEMAP_BASE_URL گرفته می‌شود.
 */
const router = express.Router();

/** صفحات ثابت سایت */
const STATIC_PAGES = [
  { loc: '/', priority: '1.0' },
  { loc: '/portfolio', priority: '0.8' },
  { loc: '/services', priority: '0.8' },
  { loc: '/contact', priority: '0.7' },
  { loc: '/about', priority: '0.6' },
  { loc: '/request', priority: '0.5' },
  { loc: '/terms', priority: '0.3' },
];

const xmlEscape = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const toDay = (d) => (d ? new Date(d).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));

router.get('/', async (req, res, next) => {
  try {
    const base = String(process.env.SITEMAP_BASE_URL || 'http://localhost:4201').trim().replace(/\/+$/, '');
    const projects = await Project.find({ isPublished: true }).select('updatedAt').lean();

    const urls = [
      ...STATIC_PAGES.map(
        (p) =>
          `  <url>\n    <loc>${base}${p.loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
      ),
      ...projects.map(
        (pr) =>
          `  <url>\n    <loc>${xmlEscape(base + '/projects/' + pr._id)}</loc>\n    <lastmod>${toDay(pr.updatedAt)}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
    res.status(200).type('application/xml; charset=utf-8').send(xml);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
