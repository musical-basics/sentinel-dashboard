import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';
import { getAccessToken } from '../exchange-public-token/route';

export async function GET() {
    const accessToken = getAccessToken();

    if (!accessToken) {
        return NextResponse.json({ error: 'No bank connected' }, { status: 401 });
    }

    try {
        const response = await plaidClient.transactionsGet({
            access_token: accessToken,
            start_date: '2023-01-01',
            end_date: new Date().toISOString().split('T')[0],
        });

        // Map Plaid data to your Sentinel Transaction type
        const transactions = response.data.transactions.map((t) => ({
            id: t.transaction_id,
            merchant: t.merchant_name || t.name,
            amount: Math.abs(t.amount), // Plaid sends positive values for spending
            date: t.date,
            category: t.category?.[0] || 'Uncategorized',
            source: {
                bank: 'Plaid Bank', // In production, fetching Institution Name is a separate call
                lastFour: t.account_id.slice(-4),
            }
        }));

        return NextResponse.json(transactions);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}
