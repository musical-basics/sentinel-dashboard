import { NextResponse } from 'next/server';
import { fetchSimpleFINAccounts, mapAccountToSource } from '@/lib/simplefin';

export async function GET() {
    try {
        const data = await fetchSimpleFINAccounts();

        const transactions = data.accounts.flatMap((account) => {
            const source = mapAccountToSource(account);

            return account.transactions.map((t) => ({
                id: t.id,
                merchant: t.payee || t.description,
                amount: Math.abs(parseFloat(t.amount)),
                source,
                date: new Date(t.posted * 1000).toISOString().split('T')[0],
                category: undefined,
            }));
        });

        const accounts = data.accounts.map((account) => ({
            name: account.name,
            balance: parseFloat(account.balance),
            source: mapAccountToSource(account),
        }));

        return NextResponse.json({ transactions, accounts });
    } catch (error) {
        console.error('SimpleFIN fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch SimpleFIN data' },
            { status: 500 }
        );
    }
}
