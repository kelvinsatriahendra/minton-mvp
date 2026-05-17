import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Query parameter "email" wajib diisi' }, { status: 400 });
  }

  const results: any = {};

  // Test 1: Query with fresh client
  const client1 = createClient(supabaseUrl, supabaseAnonKey);
  const { data: r1, error: e1 } = await client1.from('users').select('*').eq('email', email);
  results.fresh_client_select = { data: r1, error: e1?.message || null, count: r1?.length || 0 };

  // Test 2: Query with ilike (case-insensitive)
  if (!r1 || r1.length === 0) {
    const { data: r2, error: e2 } = await client1.from('users').select('*').ilike('email', email);
    results.ilike_select = { data: r2, error: e2?.message || null, count: r2?.length || 0 };
  }

  // Test 3: Check if table exists by listing tables
  const { data: tables, error: tablesError } = await client1
    .from('users')
    .select('id')
    .limit(1);
  results.table_check = { can_access: !tablesError, error: tablesError?.message || null };

  return NextResponse.json(results);
}
