const Transaction = require('../wallet/transaction.js');

class TransactionMiner{
    constructor({ blockchain, transactionPool, wallet, pubsub }){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }

    mineTransactions(){
        // Get only valid transactions from the pool
        const validTransactions = this.transactionPool.validTransactions();

        // Generate the miner's reward
        validTransactions.push(
            Transaction.rewardTransaction({ minerWallet: this.wallet }),
        );

        // Add a block consisting of these transactions
        this.blockchain.addBlock({ data: validTransactions });

        // Broadcast updated blockchain
        this.pubsub.broadcastChain();

        // Clear transaction pool
        this.transactionPool.clear();
    }
}

module.exports = TransactionMiner;