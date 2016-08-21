/* global cordova, Camera */
import uuid from 'uuid';

import {copyLocalFile, nextDebugPic, resizeImage} from '../lib';

import {setError} from './index';

export const
    CAMERA_PIC_REQUEST = 'CAMERA_PIC_REQUEST',
    RECEIVE_PIC = 'RECEIVE_PIC',
    DELETE_PIC = 'DELETE_PIC',
    SAVE_PIC = 'SAVE_PIC',
    SELECT_PIC = 'SAVE_PIC',
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

        copyLocalFile(src, dest, (entry) => {
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

        if (cordova.isBrowser) {
            return dispatch(setPicData(id, {thumbnail: uri}));
        }

        resizeImage(uri, {
            height: cellHeight,
            width: cellHeight,
            outputDir
        }, (result) => {
            const filename = result.filename || result.name,
                // ^ Sometimes -- when result is copied, not resized --
                // `result` is a FileEntry
                thumbnailUrl = outputDir.toURL() + filename;
            return dispatch(setPicData(id, {thumbnail: thumbnailUrl}));
        }, (error) => dispatch(setError(error, 'generateThumbnail')));
    };
}

export function resizePic(id, uri) {
    return (dispatch, getState) => {
        const state = getState(),
            maxSize = state.config.picMaxSize,
            outputDir = state.dirs.gallery;

        if (cordova.isBrowser) {
            return;
        }

        resizeImage(uri, {
            height: maxSize,
            width: maxSize,
            outputDir
        }, (result) => {
            const filename = result.filename || result.name,
                // ^ Sometimes -- when result is copied, not resized --
                // `result` is a FileEntry
                resizedUrl = outputDir.toURL() + filename;
            return dispatch(setPicData(id, {
                uri: resizedUrl, originalUri: uri
            }));
        }, (error) => dispatch(setError(error, 'resizePic')));
    };
}

export function receivePic(uri) {
    return (dispatch, getState) => {
        const id = uuid.v1(),
            originalsDir = getState().dirs.originals;

        dispatch({
            type: RECEIVE_PIC,
            id, uri,
            takenTime: Date.now()
        });

        return dispatch(copyPic(id, uri, originalsDir, 'original'))
            .then(() => dispatch(generateThumbnail(id, uri)))
            .then(() => dispatch(resizePic(id, uri)));
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

export function deletePic(id) {
    return {
        type: DELETE_PIC,
        id
    };
}

export function requestDeletePic(id) {
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
    return {
        type: SAVE_PIC,
        id
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

export function loadTestImages() {
    return (dispatch, getState) => {
        if (getState().config.debug) {
            dispatch(receivePic(nextDebugPic(), Date.now()));
            dispatch(receivePic(nextDebugPic(), Date.now()));
            dispatch(receivePic(nextDebugPic(), Date.now()));
            dispatch(receivePic(nextDebugPic(), Date.now()));
            dispatch(receivePic(nextDebugPic(), Date.now()));
        }
    };
}

export function loadLocalPics() {
    return (dispatch) => {
        if (cordova.isBrowser) {
            dispatch(loadTestImages());
            return;
        }
    };
}
