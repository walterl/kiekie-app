/* global cordova, Camera, LocalFileSystem */
import {hashHistory} from 'react-router';

import {
    loginWithToken, showLogin,
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL,
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAIL,
    FETCH_PICSLIST_REQUEST, FETCH_PICSLIST_SUCCESS, FETCH_PICSLIST_FAIL,
    SHOW_LOGIN
} from './server';


export const
    INIT_APP = 'INIT_APP',
    INIT_CAMERA = 'INIT_CAMERA',
    INIT_DIRECTORIES = 'INIT_DIRECTORIES',
    REDIRECT = 'REDIRECT',
    SET_DEBUG = 'SET_DEBUG',
    SET_ERROR = 'SET_ERROR',
    SET_STARTUP_MESSAGE = 'SET_STARTUP_MESSAGE';
export {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL,
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAIL,
    FETCH_PICSLIST_REQUEST, FETCH_PICSLIST_SUCCESS, FETCH_PICSLIST_FAIL,
    SHOW_LOGIN
};
export * from './pics';


export function redirect(path) {
    return (dispatch) => {
        dispatch({
            type: REDIRECT,
            path
        });
        hashHistory.push(path);
    };
}

export function setDebug(debug) {
    return {
        type: SET_DEBUG,
        debug: Boolean(debug)
    };
}

export function setStartupMessage(message) {
    return {
        type: SET_STARTUP_MESSAGE,
        message
    };
}

export function setError(error) {
    return {
        type: SET_ERROR,
        error
    };
}

export function initCamera() {
    return {
        type: INIT_CAMERA,
        config: {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            correctOrientation: true
        }
    };
}

export function initDirectories(dataDirURL) {
    return (dispatch, getState) => {
        const
            state = getState(),
            dirConf = state.config.dirs,
            options = {create: true, exclusive: false};
        var dirs = {},
            dataDirectory = null;

        if (typeof dataDirURL === 'undefined') {
            if (cordova.isBrowser) {
                return new Promise((resolve, reject) =>
                    window.requestFileSystem(
                        LocalFileSystem.TEMPORARY, 100*1024*1024, (fs) => {
                            resolve(fs.root.toURL());
                        }, reject
                    )
                )
                .then((fsURL) => dispatch(initDirectories(fsURL)));
            }
            dataDirURL = cordova.file.externalDataDirectory;
        }

        return new Promise((resolve, reject) =>
            window.resolveLocalFileSystemURL(dataDirURL, resolve, reject)
        )
        .then((dataDir) =>
            new Promise((resolve, reject) => {
                dataDirectory = dataDir;
                dataDir.getDirectory(dirConf.pics, options, resolve, reject);
            })
        )
        .then((picsEntry) => {
            dirs.pics = picsEntry;
            return Promise.all(['gallery', 'originals', 'thumbnails'].map(
                (dirName) => new Promise((resolve, reject) => {
                    picsEntry.getDirectory(dirName, options, (dirEntry) => {
                        dirs[dirName] = dirEntry;
                        resolve();
                    }, reject);
                })
            ));
        })
        .then(() =>
            dispatch({
                type: INIT_DIRECTORIES,
                dataDirectory, dirs
            })
        );
    };
}

export function initLogin() {
    return (dispatch) => {
        const storage = window.localStorage,
            userName = storage.getItem('userName'),
            token = storage.getItem('authToken');

        if (token) {
            return dispatch(loginWithToken(userName, token));
        }

        return dispatch(showLogin(userName));
    };
}

export function initApp() {
    return (dispatch) => {
        dispatch({
            type: INIT_APP
        });

        dispatch(setStartupMessage('Looking for camera...'));
        dispatch(initCamera());
        dispatch(setStartupMessage('Setting up storage...'));
        dispatch(initDirectories())
            .then(() => {
                dispatch(setStartupMessage('Logging in...'));
                dispatch(initLogin());
            });
    };
}
