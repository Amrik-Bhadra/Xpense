'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function createExpense(formData: FormData) {
    const title = formData.get("title") as string
    const amount = parseFloat(formData.get("amount") as string)
    const categoryId = formData.get('categoryId') as string
    const notes = formData.get('notes') as string
    
    await prisma.expense.create({
        data:{
            title,
            amount,
            categoryId,
            notes: notes || null
        },
    })

    redirect('/expenses')
}
