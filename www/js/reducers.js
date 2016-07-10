import {combineReducers} from 'redux';

import {DELETE_PIC, RECEIVE_PIC, SAVE_PIC} from './actions';


function pic(state, action) {
    switch (action.type) {
    case RECEIVE_PIC:
        return {
            data: action.data,
            takenTime: action.takenTime,
            id: action.picId,
            note: '',
            saved: false
        };
    case SAVE_PIC:
        if (state.id !== action.id) {
            return state;
        }
        return Object.assign({}, state, {
            saved: true
        });
    default:
        return state;
    }
}


function pics(state=[], action) {
    switch (action.type) {
    case RECEIVE_PIC:
        return [...state, pic(null, action)];
    case DELETE_PIC:
        return state.filter((p) => p.id !== action.id);
    case SAVE_PIC:
        return state.map((p) => pic(p, action));
    default:
        return state;
    }
}

function log(state={
    enabled: false,
    entries: []
}, action) {
    if (!state.enabled) {
        return state;
    }

    switch (action.type) {
    case RECEIVE_PIC:
        return Object.assign({}, state, {
            entries: [...state.entries, 'Photo taken.']
        });
    default:
        return state;
    }
}

const rootReducer = combineReducers({pics, log});
export default rootReducer;
