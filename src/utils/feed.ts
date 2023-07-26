import { Content, Player, PlayerContent, PlayerContentStatus, PrismaClient, } from "@prisma/client";
import { TRPCClientError } from '@trpc/client';

export async function submitContentFinishFeed(prisma: PrismaClient, params: {
    playerId: string,
    contentId: string,
    status: Omit<PlayerContentStatus, 'inProgress'>,
    pointsDelta?: number
    moneyDelta?: number
    player?: Player
    content?: Content
}) {
    const { playerId, contentId, status } = params
    const player = params.player ?? await prisma.player.findUnique({
        where: {
            id: playerId
        }
    })
    const content = params.content ?? await prisma.content.findUnique({
        where: {
            id: contentId
        }
    })
    switch (status) {
        case 'completed':
            return prisma.event.create({
                data: {
                    type: 'contentFinished',
                    altText: `${player?.name} завершил контент ${content?.label}`,
                    pointsDelta: params.pointsDelta,
                    moneyDelta: params.moneyDelta,
                    sourcePlayerId: playerId,
                    targetContentId: contentId,
                }
            })
        case 'dropped':
            return prisma.event.create({
                data: {
                    type: 'contentDropped',
                    altText: `${player?.name} дропнул контент ${content?.label}`,
                    pointsDelta: params.pointsDelta,
                    moneyDelta: params.moneyDelta,
                    sourcePlayerId: playerId,
                    targetContentId: contentId,
                }
            })
        case 'rerolled':
            return prisma.event.create({
                data: {
                    type: 'contentRerolled',
                    altText: `${player?.name} реролльнул контент ${content?.label}`,
                    pointsDelta: params.pointsDelta,
                    moneyDelta: params.moneyDelta,
                    sourcePlayerId: playerId,
                    targetContentId: contentId,
                }
            })
        default:
            return prisma.event.create({
                data: {
                    type: 'invalidEvent',
                    altText: `Неверный тип события submitContentFinishFeed:${status}`,
                    pointsDelta: params.pointsDelta,
                    moneyDelta: params.moneyDelta,
                    sourcePlayerId: playerId,
                    targetContentId: contentId,
                }
            })
    }
}
export async function submitContentRollResultFeed(prisma: PrismaClient, params: {
    playerId: string,
    contentId: string,
    player?: Player
    content?: Content
}) {
    const { playerId, contentId } = params
    const player = params.player ?? await prisma.player.findUnique({
        where: {
            id: playerId
        }
    })
    const content = params.content ?? await prisma.content.findUnique({
        where: {
            id: contentId
        }
    })
    return prisma.event.create({
        data: {
            type: 'contentRolled',
            altText: `${player?.name} получил контент ${content?.label}`,
            sourcePlayerId: playerId,
            targetContentId: contentId,
        }
    })
}

