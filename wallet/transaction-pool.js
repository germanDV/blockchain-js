const Transaction = require('./transaction.js');

class TransactionPool{
    constructor(){
        this.transactionMap = {};
    }

    setTransaction(transaction){
        this.transactionMap[transaction.id] = transaction;
    }

    setMap(transactionMap){
        this.transactionMap = transactionMap;
    }

    existingTransaction({ inputAddress }){
        const transactions = Object.values(this.transactionMap);
        return transactions.find(t => t.input.address === inputAddress);
    }

    validTransactions(){
        return Object.values(this.transactionMap)
            .filter(t => Transaction.validTransaction(t));
    }

    clear(){
        this.transactionMap = {};
    }

    clearBlockchainTransactions({ chain }){
        for(let i = 1; i < chain.length; i++){
            const block = chain[i];
            for(const transaction of block.data){
                if(this.transactionMap[transaction.id]){
                    delete this.transactionMap[transaction.id];
                }
            }
        }
    }
}

module.exports = TransactionPool;