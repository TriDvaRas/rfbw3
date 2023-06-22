
import data from "./tiles.json";

import prisma from "../src/server/extra/lib/db";

async function main() {
    await prisma.tile.createMany({
        data: data.map((tile) => {
            return {
                location: tile.key,
                connectedTo: tile.childrenKeys,
            }
        })
    })
    console.log(`Imported ${data.length} tiles`);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
})