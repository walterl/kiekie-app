import {jsonGet, jsonPost} from '../lib/net';

export const
    LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL',
    LOGIN_FAILED = 'LOGIN_FAILED',
    REGISTER_ACCOUNT = 'REGISTER_ACCOUNT',
    REGISTER_REQUEST = 'REGISTER_REQUEST',
    REGISTER_SUCCESS = 'REGISTER_SUCCESS',
    REGISTER_FAIL = 'REGISTER_FAIL';


function loginSuccessful(userName, token) {
    window.localStorage.setItem('userName', userName);
    window.localStorage.setItem('token', token);

    return {
        type: LOGIN_SUCCESSFUL,
        userName, token
    };
}

function loginFailed(userName, error) {
    return {
        type: LOGIN_FAILED,
        userName, error
    };
}

export function loginWithToken(userName, token) {
    return (dispatch, getState) => {
        const echoUrl = getState().server.tokenEchoUrl;
        return jsonGet(echoUrl)
        .then((response) => {
            if (response.token && response.token === token) {
                dispatch(loginSuccessful(userName, token));
            } else {
                dispatch(loginFailed(userName, response));
            }
        })
        .catch((error) => {
            dispatch(loginFailed(userName, error));
        });
    };
}

export function registerAccount() {
    return {
        type: REGISTER_ACCOUNT
    };
}

export function registerSuccess(userName) {
    return {
        type: REGISTER_SUCCESS,
        userName
    };
}

export function registerFail(userName, error) {
    return {
        type: REGISTER_FAIL,
        userName, error
    };
}

export function registerRequest(userName, password) {
    return (dispatch, getState) => {
        const registerUrl = getState().server.registerUrl;

        dispatch({
            type: REGISTER_REQUEST,
            userName
        });

        jsonPost(registerUrl, {username: userName, password})
        .then(() => dispatch(registerSuccess(userName)))
        .catch((error) => dispatch(registerFail(userName, error)));
    };
}
