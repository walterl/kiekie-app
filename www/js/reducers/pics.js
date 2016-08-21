import {
    DELETE_PIC, RECEIVE_PIC, RESTORE_PIC, SAVE_PIC, SELECT_PIC, SET_PIC_DATA
} from '../actions';

function reducePic(state, action) {
    if (state.id !== action.id) {
        return state;
    }

    switch (action.type) {
    case SAVE_PIC:
        return Object.assign({}, state, {
            saved: true
        });
    case SET_PIC_DATA:
        return Object.assign({}, state, action.data);
    default:
        return state;
    }
}

function pics(state=[], action) {
    switch (action.type) {
    case RECEIVE_PIC:
        return [...state, {
            uri: action.uri,
            takenTime: action.takenTime,
            id: action.id,
            note: action.note || '',
            saved: Boolean(action.saved),
            selected: false
        }];
    case RESTORE_PIC:
        return [...state, action.pic];
    case DELETE_PIC:
        return state.filter((p) => p.id !== action.id);
    case SAVE_PIC:
    case SET_PIC_DATA:
        return state.map((p) => reducePic(p, action));
    case SELECT_PIC:
        return state.map((pic) => Object.assign({}, pic, {
            selected: pic.id === action.id
        }));
    default:
        return state;
    }
}

export default function storePics(state, action) {
    const newState = pics(state, action);
    window.localStorage.setItem('picsInfo', JSON.stringify(newState));
    return newState;
}
