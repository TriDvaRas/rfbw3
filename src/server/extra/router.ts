import { Router } from "express";
import tiles from "./routes/tiles";

const router = Router();
router.use("/tiles", tiles);
// router.get("/test", (req, res) => {
//     // const rs = getMazeEdges(20, 48, 3);
//     const rs = getMazeTiles(20, 48, 10);
//     res.json(rs);
// });

export default router;

