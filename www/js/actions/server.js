import {fileExists, storeCreds, writeBlob} from '../lib';
import {jsonGet, jsonPost, requestData} from '../lib/net';

import {redirect, setError, setStartupMessage} from './index';
import {loadLocalPics, receivePic} from './pics';

export const
    LOGIN_REQUEST = 'LOGIN_REQUEST',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAIL = 'LOGIN_FAIL',
    REGISTER_REQUEST = 'REGISTER_REQUEST',
    REGISTER_SUCCESS = 'REGISTER_SUCCESS',
    REGISTER_FAIL = 'REGISTER_FAIL',
    FETCH_PICSLIST_REQUEST = 'FETCH_PICSLIST_REQUEST',
    FETCH_PICSLIST_SUCCESS = 'FETCH_PICSLIST_SUCCESS',
    FETCH_PICSLIST_FAIL = 'FETCH_PICSLIST_FAIL',
    SHOW_LOGIN = 'SHOW_LOGIN';


export function fetchPic(pic) {
    return (dispatch, getState) => {
        const {id, download, filename, note} = pic,
            state = getState(),
            originalsDir = state.dirs.originals,
            originalUri = originalsDir.toURL() + filename,
            knownPicIds = state.pics.map((p) => p.id);

        if (!knownPicIds.includes(id)) {
            fileExists(originalUri)
            .then(({uri, exists}) => {
                if (exists) {
                    return uri;
                }
                return requestData(download)
                .then((blob) => writeBlob(blob, originalsDir, filename));
            })
            .then((uri) => dispatch(receivePic(uri, {
                id, note,
                saved: true,
                takenTime: pic.created_at
            })))
            .catch((error) => dispatch(setError(error, 'fetchPic')));
        }
    };
}

export function fetchPicsList() {
    return (dispatch, getState) => {
        const urls = getState().server.urls,
            picsUrl = urls.api + urls.pics,
            authToken = localStorage.getItem('authToken');

        dispatch({type: FETCH_PICSLIST_REQUEST});

        return jsonGet(picsUrl, authToken)
        .then((response) => {
            dispatch({
                type: FETCH_PICSLIST_SUCCESS,
                picsData: response
            });
            return response;
        })
        .then((pics) => {
            pics.forEach((pic) => dispatch(fetchPic(pic)));
            return pics;
        })
        .catch((error) => dispatch({
            type: FETCH_PICSLIST_FAIL, error
        }));
    };
}

export function showLogin(userName) {
    return (dispatch) => {
        dispatch({
            type: SHOW_LOGIN,
            userName
        });
        dispatch(redirect('/login'));
    };
}

export function loginSuccess(userName, authToken) {
    return (dispatch) => {
        storeCreds(userName, authToken);
        dispatch(setStartupMessage('Logged in.'));

        dispatch(loadLocalPics());
        dispatch(fetchPicsList());

        return dispatch({
            type: LOGIN_SUCCESS,
            userName, authToken
        });
    };
}

export function loginFail(userName, error) {
    return (dispatch) => {
        dispatch(setStartupMessage('Login failed.'));
        return dispatch({
            type: LOGIN_FAIL,
            userName, error
        });
    };
}

export function loginWithToken(userName, authToken) {
    return (dispatch, getState) => {
        const urls = getState().server.urls,
            echoUrl = urls.api + urls.tokenEcho;

        return jsonGet(echoUrl, authToken)
        .then((response) => {
            if (response.token && response.token === authToken) {
                dispatch(loginSuccess(userName, authToken));
                dispatch(redirect('/pics'));
            } else {
                dispatch(loginFail(userName, response));
                dispatch(showLogin(userName));
            }
        })
        .catch((error) => {
            dispatch(loginFail(userName, error));
            dispatch(showLogin(userName));
        });
    };
}

export function loginRequest(userName, password) {
    return (dispatch, getState) => {
        const urls = getState().server.urls,
            loginUrl = urls.api + urls.login;

        dispatch({
            type: LOGIN_REQUEST,
            userName, password
        });

        jsonPost(loginUrl, {username: userName, password})
        .then((response) => dispatch(loginSuccess(userName, response.token)))
        .catch((error) => dispatch(loginFail(userName, error)));
    };
}

export function registerSuccess(userName, authToken) {
    return (dispatch) => {
        dispatch({
            type: REGISTER_SUCCESS,
            userName, authToken
        });
        dispatch(loginSuccess(userName, authToken));
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
        const urls = getState().server.urls,
            registerUrl = urls.api + urls.register;

        dispatch({
            type: REGISTER_REQUEST,
            userName
        });

        jsonPost(registerUrl, {username: userName, password})
        .then((resp) => dispatch(registerSuccess(userName, resp.token)))
        .catch((error) => dispatch(registerFail(userName, error)));
    };
}
