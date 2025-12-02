import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const csvData = `fat_percent,sale_rate_rs_per_l
4.0,34.21
4.1,34.50
4.2,34.79
4.3,35.08
4.4,35.37
4.5,35.66
4.6,35.95
4.7,36.24
4.8,36.53
4.9,36.82
5.0,37.11
5.1,37.40
5.2,37.69
5.3,37.98
5.4,38.27
5.5,38.56
5.6,38.85
5.7,39.14
5.8,39.43
5.9,39.72
6.0,40.01
6.1,40.30
6.2,40.59
6.3,40.88
6.4,41.17
6.5,41.46
6.6,41.75
6.7,42.04
6.8,42.33
6.9,42.62
7.0,42.91
7.1,43.20
7.2,43.49
7.3,43.78
7.4,44.07
7.5,44.36
7.6,44.65
7.7,44.94
7.8,45.23
7.9,45.52
8.0,45.81`

async function main() {
    const lines = csvData.split('\n').slice(1) // Skip header

    for (const line of lines) {
        const [fatStr, rateStr] = line.split(',')
        const fat = parseFloat(fatStr)
        const rate = parseFloat(rateStr)

        if (!isNaN(fat) && !isNaN(rate)) {
            await prisma.rateChart.upsert({
                where: { fat },
                update: { rate },
                create: { fat, rate },
            })
            console.log(`Upserted rate for fat ${fat}: ${rate}`)
        }
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
