'use client'

import type { BuildWithItems, ComponentCategory } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { X, ShoppingCart, Cpu, Monitor, MemoryStick, HardDrive, CircuitBoard } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const CATEGORY_ICON_MAP: Record<ComponentCategory, LucideIcon> = {
  CPU: Cpu,
  GPU: Monitor,
  RAM: MemoryStick,
  Storage: HardDrive,
  Motherboard: CircuitBoard,
}

interface BuildSummaryProps {
  build: BuildWithItems | null
  onRemoveItem: (itemId: string) => void
  onPlaceOrder: () => void
  isLoading: boolean
}

export function BuildSummary({ build, onRemoveItem, onPlaceOrder, isLoading }: BuildSummaryProps) {
  const items = build?.pc_build_items || []

  const getItemForCategory = (category: ComponentCategory) => {
    return items.find((item) => item.components?.category === category)
  }

  const totalPrice = items.reduce(
    (sum, item) => sum + (item.components?.price || 0),
    0,
  )

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-bold text-card-foreground">Your Build</h2>
        <p className="text-sm text-muted-foreground">
          {items.length} of {CATEGORIES.length} components selected
        </p>
      </div>

      <div className="flex flex-1 flex-col divide-y divide-border">
        {CATEGORIES.map((category) => {
          const item = getItemForCategory(category)
          const Icon = CATEGORY_ICON_MAP[category]

          return (
            <div key={category} className="flex items-center gap-3 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                <Icon className="h-4 w-4" />
              </div>
              {item ? (
                <div className="flex flex-1 items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-card-foreground">
                      {item.components.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.components.brand}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      ${item.components.price.toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveItem(item.id)}
                      disabled={isLoading}
                      aria-label={`Remove ${item.components.name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">No {category} selected</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="border-t border-border p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total</span>
          <span className="text-xl font-bold text-foreground">${totalPrice.toFixed(2)}</span>
        </div>
        <Button
          className="w-full"
          size="lg"
          disabled={items.length === 0 || isLoading}
          onClick={onPlaceOrder}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isLoading ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </div>
  )
}
