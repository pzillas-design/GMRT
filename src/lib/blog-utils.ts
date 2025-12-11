
export function getPostImage(location: string | null | undefined): string {
    const normalizedLocation = location?.toLowerCase().trim();

    if (normalizedLocation === 'frankfurt') {
        return '/images/frankfurt.png';
    } else if (normalizedLocation === 'düsseldorf' || normalizedLocation === 'duesseldorf') {
        return '/images/duesseldorf.png';
    } else if (normalizedLocation === 'münchen' || normalizedLocation === 'munich') {
        return '/images/muenchen.png';
    } else if (normalizedLocation === 'wien' || normalizedLocation === 'vienna') {
        return '/images/wien.png';
    } else if (normalizedLocation === 'hannover') {
        return '/images/hannover.png';
    } else if (normalizedLocation === 'bremen') {
        return '/images/bremen.png';
    } else if (normalizedLocation === 'ruhrgebiet') {
        return '/images/ruhrgebiet.png';
    } else if (normalizedLocation === 'zürich' || normalizedLocation === 'zurich') {
        return '/images/zurich.png';
    } else if (normalizedLocation === 'berlin') {
        return '/images/berlin.png';
    }

    return '/images/default-blog.png';
}
