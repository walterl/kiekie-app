/* global Camera */
import uuid from 'uuid';

import {resizeImage} from './lib';


export const
    INIT_CAMERA = 'INIT_CAMERA',
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
    THUMBNAIL_ERROR = 'THUMBNAIL_ERROR';


export function initCamera() {
    return {
        type: INIT_CAMERA,
        config: {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: true,
            correctOrientation: true
        }
    };
}

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

export function receivePic(picData, takenTime) {
    return {
        type: RECEIVE_PIC,
        data: picData,
        picId: uuid.v1(),
        takenTime
    };
}

export function updatePic(id, data) {
    return {
        type: UPDATE_PIC,
        id, data
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
            thumbnailDir = 'thumbnails';
        var pic = state.pics.filter((p) => p.id === id),
            thumbnail = null;

        if (!pic || !pic.length) {
            dispatch(thumbnailError(id, 'Picture does not exist'));
        }
        pic = pic[0];

        thumbnail = resizeImage(pic.data, {
            maxHeight: cellHeight,
            maxWidth: cellHeight,
            outputDir: thumbnailDir
        });
        dispatch(setThumbnail(id, thumbnail));
    };
}

export function resizePic(id) {
    return (dispatch, getState) => {
        const state = getState(),
            maxSize = state.config.picMaxSize,
            imageDir = 'resized';
        var pic = state.pics.filter((p) => p.id === id),
            resized = null;

        if (!pic || !pic.length) {
            dispatch(thumbnailError(id, 'Picture does not exist'));
        }
        pic = pic[0];

        resized = resizeImage(pic.data, {
            maxHeight: maxSize,
            maxWidth: maxSize,
            outputDir: imageDir
        });
        if (resized) {
            dispatch(updatePic(id, resized));
        }
    };
}

export function processPic(imgUri) {
    return (dispatch) => {
        var pic = receivePic(imgUri, Date.now());
        dispatch(pic);
        dispatch(generateThumbnail(pic.picId));
        dispatch(resizePic(pic.picId));
    };
}

export function takePhoto(source) {
    return (dispatch, getState) => {
        const options = Object.assign({}, getState().config.camera);

        if (source === 'gallery') {
            options.sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        }

        dispatch(requestCameraPic());
        navigator.camera.getPicture(
            (imgUri) => {
                dispatch(processPic(imgUri));
            },
            (message) => {
                dispatch(cameraPicError(message));
            },
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
