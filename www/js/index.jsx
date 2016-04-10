import * as ReactDOM from 'react-dom';
import * as React from 'react';
import App from './app';


document.addEventListener('deviceready', () => {
    ReactDOM.render(<App/>, document.getElementById('app'));
}, false);
