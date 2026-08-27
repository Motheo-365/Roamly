import { Request, Response } from "express";

/**
 * Image Controller
 *
 * Searches Wikimedia Commons for an image related to
 * the requested destination.
 */
class ImageController {

    async getDestinationImage(req: Request, res: Response) {

        try {

            const destination = req.params.destination;

            if (!destination) {
                return res.status(400).json({
                    status: "error",
                    message: "Destination is required"
                });
            }

            const searchQuery = encodeURIComponent(
                `${destination} travel`
            );

            const url =
                `https://commons.wikimedia.org/w/api.php` +
                `?action=query` +
                `&generator=search` +
                `&gsrsearch=${searchQuery}` +
                `&gsrnamespace=6` +
                `&gsrlimit=10` +
                `&prop=imageinfo` +
                `&iiprop=url` +
                `&iiurlwidth=800` +
                `&format=json` +
                `&origin=*`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    "Failed to search Wikimedia Commons"
                );
            }

            const data = await response.json();

            const pages = data.query?.pages;

            if (!pages) {
                return res.status(404).json({
                    status: "error",
                    message: "No image found"
                });
            }

            const images = Object.values(pages) as Array<{
                imageinfo?: Array<{
                    thumburl?: string;
                    url?: string;
                }>;
            }>;

            const image = images.find(
                (page) =>
                    page.imageinfo?.[0]?.thumburl ||
                    page.imageinfo?.[0]?.url
            );

            const imageUrl =
                image?.imageinfo?.[0]?.thumburl ||
                image?.imageinfo?.[0]?.url;

            if (!imageUrl) {
                return res.status(404).json({
                    status: "error",
                    message: "No usable image found"
                });
            }

            return res.status(200).json({
                status: "success",
                data: {
                    url: imageUrl
                }
            });

        } catch (error) {

            console.error(
                "Error fetching destination image:",
                error
            );

            return res.status(500).json({
                status: "error",
                message: "Failed to fetch destination image"
            });
        }
    }
}

export default new ImageController();