import React, { useState, useEffect } from 'react';
import Blocks from './Blocks';

const App = () => {
    const initialState = { address: '', balance: 0 };
    const [walletInfo, setWalletInfo] = useState(initialState);

    useEffect(() => {
        async function fetchData(){
            try{
                const resp = await fetch('http://localhost:4000/api/wallet-info');
                const data = await resp.json();
                setWalletInfo(data);
            } catch(err){
                console.log(err);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>Welcome to BlockchainJS</h1>
            <div>Address: {walletInfo.address}</div>
            <div>Balance: {walletInfo.balance}</div>
            <br />
            <Blocks />
        </div>
    );
};

export default App;