import { z } from 'zod'

export const transactionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().min(1, 'Please select a category'),
  paymentMethodId: z.string().min(1, 'Please select a payment method'),
  notes: z.string().optional(),
  transactionDate: z.coerce
    .date()
    .refine(
      (d) => {
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        return d.getTime() <= endOfToday.getTime();
      },
      { message: "Date cannot be in the future" }
    ),
})