import { prisma } from "../server/db";

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