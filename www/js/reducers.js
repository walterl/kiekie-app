import {combineReducers} from 'redux';

import {DELETE_PIC, RECEIVE_PIC, SAVE_PIC} from './actions';


function pics(state=[], action) {
    switch (action.type) {
    case RECEIVE_PIC:
        return [...state, {
            data: action.data,
            takenTime: action.takenTime,
            id: state.length + 1,
            saved: false
        }];
    case DELETE_PIC:
        return state.filter((pic) => pic.id !== action.id);
    case SAVE_PIC:
        return state.map((pic) => {
            if (pic.id === action.id) {
                pic.saved = true;
            }
            return pic;
        });
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
