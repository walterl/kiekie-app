import {
    INIT_APP, INIT_CAMERA, INIT_DIRECTORIES, REGISTER_ACCOUNT, REGISTER_REQUEST,
    REGISTER_SUCCESS, REGISTER_FAIL, SET_UI_STATE
} from '../actions';


function uiRegister(state={}, action) {
    switch (action.type) {
    case REGISTER_REQUEST:
        return Object.assign(state, {
            status: 'busy',
            userName: action.userName,
            error: ''
        });
    case REGISTER_SUCCESS:
        return Object.assign(state, {
            status: 'success',
            userName: action.userName,
            error: ''
        });
    case REGISTER_FAIL:
        return Object.assign(state, {
            status: 'error',
            userName: action.userName,
            error: action.error
        });
    default:
        return state;
    }
}

function uiStartup(state={}, action) {
    switch (action.type) {
    case INIT_APP:
        return Object.assign({}, state, {
            message: 'Starting up...',
            status: action.done ? 'done' : 'initializing'
        });
    case INIT_CAMERA:
        return Object.assign({}, state, {
            message: 'Camera found.'
        });
    case INIT_DIRECTORIES:
        return Object.assign({}, state, {
            message: 'Storage found.'
        });
    case REGISTER_ACCOUNT:
        return Object.assign({}, state, {
            message: 'Registering new user...',
            status: 'register'
        });
    default:
        return state;
    }
}

export default function ui(state={}, action) {
    var newState = Object.assign({}, state);

    switch (action.type) {
    case INIT_APP:
    case INIT_CAMERA:
    case INIT_DIRECTORIES:
    case REGISTER_ACCOUNT:
        newState.startup = uiStartup(state.startup, action);
        return newState;
    case REGISTER_REQUEST:
    case REGISTER_SUCCESS:
    case REGISTER_FAIL:
        newState.register = uiRegister(state.register, action);
        return newState;
    case SET_UI_STATE:
        return Object.assign({}, state, action.config);
    default:
        return state;
    }
}
