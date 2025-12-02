"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Farmer Actions
export async function createFarmer(data: {
    code: string
    name: string
    phone: string
    address: string
}) {
    try {
        const farmer = await prisma.farmer.create({
            data,
        })
        revalidatePath("/farmers")
        return { success: true, farmer }
    } catch (error) {
        return { success: false, error: "Failed to create farmer" }
    }
}

export async function getFarmers() {
    return await prisma.farmer.findMany({
        orderBy: { code: "asc" },
    })
}

export async function updateFarmer(
    id: number,
    data: {
        code?: string
        name?: string
        phone?: string
        address?: string
    }
) {
    try {
        const farmer = await prisma.farmer.update({
            where: { id },
            data,
        })
        revalidatePath("/farmers")
        return { success: true, farmer }
    } catch (error) {
        return { success: false, error: "Failed to update farmer" }
    }
}

// Rate Chart Actions
export async function updateRate(data: {
    fat: number
    rate: number
}) {
    try {
        const rateChart = await prisma.rateChart.upsert({
            where: {
                fat: data.fat,
            },
            update: { rate: data.rate },
            create: data,
        })
        revalidatePath("/rates")
        return { success: true, rateChart }
    } catch (error) {
        return { success: false, error: "Failed to update rate" }
    }
}

export async function getRates() {
    return await prisma.rateChart.findMany({
        orderBy: { fat: "asc" },
    })
}

export async function getRate(fat: number) {
    // Round to 1 decimal place to handle floating-point precision
    const roundedFat = Math.round(fat * 10) / 10
    return await prisma.rateChart.findUnique({
        where: {
            fat: roundedFat,
        },
    })
}

// Collection Actions
export async function addCollection(data: {
    farmerId: number
    date: Date
    shift: string
    fat: number
    quantity: number
    rate: number
}) {
    try {
        const amount = data.quantity * data.rate
        const collection = await prisma.collection.create({
            data: {
                ...data,
                amount,
            },
        })
        revalidatePath("/collection")
        revalidatePath("/")
        return { success: true, collection }
    } catch (error) {
        return { success: false, error: "Failed to add collection" }
    }
}

export async function getCollections(date?: Date) {
    const where = date
        ? {
            date: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lt: new Date(date.setHours(23, 59, 59, 999)),
            },
        }
        : {}

    return await prisma.collection.findMany({
        where,
        include: {
            farmer: true,
        },
        orderBy: { createdAt: "desc" },
    })
}

export async function getDailySummary(date: Date) {
    const collections = await getCollections(date)

    const totalQuantity = collections.reduce((sum, c) => sum + c.quantity, 0)
    const totalAmount = collections.reduce((sum, c) => sum + c.amount, 0)

    return {
        date,
        totalCollections: collections.length,
        totalQuantity,
        totalAmount,
        collections,
    }
}

export async function getFarmerBill(farmerId: number, startDate: Date, endDate: Date) {
    const collections = await prisma.collection.findMany({
        where: {
            farmerId,
            date: {
                gte: new Date(startDate.setHours(0, 0, 0, 0)),
                lte: new Date(endDate.setHours(23, 59, 59, 999)),
            },
        },
        orderBy: { date: "asc" },
    })

    const totalQuantity = collections.reduce((sum, c) => sum + c.quantity, 0)
    const totalAmount = collections.reduce((sum, c) => sum + c.amount, 0)

    return {
        totalQuantity,
        totalAmount,
        collections,
    }
}
