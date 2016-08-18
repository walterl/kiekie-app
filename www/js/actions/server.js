import {jsonGet, jsonPost} from '../lib/net';

export const
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAIL = 'LOGIN_FAIL',
    SHOW_LOGIN = 'SHOW_LOGIN',
    REGISTER_REQUEST = 'REGISTER_REQUEST',
    REGISTER_SUCCESS = 'REGISTER_SUCCESS',
    REGISTER_FAIL = 'REGISTER_FAIL';


function loginSuccess(userName, token) {
    window.localStorage.setItem('userName', userName);
    window.localStorage.setItem('token', token);

    return {
        type: LOGIN_SUCCESS,
        userName, token
    };
}

function loginFail(userName, error) {
    return {
        type: LOGIN_FAIL,
        userName, error
    };
}

export function loginWithToken(userName, token) {
    return (dispatch, getState) => {
        const echoUrl = getState().server.tokenEchoUrl;
        return jsonGet(echoUrl)
        .then((response) => {
            if (response.token && response.token === token) {
                dispatch(loginSuccess(userName, token));
            } else {
                dispatch(loginFail(userName, response));
            }
        })
        .catch((error) => {
            dispatch(loginFail(userName, error));
        });
    };
}

export function showLogin() {
    const storage = window.localStorage,
        userName = storage.getItem('userName'),
        password = storage.getItem('password');

    return {
        type: SHOW_LOGIN,
        userName, password
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
