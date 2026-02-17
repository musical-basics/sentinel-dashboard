import { NextRequest, NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';

// TEMPORARY STORAGE (Resets when server restarts)
// TODO: Replace this with Supabase/Database later
let TEMPORARY_ACCESS_TOKEN: string | null = null;

export async function POST(request: NextRequest) {
    const { public_token } = await request.json();
    try {
        const response = await plaidClient.itemPublicTokenExchange({ public_token });
        TEMPORARY_ACCESS_TOKEN = response.data.access_token;
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to exchange token' }, { status: 500 });
    }
}

// Helper to get token for the transactions route
export function getAccessToken() {
    return TEMPORARY_ACCESS_TOKEN;
}
