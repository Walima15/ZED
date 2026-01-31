const StellarSdk = require('stellar-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

async function fundAccount(publicKey, name) {
    try {
        console.log(`Funding ${name} (${publicKey})...`);
        const response = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
        const data = await response.json();

        if (response.ok) {
            console.log(`Successfully funded ${name}.`);
        } else {
            console.error(`Failed to fund ${name}:`, data);
        }
    } catch (e) {
        console.error(`Error funding ${name}:`, e);
    }
}

async function main() {
    const issuerPublic = process.env.ISSUER_PUBLIC;
    const distributorPublic = process.env.DISTRIBUTOR_PUBLIC;

    if (!issuerPublic || !distributorPublic) {
        console.error('Missing keys in .env file. Run create_accounts.js first.');
        return;
    }

    await fundAccount(issuerPublic, 'Issuer');
    await fundAccount(distributorPublic, 'Distributor');
}

main();
