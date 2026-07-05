'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { transactionSchema } from '@/lib/helpers/validations'

export async function updateTransaction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const id = formData.get('id') as string

  const result = transactionSchema.safeParse({
    title: formData.get('title'),
    amount: formData.get('amount'),
    type: formData.get('type'),
    categoryId: formData.get('categoryId'),
    paymentMethodId: formData.get('paymentMethodId'),
    notes: formData.get('notes'),
    transactionDate: formData.get('transactionDate'),
  })

  if (!result.success) {
    throw new Error('Invalid form data')
  }

  const { count } = await prisma.transaction.updateMany({
    where: { id, userId: user.id },
    data: result.data,
  })

  if (count === 0) {
    throw new Error('Transaction not found')
  }

  revalidatePath('/transactions')
  redirect('/transactions')
}

export async function deleteTransaction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const id = formData.get('id') as string

  await prisma.transaction.deleteMany({
    where: { id, userId: user.id },
  })

  revalidatePath('/transactions')
}