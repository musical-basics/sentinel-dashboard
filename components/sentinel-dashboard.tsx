"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Inbox, AlertTriangle, DollarSign, ShieldCheck } from "lucide-react"
import { SentinelSidebar } from "./sentinel-sidebar"
import { TransactionCard } from "./transaction-card"
import { SubscriptionRow } from "./subscription-row"
import { RunwayView } from "./runway-view"
import { mockSubscriptions, mockIncomeSources, mockManualEstimates } from "@/lib/mock-data"
import type { Transaction, Subscription } from "@/lib/types"

export function SentinelDashboard() {
  const [activeTab, setActiveTab] = useState<"inbox" | "approved" | "runway">("inbox")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions)
  const [isSyncing, setIsSyncing] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const syncBankData = useCallback(async () => {
    setIsSyncing(true)
    try {
      const res = await fetch('/api/simplefin')
      if (res.ok) {
        const data = await res.json()
        setTransactions(data.transactions)
      }
    } catch (e) {
      console.error('SimpleFIN sync failed:', e)
    } finally {
      setIsSyncing(false)
      setHasLoaded(true)
    }
  }, [])

  useEffect(() => {
    syncBankData()
  }, [syncBankData])

  const handleApprove = (id: string) => {
    const txn = transactions.find((t) => t.id === id)
    if (!txn) return

    const billingDay = new Date(txn.date).getDate()
    const isYearly = txn.amount >= 100

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      merchant: txn.merchant,
      amount: txn.amount,
      source: txn.source,
      frequency: isYearly ? "yearly" : "monthly",
      billingDay,
      notes: "",
      approvedAt: new Date().toISOString().split("T")[0],
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id))
    setSubscriptions((prev) => [...prev, newSub])
  }

  const handleNotesChange = (id: string, notes: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, notes } : s))
    )
  }

  const handleUnapprove = (id: string) => {
    const sub = subscriptions.find((s) => s.id === id)
    if (!sub) return

    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      merchant: sub.merchant,
      amount: sub.amount,
      source: sub.source,
      date: sub.approvedAt,
    }

    setSubscriptions((prev) => prev.filter((s) => s.id !== id))
    setTransactions((prev) => [...prev, newTxn])
  }

  const handleRemove = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id))
  }

  const monthlyTotal = useMemo(() => {
    return subscriptions
      .filter((s) => s.frequency === "monthly")
      .reduce((sum, s) => sum + s.amount, 0)
  }, [subscriptions])

  const yearlyTotal = useMemo(() => {
    return subscriptions
      .filter((s) => s.frequency === "yearly")
      .reduce((sum, s) => sum + s.amount, 0)
  }, [subscriptions])

  const yearlyCount = useMemo(
    () => subscriptions.filter((s) => s.frequency === "yearly").length,
    [subscriptions]
  )

  return (
    <div className="flex h-screen bg-background">
      <SentinelSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        inboxCount={transactions.length}
        approvedCount={subscriptions.length}
        onSync={syncBankData}
        isSyncing={isSyncing}
      />

      <main className="flex-1 overflow-y-auto">
        {activeTab === "inbox" && (
          <InboxView transactions={transactions} onApprove={handleApprove} />
        )}
        {activeTab === "approved" && (
          <ApprovedView
            subscriptions={subscriptions}
            onNotesChange={handleNotesChange}
            onRemove={handleRemove}
            onUnapprove={handleUnapprove}
            monthlyTotal={monthlyTotal}
            yearlyTotal={yearlyTotal}
            yearlyCount={yearlyCount}
          />
        )}
        {activeTab === "runway" && (
          <RunwayView
            subscriptions={subscriptions}
            incomeSources={mockIncomeSources}
            initialEstimates={mockManualEstimates}
          />
        )}
      </main>
    </div>
  )
}

function InboxView({
  transactions,
  onApprove,
}: {
  transactions: Transaction[]
  onApprove: (id: string) => void
}) {
  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2.5">
          <Inbox className="h-5 w-5 text-foreground" />
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Transaction Inbox
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {transactions.length} unreviewed charge{transactions.length !== 1 ? "s" : ""}. Review and approve recurring subscriptions.
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="border border-foreground/15 p-12 text-center">
          <ShieldCheck className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-foreground font-semibold">Inbox clear</p>
          <p className="text-sm text-muted-foreground mt-1">
            All transactions have been reviewed.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {transactions.map((txn) => (
            <TransactionCard
              key={txn.id}
              transaction={txn}
              onApprove={onApprove}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ApprovedView({
  subscriptions,
  onNotesChange,
  onRemove,
  onUnapprove,
  monthlyTotal,
  yearlyTotal,
  yearlyCount,
}: {
  subscriptions: Subscription[]
  onNotesChange: (id: string, notes: string) => void
  onRemove: (id: string) => void
  onUnapprove: (id: string) => void
  monthlyTotal: number
  yearlyTotal: number
  yearlyCount: number
}) {
  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-foreground" />
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Approved Subscriptions
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {subscriptions.length} active subscription{subscriptions.length !== 1 ? "s" : ""} across all accounts.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border border-foreground/15 px-4 py-3 bg-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <DollarSign className="h-3.5 w-3.5" />
            Monthly Burn
          </div>
          <p className="text-2xl font-mono font-bold text-foreground">
            ${monthlyTotal.toFixed(2)}
          </p>
        </div>
        <div className="border border-foreground/15 px-4 py-3 bg-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <DollarSign className="h-3.5 w-3.5" />
            Yearly Commitments
          </div>
          <p className="text-2xl font-mono font-bold text-foreground">
            ${yearlyTotal.toFixed(2)}
          </p>
        </div>
        {yearlyCount > 0 && (
          <div className="border border-red-400 bg-red-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-red-800 mb-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              Yearly Danger Zone
            </div>
            <p className="text-2xl font-mono font-bold text-red-900">
              {yearlyCount} item{yearlyCount !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {subscriptions.length === 0 ? (
        <div className="border border-foreground/15 p-12 text-center">
          <Inbox className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-foreground font-semibold">No approved subscriptions</p>
          <p className="text-sm text-muted-foreground mt-1">
            Approve transactions from the Inbox to see them here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-foreground text-background">
                <th className="border border-foreground/15 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider">
                  Merchant
                </th>
                <th className="border border-foreground/15 px-4 py-2.5 text-right text-xs font-bold uppercase tracking-wider">
                  Amount
                </th>
                <th className="border border-foreground/15 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider">
                  Frequency
                </th>
                <th className="border border-foreground/15 px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider">
                  Billing Day
                </th>
                <th className="border border-foreground/15 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider">
                  Source
                </th>
                <th className="border border-foreground/15 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider">
                  Notes
                </th>
                <th className="border border-foreground/15 px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider w-16">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <SubscriptionRow
                  key={sub.id}
                  subscription={sub}
                  onNotesChange={onNotesChange}
                  onRemove={onRemove}
                  onUnapprove={onUnapprove}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
