import {
    INIT_APP, LOGOUT, DISMISS_ERROR, SET_ERROR, SET_STARTUP_FINISHED,
    SET_STARTUP_MESSAGE, SHOW_LOGIN,
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL,
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAIL
} from '../actions';


function uiLogin(state={}, action) {
    switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
        return Object.assign(state, {
            status: 'busy',
            userName: action.userName,
            error: ''
        });
    case LOGIN_SUCCESS:
        return Object.assign(state, {
            status: 'login-success',
            userName: action.userName,
            error: ''
        });
    case REGISTER_SUCCESS:
        return Object.assign(state, {
            status: 'register-success',
            userName: action.userName,
            error: ''
        });
    case LOGIN_FAIL:
    case REGISTER_FAIL:
        return Object.assign(state, {
            status: 'error',
            userName: action.userName,
            error: action.error
        });
    case SHOW_LOGIN:
        return Object.assign({}, state, {
            userName: action.userName
        });
    case LOGOUT:
        return Object.assign({}, state, {
            error: null, status: ''
        });
    default:
        return state;
    }
}

function uiStartup(state={}, action) {
    switch (action.type) {
    case INIT_APP:
        return Object.assign({}, state, {
            message: 'Starting app...'
        });
    case SET_STARTUP_FINISHED:
        return Object.assign({}, state, {
            finished: action.finished
        });
    case SET_STARTUP_MESSAGE:
        return Object.assign({}, state, {
            message: action.message
        });
    default:
        return state;
    }
}

// eslint-disable-next-line complexity
export default function ui(state={}, action) {
    var newState = Object.assign({}, state);

    switch (action.type) {
    case SET_ERROR:
        newState.error = {
            message: action.error,
            src: action.src
        };
        return newState;
    case DISMISS_ERROR:
        if (newState.error.message === action.error) {
            newState.error = {message: '', src: ''};
        }
        return newState;
    case INIT_APP:
    case SET_STARTUP_FINISHED:
    case SET_STARTUP_MESSAGE:
        newState.startup = uiStartup(state.startup, action);
        return newState;
    case LOGIN_REQUEST:
    case LOGIN_SUCCESS:
    case LOGIN_FAIL:
    case LOGOUT:
    case REGISTER_REQUEST:
    case REGISTER_SUCCESS:
    case REGISTER_FAIL:
    case SHOW_LOGIN:
        newState.login = uiLogin(state.login, action);
        return newState;
    default:
        return state;
    }
}
