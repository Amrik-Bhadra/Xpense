import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/session'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const month = parseInt(searchParams.get('month') ?? '', 10)
  const year = parseInt(searchParams.get('year') ?? '', 10)

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 1)

  const totals = await prisma.transaction.groupBy({
    by: ['categoryId', 'type'],
    where: { userId: user.id, transactionDate: { gte: startDate, lt: endDate } },
    _sum: { amount: true },
  })

  const categories = await prisma.category.findMany()
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  const income = totals
    .filter((t) => t.type === 'INCOME')
    .map((t) => ({ name: categoryMap[t.categoryId] ?? 'Unknown', value: t._sum.amount ?? 0 }))

  const expense = totals
    .filter((t) => t.type === 'EXPENSE')
    .map((t) => ({ name: categoryMap[t.categoryId] ?? 'Unknown', value: t._sum.amount ?? 0 }))

  return NextResponse.json({ income, expense })
}