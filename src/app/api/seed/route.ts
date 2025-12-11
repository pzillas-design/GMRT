import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Clear existing posts to avoid duplicates (optional, but good for idempotency in this context)
        // await prisma.post.deleteMany({}); 

        const posts = [
            {
                title: "1. German Malaysian Round Table (GMRT) Westfalen",
                location: "Düsseldorf",
                content: "Donnerstag, 9. Oktober 2025 - BECKHOFF Automation GmbH & Co. KG",
                contentBlocks: JSON.stringify([
                    {
                        id: "1",
                        type: "headline",
                        content: "Veranstaltungsdetails",
                        level: 2
                    },
                    {
                        id: "2",
                        type: "text",
                        content: "Donnerstag, 9. Oktober 2025\nBECKHOFF Automation GmbH & Co. KG\nHauptverwaltung (Gebäude T5)\nHülshorstweg 20\n33415 Verl, Germany\n\n- Registrierung: ab 16:00 Uhr (mit kleinem Imbiss)\n- Beginn: 16:30 Uhr (Vorträge, Produkt-Demonstration, Networking)\n- Ende: ca. 19:00 Uhr"
                    },
                    {
                        id: "3",
                        type: "headline",
                        content: "Impulsbeiträge",
                        level: 2
                    },
                    {
                        id: "4",
                        type: "text",
                        content: "- Joshua A. Rusdy International Sales, BECKHOFF Automation GmbH & Co. KG „Automatisierungstechnik in Südostasien – mit der Fa. Beckhoff in Malaysia“\n- Nils Wolters Investment Officer, MIDA (Malaysia Investment Development Authority) „Investieren in Malaysia“"
                    },
                    {
                        id: "5",
                        type: "image",
                        content: "https://gmrt.de/wp-content/uploads/2021/09/GMRT-Logo-2021-300x138.png", // Placeholder or real image if available
                        caption: "GMRT Westfalen"
                    }
                ]),
                createdAt: new Date("2025-10-09")
            },
            {
                title: "22. GERMAN MALAYSIAN ROUND TABLE (GMRT) DÜSSELDORF",
                location: "Düsseldorf",
                content: "Donnerstag, 18. September 2025 - IHK Düsseldorf",
                contentBlocks: JSON.stringify([
                    {
                        id: "1",
                        type: "headline",
                        content: "22. GERMAN MALAYSIAN ROUND TABLE (GMRT) DÜSSELDORF",
                        level: 2
                    },
                    {
                        id: "2",
                        type: "text",
                        content: "Donnerstag, 18. September 2025\nErnst-Schneider-Saal, Industrie- und Handelskammer zu Düsseldorf\nErnst-Schneider-Platz 1, 40212 Düsseldorf\nBeginn: 16:00 Uhr (MESZ / CEST)\nEnde: 19:00 Uhr"
                    },
                    {
                        id: "3",
                        type: "headline",
                        content: "Eröffnung",
                        level: 3
                    },
                    {
                        id: "4",
                        type: "text",
                        content: "- Roland Mauss, GMRT Chapter Initiator\n- Ralf Schlindwein, Geschäftsführer International, IHK Düsseldorf"
                    },
                    {
                        id: "5",
                        type: "headline",
                        content: "Referenten & Beiträge",
                        level: 3
                    },
                    {
                        id: "6",
                        type: "text",
                        content: "- Tara Méité Deputy Executive Director / Head of Services DEinternational AHK Malaysia\n- Asrulnizam Addrus Director MIDA Frankfurt\n- Chao Yong Sai, Senior Vice President, UOB Singapur"
                    }
                ]),
                createdAt: new Date("2025-09-18")
            },
            {
                title: "Einladung 19. GMRT Düsseldorfer / 2. Düsseldorf GMRT Digital",
                location: "Düsseldorf",
                content: "Donnerstag, 30. September 2021 - Digital Event",
                contentBlocks: JSON.stringify([
                    {
                        id: "1",
                        type: "text",
                        content: "Dear friends of GMRT, sehr geehrte Damen und Herren,\n\nim Namen aller GMRT-Chapter und Repräsentanten sowie Partner freue ich mich sehr, Sie zu einer weiteren Veranstaltung von GMRT digital einzuladen."
                    },
                    {
                        id: "2",
                        type: "headline",
                        content: "Focus on Malaysia: economic, monetary and investor outlook",
                        level: 2
                    },
                    {
                        id: "3",
                        type: "text",
                        content: "2. GMRT digital – Donnerstag, 30. September 2021\n11:00 Uhr – 12:15 Uhr (MESZ / CEST)"
                    },
                    {
                        id: "4",
                        type: "text",
                        content: "Ralf Schlindwein, Geschäftsführer International, IHK Düsseldorf wird gemeinsam mit dem GMRT die Veranstaltung eröffnen."
                    }
                ]),
                createdAt: new Date("2021-09-30")
            }
        ];

        for (const post of posts) {
            await prisma.post.create({
                data: post
            });
        }

        return NextResponse.json({ success: true, count: posts.length });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to seed posts' }, { status: 500 });
    }
}
