const StellarSdk = require('stellar-sdk');
const fs = require('fs');
const path = require('path');

// Generate Issuer Keypair
const issuerPair = StellarSdk.Keypair.random();
// Generate Distributor Keypair
const distributorPair = StellarSdk.Keypair.random();

console.log('Issuer Public Key:', issuerPair.publicKey());
console.log('Issuer Secret Key:', issuerPair.secret());
console.log('Distributor Public Key:', distributorPair.publicKey());
console.log('Distributor Secret Key:', distributorPair.secret());

// Save to .env file
const envContent = `ISSUER_PUBLIC=${issuerPair.publicKey()}
ISSUER_SECRET=${issuerPair.secret()}
DISTRIBUTOR_PUBLIC=${distributorPair.publicKey()}
DISTRIBUTOR_SECRET=${distributorPair.secret()}
`;

const envPath = path.join(__dirname, '../.env');
fs.writeFileSync(envPath, envContent);

console.log(`\nKeys saved to ${envPath}`);
