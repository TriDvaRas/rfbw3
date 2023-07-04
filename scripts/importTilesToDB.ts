

import prisma from "../src/server/extra/lib/db";
import fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const data: {
    key: string,
    childrenKeys: string[]
    "buildings"?: string[],
    "robots"?: string[],
    "windows"?: string[]
}[] = JSON.parse(fs.readFileSync("./scripts/rfbwmap.json", "utf-8"));

async function main() {
    // throw new Error("Fuse");
    await prisma.tile.deleteMany({
        
    });
    await prisma.tile.createMany({
        data: data.map((tile) => {
            return {
                location: tile.key,
                connectedTo: tile.childrenKeys || [],
                buildings: tile.buildings || [],
                robots: tile.robots || [],
                windows: tile.windows || [],
            }
        })
    })
    console.log(`Imported ${data.length} tiles`);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
})