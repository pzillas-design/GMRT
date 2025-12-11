import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Clear existing data
    await prisma.post.deleteMany({});

    const today = new Date();

    // Helper to get date relative to today
    const getDate = (daysOffset: number) => {
        const date = new Date(today);
        date.setDate(date.getDate() + daysOffset);
        return date;
    };

    // Upcoming Events
    const upcomingPosts = [
        {
            title: 'GMRT Networking Night 2025',
            content: 'Treffen Sie führende Experten und Netzwerker aus der ASEAN-Region zu einem exklusiven Abend in Frankfurt. Wir diskutieren die neuesten Trends und Chancen für deutsche Unternehmen in Südostasien.',
            location: 'Frankfurt',
            eventDate: getDate(30), // +30 days
            createdAt: getDate(-2),
            contentBlocks: JSON.stringify([
                { id: '1', type: 'headline', content: 'Networking Night 2025', level: 2 },
                { id: '2', type: 'text', content: 'Treffen Sie führende Experten und Netzwerker aus der ASEAN-Region zu einem exklusiven Abend in Frankfurt. Wir diskutieren die neuesten Trends und Chancen für deutsche Unternehmen in Südostasien.' }
            ])
        },
        {
            title: 'ASEAN Business Forum München',
            content: 'Das jährliche Highlight für alle, die geschäftlich in ASEAN aktiv sind. Mit Keynotes von Botschaftern und Wirtschaftsvertretern.',
            location: 'München',
            eventDate: getDate(60), // +60 days
            createdAt: getDate(-5),
            contentBlocks: JSON.stringify([
                { id: '1', type: 'headline', content: 'ASEAN Business Forum', level: 2 },
                { id: '2', type: 'text', content: 'Das jährliche Highlight für alle, die geschäftlich in ASEAN aktiv sind.' }
            ])
        }
    ];

    // Past Events
    const pastPosts = [
        {
            title: 'Rückblick: Jahresauftakt 2024',
            content: 'Ein gelungener Start in das neue Jahr mit über 100 Gästen in Düsseldorf. Wir haben die Roadmap für das kommende Jahr vorgestellt.',
            location: 'Düsseldorf',
            eventDate: getDate(-45), // -45 days
            createdAt: getDate(-40),
            contentBlocks: JSON.stringify([
                { id: '1', type: 'headline', content: 'Jahresauftakt 2024', level: 2 },
                { id: '2', type: 'text', content: 'Ein gelungener Start in das neue Jahr mit über 100 Gästen in Düsseldorf.' }
            ])
        },
        {
            title: 'Delegationsreise Malaysia',
            content: 'Unsere Delegation besuchte Kuala Lumpur und Penang, um neue Partnerschaften im Bereich Elektronik und Halbleiter zu knüpfen.',
            location: 'Allgemein',
            eventDate: getDate(-90), // -90 days
            createdAt: getDate(-85),
            contentBlocks: JSON.stringify([
                { id: '1', type: 'headline', content: 'Delegationsreise Malaysia', level: 2 },
                { id: '2', type: 'text', content: 'Unsere Delegation besuchte Kuala Lumpur und Penang.' }
            ])
        },
        {
            title: 'Sommerfest Berlin',
            content: 'Bei strahlendem Sonnenschein genossen wir asiatische Köstlichkeiten und gute Gespräche an der Spree.',
            location: 'Berlin',
            eventDate: getDate(-120), // -120 days
            createdAt: getDate(-115),
            contentBlocks: JSON.stringify([
                { id: '1', type: 'headline', content: 'Sommerfest Berlin', level: 2 },
                { id: '2', type: 'text', content: 'Bei strahlendem Sonnenschein genossen wir asiatische Köstlichkeiten.' }
            ])
        }
    ];

    for (const post of upcomingPosts) {
        const p = await prisma.post.create({ data: post });
        console.log(`Created upcoming post with id: ${p.id}`);
    }

    for (const post of pastPosts) {
        const p = await prisma.post.create({ data: post });
        console.log(`Created past post with id: ${p.id}`);
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
