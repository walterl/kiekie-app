/* global cordova, Camera */
import uuid from 'uuid';

import {copyPic, nextDebugPic, resizeImage} from '../lib';

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
    SET_THUMBNAIL = 'SET_THUMBNAIL',
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
