import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './app';

const DEBUG = true;

document.addEventListener('deviceready', () => {
    // Needed for onTouchTap
    // Can go away when react 1.0 release
    // Check this repo:
    // https://github.com/zilverline/react-tap-event-plugin
    // http://www.material-ui.com/#/get-started/installation
    injectTapEventPlugin();

    ReactDOM.render(<App showLog={DEBUG}/>, document.getElementById('app'));
}, false);
