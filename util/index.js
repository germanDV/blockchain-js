const EC = require('elliptic').ec;
const cryptoHash = require('./crypto-hash.js');

const ec = new EC('secp256k1');

function verifySignature({ publicKey, data, signature }){
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');
    return keyFromPublic.verify(cryptoHash(data), signature);
}

module.exports = { ec, verifySignature, cryptoHash };