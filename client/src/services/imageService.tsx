const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";

export function getDestinationImage(
    destination: string | null
): string {
    if (!destination) {
        return DEFAULT_IMAGE;
    }

    const query = encodeURIComponent(destination);

    return `https://source.unsplash.com/800x600/?${query},travel`;
}