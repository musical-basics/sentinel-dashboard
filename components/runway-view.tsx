"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, TrendingDown, Plus, X, Repeat, PenLine, CreditCard } from "lucide-react"
import type { Subscription, IncomeSource, ManualEstimate } from "@/lib/types"

interface RunwayViewProps {
  subscriptions: Subscription[]
  incomeSources: IncomeSource[]
  initialEstimates: ManualEstimate[]
}

function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export function RunwayView({ subscriptions, incomeSources, initialEstimates }: RunwayViewProps) {
  const [estimates, setEstimates] = useState<ManualEstimate[]>(initialEstimates)
  const [newLabel, setNewLabel] = useState("")
  const [newAmount, setNewAmount] = useState("")

  // Calculate monthly burn: monthly subs at face value + yearly subs / 12
  const monthlyItems = subscriptions.filter((s) => s.frequency === "monthly")
  const yearlyItems = subscriptions.filter((s) => s.frequency === "yearly")

  const monthlySubsTotal = monthlyItems.reduce((sum, s) => sum + s.amount, 0)
  const yearlyAsMonthly = yearlyItems.reduce((sum, s) => sum + s.amount / 12, 0)
  const totalMonthlyBurn = monthlySubsTotal + yearlyAsMonthly

  // Calculate monthly income
  const recurringIncomeTotal = incomeSources.reduce((sum, s) => sum + s.amount, 0)
  const estimatesTotal = estimates.reduce((sum, e) => sum + e.amount, 0)
  const totalMonthlyIncome = recurringIncomeTotal + estimatesTotal

  // Net cashflow
  const netCashflow = totalMonthlyIncome - totalMonthlyBurn

  const handleAddEstimate = () => {
    const amount = parseFloat(newAmount)
    if (!newLabel.trim() || isNaN(amount) || amount <= 0) return
    setEstimates((prev) => [
      ...prev,
      { id: `est-${Date.now()}`, label: newLabel.trim(), amount },
    ])
    setNewLabel("")
    setNewAmount("")
  }

  const handleRemoveEstimate = (id: string) => {
    setEstimates((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2.5">
          <DollarSign className="h-5 w-5 text-foreground" />
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Monthly Runway
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Full picture of your monthly burn vs. income. Yearly costs are spread across 12 months.
        </p>
      </div>

      {/* Net Cashflow Banner */}
      <div className={`border-2 px-6 py-5 mb-6 ${
        netCashflow >= 0
          ? "border-emerald-600 bg-emerald-50"
          : "border-red-500 bg-red-50"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {netCashflow >= 0 ? (
              <TrendingUp className="h-5 w-5 text-emerald-700" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-700" />
            )}
            <span className={`text-sm font-semibold uppercase tracking-wider ${
              netCashflow >= 0 ? "text-emerald-800" : "text-red-800"
            }`}>
              Net Monthly Cashflow
            </span>
          </div>
          <span className={`text-3xl font-mono font-bold ${
            netCashflow >= 0 ? "text-emerald-900" : "text-red-900"
          }`}>
            {netCashflow >= 0 ? "+" : "-"}${Math.abs(netCashflow).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Two-Column Spreadsheet */}
      <div className="grid grid-cols-2 gap-6">

        {/* LEFT: Monthly Burn */}
        <div className="border border-foreground/15">
          <div className="bg-foreground text-background px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Monthly Burn</span>
            <span className="text-xs font-mono">${totalMonthlyBurn.toFixed(2)}</span>
          </div>

          {/* Monthly Subscriptions */}
          <div className="border-b border-foreground/10">
            <div className="px-4 py-2 bg-foreground/5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Repeat className="h-3 w-3" />
                Monthly Charges
              </span>
            </div>
            {monthlyItems.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">No monthly subscriptions.</div>
            ) : (
              monthlyItems.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between px-4 py-2.5 border-t border-foreground/5">
                  <div>
                    <span className="text-sm font-medium text-foreground">{sub.merchant}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      <CreditCard className="h-3 w-3 inline-block mr-0.5 -translate-y-px" />
                      {sub.source.bank} {"\u2022\u2022"} {sub.source.lastFour}
                    </span>
                  </div>
                  <span className="text-sm font-mono font-semibold text-foreground">${sub.amount.toFixed(2)}</span>
                </div>
              ))
            )}
          </div>

          {/* Yearly (as Monthly) */}
          <div>
            <div className="px-4 py-2 bg-red-50">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                <Repeat className="h-3 w-3" />
                Yearly (Monthly Equivalent)
              </span>
            </div>
            {yearlyItems.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">No yearly subscriptions.</div>
            ) : (
              yearlyItems.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between px-4 py-2.5 border-t border-foreground/5 bg-red-50/50">
                  <div>
                    <span className="text-sm font-medium text-red-800">{sub.merchant}</span>
                    <span className="text-xs text-red-600 ml-2">
                      ${sub.amount.toFixed(2)}/yr {"="} ${(sub.amount / 12).toFixed(2)}/mo
                    </span>
                  </div>
                  <span className="text-sm font-mono font-semibold text-red-800">${(sub.amount / 12).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>

          {/* Burn Total */}
          <div className="border-t-2 border-foreground flex items-center justify-between px-4 py-3 bg-foreground/5">
            <span className="text-sm font-bold text-foreground uppercase tracking-wide">Total Monthly Burn</span>
            <span className="text-lg font-mono font-bold text-foreground">${totalMonthlyBurn.toFixed(2)}</span>
          </div>
        </div>

        {/* RIGHT: Monthly Income */}
        <div className="border border-foreground/15">
          <div className="bg-foreground text-background px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Monthly Income</span>
            <span className="text-xs font-mono">${totalMonthlyIncome.toFixed(2)}</span>
          </div>

          {/* Recurring Income */}
          <div className="border-b border-foreground/10">
            <div className="px-4 py-2 bg-foreground/5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Repeat className="h-3 w-3" />
                Recurring Income
              </span>
            </div>
            {incomeSources.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">No recurring income sources.</div>
            ) : (
              incomeSources.map((inc) => (
                <div key={inc.id} className="flex items-center justify-between px-4 py-2.5 border-t border-foreground/5">
                  <div>
                    <span className="text-sm font-medium text-foreground">{inc.merchant}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      <CreditCard className="h-3 w-3 inline-block mr-0.5 -translate-y-px" />
                      {inc.source.bank} {"\u2022\u2022"} {inc.source.lastFour}
                    </span>
                  </div>
                  <span className="text-sm font-mono font-semibold text-emerald-700">${inc.amount.toFixed(2)}</span>
                </div>
              ))
            )}
          </div>

          {/* Manual Estimates */}
          <div>
            <div className="px-4 py-2 bg-foreground/5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <PenLine className="h-3 w-3" />
                Manual Estimates
              </span>
            </div>
            {estimates.map((est) => (
              <div key={est.id} className="flex items-center justify-between px-4 py-2.5 border-t border-foreground/5">
                <span className="text-sm font-medium text-foreground">{est.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-semibold text-emerald-700">${est.amount.toFixed(2)}</span>
                  <button
                    onClick={() => handleRemoveEstimate(est.id)}
                    className="text-muted-foreground hover:text-red-600 transition-colors cursor-pointer"
                    aria-label={`Remove ${est.label}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {/* Add Row */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-t border-dashed border-foreground/10">
              <input
                type="text"
                placeholder="Label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="flex-1 text-sm bg-transparent border-b border-foreground/15 py-1 px-1 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground"
              />
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddEstimate()}
                  className="w-20 text-sm font-mono bg-transparent border-b border-foreground/15 py-1 px-1 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground text-right"
                />
              </div>
              <button
                onClick={handleAddEstimate}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Add estimate"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Income Total */}
          <div className="border-t-2 border-foreground flex items-center justify-between px-4 py-3 bg-foreground/5">
            <span className="text-sm font-bold text-foreground uppercase tracking-wide">Total Monthly Income</span>
            <span className="text-lg font-mono font-bold text-emerald-700">${totalMonthlyIncome.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
