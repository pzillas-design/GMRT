
export function getPostImage(location: string | null | undefined): string {
    const normalizedLocation = location?.toLowerCase().trim();

    if (normalizedLocation === 'frankfurt') {
        return '/images/frankfurt.jpg';
    } else if (normalizedLocation === 'düsseldorf' || normalizedLocation === 'duesseldorf') {
        return '/images/duesseldorf.jpg';
    } else if (normalizedLocation === 'münchen' || normalizedLocation === 'munich') {
        return '/images/muenchen.jpg';
    } else if (normalizedLocation === 'wien' || normalizedLocation === 'vienna') {
        return '/images/wien.jpg';
    } else if (normalizedLocation === 'hannover') {
        return '/images/hannover.jpg';
    } else if (normalizedLocation === 'bremen') {
        return '/images/bremen.jpg';
    } else if (normalizedLocation === 'ruhrgebiet') {
        return '/images/ruhrgebiet.jpg';
    } else if (normalizedLocation === 'zürich' || normalizedLocation === 'zurich') {
        return '/images/zurich.jpg';
    } else if (normalizedLocation === 'berlin') {
        return '/images/berlin.jpg';
    }

    return '/images/default-blog.jpg';
}
