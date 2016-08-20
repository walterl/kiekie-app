import {combineReducers} from 'redux';

import {
    INIT_CAMERA, INIT_DIRECTORIES, SET_PIC_SELECTED, SET_DEBUG,
    LOGIN_SUCCESS, REGISTER_SUCCESS,
    FETCH_PICSLIST_SUCCESS
} from '../actions';

import pics from './pics';
import ui from './ui';


function config(state={debug: false}, action) {
    switch (action.type) {
    case INIT_CAMERA:
        return Object.assign({}, state, {
            camera: action.config
        });
    case SET_DEBUG:
        return Object.assign({}, state, {
            debug: action.debug
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

function selected(state=null, action) {
    switch (action.type) {
    case SET_PIC_SELECTED:
        return action.id;
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
    config, dirs, pics, selected, server, ui
});
export default rootReducer;
