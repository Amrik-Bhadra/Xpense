import { Smartphone, CreditCard, Banknote, Landmark, Wallet, type LucideIcon } from 'lucide-react';

export const paymentMethodIcons: Record<string, LucideIcon> = {
  UPI: Smartphone,
  Card: CreditCard,
  Cash: Banknote,
  'Bank Transfer': Landmark,
  Other: Wallet,
};

export const paymentMethodColors: Record<string, { bg: string; text: string }> = {
  UPI: { bg: '#e0f2fe', text: '#0369a1' },
  Card: { bg: '#ede9fe', text: '#6d28d9' },
  Cash: { bg: '#dcfce7', text: '#15803d' },
  'Bank Transfer': { bg: '#ccfbf1', text: '#0f766e' },
  Other: { bg: '#f5e0ff', text: '#9333ea' },
};

export const defaultPaymentMethodIcon = Wallet;

export function getPaymentMethodStyle(name: string) {
  return paymentMethodColors[name] ?? { bg: '#f3f4f6', text: '#374151' };
}
