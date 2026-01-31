import { Horizon, Keypair, Asset, TransactionBuilder, Networks, Operation, BASE_FEE } from '@stellar/stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

// DOM Elements
const secretInput = document.getElementById('secret-key');
const connectBtn = document.getElementById('connect-btn');
const balanceDisplay = document.getElementById('balance-amount');
const publicKeyDisplay = document.getElementById('public-key-display');
const transferArea = document.getElementById('transfer-area');
const sendBtn = document.getElementById('send-btn');
const destInput = document.getElementById('destination-address');
const amountInput = document.getElementById('amount');
const statusMsg = document.getElementById('status-message');
const statusArea = document.getElementById('status-area');

// State
let userKeypair = null;
let zmwAsset = new Asset('ZMW', 'GDU3V2YDHCVXT4YEF5LZ63ZC46EDXHABA22NTIP5E5PZIQUKBFT74DYT'); // Hardcoded Issuer for Demo
// Note: In a real app, you'd fetch the issuer from config or user input

function showStatus(msg, type = 'info') {
    statusMsg.textContent = msg;
    statusArea.className = `status-area ${type}`;
    statusArea.classList.remove('hidden');
    // Clear after 5 seconds
    setTimeout(() => {
        statusArea.classList.add('hidden');
    }, 5000);
}

async function loadAccount() {
    const secret = secretInput.value.trim();
    if (!secret) {
        showStatus('Please enter a secret key', 'error');
        return;
    }

    try {
        userKeypair = Keypair.fromSecret(secret);
        publicKeyDisplay.textContent = userKeypair.publicKey();

        showStatus('Loading account...', 'info');
        const account = await server.loadAccount(userKeypair.publicKey());

        // Find ZMW balance
        const zmwBalance = account.balances.find(b =>
            b.asset_code === 'ZMW' && b.asset_issuer === zmwAsset.getIssuer()
        );

        if (zmwBalance) {
            balanceDisplay.textContent = zmwBalance.balance;
        } else {
            balanceDisplay.textContent = '0.00';
            showStatus('Account found, but no ZMW trustline.', 'warning');
        }

        transferArea.classList.remove('hidden');
        connectBtn.textContent = 'Refresh Balance';
        showStatus('Wallet connected successfully', 'success');

    } catch (e) {
        console.error(e);
        showStatus('Failed to load account. Check secret key or network.', 'error');
    }
}

async function sendZMW() {
    if (!userKeypair) return;

    const dest = destInput.value.trim();
    const amount = amountInput.value.trim();

    if (!dest || !amount) {
        showStatus('Please fill in destination and amount', 'error');
        return;
    }

    try {
        showStatus('Sending transaction...', 'info');
        sendBtn.disabled = true;

        const account = await server.loadAccount(userKeypair.publicKey());

        const tx = new TransactionBuilder(account, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET
        })
            .addOperation(Operation.payment({
                destination: dest,
                asset: zmwAsset,
                amount: amount,
            }))
            .setTimeout(30)
            .build();

        tx.sign(userKeypair);

        const result = await server.submitTransaction(tx);
        console.log('Tx Result:', result);

        showStatus(`Sent ${amount} ZMW to ${dest.substring(0, 6)}...`, 'success');

        // Refresh balance
        await loadAccount();

        // Clear inputs
        amountInput.value = '';
        // destInput.value = ''; // Keep destination for convenience

    } catch (e) {
        console.error(e);
        let msg = 'Transaction failed.';
        if (e.response && e.response.data && e.response.data.extras) {
            msg += ' ' + JSON.stringify(e.response.data.extras.result_codes);
        }
        showStatus(msg, 'error');
    } finally {
        sendBtn.disabled = false;
    }
}

connectBtn.addEventListener('click', loadAccount);
sendBtn.addEventListener('click', sendZMW);
