import { WeightModInvalidateOn, WeightModType } from "@prisma/client";
import Chooser from "random-seed-weighted-chooser";

type RollableContent = {
    id: string;
    baseWeight: number;
    weightMods: {
        type: WeightModType;
        multiplier: number;
        isValid: boolean;
        invalidateAt: Date | null;
        invalidateOn: WeightModInvalidateOn[];
    }[];
}

export function selectWeightedContent(contents: RollableContent[]): RollableContent | null {
    const weights = contents.map(x => x.baseWeight * x.weightMods.filter(x => x.isValid).map(x => x.multiplier).reduce((a, b) => a * b, 1));
    const index = Chooser.chooseWeightedIndex(weights); 
    return index == -1 ? null : contents[index]!
}