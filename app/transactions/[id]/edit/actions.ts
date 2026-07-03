'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { transactionSchema } from '@/lib/validations'

export async function updateExpense(formData: FormData) {
    const id = formData.get('id') as string
    const result = transactionSchema.safeParse({
        title: formData.get('title'),
        amount: formData.get('amount'),
        type: formData.get('type'),
        categoryId: formData.get('categoryId'),
        notes: formData.get('notes'),
    })

    if (!result.success) {
        throw new Error('Invalid form data')
    }

    await prisma.transaction.update({
        where: { id },
        data: result.data,
    })

    revalidatePath('/transactions')
    redirect('/transactions')
}

export async function deleteTransaction(formData: FormData) {
    const id = formData.get('id') as string;

    await prisma.transaction.delete({ where: { id } })

    revalidatePath('/transactions')
}