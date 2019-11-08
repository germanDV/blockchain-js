import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';

const POLL_INTERVAL_MS = 10 * 1000;

const TransactionPool = (props) => {
    const [transactionPoolMap, setTransactionPoolMap] = useState();

    const fetchData = useCallback(async() => {
        try{
            const resp = await fetch(`${document.location.origin}/api/transaction-pool-map`);
            const data = await resp.json();
            setTransactionPoolMap(data);
        } catch(err){
            console.log(err);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [fetchData]);

    const mineTransactions = async() => {
        try{
            const resp = await fetch(`${document.location.origin}/api/mine-transactions`);
            if(resp.status === 200){
                alert('success');
                props.history.push('/blocks');
            } else{
                alert('Mine transactions request did not complete')
            }
        } catch(err){
            console.log(err);
        }
    };

    if(!transactionPoolMap){
        return <div><em>loading...</em></div>;
    }

    return (
        <div className='TransactionPool'>
            <div><Link to='/'>Home</Link></div>
            <h3>Transaction Pool</h3>
            {Object.values(transactionPoolMap).map(transaction => (
                <div key={transaction.id}>
                    <hr />
                    <Transaction transaction={transaction} />
                </div>
            ))}
            <hr />
            <Button variant='danger' onClick={mineTransactions}>
                Mine Transactions
            </Button>
        </div>
    );
};

export default TransactionPool;