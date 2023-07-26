import { prisma } from "../server/db";

export async function incrementPlayerPoints(playerId: string, pointsDelta: number) {
    const res = await prisma.player.update({
        where: {
            id: playerId
        },
        data: {
            points: {
                increment: pointsDelta
            }
        }
    })
}
export async function incrementPlayerMoney(playerId: string, moneyDelta: number) {
    const res = await prisma.player.update({
        where: {
            id: playerId
        },
        data: {
            money: {
                increment: moneyDelta
            }
        }
    })
}
