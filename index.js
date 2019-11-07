const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const Blockchain = require('./blockchain/blockchain.js');
const TransactionPool = require('./wallet/transaction-pool.js');
const Wallet = require('./wallet/wallet.js');
const TransactionMiner = require('./app/transaction-miner');
const PubSub = require('./app/pubsub.js');

const app = express();
app.use(bodyParser.json());

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

const DEFAULT_PORT = 4000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;
    blockchain.addBlock({ data });
    pubsub.broadcastChain();
    res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;

    let transaction = transactionPool.existingTransaction({
        inputAddress: wallet.publicKey,
    });

    try{
        if(transaction){
            transaction.update({
                senderWallet: wallet,
                recipient,
                amount,
            });
        } else{
            transaction = wallet.createTransaction({
                recipient,
                amount,
                chain: blockchain.chain,
            });
        }
    } catch(err){
        return res.status(400).json({ type: 'error', message: err.message });
    }

    transactionPool.setTransaction(transaction);
    pubsub.broadcastTransaction(transaction);
    res.json({ type: 'success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransactions();
    res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req, res) => {
    const address = wallet.publicKey;
    res.json({
        address,
        balance: Wallet.calculateBalance({
            chain: blockchain.chain,
            address,
        }),
    });
});

const syncWithRootNode = () => {
    request(
        { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
        (err, response, body) => {
            if(!err && response.statusCode === 200){
                const rootChain = JSON.parse(body);
                console.log('replace chain on a sync with', rootChain);
                blockchain.replaceChain(rootChain);
            } else{
                console.log('We have a problem', err);
            }
        },
    );

    request(
        { url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` },
        (err, response, body) => {
            if(!err && response.statusCode === 200){
                const rootTransactionPoolMap = JSON.parse(body);
                console.log('replace transaction pool map on a sync with', rootTransactionPoolMap);
                transactionPool.setMap(rootTransactionPoolMap);
            } else{
                console.log('We have a problem', err);
            }
        },
    );
};

let PEER_PORT;
if(process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`Blockchain back-end listening on port ${PORT}`);
    if(PORT !== DEFAULT_PORT){
        syncWithRootNode();
    }
});