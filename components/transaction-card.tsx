"use client"

import { CheckCircle, CreditCard, Calendar } from "lucide-react"
import type { Transaction } from "@/lib/types"

interface TransactionCardProps {
  transaction: Transaction
  onApprove: (id: string) => void
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${months[month - 1]} ${day}, ${year}`
}

export function TransactionCard({ transaction, onApprove }: TransactionCardProps) {
  return (
    <div className="border border-foreground/15 bg-card p-4 flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-foreground truncate">
            {transaction.merchant}
          </span>
          {transaction.category && (
            <span className="text-xs text-muted-foreground border border-foreground/10 px-1.5 py-0.5 shrink-0">
              {transaction.category}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <CreditCard className="h-3.5 w-3.5" />
            {transaction.source.bank} {"••"} {transaction.source.lastFour}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(transaction.date)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-lg font-mono font-semibold text-foreground">
          ${transaction.amount.toFixed(2)}
        </span>
        <button
          onClick={() => onApprove(transaction.id)}
          className="flex items-center gap-1.5 border border-foreground/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer"
        >
          <CheckCircle className="h-4 w-4" />
          Approve
        </button>
      </div>
    </div>
  )
}
