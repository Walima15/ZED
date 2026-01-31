# ZED - Zambian Stablecoin on Stellar

A proof-of-concept stablecoin implementation for the Zambian Kwacha (ZMW) built on the Stellar Network (Testnet). This project demonstrates how to issue assets, manage accounts, and build a simple web wallet for interacting with the Stellar blockchain.

## Features

- **Asset Issuance**: Scripts to mint `ZMW` assets.
- **Key Management**: Automatic generation of Issuer and Distributor keypairs.
- **Web Wallet**: A clean, modern web interface to check balances and send ZMW.
- **Stellar SDK Integration**: Uses `@stellar/stellar-sdk` for blockchain interactions.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (usually comes with Node.js)

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Walima15/ZED.git
    cd ZED
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Usage

### 1. Setup Network & Accounts
Run the setup scripts in order to generate keys and issue the asset.

```bash
# Generate keys for Issuer and Distributor (saved to .env)
node scripts/create_accounts.js

# Fund accounts with Testnet XLM (using Friendbot)
node scripts/fund_accounts.js

# Establish trustline and mint 1,000,000 ZMW to Distributor
node scripts/issue_asset.js
```

### 2. Run the Web Wallet
Start the local development server:

```bash
npx vite
```
Open your browser at `http://localhost:5173` (or the URL shown in the terminal).

### 3. Login
To use the wallet, you need the **Secret Key** of the Distributor (or any other account holding ZMW).
You can find the generated secret key in the `.env` file or the console output from the setup scripts.

**Example Distributor Secret** (from your setup):
`SBLFJIQ3EGVPFK7LLVMM6X7QLPIOIEHUF4GLY3IKWOQBSDCJ47WM5JB3` 
*(Note: Do not share secret keys in real production environments!)*

## Project Structure

- `scripts/`: Backend scripts for blockchain administration.
- `web-wallet/`: Frontend web application (HTML/CSS/JS).
- `.env`: (Auto-generated) Contains your local testnet keys.

## Disclaimer

This project is for educational purposes only and runs on the **Stellar Testnet**. The `ZMW` coins have no real-world value.
