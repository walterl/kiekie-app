import {combineReducers} from 'redux';

import {DELETE_PIC, RECEIVE_PIC, SAVE_PIC, SET_NOTE} from './actions';


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
    case SET_NOTE:
        if (state.id !== action.id || state.note === action.note) {
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
        return [...state, pic(null, action)];
    case DELETE_PIC:
        return state.filter((p) => p.id !== action.id);
    case SAVE_PIC:
    case SET_NOTE:
        return state.map((p) => pic(p, action));
    default:
        return state;
    }
}

const rootReducer = combineReducers({pics});
export default rootReducer;
