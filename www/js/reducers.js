import {combineReducers} from 'redux';

import {
    INIT_CAMERA, CANCEL_DELETE_PIC, DELETE_PIC, RECEIVE_PIC,
    REQUEST_DELETE_PIC, SAVE_PIC, SELECT_PIC, SET_DEBUG, SET_NOTE,
    SET_UI
} from './actions';


function reducePic(state, action) {
    var newState = null;

    if (state.id !== action.id) {
        return state;
    }

    switch (action.type) {
    case REQUEST_DELETE_PIC:
        return Object.assign({}, state, {
            confirmDelete: true
        });

    case CANCEL_DELETE_PIC:
        if (!state.confirmDelete) {
            return state;
        }
        newState = Object.assign({}, state);
        Reflect.deleteProperty(newState, 'confirmDelete');
        return newState;

    case SAVE_PIC:
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
            note: action.note,
            saved: false
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
    case CANCEL_DELETE_PIC:
    case REQUEST_DELETE_PIC:
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

function ui(state={}, action) {
    switch (action.type) {
    case SET_UI:
        return Object.assign({}, state, action.config);
    default:
        return state;
    }
}

const rootReducer = combineReducers({config, pics, selected, ui});
export default rootReducer;
