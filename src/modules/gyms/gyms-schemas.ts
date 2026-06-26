import z from "zod"

export const createGymBodySchema = z.object({
    title: z.string(),
    descriptions: z.string().nullable().default(null),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    phone: z.string().nullable().default(null)
})

export const searchGymsBodySchema = z.object({
    query: z.string(),
    page: z.coerce.number()
})

export const getNearbyGymsSchema = z.object({
    userLatitude: z.coerce.number(),
    userLongitude: z.coerce.number()
    
})