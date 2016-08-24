/* global cordova, FileTransfer */
import {fileExists, readBlob, storeCreds, writeBlob} from '../lib';
import {
    HTTP_NOT_FOUND, formPost, jsonDelete, jsonGet, jsonPost, jsonPut,
    requestData
} from '../lib/net';

import {redirect, setError, setStartupMessage} from './index';
import {loadLocalPics, receivePic} from './pics';

export const
    DELETE_PIC_REQUEST = 'DELETE_PIC_REQUEST',
    DELETE_PIC_SUCCESS = 'DELETE_PIC_SUCCESS',
    DELETE_PIC_FAIL = 'DELETE_PIC_FAIL',
    LOGIN_REQUEST = 'LOGIN_REQUEST',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAIL = 'LOGIN_FAIL',
    REGISTER_REQUEST = 'REGISTER_REQUEST',
    REGISTER_SUCCESS = 'REGISTER_SUCCESS',
    REGISTER_FAIL = 'REGISTER_FAIL',
    FETCH_PICSLIST_REQUEST = 'FETCH_PICSLIST_REQUEST',
    FETCH_PICSLIST_SUCCESS = 'FETCH_PICSLIST_SUCCESS',
    FETCH_PICSLIST_FAIL = 'FETCH_PICSLIST_FAIL',
    FETCH_PIC = 'FETCH_PIC',
    SHOW_LOGIN = 'SHOW_LOGIN',
    UPDATE_PIC_REQUEST = 'UPDATE_PIC_REQUEST',
    UPDATE_PIC_SUCCESS = 'UPDATE_PIC_SUCCESS',
    UPDATE_PIC_FAIL = 'UPDATE_PIC_FAIL',
    UPLOAD_PIC_REQUEST = 'UPLOAD_PIC_REQUEST',
    UPLOAD_PIC_SUCCESS = 'UPLOAD_PIC_SUCCESS',
    UPLOAD_PIC_FAIL = 'UPLOAD_PIC_FAIL';


export function fetchPic(pic) {
    return (dispatch, getState) => {
        const {id, download, filename, note} = pic,
            takenTime = pic.created_at,
            state = getState(),
            originalsDir = state.dirs.originals,
            originalUri = originalsDir.toURL() + filename,
            knownPicIds = state.pics.map((p) => p.id);

        dispatch({
            type: FETCH_PIC,
            id, download, filename, note
        });

        if (!knownPicIds.includes(id)) {
            fileExists(originalUri)
            .then(({uri, exists}) => {
                if (exists) {
                    return uri;
                }
                return requestData(download)
                .then((blob) => writeBlob(blob, originalsDir, filename));
            })
            .then((uri) => {
                // Get data URL for file contents blob, since browser doesn't
                // seem to support filesystem URLs.
                if (cordova.isBrowser) {
                    return readBlob(uri)
                    .then((blob) => window.URL.createObjectURL(blob));
                }
                return uri;
            })
            .then((uri) => dispatch(receivePic(uri, {
                id, note, takenTime,
                saved: true
            })))
            .catch((error) => dispatch(setError(error, 'fetchPic')));
        }
    };
}

export function fetchPicsList() {
    return (dispatch, getState) => {
        const urls = getState().config.urls,
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

export function uploadPic({id, note, uri} = {}) {
    return (dispatch, getState) => {
        const urls = getState().config.urls;

        dispatch({
            type: UPLOAD_PIC_REQUEST,
            id, note, uri
        });

        if (cordova.isBrowser) {
            return new Promise((resolve, reject) => {
                readBlob(uri)
                .then((blob) => {
                    const formData = new FormData();
                    formData.append('id', id);
                    formData.append('note', note);
                    formData.append('file', blob);
                    return formData;
                })
                .then((data) => formPost(`${urls.api}${urls.pics}`, data))
                .then((response) => {
                    dispatch({
                        type: UPLOAD_PIC_SUCCESS,
                        id, response
                    });
                    resolve();
                })
                .catch((error) => {
                    dispatch({
                        type: UPLOAD_PIC_FAIL,
                        id, error
                    });
                    reject(error);
                });
            });
        }

        return new Promise((resolve, reject) => {
            const authToken = window.localStorage.getItem('authToken'),
                options = {
                    fileKey: 'file',
                    fileName: uri.substr(uri.lastIndexOf('/') + 1),
                    mimeType: 'image/jpeg',
                    params: {id, note},
                    headers: {'Authorization': `Token ${authToken}`}
                },
                ft = new FileTransfer();
            ft.upload(
                uri, encodeURI(`${urls.api}${urls.pics}`),
                (response) => {
                    dispatch({
                        type: UPLOAD_PIC_SUCCESS,
                        id, response
                    });
                    resolve();
                },
                (error) => {
                    dispatch({
                        type: UPLOAD_PIC_FAIL,
                        id, error
                    });
                    reject(error);
                },
                options
            );
        });
    };
}

export function updatePicRequest(id) {
    return (dispatch, getState) => {
        const urls = getState().config.urls;
        var pic = getState().pics.filter((p) => p.id === id),
            error = null;

        return new Promise((resolve, reject) => {
            if (!pic.length) {
                error = new Error('Picture not found');
                error.id = id;
                reject(error);
                return;
            }
            pic = pic[0];

            dispatch({
                type: UPDATE_PIC_REQUEST,
                pic
            });

            jsonPut(`${urls.api}${urls.pics}${id}/`, {note: pic.note})
            .then(() => {
                // If the PUT succeeded, it means that the pic was previously
                // created (and presumably uploaded). Therefore we don't upload
                // it again.
                dispatch({
                    type: UPDATE_PIC_SUCCESS,
                    id
                });
                resolve();
            })
            .catch((err) => {
                if (err.response.status === HTTP_NOT_FOUND) {
                    // Pic does not yet exist on server. Let's create it.
                    return dispatch(uploadPic(pic))
                    .then(resolve)
                    .catch(reject);
                }
                dispatch({
                    type: UPDATE_PIC_FAIL,
                    id, err
                });
                reject(err);
            });
        });
    };
}

export function deletePicRequest(id) {
    return (dispatch, getState) => {
        const urls = getState().config.urls,
            picUrl = `${urls.api}${urls.pics}${id}/`;

        dispatch({
            type: DELETE_PIC_REQUEST,
            id
        });

        jsonDelete(picUrl)
        .then(() => dispatch({
            type: DELETE_PIC_SUCCESS,
            id
        }))
        .catch((error) => dispatch({
            type: DELETE_PIC_FAIL,
            error
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
        const urls = getState().config.urls,
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
        const urls = getState().config.urls,
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
        const urls = getState().config.urls,
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
