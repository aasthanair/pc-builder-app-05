'use client'
// test
import { Navbar } from '@/components/navbar'
import { ComponentCard } from '@/components/component-card'
import { BuildSummary } from '@/components/build-summary'
import type { PCComponent, BuildWithItems, ComponentCategory } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { cn } from '@/lib/utils'
import { Cpu, Monitor, MemoryStick, HardDrive, CircuitBoard, Loader2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const CATEGORY_ICON_MAP: Record<ComponentCategory, LucideIcon> = {
  CPU: Cpu,
  GPU: Monitor,
  RAM: MemoryStick,
  Storage: HardDrive,
  Motherboard: CircuitBoard,
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function BuilderPage() {
  const [activeCategory, setActiveCategory] = useState<ComponentCategory>('CPU')
  const [actionLoading, setActionLoading] = useState(false)
  const router = useRouter()

  const { data: components, isLoading: componentsLoading } = useSWR<PCComponent[]>(
    '/api/components',
    fetcher,
  )

  const { data: builds, mutate: mutateBuilds } = useSWR<BuildWithItems[]>(
    '/api/builds',
    fetcher,
  )

  const draftBuild = builds?.find((b) => b.status === 'draft') || null

  const selectedComponentIds = new Set(
    draftBuild?.pc_build_items?.map((item) => item.component_id) || [],
  )

  const filteredComponents = components?.filter((c) => c.category === activeCategory) || []

  const handleSelectComponent = useCallback(
    async (component: PCComponent) => {
      setActionLoading(true)
      try {
        const res = await fetch('/api/builds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'add_item', component_id: component.id }),
        })
        if (res.ok) {
          await mutateBuilds()
        }
      } finally {
        setActionLoading(false)
      }
    },
    [mutateBuilds],
  )

  const handleRemoveItem = useCallback(
    async (itemId: string) => {
      if (!draftBuild) return
      setActionLoading(true)
      try {
        const res = await fetch('/api/builds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'remove_item',
            item_id: itemId,
            build_id: draftBuild.id,
          }),
        })
        if (res.ok) {
          await mutateBuilds()
        }
      } finally {
        setActionLoading(false)
      }
    },
    [draftBuild, mutateBuilds],
  )

  const handlePlaceOrder = useCallback(async () => {
    if (!draftBuild) return
    setActionLoading(true)
    try {
      const res = await fetch('/api/builds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'place_order', build_id: draftBuild.id }),
      })
      if (res.ok) {
        await mutateBuilds()
        router.push('/orders')
      }
    } finally {
      setActionLoading(false)
    }
  }, [draftBuild, mutateBuilds, router])

  // Check what component of the active category is selected
  const selectedInCategory = draftBuild?.pc_build_items?.find(
    (item) => item.components?.category === activeCategory,
  )

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 lg:flex-row">
        {/* Left: Component browser */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">PC Builder</h1>
          <p className="mt-1 text-sm text-muted-foreground">Select one component per category to complete your build.</p>

          {/* Category tabs */}
          <div className="mt-6 flex gap-1 overflow-x-auto rounded-lg border border-border bg-secondary/50 p-1">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICON_MAP[cat]
              const hasSelection = draftBuild?.pc_build_items?.some(
                (item) => item.components?.category === cat,
              )
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    activeCategory === cat
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {cat}
                  {hasSelection && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Component grid */}
          <div className="mt-4">
            {componentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredComponents.map((component) => (
                  <ComponentCard
                    key={component.id}
                    component={component}
                    isSelected={
                      selectedComponentIds.has(component.id) ||
                      selectedInCategory?.component_id === component.id
                    }
                    onSelect={handleSelectComponent}
                    isLoading={actionLoading}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Build summary sidebar */}
        <aside className="w-full shrink-0 lg:w-80">
          <div className="sticky top-20">
            <BuildSummary
              build={draftBuild}
              onRemoveItem={handleRemoveItem}
              onPlaceOrder={handlePlaceOrder}
              isLoading={actionLoading}
            />
          </div>
        </aside>
      </main>
    </div>
  )
}
