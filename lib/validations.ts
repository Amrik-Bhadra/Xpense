import { z } from 'zod'

export const transactionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().min(1, 'Please select a category'),
  notes: z.string().optional(),
})