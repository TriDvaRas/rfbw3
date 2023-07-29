import { z } from "zod"

export const shopItemFormSchema = z.object({
    defaultStock: z.coerce.number().positive(),
    stockRefreshRule: z.enum(['never', 'days1', 'days3', 'days7', 'days14']),
    stockOwnerRule: z.enum(['shared', 'perPlayer']),
    price: z.coerce.number().min(1),
    label: z.string().min(1),
    description: z.string().min(1),
    imageUrl: z.string().min(1),
})
export type ShopItemFormSchema = z.infer<typeof shopItemFormSchema>

export const truthFormSchema = z.object({
    id: z.coerce.number().min(1),
    label: z.string().min(1),
    truth: z.string().min(1),
    lockedById: z.coerce.number().nullable(),
    category: z.enum(['entropy','items','events','effects','mechanics','random']),
    rarity: z.enum(['N','R','SR','SSR','UR']),
})
export type TruthFormSchema = z.infer<typeof truthFormSchema>


