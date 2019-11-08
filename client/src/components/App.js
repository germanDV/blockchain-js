import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const App = () => {
    const initialState = { address: '', balance: 0 };
    const [walletInfo, setWalletInfo] = useState(initialState);

    useEffect(() => {
        async function fetchData(){
            try{
                const resp = await fetch(`${document.location.origin}/api/wallet-info`);
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
            <div>
                <Link to='/blocks'>Blocks</Link>
            </div>
            <div>
                <Link to='/transfer'>Transfer</Link>
            </div>
            <div>
                <Link to='/pool'>Transaction Pool</Link>
            </div>
            <br />
            <div className='WalletInfo'>
                <div>Address: {walletInfo.address}</div>
                <div>Balance: {walletInfo.balance}</div>
            </div>
        </div>
    );
};

export default App;