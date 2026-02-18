// SimpleFIN Test Script
// Run: node test-simplefin.js

const SIMPLEFIN_USERNAME = "E52C8BF5DE1176B0542D0DA787AB1F50B30B20F986E4DBC5D718606810CF0324";
const SIMPLEFIN_PASSWORD = "95E6028B7806CE09C506E47C3E0F7042AEB9CC95C8D5F47ABC1853DFF3EF9769";
const SIMPLEFIN_BASE_URL = "https://beta-bridge.simplefin.org/simplefin";

async function getMoney() {
    try {
        console.log("🔌 Connecting to SimpleFin...");

        const credentials = Buffer.from(`${SIMPLEFIN_USERNAME}:${SIMPLEFIN_PASSWORD}`).toString('base64');

        const response = await fetch(`${SIMPLEFIN_BASE_URL}/accounts`, {
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });
        const data = await response.json();

        // Let's see what we caught
        data.accounts.forEach(account => {
            console.log(`\n🏦 Bank: ${account.org.domain} | Account: ${account.name}`);
            console.log(`💰 Balance: $${account.balance}`);
            console.log(`📜 Transactions found: ${account.transactions.length}`);

            // Check for PayPal phantom transactions
            const paypalTx = account.transactions.filter(t =>
                t.description.toLowerCase().includes('paypal')
            );

            if (paypalTx.length > 0) {
                console.log(`   --> Found ${paypalTx.length} PayPal transactions via Chase!`);
                console.log(`   --> Example: ${paypalTx[0].description} ($${paypalTx[0].amount})`);
            }
        });

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

getMoney();
