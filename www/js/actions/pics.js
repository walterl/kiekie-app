/* global cordova, Camera */
import uuid from 'uuid';

import {copyLocalFile, fileExists, resizeImage} from '../lib';

import {setError} from './index';
import {fetchPicsList, updatePicRequest} from './server';

export const
    CAMERA_PIC_REQUEST = 'CAMERA_PIC_REQUEST',
    CLEAR_PICS_LIST = 'CLEAR_PICS_LIST',
    COPY_PIC = 'COPY_PIC',
    COPY_PIC_SUCCESS = 'COPY_PIC_SUCCESS',
    GENERATE_THUMBNAIL = 'GENERATE_THUMBNAIL',
    GENERATE_THUMBNAIL_SUCCESS = 'GENERATE_THUMBNAIL_SUCCESS',
    LOAD_ALL_PICS = 'LOAD_ALL_PICS',
    RECEIVE_PIC = 'RECEIVE_PIC',
    PIC_INIT_SUCCESS = 'PIC_INIT_SUCCESS',
    PIC_INIT_FAIL = 'PIC_INIT_FAIL',
    RESIZE_PIC = 'RESIZE_PIC',
    RESIZE_PIC_SUCCESS = 'RESIZE_PIC_SUCCESS',
    RESTORE_PIC = 'RESTORE_PIC',
    SAVE_PIC = 'SAVE_PIC',
    SAVE_PIC_REQUEST = 'SAVE_PIC_REQUEST',
    SAVE_ALL_PICS = 'SAVE_ALL_PICS',
    SELECT_PIC = 'SELECT_PIC',
    SET_PIC_DATA = 'SET_PIC_DATA';

export function requestCameraPic() {
    return {type: CAMERA_PIC_REQUEST};
}

export function setPicData(id, data) {
    return {
        type: SET_PIC_DATA,
        id, data
    };
}

/**
 * Copy pic `id` from `src` to `dest`.
 *
 * @arg String id Pic ID. Simply passed on via dispatched action.
 * @arg String src Source URI string.
 * @arg DirectoryEntry dest The directory (entry) to copy the file at the `src`
 * URI to.
 * @arg String label Simply passed on to the dispatched action. The pics
 * reducer should set the destination URI at this key in the pic's state.
 */
export function copyPic(id, src, dest, label) {
    return (dispatch) => new Promise((resolve, reject) => {
        if (cordova.isBrowser) {
            if (label) {
                dispatch(setPicData(id, {[label]: src}));
            }
            resolve();
            return;
        }

        dispatch({
            type: COPY_PIC,
            id, src, dest, label
        });

        copyLocalFile(src, dest, (entry) => {
            dispatch({
                type: COPY_PIC_SUCCESS,
                id, src, label,
                dest: entry.toURL()
            });

            if (label) {
                dispatch(setPicData(id, {
                    [label]: entry.toURL()
                }));
            }
            resolve();
        }, reject);
    });
}

export function generateThumbnail(id, uri) {
    return (dispatch, getState) => {
        const state = getState(),
            cellHeight = state.ui.picsList.cellHeight,
            outputDir = state.dirs.thumbnails;

        dispatch({
            type: GENERATE_THUMBNAIL,
            id, uri
        });

        if (cordova.isBrowser) {
            return dispatch(setPicData(id, {thumbnail: uri}));
        }

        return new Promise((resolve, reject) => {
            resizeImage(uri, {
                height: cellHeight,
                width: cellHeight,
                outputDir
            }, (result) => {
                const filename = result.filename || result.name,
                    // ^ Sometimes -- when result is copied, not resized --
                    // `result` is a FileEntry
                    thumbnailUrl = outputDir.toURL() + filename;
                dispatch({
                    type: GENERATE_THUMBNAIL_SUCCESS,
                    id, cellHeight,
                    input: uri,
                    thumbnail: thumbnailUrl
                });
                dispatch(setPicData(id, {thumbnail: thumbnailUrl}));
                resolve();
            }, reject);
        });
    };
}

export function resizePic(id, uri) {
    return (dispatch, getState) => {
        const state = getState(),
            maxSize = state.config.picMaxSize,
            outputDir = state.dirs.gallery;

        dispatch({
            type: RESIZE_PIC,
            id, uri
        });

        if (cordova.isBrowser) {
            return;
        }

        return new Promise((resolve, reject) => {
            resizeImage(uri, {
                height: maxSize,
                width: maxSize,
                outputDir
            }, (result) => {
                const filename = result.filename || result.name,
                    // ^ Sometimes -- when result is copied, not resized --
                    // `result` is a FileEntry
                    resizedUrl = outputDir.toURL() + filename;
                dispatch({
                    type: RESIZE_PIC_SUCCESS,
                    id, maxSize,
                    input: uri,
                    resized: resizedUrl
                });
                dispatch(setPicData(id, {
                    uri: resizedUrl, originalUri: uri
                }));
                resolve();
            }, reject);
        });
    };
}

export function receivePic(uri, {id, note, saved, takenTime}={}) {
    return (dispatch, getState) => {
        const originalsDir = getState().dirs.originals;
        id = id || uuid.v1();
        takenTime = takenTime || Date.now();

        if (uri.startsWith('/')) {
            uri = `file://${uri}`;
        }

        dispatch({
            type: RECEIVE_PIC,
            id, uri, note, saved, takenTime
        });

        return dispatch(copyPic(id, uri, originalsDir, 'original'))
            .then(() => dispatch(generateThumbnail(id, uri)))
            .then(() => dispatch(resizePic(id, uri)))
            .then(() => dispatch({
                type: PIC_INIT_SUCCESS,
                id, uri, note, saved, takenTime
            }))
            .catch((error) => dispatch({
                type: PIC_INIT_FAIL,
                id, uri, error
            }));
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
            (imgUri) => dispatch(receivePic(imgUri)),
            (message) => dispatch(setError(message, 'requestPic')),
            options
        );
    };
}

export function restorePic(pic) {
    return {
        type: RESTORE_PIC,
        pic
    };
}

export function confirmDeletePic(id) {
    return {
        type: SET_PIC_DATA,
        id,
        data: {confirmDelete: true}
    };
}

export function cancelDeletePic(id) {
    return {
        type: SET_PIC_DATA,
        id,
        data: {confirmDelete: null}
    };
}

export function savePic(id) {
    return (dispatch) => {
        dispatch({
            type: SAVE_PIC_REQUEST,
            id
        });

        dispatch(updatePicRequest(id))
        .then(() => dispatch({
            type: SAVE_PIC,
            id
        }))
        .catch((error) => dispatch(setError(error, 'savePic')));
    };
}

export function saveAllPics() {
    return (dispatch, getState) => {
        dispatch({type: SAVE_ALL_PICS});

        getState().pics
            .filter((pic) => !pic.saved)
            .forEach((pic) => dispatch(savePic(pic.id)));
    };
}

export function setNote(id, note) {
    return {
        type: SET_PIC_DATA,
        id,
        data: {note, saved: false}
    };
}

export function selectPic(id) {
    return {
        type: SELECT_PIC,
        id
    };
}

export function loadLocalPics() {
    return (dispatch) => {
        const picsInfo = JSON.parse(window.localStorage.getItem('picsInfo'));

        if (!picsInfo) {
            return;
        }

        picsInfo.forEach((pic) => {
            const missingFiles = ['uri', 'thumbnail', 'original']
                .filter((key) => key in pic)
                .filter((key) => !fileExists(pic[key]));
            if (!missingFiles.length) {
                dispatch(restorePic(pic));
            }
        });
    };
}

export function loadAllPics() {
    return (dispatch) => {
        if (window.localStorage.getItem('authToken')) {
            dispatch({type: LOAD_ALL_PICS});
            dispatch(loadLocalPics());
            dispatch(fetchPicsList());
        }
    };
}

export function clearPicsList() {
    return {type: CLEAR_PICS_LIST};
}

export function reloadPics() {
    return (dispatch) => {
        dispatch(clearPicsList());
        dispatch(loadAllPics());
    };
}
