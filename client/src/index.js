// Dependencies
import React from 'react';
import { render } from 'react-dom';

// These two are required for async/await
// to work in the browser
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Styles
import './index.css';

// Components
import App from './components/App';

render(
    <App />,
    document.querySelector('#root'),
);
