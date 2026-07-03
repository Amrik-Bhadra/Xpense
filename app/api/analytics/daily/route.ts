import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const month = parseInt(searchParams.get('month') ?? '', 10)
  const year = parseInt(searchParams.get('year') ?? '', 10)

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 1) // first day of NEXT month — exclusive upper bound

  const transactions = await prisma.transaction.findMany({
    where: { createdAt: { gte: startDate, lt: endDate } },
    select: { amount: true, type: true, createdAt: true },
  })

  const daysInMonth = new Date(year, month, 0).getDate()
  const data = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    income: 0,
    expense: 0,
  }))

  for (const txn of transactions) {
    const day = txn.createdAt.getDate()
    if (txn.type === 'INCOME') data[day - 1].income += txn.amount
    else data[day - 1].expense += txn.amount
  }

  return NextResponse.json(data)
}