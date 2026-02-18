const SIMPLEFIN_USERNAME = process.env.SIMPLEFIN_USERNAME!;
const SIMPLEFIN_PASSWORD = process.env.SIMPLEFIN_PASSWORD!;
const SIMPLEFIN_BASE_URL = process.env.SIMPLEFIN_BASE_URL!;

export type SimpleFINAccount = {
    id: string;
    name: string;
    balance: string;
    org: { domain: string; name?: string };
    transactions: SimpleFINTransaction[];
};

export type SimpleFINTransaction = {
    id: string;
    posted: number; // Unix timestamp
    amount: string;
    description: string;
    payee?: string;
    memo?: string;
};

export type SimpleFINResponse = {
    accounts: SimpleFINAccount[];
};

function parseLastFour(accountName: string): string {
    const match = accountName.match(/\((\d{4})\)/);
    return match ? match[1] : accountName.slice(-4);
}

function parseBankName(domain: string): string {
    if (domain.includes('chase')) return 'Chase';
    if (domain.includes('amex') || domain.includes('americanexpress')) return 'Amex';
    if (domain.includes('wellsfargo')) return 'Wells Fargo';
    if (domain.includes('citi')) return 'Citi';
    if (domain.includes('bofa') || domain.includes('bankofamerica')) return 'BofA';
    // Capitalize domain
    return domain.replace('www.', '').replace('.com', '').replace(/^\w/, c => c.toUpperCase());
}

export async function fetchSimpleFINAccounts(): Promise<SimpleFINResponse> {
    const credentials = Buffer.from(`${SIMPLEFIN_USERNAME}:${SIMPLEFIN_PASSWORD}`).toString('base64');

    const response = await fetch(`${SIMPLEFIN_BASE_URL}/accounts`, {
        headers: {
            'Authorization': `Basic ${credentials}`,
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`SimpleFIN request failed: ${response.status}`);
    }

    return response.json();
}

export function mapAccountToSource(account: SimpleFINAccount) {
    return {
        bank: parseBankName(account.org.domain),
        lastFour: parseLastFour(account.name),
    };
}
