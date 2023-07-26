import _ from "lodash";
import { prisma } from "../server/db";
import { EntropyReason } from "@prisma/client";

export async function getGameEntropy() {
    const entropies = await prisma.entropy.findMany({
        select: {
            entropy: true,
        },
    });
    return entropies.reduce((accumulator, entropy) => accumulator + entropy.entropy, 0);
}

export async function getSelfContentMultiplier() {
    const entropy = await getGameEntropy();
    return entropy > 500 ? 1 - 2800 / (entropy + 2300) : 0;
}
export async function getMoneyGainMultiplier() {
    const entropy = await getGameEntropy();
    if (entropy < 10) return _.random(7, 12);
    if (entropy < 100) return _.random(7, 12);
    if (entropy < 500) return _.random(5, 20);
    if (entropy < 1500) return _.random(0, 32);
    return _.random(-12, 48);
}
export async function getEntropyGainMultiplier() {
    const entropy = await getGameEntropy();
    if (entropy < 250) return _.random(1, 2.3);
    if (entropy < 500) return _.random(1.75, 3);
    if (entropy < 1500) return _.random(3, 5.5);
    return _.random(-7, 10);
}

export async function addNewEntropy(entropy: number, sourcePlayerId: string, reason: EntropyReason) {
    await prisma.entropy.create({
        data: {
            entropy,
            reason,
            sourcePlayer:{
                connect:{
                    id: sourcePlayerId
                }
            }
        }
    })
}