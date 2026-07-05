'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { transactionSchema } from "@/lib/helpers/validations"
import { getCurrentUser } from "@/lib/auth/session"

export type ActionState = {
    errors?: Record<string, string[]>
} | undefined

export async function createTransaction(prevState: ActionState, formData: FormData) {
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const result = transactionSchema.safeParse({
        title: formData.get("title") as string,
        amount: parseFloat(formData.get("amount") as string),
        type: formData.get('type'),
        categoryId: formData.get('categoryId') as string,
        paymentMethodId: formData.get('paymentMethodId') as string,
        notes: formData.get('notes') as string,
        transactionDate: formData.get('transactionDate'),
    })

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors }
    }

    await prisma.transaction.create({
        data: {
            ...result.data,
            userId: user.id,
        },
    })

    redirect('/transactions')
}