import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/login', '/create', '/edit/', '/uploads/'],
        },
        sitemap: 'https://gmrt.de/sitemap.xml',
    }
}
