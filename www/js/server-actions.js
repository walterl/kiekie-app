import {jsonPost} from './net';

export const
    LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL',
    LOGIN_FAILED = 'LOGIN_FAILED',
    REGISTER_ACCOUNT = 'REGISTER_ACCOUNT',
    REGISTER_REQUEST = 'REGISTER_REQUEST',
    REGISTER_SUCCESS = 'REGISTER_SUCCESS',
    REGISTER_FAIL = 'REGISTER_FAIL';


function loginSuccessful(userId, sessionId) {
    return {
        type: LOGIN_SUCCESSFUL,
        userId, sessionId
    };
}

function loginFailed(userId, error) {
    return {
        type: LOGIN_FAILED,
        userId, error
    };
}

export function loginOnServer(userId) {
    return (dispatch) => {
        dispatch(loginFailed(userId, 'Not yet implemented'));
    };
}

export function registerAccount() {
    return {
        type: REGISTER_ACCOUNT
    };
}

export function registerSuccess(userName, userId, sessionId) {
    return {
        type: REGISTER_SUCCESS,
        userName, userId, sessionId
    };
}

export function registerFail(userName, error) {
    return {
        type: REGISTER_FAIL,
        userName, error
    };
}

export function registerRequest(userName) {
    return (dispatch, getState) => {
        const registerUrl = getState().server.registerUrl;

        dispatch({
            type: REGISTER_REQUEST,
            userName
        });

        jsonPost(registerUrl, {userName})
        .then((response) => {
            dispatch(registerSuccess(
                userName, response.userId, response.sessionId
            ));
        })
        .catch((error) => {
            dispatch(registerFail(userName, error));
        });
    };
}
