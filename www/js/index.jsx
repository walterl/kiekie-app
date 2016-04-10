import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

document.addEventListener('deviceready', () => {
    ReactDOM.render(<App/>, document.getElementById('app'));
}, false);
