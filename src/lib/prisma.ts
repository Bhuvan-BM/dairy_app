import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma =
  global.prisma ||
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: 'file:./dev.db' }),
    log: ['error'],
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export { prisma }
