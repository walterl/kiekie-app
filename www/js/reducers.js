import {combineReducers} from 'redux';

import {RECEIVE_PIC} from './actions';


function pics(state=[], action) {
    switch (action.type) {
    case RECEIVE_PIC:
        return [...state, {
            data: action.data,
            takenTime: action.takenTime
        }];
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
