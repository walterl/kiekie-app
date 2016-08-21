/* global cordova, Camera */
import uuid from 'uuid';

import {copyLocalFile, nextDebugPic, resizeImage} from '../lib';

import {logError} from './index';

export const
    CAMERA_PIC_REQUEST = 'CAMERA_PIC_REQUEST',
    CAMERA_PIC_ERROR = 'CAMERA_PIC_ERROR',
    RECEIVE_PIC = 'RECEIVE_PIC',
    UPDATE_PIC = 'UPDATE_PIC',
    DELETE_PIC = 'DELETE_PIC',
    DELETE_PIC_REQUEST = 'DELETE_PIC_REQUEST',
    DELETE_PIC_CANCEL = 'DELETE_PIC_CANCEL',
    RESIZE_ERROR = 'RESIZE_ERROR',
    SAVE_PIC = 'SAVE_PIC',
    SET_PIC_SELECTED = 'SET_PIC_SELECTED',
    SET_NOTE = 'SET_NOTE',
    SET_PIC_DATA = 'SET_PIC_DATA',
    THUMBNAIL_ERROR = 'THUMBNAIL_ERROR';

export function requestCameraPic() {
    return {type: CAMERA_PIC_REQUEST};
}

export function cameraPicError(error) {
    return {
        type: CAMERA_PIC_ERROR,
        error
    };
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
        }, logError);
    };
}

export function resizeError(id, error) {
    return {
        type: RESIZE_ERROR,
        id, error
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
            return dispatch(updatePic(id, resizedUrl));
        }, logError);
    };
}

export function receivePic(imgUri) {
    return (dispatch, getState) => {
        const picId = uuid.v1(),
            originalsDir = getState().dirs.originals;

        dispatch({
            type: RECEIVE_PIC,
            id: picId,
            uri: imgUri,
            takenTime: Date.now()
        });

        return dispatch(copyPic(picId, imgUri, originalsDir, 'original'))
            .then(() => dispatch(generateThumbnail(picId, imgUri)))
            .then(() => dispatch(resizePic(picId, imgUri)));
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
            dispatch(receivePic(nextDebugPic(), Date.now()));
            dispatch(receivePic(nextDebugPic(), Date.now()));
            dispatch(receivePic(nextDebugPic(), Date.now()));
            dispatch(receivePic(nextDebugPic(), Date.now()));
            dispatch(receivePic(nextDebugPic(), Date.now()));
        }
    };
}
