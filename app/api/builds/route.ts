import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET: Fetch user's builds
export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('pc_builds')
    .select('*, pc_build_items(*, components(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    // In dev/demo mode, fail soft and return an empty list instead of 500
    console.error('Error fetching builds:', error.message)
    return NextResponse.json([], { status: 200 })
  }

  return NextResponse.json(data)
}

// POST: Create a new build or add item to existing draft
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { action } = body

  if (action === 'add_item') {
    const { component_id } = body

    // Get or create a draft build
    let { data: drafts } = await supabase
      .from('pc_builds')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .limit(1)

    let build = drafts?.[0]

    if (!build) {
      const { data: newBuild, error: buildError } = await supabase
        .from('pc_builds')
        .insert({ user_id: user.id, name: 'My Build' })
        .select()
        .single()

      if (buildError) {
        return NextResponse.json({ error: buildError.message }, { status: 500 })
      }
      build = newBuild
    }

    // Get the component to check its category
    const { data: component } = await supabase
      .from('components')
      .select('*')
      .eq('id', component_id)
      .single()

    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 })
    }

    // Check if a component of same category already exists in the build
    const { data: existingItems } = await supabase
      .from('pc_build_items')
      .select('*, components(*)')
      .eq('build_id', build.id)

    const existingOfCategory = existingItems?.find(
      (item: { components: { category: string } }) => item.components?.category === component.category
    )

    if (existingOfCategory) {
      // Replace the existing component of same category
      await supabase
        .from('pc_build_items')
        .delete()
        .eq('id', existingOfCategory.id)
    }

    // Add the new component
    const { error: itemError } = await supabase
      .from('pc_build_items')
      .insert({ build_id: build.id, component_id })

    if (itemError) {
      return NextResponse.json({ error: itemError.message }, { status: 500 })
    }

    // Update total price
    const { data: allItems } = await supabase
      .from('pc_build_items')
      .select('components(price)')
      .eq('build_id', build.id)

    const totalPrice = allItems?.reduce(
      (sum: number, item: { components: { price: number } }) => sum + (item.components?.price || 0),
      0,
    ) || 0

    await supabase
      .from('pc_builds')
      .update({ total_price: totalPrice })
      .eq('id', build.id)

    // Fetch the updated build with items
    const { data: updatedBuild } = await supabase
      .from('pc_builds')
      .select('*, pc_build_items(*, components(*))')
      .eq('id', build.id)
      .single()

    return NextResponse.json(updatedBuild)
  }

  if (action === 'remove_item') {
    const { item_id, build_id } = body

    await supabase.from('pc_build_items').delete().eq('id', item_id)

    // Update total price
    const { data: allItems } = await supabase
      .from('pc_build_items')
      .select('components(price)')
      .eq('build_id', build_id)

    const totalPrice = allItems?.reduce(
      (sum: number, item: { components: { price: number } }) => sum + (item.components?.price || 0),
      0,
    ) || 0

    await supabase
      .from('pc_builds')
      .update({ total_price: totalPrice })
      .eq('id', build_id)

    const { data: updatedBuild } = await supabase
      .from('pc_builds')
      .select('*, pc_build_items(*, components(*))')
      .eq('id', build_id)
      .single()

    return NextResponse.json(updatedBuild)
  }

  if (action === 'place_order') {
    const { build_id } = body

    const { data: updatedBuild, error } = await supabase
      .from('pc_builds')
      .update({ status: 'ordered', ordered_at: new Date().toISOString() })
      .eq('id', build_id)
      .eq('user_id', user.id)
      .select('*, pc_build_items(*, components(*))')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(updatedBuild)
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
