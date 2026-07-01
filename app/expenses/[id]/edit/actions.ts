'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function updateExpense(formData: FormData) {
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const amount = parseFloat(formData.get('amount') as string)
    const categoryId = formData.get('categoryId') as string
    const notes = formData.get('notes') as string

    await prisma.expense.update({
        where: { id },
        data: { title, amount, categoryId, notes: notes || null },
    });

    revalidatePath('/expenses')
    redirect('/expenses')
}

export async function deleteExpense(formData: FormData) {
    const id = formData.get('id') as string;

    await prisma.expense.delete({ where: { id } })

    revalidatePath('/expenses')
}