// using native fetch

async function debugApiList() {
    const baseUrl = 'http://localhost:3000';

    console.log('--- Testing API Connectivity ---');
    console.log(`Fetching ${baseUrl}/api/posts ...`);

    try {
        const res = await fetch(`${baseUrl}/api/posts`);
        if (res.ok) {
            const posts = await res.json();
            console.log(`Success! Found ${posts.length} posts.`);
            if (posts.length > 0) {
                console.log('Sample Post ID:', posts[0].id);
            }
        } else {
            console.error('GET /api/posts FAILED:', res.status, res.statusText);
            console.error('Body:', await res.text());
        }
    } catch (e) {
        console.error('Network error / Server unreachable:', (e as Error).message);
    }
}

debugApiList();
