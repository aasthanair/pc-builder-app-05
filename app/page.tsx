import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Cpu, Monitor, HardDrive, MemoryStick, CircuitBoard } from 'lucide-react'

const categories = [
  { name: 'CPU', description: 'Processors from AMD and Intel', icon: Cpu },
  { name: 'GPU', description: 'Graphics cards for gaming and rendering', icon: Monitor },
  { name: 'RAM', description: 'High-speed DDR5 memory kits', icon: MemoryStick },
  { name: 'Storage', description: 'NVMe SSDs for blazing fast storage', icon: HardDrive },
  { name: 'Motherboard', description: 'ATX boards for AM5 and LGA 1700', icon: CircuitBoard },
]

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center md:py-32">
          <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-medium text-muted-foreground">Now with DDR5 & PCIe 5.0 components</span>
          </div>
          <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Build Your Dream PC
          </h1>
          <p className="max-w-xl text-pretty text-lg text-muted-foreground leading-relaxed">
            Select premium components, configure your build, and order your custom PC. All from one place.
          </p>
          <div className="flex items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/builder">Start Building</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/sign-up">Create Account</Link>
            </Button>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto w-full max-w-5xl px-4 pb-24 md:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground">Component Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.name}
                  href="/builder"
                  className="group flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-secondary/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
