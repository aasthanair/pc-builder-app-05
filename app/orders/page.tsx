'use client'

import { Navbar } from '@/components/navbar'
import type { BuildWithItems, ComponentCategory } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'
import useSWR from 'swr'
import { Package, Loader2, ArrowRight, Cpu, Monitor, MemoryStick, HardDrive, CircuitBoard } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const CATEGORY_ICON_MAP: Record<ComponentCategory, LucideIcon> = {
  CPU: Cpu,
  GPU: Monitor,
  RAM: MemoryStick,
  Storage: HardDrive,
  Motherboard: CircuitBoard,
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function OrdersPage() {
  const { data: builds, isLoading } = useSWR<BuildWithItems[]>('/api/builds', fetcher)

  const orders = builds?.filter((b) => b.status === 'ordered') || []

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 md:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Your Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">View your placed orders and build history.</p>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">No orders yet</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Once you build a PC and place an order, it will appear here.
            </p>
            <Button asChild>
              <Link href="/builder">
                Start Building
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-6">
            {orders.map((order) => {
              const items = order.pc_build_items || []
              return (
                <div key={order.id} className="rounded-lg border border-border bg-card">
                  {/* Order header */}
                  <div className="flex flex-col gap-2 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-card-foreground">{order.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Ordered on{' '}
                        {order.ordered_at
                          ? new Date(order.ordered_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                        Ordered
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        ${order.total_price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="divide-y divide-border">
                    {CATEGORIES.map((category) => {
                      const item = items.find((i) => i.components?.category === category)
                      if (!item) return null
                      const Icon = CATEGORY_ICON_MAP[category]

                      return (
                        <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-card-foreground">{item.components.name}</p>
                            <p className="text-xs text-muted-foreground">{item.components.brand}</p>
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            ${item.components.price.toFixed(2)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
