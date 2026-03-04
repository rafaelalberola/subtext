import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  return handler()
}

export async function POST() {
  return handler()
}

async function handler() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await admin.from('free_analyses').delete().gte('created_at', '2000-01-01')
  await admin.from('rate_limits').delete().gte('window_start', '2000-01-01')

  const response = NextResponse.json({ ok: true })
  response.cookies.delete('reveald_fp')
  return response
}
