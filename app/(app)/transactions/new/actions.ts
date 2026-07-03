'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { transactionSchema } from "@/lib/validations"

export type ActionState = {
    errors?: Record<string, string[]>
} | undefined

export async function createTransaction(prevState: ActionState, formData: FormData) {
    const result = transactionSchema.safeParse({
        title: formData.get("title") as string,
        amount: parseFloat(formData.get("amount") as string),
        type: formData.get('type'),
        categoryId: formData.get('categoryId') as string,
        notes: formData.get('notes') as string,
    })

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors }
    }

    await prisma.transaction.create({ data: result.data })

    redirect('/transactions')
}
