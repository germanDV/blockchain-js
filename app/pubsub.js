const redis = require('redis');

const CHANNELS = {
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION',
};

class PubSub{
    constructor({ blockchain, transactionPool, redisUrl }){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

        this.publisher = redis.createClient(redisUrl);
        this.subscriber = redis.createClient(redisUrl);

        this.subscribeToChannels();
        this.subscriber.on('message', (ch, msg) => this.handleMessage(ch, msg));
    }

    handleMessage(channel, message){
        console.log(`Message received. Channel: ${channel}.`);

        const parsedMessage = JSON.parse(message);

        switch(channel){
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage, true, () => {
                    this.transactionPool.clearBlockchainTransactions({
                        chain: parsedMessage,
                    });
                });
                break;
            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMessage);
                break;
            default:
                return;
        }
    }

    subscribeToChannels(){
        Object.values(CHANNELS).forEach((channel) => {
            this.subscriber.subscribe(channel);
        });
    }

    publish({ channel, message }){
        // Unsubscribe from channel so that I don't get the message
        // that I'm about to publish; then I re-subscribe.
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        });
    }

    broadcastChain(){
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain),
        });
    }

    broadcastTransaction(transaction){
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction),
        });
    }
}

module.exports = PubSub;
