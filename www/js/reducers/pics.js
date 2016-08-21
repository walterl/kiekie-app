import {DELETE_PIC, RECEIVE_PIC, SAVE_PIC, SET_PIC_DATA} from '../actions';

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

export default function pics(state=[], action) {
    switch (action.type) {
    case RECEIVE_PIC:
        return [...state, {
            uri: action.uri,
            takenTime: action.takenTime,
            id: action.id,
            note: '',
            saved: false,
            selected: false
        }];
    case DELETE_PIC:
        return state.filter((p) => p.id !== action.id);
    case SAVE_PIC:
    case SET_PIC_DATA:
        return state.map((p) => reducePic(p, action));
    default:
        return state;
    }
}
