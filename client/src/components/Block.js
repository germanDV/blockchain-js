import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';

const Block = ({ block: { timestamp, hash, data } }) => {
    const [displayTransaction, setDisplayTransaction] = useState(false);

    const toggleTransaction = () => {
        setDisplayTransaction(prevState => !prevState);
    };

    const timeDisplay = timestamp && new Date(timestamp).toLocaleString();

    const hashDisplay = hash && `${hash.substr(0, 15)}...`;

    const stringData = data && JSON.stringify(data);
    const dataDisplay = stringData && stringData.length > 35
        ? `${stringData.substr(0, 35)}...`
        : stringData;

    return (
        <div className='Block'>
            <div>Hash: {hashDisplay}</div>
            <div>Timestamp: {timeDisplay}</div>
            <hr />
            {displayTransaction
                ? data.map(tx => (
                    <div key={tx.id}>
                        <Transaction transaction={tx} />
                        <hr />
                    </div>
                ))
                : <div>Data: {dataDisplay}</div>
            }
            <Button onClick={toggleTransaction} variant='danger' size='sm'>
                {displayTransaction ? 'Show less' : 'Show more'}
            </Button>
        </div>
    );
};

export default Block;