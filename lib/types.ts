export type ComponentCategory = 'CPU' | 'GPU' | 'RAM' | 'Storage' | 'Motherboard'

export interface PCComponent {
  id: string
  category: ComponentCategory
  name: string
  brand: string
  price: number
  specs: Record<string, string | number>
  image_url: string | null
  created_at: string
}

export interface PCBuild {
  id: string
  user_id: string
  name: string
  status: 'draft' | 'ordered'
  total_price: number
  created_at: string
  ordered_at: string | null
}

export interface PCBuildItem {
  id: string
  build_id: string
  component_id: string
  quantity: number
  created_at: string
  component?: PCComponent
}

export interface BuildWithItems extends PCBuild {
  pc_build_items: (PCBuildItem & { components: PCComponent })[]
}

export const CATEGORIES: ComponentCategory[] = ['CPU', 'GPU', 'RAM', 'Storage', 'Motherboard']

export const CATEGORY_ICONS: Record<ComponentCategory, string> = {
  CPU: 'Cpu',
  GPU: 'Monitor',
  RAM: 'MemoryStick',
  Storage: 'HardDrive',
  Motherboard: 'CircuitBoard',
}
