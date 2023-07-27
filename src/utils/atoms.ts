import { Content, ContentDLC, PlayerContent } from "@prisma/client";
import { atom } from "jotai";


export const canRollNewContentAtom = atom(true);
export const newContentOpenPopupTileIdAtom = atom<string | null>(null);


//* content info modal
export const showContentFullInfoModalAtom = atom(false);
export const contentFullInfoModalContentAtom = atom<(Content) | null>(null);
//* content finish modal
export const showPlayerContentFinishModalAtom = atom(false);
export const playerContentFinishModalContentAtom = atom<(PlayerContent & {
    content: Content & {
        DLCs: ContentDLC[];
    };
}) | null>(null);


