'use client'

import { Navbar } from '@/components/navbar'
import type { BuildWithItems, ComponentCategory } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'
import { ShoppingCart, Trash2, Cpu, Monitor, MemoryStick, HardDrive, CircuitBoard, Loader2, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

const CATEGORY_ICON_MAP: Record<ComponentCategory, LucideIcon> = {
  CPU: Cpu,
  GPU: Monitor,
  RAM: MemoryStick,
  Storage: HardDrive,
  Motherboard: CircuitBoard,
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CartPage() {
  const [actionLoading, setActionLoading] = useState(false)
  const router = useRouter()

  const { data: builds, isLoading, mutate } = useSWR<BuildWithItems[]>('/api/builds', fetcher)

  const draftBuild = builds?.find((b) => b.status === 'draft') || null
  const items = draftBuild?.pc_build_items || []

  const totalPrice = items.reduce(
    (sum, item) => sum + (item.components?.price || 0),
    0,
  )

  const handleRemoveItem = async (itemId: string) => {
    if (!draftBuild) return
    setActionLoading(true)
    try {
      await fetch('/api/builds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove_item',
          item_id: itemId,
          build_id: draftBuild.id,
        }),
      })
      await mutate()
    } finally {
      setActionLoading(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!draftBuild) return
    setActionLoading(true)
    try {
      const res = await fetch('/api/builds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'place_order', build_id: draftBuild.id }),
      })
      if (res.ok) {
        await mutate()
        router.push('/orders')
      }
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 md:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Your Cart</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review your selected components before ordering.</p>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Your cart is empty</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Head over to the builder to start selecting components for your custom PC.
            </p>
            <Button asChild>
              <Link href="/builder">
                Go to Builder
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-6">
            {/* Item list */}
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-card">
              {CATEGORIES.map((category) => {
                const item = items.find((i) => i.components?.category === category)
                if (!item) return null

                const Icon = CATEGORY_ICON_MAP[category]
                const specs = Object.entries(item.components.specs || {}).slice(0, 3)

                return (
                  <div key={item.id} className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-primary">{item.components.brand} - {category}</p>
                      <p className="font-semibold text-card-foreground">{item.components.name}</p>
                      {specs.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {specs.map(([key, val]) => (
                            <span key={key} className="rounded bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">
                              {String(val)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-foreground">${item.components.price.toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={actionLoading}
                        aria-label={`Remove ${item.components.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Order summary */}
            <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Components</span>
                <span className="text-foreground">{items.length} items</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-lg font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-foreground">${totalPrice.toFixed(2)}</span>
              </div>
              <Button
                size="lg"
                className="mt-2 w-full"
                onClick={handlePlaceOrder}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
