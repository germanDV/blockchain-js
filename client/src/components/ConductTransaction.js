import React, { useState } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ConductTransaction = (props) => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState(0);

    const conductTransaction = async() => {
        try{
            const resp = await fetch(`${document.location.origin}/api/transact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipient, amount }),
            });
            const data = await resp.json();
            alert(data.message || data.type);
        } catch(err){
            console.log(err);
        } finally{
            setRecipient('');
            setAmount(0);
            props.history.push('/pool');
        }
    };

    return (
        <div className='ConductTransaction'>
            <Link to='/'>Home</Link>
            <h3>Make a Transaction</h3>
            <FormGroup>
                <FormControl
                    input='text'
                    placeholder='Beneficiary address'
                    value={recipient}
                    onChange={ev => setRecipient(ev.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <FormControl
                    input='number'
                    placeholder='Amount'
                    value={amount}
                    onChange={ev => setAmount(Number(ev.target.value))}
                />
            </FormGroup>
            <div>
                <Button variate='danger' onClick={conductTransaction}>
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default ConductTransaction;