import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

let locales = ['de', 'en']
let defaultLocale = 'de'

function getLocale(request: NextRequest): string {
    const headers = { 'accept-language': request.headers.get('accept-language') || '' }
    const languages = new Negotiator({ headers }).languages()

    if (languages.length === 0) return defaultLocale

    try {
        return match(languages, locales, defaultLocale)
    } catch (e) {
        return defaultLocale
    }
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    // Exceptions for static files and api routes
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/uploads') ||
        pathname.includes('.') // images, etc
    ) {
        return
    }

    if (pathnameIsMissingLocale) {
        const locale = getLocale(request)

        // Redirect if there is no locale
        return NextResponse.redirect(
            new URL(`/${locale}/${pathname}`, request.url)
        )
    }

    // Authentication Protection
    // Protect /create and /edit routes
    if (pathname.includes('/create') || pathname.includes('/edit')) {
        const token = request.cookies.get('gmrt_auth_token')?.value;

        if (token !== 'authenticated') {
            // Get current locale from path to preserve language
            const pathLocale = pathname.split('/')[1];
            const locale = locales.includes(pathLocale) ? pathLocale : defaultLocale;

            return NextResponse.redirect(
                new URL(`/${locale}/login`, request.url)
            );
        }
    }
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        '/((?!_next|api|uploads|favicon.ico).*)',
    ],
}
