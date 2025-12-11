import type { Metadata } from "next";
import { Inter, Lexend_Deca } from "next/font/google"; // Corrected import
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDictionary } from '@/get-dictionary'

// Configure fonts
const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const lexend = Lexend_Deca({ // Corrected font name
    variable: "--font-lexend",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "GMRT - German Malaysian Round Table",
    description: "Networking and Business insights for Germany and Malaysia",
};

export async function generateStaticParams() {
    return [{ lang: 'de' }, { lang: 'en' }]
}

export default async function RootLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ lang: string }>
}>) {
    // Await params in Nextjs 15+ if needed, but for now standard access. 
    // Next 15 might require awaiting params. Let's assume standard behavior for 14/15 transition or await if it's a promise.
    const { lang } = await params;
    const dict: any = await getDictionary(lang as 'de' | 'en');

    return (
        <html lang={lang}>
            <body
                className={`${inter.variable} ${lexend.variable} antialiased min-h-screen flex flex-col bg-slate-50`}
            >
                <Navbar lang={lang as 'de' | 'en'} dict={dict.navigation} />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer dict={dict.footer} navDict={dict.navigation} lang={lang as string} />
            </body>
        </html>
    );
}
