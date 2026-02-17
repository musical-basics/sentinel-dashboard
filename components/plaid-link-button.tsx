'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Plus } from 'lucide-react';

export function PlaidLinkButton({ onConnect }: { onConnect: () => void }) {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const createToken = async () => {
            const response = await fetch('/api/create-link-token', { method: 'POST' });
            const data = await response.json();
            setToken(data.link_token);
        };
        createToken();
    }, []);

    const onSuccess = useCallback(async (publicToken: string) => {
        await fetch('/api/exchange-public-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ public_token: publicToken }),
        });
        onConnect(); // Tell dashboard to refresh data
    }, [onConnect]);

    const { open, ready } = usePlaidLink({
        token,
        onSuccess,
    });

    return (
        <button
            onClick={() => open()}
            disabled={!ready}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors rounded-md"
        >
            <Plus className="h-4 w-4" />
            Connect Bank
        </button>
    );
}
