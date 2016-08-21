/* global cordova, Camera */
import uuid from 'uuid';

import {copyLocalFile, nextDebugPic, resizeImage} from '../lib';

import {logError} from './index';

export const
    CAMERA_PIC_REQUEST = 'CAMERA_PIC_REQUEST',
    CAMERA_PIC_ERROR = 'CAMERA_PIC_ERROR',
    COPY_PIC = 'COPY_PIC',
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
            dispatch({
                type: COPY_PIC,
                dest: src,
                id, src, label
            });
            resolve();
            return;
        }

        copyLocalFile(src, dest, (entry) => {
            dispatch({
                type: COPY_PIC,
                dest: entry.toURL(),
                id, src, label
            });
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

export function setThumbnail(id, thumbnail) {
    return {
        type: SET_THUMBNAIL,
        id, thumbnail
    };
}

export function generateThumbnail(id, uri) {
    return (dispatch, getState) => {
        const state = getState(),
            cellHeight = state.ui.picsList.cellHeight,
            outputDir = state.dirs.thumbnails;

        if (cordova.isBrowser) {
            return dispatch(setThumbnail(id, uri));
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
