'use client'

import type { PCComponent } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComponentCardProps {
  component: PCComponent
  isSelected: boolean
  onSelect: (component: PCComponent) => void
  isLoading: boolean
}

export function ComponentCard({ component, isSelected, onSelect, isLoading }: ComponentCardProps) {
  const specEntries = Object.entries(component.specs || {}).slice(0, 4)

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-lg border p-4 transition-all',
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border bg-card hover:border-primary/30'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-xs font-medium text-primary">{component.brand}</p>
          <h3 className="mt-0.5 font-semibold text-card-foreground leading-snug">{component.name}</h3>
        </div>
        <p className="shrink-0 text-lg font-bold text-foreground">${component.price.toFixed(2)}</p>
      </div>

      {specEntries.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {specEntries.map(([key, value]) => (
            <span
              key={key}
              className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
            >
              {String(value)}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Button
          size="sm"
          variant={isSelected ? 'default' : 'outline'}
          className="w-full"
          onClick={() => onSelect(component)}
          disabled={isLoading || isSelected}
        >
          {isSelected ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5" />
              Selected
            </>
          ) : (
            <>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add to Build
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
