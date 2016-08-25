/* global cordova, Camera, LocalFileSystem */
import {hashHistory} from 'react-router';

import {
    loginWithToken,
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL,
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAIL,
    FETCH_PICSLIST_REQUEST, FETCH_PICSLIST_SUCCESS, FETCH_PICSLIST_FAIL
} from './server';


export const
    INIT_APP = 'INIT_APP',
    INIT_CAMERA = 'INIT_CAMERA',
    INIT_DIRECTORIES = 'INIT_DIRECTORIES',
    REDIRECT = 'REDIRECT',
    SAVE_CONFIG = 'SAVE_CONFIG',
    SET_CONFIG_URL = 'SET_CONFIG_URL',
    SET_CONFIG_SETTING = 'SET_CONFIG_SETTING',
    SET_ERROR = 'SET_ERROR',
    SET_STARTUP_FINISHED = 'SET_STARTUP_FINISHED',
    SET_STARTUP_MESSAGE = 'SET_STARTUP_MESSAGE',
    SHOW_LOGIN = 'SHOW_LOGIN';

export {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL,
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAIL,
    FETCH_PICSLIST_REQUEST, FETCH_PICSLIST_SUCCESS, FETCH_PICSLIST_FAIL
};
export * from './pics';


export function redirect(path, replace=true) {
    return (dispatch) => {
        dispatch({
            type: REDIRECT,
            path
        });

        hashHistory[replace ? 'replace' : 'push'](path);
    };
}

export function saveConfig() {
    return (dispatch, getState) => {
        const config = getState().config;

        dispatch({
            type: SAVE_CONFIG,
            config
        });

        window.localStorage.setItem('config', JSON.stringify(config));
    };
}

export function setConfigUrl(key, url) {
    return (dispatch) => {
        dispatch({
            type: SET_CONFIG_URL,
            key,
            url
        });
        dispatch(saveConfig());
    };
}

export function setConfigSetting(key, value) {
    return (dispatch) => {
        dispatch({
            type: SET_CONFIG_SETTING,
            key, value
        });
        dispatch(saveConfig());
    };
}

export function setStartupFinished(finished=true) {
    return (dispatch) => {
        dispatch({
            type: SET_STARTUP_FINISHED,
            finished
        });

        dispatch(redirect('/pics'));
    };
}

export function setStartupMessage(message) {
    return {
        type: SET_STARTUP_MESSAGE,
        message
    };
}

export function setError(error, src) {
    return {
        type: SET_ERROR,
        error, src
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
            picsDirs = Object.keys(dirConf).filter((d) => d !== 'pics'),
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
        .then((dataDir) => new Promise((resolve, reject) => {
            dataDirectory = dataDir;
            dataDir.getDirectory(dirConf.pics, options, resolve, reject);
        }))
        .then((picsEntry) => {
            dirs.pics = picsEntry;
            return Promise.all(picsDirs.map(
                (dirName) => new Promise((resolve, reject) => {
                    picsEntry.getDirectory(dirName, options, (dirEntry) => {
                        dirs[dirName] = dirEntry;
                        resolve();
                    }, reject);
                })
            ));
        })
        .then(() => dispatch({
            type: INIT_DIRECTORIES,
            dataDirectory, dirs
        }));
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
    return (dispatch, getState) => {
        const storedConfig = JSON.parse(window.localStorage.getItem('config'));

        dispatch({
            type: INIT_APP,
            config: Object.assign({}, getState().config, storedConfig)
        });

        dispatch(setStartupMessage('Looking for camera...'));
        dispatch(initCamera());
        dispatch(setStartupMessage('Setting up storage...'));
        dispatch(initDirectories())
            .then(() => {
                dispatch(setStartupMessage('Logging in...'));
                dispatch(initLogin());
            });

        dispatch(saveConfig());
    };
}
