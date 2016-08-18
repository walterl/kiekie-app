/* global cordova, Camera, LocalFileSystem */
import uuid from 'uuid';

import {copyPic, nextDebugPic, resizeImage} from '../lib';
import {
    loginWithToken, showLogin,
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL,
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAIL,
    SHOW_LOGIN
} from './server';


export const
    START_INIT = 'START_INIT',
    FINISH_INIT = 'FINISH_INIT',
    INIT_ROUTE_FOLLOWED = 'INIT_ROUTE_FOLLOWED',
    INIT_APP = 'INIT_APP',
    INIT_CAMERA = 'INIT_CAMERA',
    INIT_DIRECTORIES = 'INIT_DIRECTORIES',
    SET_DEBUG = 'SET_DEBUG',
    CAMERA_PIC_REQUEST = 'CAMERA_PIC_REQUEST',
    CAMERA_PIC_ERROR = 'CAMERA_PIC_ERROR',
    RECEIVE_PIC = 'RECEIVE_PIC',
    UPDATE_PIC = 'UPDATE_PIC',
    DELETE_PIC = 'DELETE_PIC',
    DELETE_PIC_REQUEST = 'DELETE_PIC_REQUEST',
    DELETE_PIC_CANCEL = 'DELETE_PIC_CANCEL',
    SAVE_PIC = 'SAVE_PIC',
    SET_PIC_SELECTED = 'SET_PIC_SELECTED',
    SET_NOTE = 'SET_NOTE',
    SET_THUMBNAIL = 'SET_THUMBNAIL',
    SET_UI_STATE = 'SET_UI_STATE',
    RESIZE_ERROR = 'RESIZE_ERROR',
    THUMBNAIL_ERROR = 'THUMBNAIL_ERROR';
export {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL,
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAIL,
    SHOW_LOGIN
};

var logError = () => {};


export function setDebug(debug) {
    return {
        type: SET_DEBUG,
        debug: Boolean(debug)
    };
}

export function requestCameraPic() {
    return {type: CAMERA_PIC_REQUEST};
}

export function cameraPicError(error) {
    return {
        type: CAMERA_PIC_ERROR,
        error
    };
}

export function receivePic(uri, takenTime, id) {
    const action = {
        type: RECEIVE_PIC,
        id, uri, takenTime
    };

    return (dispatch, getState) => {
        const state = getState();
        id = id || uuid.v1();

        return new Promise((resolve, reject) => {
            if (cordova.isBrowser) {
                dispatch(action);
                resolve();
                return;
            }

            copyPic(uri, state.dirs.originals, (entry) => {
                dispatch(Object.assign(action, {uri: entry.toURL()}));
                resolve();
            }, () => {
                dispatch(action);
                reject();
            });
        });
    };
}

export function updatePic(id, uri) {
    return {
        type: UPDATE_PIC,
        id, uri
    };
}

export function thumbnailError(id, error) {
    return {
        type: THUMBNAIL_ERROR,
        id, error
    };
}

export function setThumbnail(id, thumbnail) {
    return {
        type: SET_THUMBNAIL,
        id, thumbnail
    };
}

export function generateThumbnail(id) {
    return (dispatch, getState) => {
        const state = getState(),
            cellHeight = state.ui.picsList.cellHeight,
            outputDir = state.dirs.thumbnails;
        var pic = state.pics.filter((p) => p.id === id);

        if (!pic || !pic.length) {
            return dispatch(thumbnailError(id, 'Picture does not exist'));
        }
        pic = pic[0];

        if (cordova.isBrowser) {
            return dispatch(setThumbnail(id, pic.uri));
        }

        resizeImage(pic.uri, {
            height: cellHeight,
            width: cellHeight,
            outputDir
        }, (result) => {
            const filename = result.filename || result.name,
                // ^ Sometimes -- when result is copied, not resized --
                // `result` is a FileEntry
                thumbnailUrl = outputDir.toURL() + filename;
            return dispatch(setThumbnail(id, thumbnailUrl));
        }, logError);
    };
}

export function resizeError(id, error) {
    return {
        type: RESIZE_ERROR,
        id, error
    };
}

export function resizePic(id) {
    return (dispatch, getState) => {
        const state = getState(),
            maxSize = state.config.picMaxSize,
            outputDir = state.dirs.gallery;
        var pic = state.pics.filter((p) => p.id === id);

        if (!pic || !pic.length) {
            return dispatch(resizeError(id, 'Picture does not exizt'));
        }
        pic = pic[0];

        if (cordova.isBrowser) {
            return;
        }

        resizeImage(pic.uri, {
            height: maxSize,
            width: maxSize,
            outputDir
        }, (result) => {
            const filename = result.filename || result.name,
                // ^ Sometimes -- when result is copied, not resized --
                // `result` is a FileEntry
                resizedUrl = outputDir.toURL() + filename;
            return dispatch(updatePic(id, resizedUrl));
        }, logError);
    };
}

export function processPic(imgUri) {
    return (dispatch) => {
        const picId = uuid.v1();

        return dispatch(receivePic(imgUri, Date.now(), picId))
            .then(() => dispatch(generateThumbnail(picId)))
            .then(() => dispatch(resizePic(picId)));
    };
}

export function requestPic(source) {
    return (dispatch, getState) => {
        const options = Object.assign({}, getState().config.camera);

        if (source === 'gallery') {
            options.sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        }

        dispatch(requestCameraPic());
        navigator.camera.getPicture(
            (imgUri) => dispatch(processPic(imgUri)),
            (message) => dispatch(cameraPicError(message)),
            options
        );
    };
}

export function deletePic(id) {
    return {
        type: DELETE_PIC,
        id
    };
}

export function requestDeletePic(id) {
    return {
        type: DELETE_PIC_REQUEST,
        id
    };
}

export function cancelDeletePic(id) {
    return {
        type: DELETE_PIC_CANCEL,
        id
    };
}

export function savePic(id) {
    return {
        type: SAVE_PIC,
        id
    };
}

export function setNote(id, note) {
    return {
        type: SET_NOTE,
        id, note
    };
}

export function selectPic(id) {
    return {
        type: SET_PIC_SELECTED,
        id
    };
}

export function loadTestImages() {
    return (dispatch, getState) => {
        if (getState().config.debug) {
            dispatch(processPic(nextDebugPic(), Date.now()));
            dispatch(processPic(nextDebugPic(), Date.now()));
            dispatch(processPic(nextDebugPic(), Date.now()));
            dispatch(processPic(nextDebugPic(), Date.now()));
            dispatch(processPic(nextDebugPic(), Date.now()));
        }
    };
}

export function startInit(component) {
    return {
        type: START_INIT,
        component
    };
}

export function finishInit(component) {
    return {
        type: FINISH_INIT,
        component
    };
}

export function initRouteFollowed(route) {
    return {
        type: INIT_ROUTE_FOLLOWED,
        route
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

        if (state.config.debug) {
            // eslint-disable-next-line no-console
            logError = (err) => console.error(err);
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
                dataDirectory,
                dirs
            })
        );
    };
}

export function initAccount() {
    return (dispatch) => {
        const storage = window.localStorage,
            userName = storage.getItem('userName'),
            token = storage.getItem('apiToken');

        if (token) {
            return dispatch(loginWithToken(userName, token));
        }

        return dispatch(showLogin());
    };
}

export function initApp() {
    return (dispatch) => {
        dispatch({
            type: INIT_APP,
            done: false
        });

        dispatch(startInit('camera'));
        dispatch(initCamera());
        dispatch(finishInit('camera'));

        dispatch(startInit('dirs'));
        dispatch(initDirectories())
            .then(() => dispatch(finishInit('dirs')));

        dispatch(startInit('account'));
        dispatch(initAccount());
    };
}
