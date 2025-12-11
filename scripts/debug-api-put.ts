// using native fetch

async function main() {
    const postId = 388; // Use a known existing ID or fetch one
    const baseUrl = 'http://localhost:3000';

    console.log(`Fetching post ${postId}...`);
    const getRes = await fetch(`${baseUrl}/api/posts/${postId}`);
    if (!getRes.ok) {
        console.error('Failed to fetch post:', await getRes.text());
        return;
    }
    const post = await getRes.json();
    console.log('Original Post:', { title: post.title, id: post.id });

    // Prepare payload mimicking the frontend
    const payload = {
        title: post.title + ' - API DEBUG',
        location: post.location,
        eventDate: post.eventDate, // Send back the ISO string
        contentBlocks: typeof post.contentBlocks === 'string' ? JSON.parse(post.contentBlocks) : post.contentBlocks, // Frontend sends array!
        coverImage: post.coverImage,
        content: post.content
    };

    console.log('Sending PUT payload:', JSON.stringify(payload, null, 2));

    const putRes = await fetch(`${baseUrl}/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!putRes.ok) {
        console.error('PUT Failed:', putRes.status, putRes.statusText);
        const text = await putRes.text();
        console.error('Response Body:', text);
    } else {
        console.log('PUT Success!', await putRes.json());
    }
}

main();
