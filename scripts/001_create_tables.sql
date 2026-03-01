-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Create components table
create table if not exists public.components (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('CPU', 'GPU', 'RAM', 'Storage', 'Motherboard')),
  price numeric(10, 2) not null,
  socket_type text,
  created_at timestamptz default now()
);

alter table public.components enable row level security;

-- Components are readable by everyone (including anonymous)
create policy "components_select_all" on public.components for select using (true);

-- Create pc_builds table
create table if not exists public.pc_builds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total_price numeric(10, 2) not null,
  created_at timestamptz default now()
);

alter table public.pc_builds enable row level security;

create policy "builds_select_own" on public.pc_builds for select using (auth.uid() = user_id);
create policy "builds_insert_own" on public.pc_builds for insert with check (auth.uid() = user_id);
create policy "builds_delete_own" on public.pc_builds for delete using (auth.uid() = user_id);

-- Create pc_build_items table
create table if not exists public.pc_build_items (
  id uuid primary key default gen_random_uuid(),
  build_id uuid not null references public.pc_builds(id) on delete cascade,
  component_id uuid not null references public.components(id) on delete cascade
);

alter table public.pc_build_items enable row level security;

create policy "build_items_select_own" on public.pc_build_items for select
  using (exists (select 1 from public.pc_builds where pc_builds.id = build_id and pc_builds.user_id = auth.uid()));
create policy "build_items_insert_own" on public.pc_build_items for insert
  with check (exists (select 1 from public.pc_builds where pc_builds.id = build_id and pc_builds.user_id = auth.uid()));
