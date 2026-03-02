-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Create components table
create table if not exists public.components (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('CPU', 'GPU', 'RAM', 'Storage', 'Motherboard')),
  name text not null,
  brand text not null,
  price numeric(10, 2) not null,
  specs jsonb not null default '{}'::jsonb,
  image_url text,
  created_at timestamptz default now()
);

create unique index if not exists components_category_name_key
  on public.components (category, name);

alter table public.components enable row level security;

drop policy if exists "components_read_all" on public.components;
create policy "components_read_all" on public.components
  for select
  using (true);

-- Create pc_builds table
create table if not exists public.pc_builds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My Build',
  status text not null default 'draft' check (status in ('draft', 'ordered')),
  total_price numeric(10, 2) not null default 0,
  created_at timestamptz default now(),
  ordered_at timestamptz
);

alter table public.pc_builds enable row level security;

drop policy if exists "pc_builds_select_own" on public.pc_builds;
create policy "pc_builds_select_own" on public.pc_builds
  for select
  using (auth.uid() = user_id);

drop policy if exists "pc_builds_modify_own" on public.pc_builds;
create policy "pc_builds_modify_own" on public.pc_builds
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create pc_build_items table
create table if not exists public.pc_build_items (
  id uuid primary key default gen_random_uuid(),
  build_id uuid not null references public.pc_builds(id) on delete cascade,
  component_id uuid not null references public.components(id) on delete cascade,
  quantity integer not null default 1,
  created_at timestamptz default now()
);

alter table public.pc_build_items enable row level security;

drop policy if exists "pc_build_items_select_own" on public.pc_build_items;
create policy "pc_build_items_select_own" on public.pc_build_items
  for select
  using (
    exists (
      select 1
      from public.pc_builds b
      where b.id = build_id and b.user_id = auth.uid()
    )
  );

drop policy if exists "pc_build_items_modify_own" on public.pc_build_items;
create policy "pc_build_items_modify_own" on public.pc_build_items
  for all
  using (
    exists (
      select 1
      from public.pc_builds b
      where b.id = build_id and b.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.pc_builds b
      where b.id = build_id and b.user_id = auth.uid()
    )
  );
