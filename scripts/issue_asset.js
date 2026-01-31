const StellarSdk = require('stellar-sdk');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

// Define Asset
const assetCode = 'ZMW';
const issuerPublic = process.env.ISSUER_PUBLIC;
const issuerSecret = process.env.ISSUER_SECRET;
const distributorPublic = process.env.DISTRIBUTOR_PUBLIC;
const distributorSecret = process.env.DISTRIBUTOR_SECRET;

const zmwAsset = new StellarSdk.Asset(assetCode, issuerPublic);

async function main() {
    if (!issuerSecret || !distributorSecret) {
        console.error('Missing secrets in .env');
        return;
    }

    const issuerKey = StellarSdk.Keypair.fromSecret(issuerSecret);
    const distributorKey = StellarSdk.Keypair.fromSecret(distributorSecret);

    try {
        // 1. Distributor must trust Issuer for ZMW
        console.log('Distributor creating trustline...');
        const distributorAccount = await server.loadAccount(distributorPublic);

        const trustTx = new StellarSdk.TransactionBuilder(distributorAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET
        })
            .addOperation(StellarSdk.Operation.changeTrust({
                asset: zmwAsset,
                // limit: '10000000', // Optional limit
            }))
            .setTimeout(30)
            .build();

        trustTx.sign(distributorKey);
        await server.submitTransaction(trustTx);
        console.log('Trustline established.');

        // 2. Issuer mints ZMW to Distributor
        console.log('Issuer minting ZMW...');
        const issuerAccount = await server.loadAccount(issuerPublic);

        const mintTx = new StellarSdk.TransactionBuilder(issuerAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET
        })
            .addOperation(StellarSdk.Operation.payment({
                destination: distributorPublic,
                asset: zmwAsset,
                amount: '1000000', // Mint 1 Million ZMW
            }))
            .setTimeout(30)
            .build();

        mintTx.sign(issuerKey);
        await server.submitTransaction(mintTx);
        console.log(`Success! Minted 1,000,000 ZMW to Distributor.`);
        console.log(`Distributor Address: ${distributorPublic}`);
        console.log(`Asset Code: ${assetCode}`);
        console.log(`Issuer Address: ${issuerPublic}`);

    } catch (e) {
        console.error('An error occurred:', e);
        if (e.response) {
            console.error('Error details:', JSON.stringify(e.response.data, null, 2));
        }
    }
}

main();
