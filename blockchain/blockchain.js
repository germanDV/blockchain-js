const Block = require('./block.js');
const Transaction = require('../wallet/transaction.js');
const Wallet = require('../wallet/wallet.js');
const { cryptoHash } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config.js');

class Blockchain{
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock({ data }){
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data,
        });

        this.chain.push(newBlock);
    }

    static isValidChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
            return false;
        }

        for(let i = 1; i < chain.length; i++){
            const actualLastHash = chain[i - 1].hash;
            const lastDifficulty = chain[i - 1].difficulty;
            const block = chain[i];
            const { timestamp, lastHash, hash, data, nonce, difficulty } = block;
            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
            if(lastHash !== actualLastHash) return false;
            if(hash !== validatedHash) return false;
            if(Math.abs(lastDifficulty - difficulty) > 1) return false;
        }

        return true;
    }

    replaceChain(chain, validateTransactions, onSuccess){
        if(chain.length <= this.chain.length){
            console.error('The incoming chain must be longer.');
            return;
        }

        if(!Blockchain.isValidChain(chain)){
            console.error('The incoming chain must be valid.');
            return;
        }

        if(validateTransactions && !this.validTransactionData({ chain })){
            console.error('The incoming chain has invalid transaction data.');
            return;
        }

        if(onSuccess) onSuccess();
        console.log('Replacing chain with', chain);
        this.chain = chain;
    }

    validTransactionData({ chain }){
        const len = chain.length;
        for(let i = 1; i < len; i++){
            const block = chain[i];
            let rewardTransactionCount = 0;

            const transactionSet = new Set();

            for(const transaction of block.data){
                if(transaction.input.address === REWARD_INPUT.address){
                    rewardTransactionCount++;

                    if(rewardTransactionCount > 1){
                        console.error('Miner rewards exceed limit');
                        return false;
                    }

                    if(Object.values(transaction.outputMap)[0] !== MINING_REWARD){
                        console.error('Miner reward amount is invalid');
                        return false;
                    }
                } else{
                    if(!Transaction.validTransaction(transaction)){
                        console.error('Invalid transaction');
                        return false;
                    }

                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain,
                        address: transaction.input.address,
                    });

                    if(transaction.input.amount !== trueBalance){
                        console.error('Invalid input amount');
                        return false;
                    }

                    if(transactionSet.has(transaction)){
                        console.error('Identical transaction found (duplicate)');
                        return false;
                    } else{
                        transactionSet.add(transaction);
                    }
                }
            }
        }

        return true;
    }
}

module.exports = Blockchain;
