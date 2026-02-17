"use client"

import { Inbox, ShieldCheck, Activity, DollarSign } from "lucide-react"

interface SentinelSidebarProps {
  activeTab: "inbox" | "approved" | "runway"
  onTabChange: (tab: "inbox" | "approved" | "runway") => void
  inboxCount: number
  approvedCount: number
}

export function SentinelSidebar({ activeTab, onTabChange, inboxCount, approvedCount }: SentinelSidebarProps) {
  return (
    <aside className="w-64 border-r border-foreground/15 bg-card flex flex-col shrink-0">
      <div className="px-5 py-5 border-b border-foreground/15">
        <div className="flex items-center gap-2.5">
          <Activity className="h-5 w-5 text-foreground" strokeWidth={2.5} />
          <h1 className="text-lg font-bold tracking-tight text-foreground">SENTINEL</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1 tracking-wide">Subscription Watchdog</p>
      </div>
      <nav className="flex flex-col gap-1 p-3 flex-1">
        <button
          onClick={() => onTabChange("inbox")}
          className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors text-left cursor-pointer ${
            activeTab === "inbox"
              ? "bg-foreground text-background"
              : "text-foreground hover:bg-foreground/5"
          }`}
        >
          <Inbox className="h-4 w-4" />
          Transaction Inbox
          {inboxCount > 0 && (
            <span className={`ml-auto text-xs font-mono px-1.5 py-0.5 ${
              activeTab === "inbox"
                ? "bg-background text-foreground"
                : "bg-foreground/10 text-foreground"
            }`}>
              {inboxCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onTabChange("approved")}
          className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors text-left cursor-pointer ${
            activeTab === "approved"
              ? "bg-foreground text-background"
              : "text-foreground hover:bg-foreground/5"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Approved Subscriptions
          {approvedCount > 0 && (
            <span className={`ml-auto text-xs font-mono px-1.5 py-0.5 ${
              activeTab === "approved"
                ? "bg-background text-foreground"
                : "bg-foreground/10 text-foreground"
            }`}>
              {approvedCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onTabChange("runway")}
          className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors text-left cursor-pointer ${
            activeTab === "runway"
              ? "bg-foreground text-background"
              : "text-foreground hover:bg-foreground/5"
          }`}
        >
          <DollarSign className="h-4 w-4" />
          Monthly Runway
        </button>
      </nav>
      <div className="px-5 py-4 border-t border-foreground/15">
        <p className="text-xs text-muted-foreground">
          All charges land in the Inbox. Nothing is "safe" until you approve it.
        </p>
      </div>
    </aside>
  )
}
