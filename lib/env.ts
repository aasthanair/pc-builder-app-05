import { z } from 'zod'

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .min(1, 'is required')
    .url('must be a valid URL (e.g. https://xxxx.supabase.co)'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'is required'),
  NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL: z.string().url().optional(),
})

export type PublicEnv = z.infer<typeof publicEnvSchema>

let cachedPublicEnv: PublicEnv | null = null

export function getPublicEnv(): PublicEnv {
  if (cachedPublicEnv) return cachedPublicEnv

  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://ubobskvurlpfgxoujdao.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVib2Jza3Z1cmxwZmd4b3VqZGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzODQyNTYsImV4cCI6MjA4Nzk2MDI1Nn0.Lm8gkkjQu46TlJdtbyUliQqdHLS1aqi__VhZA6uzAr0',
    NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL:
      process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
      'http://localhost:3000/builder',
  })

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((i) => `${i.path.join('.') || 'env'} ${i.message}`)
      .join('; ')

    throw new Error(
      `Missing/invalid environment variables: ${details}. ` +
        `For local dev, add them to .env.local in the project root. ` +
        `For Vercel, set them in Project Settings → Environment Variables and redeploy.`,
    )
  }

  cachedPublicEnv = parsed.data
  return cachedPublicEnv
}

export function getSupabasePublicConfig() {
  const env = getPublicEnv()
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
}
