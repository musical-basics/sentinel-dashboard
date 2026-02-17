import type { Transaction, Subscription, IncomeSource, ManualEstimate } from "./types"

export const mockTransactions: Transaction[] = [
  {
    id: "txn-1",
    merchant: "Netflix",
    amount: 15.99,
    source: { bank: "Chase", lastFour: "1234" },
    date: "2026-02-01",
    category: "Entertainment",
  },
  {
    id: "txn-2",
    merchant: "Spotify",
    amount: 10.99,
    source: { bank: "Chase", lastFour: "1234" },
    date: "2026-02-03",
    category: "Entertainment",
  },
  {
    id: "txn-3",
    merchant: "iCloud+",
    amount: 2.99,
    source: { bank: "Amex", lastFour: "9876" },
    date: "2026-02-05",
    category: "Cloud Storage",
  },
  {
    id: "txn-4",
    merchant: "Adobe Creative Cloud",
    amount: 659.88,
    source: { bank: "Amex", lastFour: "9876" },
    date: "2026-01-15",
    category: "Software",
  },
  {
    id: "txn-5",
    merchant: "ChatGPT Plus",
    amount: 20.0,
    source: { bank: "Chase", lastFour: "1234" },
    date: "2026-02-10",
    category: "AI Tools",
  },
  {
    id: "txn-6",
    merchant: "Wise",
    amount: 9.0,
    source: { bank: "Wise", lastFour: "5522" },
    date: "2026-02-12",
    category: "Financial Services",
  },
  {
    id: "txn-7",
    merchant: "GitHub Pro",
    amount: 4.0,
    source: { bank: "Chase", lastFour: "1234" },
    date: "2026-02-08",
    category: "Developer Tools",
  },
  {
    id: "txn-8",
    merchant: "New York Times",
    amount: 260.0,
    source: { bank: "Amex", lastFour: "9876" },
    date: "2026-01-20",
    category: "News",
  },
]

export const mockSubscriptions: Subscription[] = [
  {
    id: "sub-1",
    merchant: "Google One",
    amount: 2.99,
    source: { bank: "Chase", lastFour: "1234" },
    frequency: "monthly",
    billingDay: 1,
    notes: "",
    approvedAt: "2026-01-10",
  },
  {
    id: "sub-2",
    merchant: "1Password",
    amount: 35.88,
    source: { bank: "Amex", lastFour: "9876" },
    frequency: "yearly",
    billingDay: 22,
    notes: "Shared with family",
    approvedAt: "2025-12-22",
  },
  {
    id: "sub-3",
    merchant: "Notion",
    amount: 10.0,
    source: { bank: "Wise", lastFour: "5522" },
    frequency: "monthly",
    billingDay: 5,
    notes: "Work use only",
    approvedAt: "2026-01-05",
  },
  {
    id: "sub-4",
    merchant: "Mortgage — Wells Fargo",
    amount: 2700.0,
    source: { bank: "Chase", lastFour: "1234" },
    frequency: "monthly",
    billingDay: 1,
    notes: "30-yr fixed",
    approvedAt: "2025-06-01",
  },
  {
    id: "sub-5",
    merchant: "Amazon Prime",
    amount: 139.0,
    source: { bank: "Amex", lastFour: "9876" },
    frequency: "yearly",
    billingDay: 15,
    notes: "",
    approvedAt: "2025-09-15",
  },
]

export const mockIncomeSources: IncomeSource[] = [
  {
    id: "inc-1",
    merchant: "Salary — Acme Corp",
    amount: 6200.0,
    source: { bank: "Chase", lastFour: "1234" },
    frequency: "monthly",
  },
  {
    id: "inc-2",
    merchant: "Side Project Revenue",
    amount: 480.0,
    source: { bank: "Wise", lastFour: "5522" },
    frequency: "monthly",
  },
]

export const mockManualEstimates: ManualEstimate[] = [
  {
    id: "est-1",
    label: "Freelance Estimate",
    amount: 2000,
  },
]
