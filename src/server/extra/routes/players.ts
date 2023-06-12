import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/db";

const router = Router();

const createPlayerRequestBody = z.object({
    name: z.string(),
    userId: z.string().cuid(),
    about: z.string().optional(),
    fieldRoot: z.string().regex(/^\d+,\d+$/),
});

router.post("/create", (req, res) => {
    const body = createPlayerRequestBody.parse(req.body);
    prisma.player.create({
        data: {
            addedById: req.session.user.id,
            fieldRoot: body.fieldRoot,
            name: body.name,
            userId: body.userId,
            about: body.about,
        },
    }).then((player) => {
        res.json(player);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

export default router;

