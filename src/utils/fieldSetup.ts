import { ContentType, PlayerTileType } from "@prisma/client";
import { prisma } from "../server/db";

export function getDefaultPlayerNodes(rootY: number, rootX: number) {
    const nodes: {
        x: number,
        y: number,
        type: PlayerTileType
        contentType?: ContentType,
        hardConnections?: string[],
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
                    contentType: ContentType.anime,
                    hardConnections: [
                        `${rootX - 1},${rootY - 2}`,
                        `${rootX},${rootY - 2}`,
                        `${rootX + 1},${rootY - 2}`,
                    ]
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
                    contentType: ContentType.game,
                    hardConnections: [
                        `${rootX + 2},${rootY}`,
                        `${rootX + 2},${rootY + 1}`,
                        `${rootX + 1},${rootY + 1}`,
                    ]
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
                    contentType: ContentType.movie,
                    hardConnections: [
                        `${rootX - 1},${rootY + 1}`,
                        `${rootX - 2},${rootY + 1}`,
                        `${rootX - 2},${rootY}`,
                    ]
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
                    hardConnections: [`${rootX},${rootY - 1}`],
                },
                {
                    x: rootX + 1,
                    y: rootY - 2,
                    type: PlayerTileType.field,
                    hardConnections: [`${rootX},${rootY - 1}`],
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
                    hardConnections: [`${rootX + 1},${rootY}`],
                },
                {
                    x: rootX + 2,
                    y: rootY + 1,
                    type: PlayerTileType.field,
                    hardConnections: [`${rootX + 1},${rootY}`],
                },
                {
                    x: rootX + 1,
                    y: rootY + 1,
                    type: PlayerTileType.field,
                    hardConnections: [`${rootX + 1},${rootY}`],
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
                    hardConnections: [`${rootX - 1},${rootY}`],
                },
                {
                    x: rootX - 2,
                    y: rootY + 1,
                    type: PlayerTileType.field,
                    hardConnections: [`${rootX - 1},${rootY}`],
                },
                {
                    x: rootX - 2,
                    y: rootY,
                    type: PlayerTileType.field,
                    hardConnections: [`${rootX - 1},${rootY}`],
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
                    hardConnections: [`${rootX},${rootY - 1}`],
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
                    contentType: ContentType.anime,
                    hardConnections: [
                        `${rootX - 1},${rootY - 1}`,
                        `${rootX},${rootY - 2}`,
                        `${rootX + 1},${rootY - 1}`,
                    ]
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
                    contentType: ContentType.game,
                    hardConnections: [
                        `${rootX + 2},${rootY}`,
                        `${rootX + 2},${rootY + 1}`,
                        `${rootX + 1},${rootY + 2}`,
                    ]
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
                    contentType: ContentType.movie,
                    hardConnections: [
                        `${rootX - 1},${rootY + 2}`,
                        `${rootX - 2},${rootY + 1}`,
                        `${rootX - 2},${rootY}`,
                    ]
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
                    hardConnections: [`${rootX},${rootY - 1}`],
                },
                {
                    x: rootX + 1,
                    y: rootY - 1,
                    type: PlayerTileType.field,
                    hardConnections: [`${rootX},${rootY - 1}`],
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
                    hardConnections: [`${rootX + 1},${rootY + 1}`],
                },
                {
                    x: rootX + 2,
                    y: rootY + 1,
                    type: PlayerTileType.field,
                    hardConnections: [`${rootX + 1},${rootY + 1}`],
                },
                {
                    x: rootX + 1,
                    y: rootY + 2,
                    type: PlayerTileType.field,
                    hardConnections: [`${rootX + 1},${rootY + 1}`],
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
                    hardConnections: [`${rootX - 1},${rootY + 1}`],
                },
                {
                    x: rootX - 2,
                    y: rootY + 1,
                    type: PlayerTileType.field,
                    hardConnections: [`${rootX - 1},${rootY + 1}`],
                },
                {
                    x: rootX - 2,
                    y: rootY,
                    type: PlayerTileType.field,
                    hardConnections: [`${rootX - 1},${rootY + 1}`],
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
                    hardConnections: [`${rootX},${rootY - 1}`],
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
        if (node.hardConnections)
            node.hardConnections = node.hardConnections.map(hc => {
                const [x, y] = hc.split(',').map(n => parseInt(n))
                return `${y},${x}`
            })

    })
    return nodes
}