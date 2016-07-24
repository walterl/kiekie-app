import {combineReducers} from 'redux';

import {
    INIT_CAMERA, DELETE_PIC, RECEIVE_PIC, SAVE_PIC, SELECT_PIC, SET_DEBUG,
    SET_NOTE
} from './actions';


function reducePic(state, action) {
    if (state.id !== action.id) {
        return state;
    }

    switch (action.type) {

    case SAVE_PIC:
        if (state.id !== action.id) {
            return state;
        }
        return Object.assign({}, state, {
            saved: true
        });

    case SELECT_PIC:
        if (!state.selected) {
            return state;
        }
        return Object.assign({}, state, {
            selected: action.id === state.id
        });

    case SET_NOTE:
        if (state.note === action.note) {
            return state;
        }
        return Object.assign({}, state, {
            note: action.note
        });

    default:
        return state;
    }
}

function pics(state=[], action) {
    switch (action.type) {
    case RECEIVE_PIC:
        return [...state, {
            data: action.data,
            takenTime: action.takenTime,
            id: action.picId,
            note: '',
            saved: false,
            selected: false
        }];
    case DELETE_PIC:
        return state.filter((p) => p.id !== action.id);
    case SAVE_PIC:
    case SELECT_PIC:
    case SET_NOTE:
        return state.map((p) => reducePic(p, action));
    default:
        return state;
    }
}

function selected(state=null, action) {
    switch (action.type) {
    case SELECT_PIC:
        return action.id;
    default:
        return state;
    }
}

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

const rootReducer = combineReducers({config, pics, selected});
export default rootReducer;
