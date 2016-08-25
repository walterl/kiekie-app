import {combineReducers} from 'redux';

import {
    INIT_APP, INIT_CAMERA, INIT_DIRECTORIES, SET_CONFIG_URL,
    SET_CONFIG_SETTING,
    LOGIN_SUCCESS, REGISTER_SUCCESS,
    FETCH_PICSLIST_SUCCESS
} from '../actions';

import pics from './pics';
import ui from './ui';


function config(state={debug: false}, action) {
    switch (action.type) {
    case INIT_APP:
        return Object.assign({}, state, action.config);
    case INIT_CAMERA:
        return Object.assign({}, state, {
            camera: action.config
        });
    case SET_CONFIG_SETTING:
        return Object.assign({}, state, {
            [action.key]: action.value
        });
    case SET_CONFIG_URL:
        return Object.assign({}, state, {
            urls: Object.assign({}, state.urls, {
                [action.key]: action.url
            })
        });
    default:
        return state;
    }
}

function dirs(state={
    pics: null,
    gallery: null,
    originals: null,
    thumbnails: null
}, action) {
    switch (action.type) {
    case INIT_DIRECTORIES:
        return Object.assign(
            {}, state, action.dirs, {root: action.dataDirectory}
        );
    default:
        return state;
    }
}

function server(state={}, action) {
    switch (action.type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
        return Object.assign({}, state, {
            userName: action.userName,
            authToken: action.authToken
        });
    case FETCH_PICSLIST_SUCCESS:
        return Object.assign({}, state, {
            data: Object.assign({}, state.data, {
                pics: {
                    data: action.picsData,
                    fetchedAt: Date.now()
                }
            })
        });
    default:
        return state;
    }
}

const rootReducer = combineReducers({
    config, dirs, pics, server, ui
});
export default rootReducer;
