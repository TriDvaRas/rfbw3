import { PlayerTileType } from "@prisma/client";
import { prisma } from "../../db";

export async function setupPlayerFieldBase(playerId: string) {
    const player = await prisma.player.findUniqueOrThrow({
        where: {
            id: playerId,
        },
    });

    const [rootX, rootY] = player.fieldRoot.split(",").map((n) => parseInt(n, 10)) as [number, number];

    const fieldNodes  = getDefaultPlayerNodes(rootX, rootY);
    return await prisma.playerTile.createMany({
        data: fieldNodes.map((node) => ({
            playerId: playerId,
            tileId: `${node.x},${node.y}`,
            type: node.type,
        }))
    })
}
function getDefaultPlayerNodes(rootX: number, rootY: number) {
    const fieldNodes: {
        x: number,
        y: number,
        type: PlayerTileType
    }[] = [{
        x: rootX,
        y: rootY,
        type: PlayerTileType.border,
    }];

    switch (rootX % 2) {
        case 0:
            fieldNodes.push(...[
                {
                    x: rootX,
                    y: rootY - 1,
                    type: PlayerTileType.start,
                },
                {
                    x: rootX + 1,
                    y: rootY - 1,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX + 1,
                    y: rootY,
                    type: PlayerTileType.start,
                },
                {
                    x: rootX,
                    y: rootY + 1,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX - 1,
                    y: rootY,
                    type: PlayerTileType.start,
                },
                {
                    x: rootX - 1,
                    y: rootY - 1,
                    type: PlayerTileType.border,
                },
            ])
            //r2
            fieldNodes.push(...[
                {
                    x: rootX,
                    y: rootY - 2,
                    type: PlayerTileType.field,
                },
                {
                    x: rootX + 1,
                    y: rootY - 2,
                    type: PlayerTileType.field,
                },
                {
                    x: rootX + 2,
                    y: rootY - 1,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX + 2,
                    y: rootY,
                    type: PlayerTileType.field,
                },
                {
                    x: rootX + 2,
                    y: rootY + 1,
                    type: PlayerTileType.field,
                },
                {
                    x: rootX + 1,
                    y: rootY + 1,
                    type: PlayerTileType.field,
                },
                {
                    x: rootX,
                    y: rootY + 2,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX - 1,
                    y: rootY + 1,
                    type: PlayerTileType.field,
                },
                {
                    x: rootX - 2,
                    y: rootY + 1,
                    type: PlayerTileType.field,
                },
                {
                    x: rootX - 2,
                    y: rootY,
                    type: PlayerTileType.field,
                },
                {
                    x: rootX - 2,
                    y: rootY - 1,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX - 1,
                    y: rootY - 2,
                    type: PlayerTileType.field,
                },
            ])
            //r3
            fieldNodes.push(...[
                {
                    x: rootX,
                    y: rootY - 3,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX + 3,
                    y: rootY - 2,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX + 3,
                    y: rootY + 1,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX,
                    y: rootY + 3,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX - 3,
                    y: rootY + 1,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX - 3,
                    y: rootY - 2,
                    type: PlayerTileType.border,
                },
            ])
            break;
        case 1:
            //r1
            fieldNodes.push(...[
                {
                    x: rootX,
                    y: rootY - 1,
                    type: PlayerTileType.start,
                },
                {
                    x: rootX + 1,
                    y: rootY,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX + 1,
                    y: rootY + 1,
                    type: PlayerTileType.start,
                },
                {
                    x: rootX,
                    y: rootY + 1,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX - 1,
                    y: rootY + 1,
                    type: PlayerTileType.start,
                },
                {
                    x: rootX - 1,
                    y: rootY,
                    type: PlayerTileType.border,
                },
            ])
            //r2
            fieldNodes.push(...[

                {
                    x: rootX,
                    y: rootY - 2,
                    type: PlayerTileType.field,
                },
                {
                    x: rootX + 1,
                    y: rootY - 1,
                    type: PlayerTileType.field,
                },
                {
                    x: rootX + 2,
                    y: rootY - 1,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX + 2,
                    y: rootY,
                    type: PlayerTileType.field,
                },
                {
                    x: rootX + 2,
                    y: rootY + 1,
                    type: PlayerTileType.field,
                },
                {
                    x: rootX + 1,
                    y: rootY + 2,
                    type: PlayerTileType.field,
                },
                {
                    x: rootX,
                    y: rootY + 2,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX - 1,
                    y: rootY + 2,
                    type: PlayerTileType.field,
                },
                {
                    x: rootX - 2,
                    y: rootY + 1,
                    type: PlayerTileType.field,
                },
                {
                    x: rootX - 2,
                    y: rootY,
                    type: PlayerTileType.field,
                },
                {
                    x: rootX - 2,
                    y: rootY - 1,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX - 1,
                    y: rootY - 1,
                    type: PlayerTileType.field,
                },
            ])
            //r3
            fieldNodes.push(...[
                {
                    x: rootX,
                    y: rootY - 3,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX + 3,
                    y: rootY - 1,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX + 3,
                    y: rootY + 2,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX,
                    y: rootY + 3,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX - 3,
                    y: rootY + 2,
                    type: PlayerTileType.border,
                },
                {
                    x: rootX - 3,
                    y: rootY - 1,
                    type: PlayerTileType.border,
                },
            ])
            break;
    }
    return fieldNodes
}