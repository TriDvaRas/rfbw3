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


//* Truth Gallery Modal
export const showTruthGalleryModalAtom = atom(false);


//* ADMIN
//*
//* content approval
export const showContentApprovalAssistantAtom = atom(false);
export const contentApprovalAssistantNextContentIndexAtom = atom<number | undefined>(undefined);
export const contentApprovalAssistantContentListAtom = atom<Content[]>([]);