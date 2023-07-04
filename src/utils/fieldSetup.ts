import { PlayerTileType } from "@prisma/client";
import { prisma } from "../server/db";

export function getDefaultPlayerNodes(rootY: number, rootX: number) {
    const nodes: {
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
            nodes.push(...[
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
            nodes.push(...[
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
            nodes.push(...[
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
            nodes.push(...[
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
            nodes.push(...[

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
            nodes.push(...[
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
    //transpose everything because i'm stupid
    nodes.forEach(node => {
        const x = node.x
        node.x = node.y
        node.y = x
    })
    return nodes
}