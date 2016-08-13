/* global cordova */
import './polyfill/objectassign.js';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import RoutedApp from './ui/RoutedApp';
import {initApp} from './actions';
import configureStore from './store';

const store = configureStore({
    config: {
        debug: true,
        camera: {},
        picMaxSize: 1280,
        dirs: {
            pics: 'pics',
            gallery: 'gallery',
            originals: 'originals',
            thumbnails: 'thumbnails'
        }
    },
    dirs: {
        root: null,
        pics: null,
        gallery: null,
        originals: null,
        thumbnails: null
    },
    pics: [],
    selected: null,
    server: {
        loginUrl: 'http://127.0.0.1:8008/login',
        registerUrl: 'http://127.0.0.1:8008/register'
    },
    ui: {
        picsList: {
            cellHeight: 200
        },
        startup: {
            status: '',
            message: '',
            register: {
                status: '',
                error: null,
                userName: ''
            }
        }
    }
});


document.addEventListener('deviceready', () => {
    // Needed for onTouchTap
    // Can go away when react 1.0 release
    // Check this repo:
    // https://github.com/zilverline/react-tap-event-plugin
    // http://www.material-ui.com/#/get-started/installation
    injectTapEventPlugin();

    cordova.isBrowser = cordova.platformId === 'browser';

    store.dispatch(initApp());

    ReactDOM.render(
        <Provider store={store}>
            <MuiThemeProvider>
                <RoutedApp />
            </MuiThemeProvider>
        </Provider>,
        document.getElementById('app')
    );
}, false);
