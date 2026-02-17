export type BankSource = {
  bank: string
  lastFour: string
}

export type Frequency = "monthly" | "yearly"

export type Transaction = {
  id: string
  merchant: string
  amount: number
  source: BankSource
  date: string
  category?: string
}

export type Subscription = {
  id: string
  merchant: string
  amount: number
  source: BankSource
  frequency: Frequency
  billingDay: number
  notes: string
  approvedAt: string
}

export type IncomeSource = {
  id: string
  merchant: string
  amount: number
  source: BankSource
  frequency: Frequency
}

export type ManualEstimate = {
  id: string
  label: string
  amount: number
}
