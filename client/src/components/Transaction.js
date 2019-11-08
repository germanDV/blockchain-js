import React from 'react';

const Transaction = ({ transaction: { input, outputMap } }) => {
    const recipients = Object.keys(outputMap);

    return (
        <div className='Transaction'>
            <div>From: {input.address.substr(0, 20)}... | Balance: {input.amount}</div>
            {recipients.map(recipient => (
                <div key={recipient}>
                    To: {recipient.substr(0, 20)}... | Sent: {outputMap[recipient]}
                </div>
            ))}
        </div>
    );
};

export default Transaction;