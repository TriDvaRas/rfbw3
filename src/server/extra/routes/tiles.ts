import { Router } from "express";
import { z } from "zod";
import { getMazeNodes } from "../util/graph";

const router = Router();

const getTilesRequestQuery = z.object({
    x: z.string().regex(/^\d+$/),
    y: z.string().regex(/^\d+$/),
    depth: z.string().regex(/^\d+$/),
});

router.get("/", (req, res) => {
    // const rs = getMazeEdges(20, 48, 3);
    // const rs = getMazeTiles(20, 48, 10);
    const query = getTilesRequestQuery.parse(req.query);
    const start = Date.now();
    const rs = getMazeNodes(+query.x, +query.y, +query.depth);
    console.log("getTiles", rs.length);
    console.log("getTiles", Date.now() - start);
    res.json(rs);
});

export default router;

