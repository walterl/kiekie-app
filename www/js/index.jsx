/* global cordova */
import './polyfill/arrayincludes.js';
import './polyfill/objectassign.js';
import './polyfill/stringstartswith.js';
import './polyfill/stringendswith.js';

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
        camera: {},
        picMaxSize: 1280,
        dirs: {
            pics: 'pics',
            gallery: 'gallery',
            originals: 'originals',
            thumbnails: 'thumbnails'
        },
        urls: {
            // FIXME Update this URL before building final app!
            api: 'https://kiekie.walterenlorraine.co.za/api/',
            apiPrev: '',

            login: 'user/login',
            register: 'user/register',
            tokenEcho: 'user/echo_token',

            pics: 'pics/'
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
    server: {
        authToken: null,
        userName: null,
        data: {
            pics: {
                data: [],
                fetchedAt: null
            }
        }
    },
    ui: {
        error: {
            message: '',
            src: ''
        },
        login: {
            error: null,
            status: '',
            userName: ''
        },
        picsList: {
            cellHeight: 200
        },
        settings: {
            testingApiUrl: false
        },
        startup: {
            finished: false,
            message: ''
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
