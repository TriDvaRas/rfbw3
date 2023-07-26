import { Content, ContentDLC, PlayerContent } from "@prisma/client";
import { atom } from "jotai";


export const canRollNewContentAtom = atom(true);
export const newContentOpenPopupTileIdAtom = atom<string | null>(null);



export const showContentFullInfoModalAtom = atom(false);
export const contentFullInfoModalContentAtom = atom<(Content) | null>(null);

export const showPlayerContentCompleteModalAtom = atom(false);
export const playerContentCompleteModalContentAtom = atom<(PlayerContent & {
    content: Content & {
        DLCs: ContentDLC[];
    };
}) | null>(null);

export const showPlayerContentDropModalAtom = atom(false);
export const playerContentDropContentAtom = atom<(PlayerContent & {
    content: Content & {
        DLCs: ContentDLC[];
    };
}) | null>(null);
