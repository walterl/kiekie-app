import {
    START_INIT, FINISH_INIT, INIT_ROUTE_FOLLOWED, INIT_APP, INIT_CAMERA,
    INIT_DIRECTORIES, SHOW_LOGIN, SET_UI_STATE,
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
    default:
        return state;
    }
}

function uiStartup(state={}, action) {
    switch (action.type) {
    case START_INIT:
        return Object.assign({}, state, {
            initializing: [...state.initializing, action.component]
        });
    case FINISH_INIT:
        return Object.assign({}, state, {
            initializing: state.initializing.filter(
                (i) => i !== action.component)
        });
    case INIT_ROUTE_FOLLOWED:
        return Object.assign({}, state, {
            initRoutes: state.initRoutes.filter((r) => r !== action.route)
        });
    case INIT_APP:
        return Object.assign({}, state, {
            message: 'Starting up...'
        });
    case INIT_CAMERA:
        return Object.assign({}, state, {
            message: 'Camera found.'
        });
    case INIT_DIRECTORIES:
        return Object.assign({}, state, {
            message: 'Storage found.'
        });
    case SHOW_LOGIN:
        return Object.assign({}, state, {
            message: 'Logging in...',
            initRoutes: [...state.initRoutes, '/login']
        });
    default:
        return state;
    }
}

// eslint-disable-next-line complexity
export default function ui(state={}, action) {
    var newState = Object.assign({}, state);

    switch (action.type) {
    case START_INIT:
    case FINISH_INIT:
    case INIT_ROUTE_FOLLOWED:
    case INIT_APP:
    case INIT_CAMERA:
    case INIT_DIRECTORIES:
    case SHOW_LOGIN:
        newState.startup = uiStartup(state.startup, action);
        return newState;
    case LOGIN_REQUEST:
    case LOGIN_SUCCESS:
    case LOGIN_FAIL:
    case REGISTER_REQUEST:
    case REGISTER_SUCCESS:
    case REGISTER_FAIL:
        newState.login = uiLogin(state.login, action);
        return newState;
    case SET_UI_STATE:
        return Object.assign({}, state, action.config);
    default:
        return state;
    }
}
