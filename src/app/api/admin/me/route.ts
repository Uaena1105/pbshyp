import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCurrentAdmin } from '@/lib/admin-auth';

export async function GET() {
  const admin = await getCurrentAdmin();
  return NextResponse.json({ admin });
}