"use client"

import { CreditCard, Trash2, Undo2 } from "lucide-react"
import type { Subscription } from "@/lib/types"

interface SubscriptionRowProps {
  subscription: Subscription
  onNotesChange: (id: string, notes: string) => void
  onRemove: (id: string) => void
  onUnapprove: (id: string) => void
}

export function SubscriptionRow({ subscription, onNotesChange, onRemove, onUnapprove }: SubscriptionRowProps) {
  const isYearly = subscription.frequency === "yearly"

  return (
    <tr className={isYearly ? "bg-red-50" : "bg-card"}>
      <td className="border border-foreground/15 px-4 py-3">
        <span className={`font-semibold ${isYearly ? "text-red-900" : "text-foreground"}`}>
          {subscription.merchant}
        </span>
      </td>
      <td className={`border border-foreground/15 px-4 py-3 font-mono text-right ${isYearly ? "text-red-900" : "text-foreground"}`}>
        ${subscription.amount.toFixed(2)}
      </td>
      <td className="border border-foreground/15 px-4 py-3">
        {isYearly ? (
          <span className="inline-block border border-red-400 bg-red-100 text-red-900 text-xs font-bold uppercase px-2 py-0.5 tracking-wide">
            Yearly
          </span>
        ) : (
          <span className="inline-block border border-emerald-400 bg-emerald-50 text-emerald-800 text-xs font-bold uppercase px-2 py-0.5 tracking-wide">
            Monthly
          </span>
        )}
      </td>
      <td className={`border border-foreground/15 px-4 py-3 text-center ${isYearly ? "text-red-900" : "text-foreground"}`}>
        {subscription.billingDay}{getOrdinalSuffix(subscription.billingDay)}
      </td>
      <td className="border border-foreground/15 px-4 py-3">
        <span className={`flex items-center gap-1 text-sm ${isYearly ? "text-red-800" : "text-muted-foreground"}`}>
          <CreditCard className="h-3.5 w-3.5 shrink-0" />
          {subscription.source.bank} {"••"} {subscription.source.lastFour}
        </span>
      </td>
      <td className="border border-foreground/15 px-4 py-3">
        <input
          type="text"
          value={subscription.notes}
          onChange={(e) => onNotesChange(subscription.id, e.target.value)}
          placeholder="Add a note..."
          className={`w-full bg-transparent border-b border-dashed text-sm focus:outline-none focus:border-foreground py-0.5 placeholder:text-muted-foreground/50 ${
            isYearly
              ? "border-red-300 text-red-900"
              : "border-foreground/20 text-foreground"
          }`}
        />
      </td>
      <td className="border border-foreground/15 px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onUnapprove(subscription.id)}
            className="flex items-center gap-1 border border-foreground/20 bg-background text-foreground text-xs font-semibold uppercase tracking-wide px-2.5 py-1 hover:bg-foreground hover:text-background transition-colors cursor-pointer"
            aria-label={`Unapprove ${subscription.merchant}`}
          >
            <Undo2 className="h-3 w-3" />
            Unapprove
          </button>
          <button
            onClick={() => onRemove(subscription.id)}
            className="text-muted-foreground hover:text-red-600 transition-colors cursor-pointer"
            aria-label={`Remove ${subscription.merchant}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th"
  switch (day % 10) {
    case 1: return "st"
    case 2: return "nd"
    case 3: return "rd"
    default: return "th"
  }
}
