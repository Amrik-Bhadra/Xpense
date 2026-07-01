'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { expenseSchema } from "@/lib/validations"

export type ActionState = {
    errors?: Record<string, string[]>
} | undefined

export async function createExpense(prevState: ActionState, formData: FormData) {
    const result = expenseSchema.safeParse({
        title: formData.get("title") as string,
        amount: parseFloat(formData.get("amount") as string),
        categoryId: formData.get('categoryId') as string,
        notes: formData.get('notes') as string,
    })

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors }
    }

    await prisma.expense.create({
        data: result.data,
    })

    redirect('/expenses')
}
