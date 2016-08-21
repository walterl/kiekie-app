import {
    COPY_PIC, DELETE_PIC_CANCEL, DELETE_PIC, RECEIVE_PIC, DELETE_PIC_REQUEST,
    SAVE_PIC, SET_PIC_SELECTED, SET_NOTE, SET_THUMBNAIL, UPDATE_PIC
} from '../actions';


/**
 * THIS IS NOT A REDUCER, BUT A REDUCER UTILITY FUNCTION.
 *
 * Sets `state[prop] = action[prop]`, on a copy of `state`, if the values
 * differ. If they don't, `state` is returned.
 *
 * `extra` is applied to the `state` copy before `[prop]` is updated.
 */
function setStateProp(state, action, prop, extra={}) {
    if (state[prop] === action[prop]) {
        return state;
    }
    return Object.assign({}, state, extra, {
        [prop]: action[prop]
    });
}

// eslint-disable-next-line complexity
function reducePic(state, action) {
    var newState = null;

    if (state.id !== action.id) {
        return state;
    }

    switch (action.type) {
    case COPY_PIC:
        if (action.label) {
            return Object.assign({}, state, {
                [action.label]: action.dest
            });
        }
        return state;
    case DELETE_PIC_REQUEST:
        return Object.assign({}, state, {
            confirmDelete: true
        });
    case DELETE_PIC_CANCEL:
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
    case SET_PIC_SELECTED:
        return Object.assign({}, state, {
            selected: true
        });
    case SET_NOTE:
        return setStateProp(state, action, 'note', {saved: false});
    case SET_THUMBNAIL:
        return setStateProp(state, action, 'thumbnail');
    case UPDATE_PIC:
        return setStateProp(state, action, 'uri', {originalUri: state.uri});
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
    case COPY_PIC:
    case DELETE_PIC_CANCEL:
    case DELETE_PIC_REQUEST:
    case SAVE_PIC:
    case SET_PIC_SELECTED:
    case SET_NOTE:
    case SET_THUMBNAIL:
    case UPDATE_PIC:
        return state.map((p) => reducePic(p, action));
    default:
        return state;
    }
}
