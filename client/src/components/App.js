import React, { useState, useEffect } from 'react';
import Blocks from './Blocks';
import logo from '../assets/logo.png';

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
        <div className='App'>
            <img className='logo' src={logo} alt='' />
            <br />
            <h1>Welcome to BlockchainJS</h1>
            <br />
            <div className='WalletInfo'>
                <div>Address: {walletInfo.address}</div>
                <div>Balance: {walletInfo.balance}</div>
            </div>
            <br />
            <Blocks />
        </div>
    );
};

export default App;