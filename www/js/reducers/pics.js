import {
    CLEAR_PICS_LIST, RESTORE_PIC,
    DELETE_PIC_REQUEST, DELETE_PIC_SUCCESS, DELETE_PIC_FAIL,
    RECEIVE_PIC, PIC_INIT_FAIL,
    SAVE_PIC_REQUEST, SAVE_PIC, SELECT_PIC, SET_PIC_DATA,
    UPDATE_PIC_FAIL, UPLOAD_PIC_FAIL
} from '../actions';

function lookupPicError(action) {
    switch (action.type) {
    case DELETE_PIC_FAIL:
        return 'Failed to delete picture.';
    case PIC_INIT_FAIL:
        return 'Failed to initialise picture.';
    case UPDATE_PIC_FAIL:
        return 'Failed to save picture note.';
    case UPLOAD_PIC_FAIL:
        return 'Failed to upload picture.';
    default:
        return action.error.toString();
    }
}

function reducePic(state, action) {
    if (state.id !== action.id) {
        return state;
    }

    switch (action.type) {
    case DELETE_PIC_REQUEST:
    case SAVE_PIC_REQUEST:
        return Object.assign({}, state, {
            busy: true,
            confirmDelete: false
        });
    case SAVE_PIC:
        return Object.assign({}, state, {
            busy: false,
            saved: true
        });
    case DELETE_PIC_FAIL:
    case PIC_INIT_FAIL:
    case UPDATE_PIC_FAIL:
    case UPLOAD_PIC_FAIL:
        return Object.assign({}, state, {
            error: lookupPicError(action),
            busy: false,
            saved: true
        });
    case SET_PIC_DATA:
        return Object.assign({}, state, action.data);
    default:
        return state;
    }
}

// eslint-disable-next-line complexity
function pics(state=[], action) {
    switch (action.type) {
    case CLEAR_PICS_LIST:
        return [];
    case RECEIVE_PIC:
        return [{
            uri: action.uri,
            takenTime: action.takenTime,
            id: action.id,
            note: action.note || '',
            saved: Boolean(action.saved),
            selected: false,
            busy: false
        }, ...state];
    case RESTORE_PIC:
        return [...state, action.pic];
    case DELETE_PIC_SUCCESS:
        return state.filter((p) => p.id !== action.id);
    case DELETE_PIC_REQUEST:
    case DELETE_PIC_FAIL:
    case PIC_INIT_FAIL:
    case SAVE_PIC_REQUEST:
    case SAVE_PIC:
    case SET_PIC_DATA:
    case UPDATE_PIC_FAIL:
    case UPLOAD_PIC_FAIL:
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
