import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosResponse } from "axios";
import { prisma } from "../../../server/db";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const imageUrl = req.query.id;

    const image = await prisma.image.findUnique({
        where: {
            url: imageUrl as string
        }
    })
    if (!image) {
        return res.status(404).send({ error: 'Image not found' });
    }
    try {
        const response: AxiosResponse<ArrayBuffer> = await axios({
            method: 'get',
            url: imageUrl as string,
            responseType: 'arraybuffer', // Set response type as arraybuffer for binary data
        });

        res.setHeader('Content-Type', response.headers['content-type']); // Set the content-type header to the content-type of the image
        res.setHeader('Content-Length', response.headers['content-length']); // Set the content-length header to the content-length of the image
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Optional: Set cache-control header to cache the image in the browser for a long time
        res.send(response.data); // Send the buffer to the client
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch image' });
    }
};