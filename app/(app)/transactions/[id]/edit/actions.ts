'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { transactionSchema } from '@/lib/validations'
import { getCurrentUser } from "@/lib/auth/session"

export async function updateExpense(formData: FormData) {
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const id = formData.get('id') as string

    // Verify this transaction actually belongs to the logged-in user
    // BEFORE updating it — never trust the id alone.
    const existing = await prisma.transaction.findUnique({ where: { id } })
    if (!existing || existing.userId !== user.id) {
        throw new Error("Transaction not found.")
    }

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
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const id = formData.get('id') as string;

    // Same ownership check before deleting
    const existing = await prisma.transaction.findUnique({ where: { id } })
    if (!existing || existing.userId !== user.id) {
        throw new Error("Transaction not found.")
    }

    await prisma.transaction.delete({ where: { id } })

    revalidatePath('/transactions')
}