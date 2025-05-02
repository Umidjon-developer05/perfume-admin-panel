import type React from "react"
import { getOrderStats } from "@/lib/data/orders"
import { DashboardShell } from "@/components/ui/dashboard-shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { unreadOrders } = await getOrderStats()

  return <DashboardShell unreadOrders={unreadOrders}>{children}</DashboardShell>
}
