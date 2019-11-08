// Dependencies
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// These two are required for async/await
// to work in the browser
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Styles
import './index.css';

// Components
import App from './components/App';
import Blocks from './components/Blocks';
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';

render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={App} />
            <Route path='/blocks' component={Blocks} />
            <Route path='/transfer' component={ConductTransaction} />
            <Route path='/pool' component={TransactionPool} />
            <Route path='*' component={() => <h1>404 | Not found</h1>} />
        </Switch>
    </BrowserRouter>,
    document.querySelector('#root'),
);
