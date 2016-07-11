import uuid from 'uuid';


export const
    SET_DEBUG = 'SET_DEBUG',
    REQUEST_TAKE_PHOTO = 'REQUEST_TAKE_PHOTO',
    RECEIVE_PIC = 'RECEIVE_PIC',
    TAKE_PHOTO_ERROR = 'TAKE_PHOTO_ERROR',
    SELECT_PIC = 'SELECT_PIC',
    DELETE_PIC = 'DELETE_PIC',
    SAVE_PIC = 'SAVE_PIC',
    SET_NOTE = 'SET_NOTE';


export function setDebug(debug) {
    return {
        type: SET_DEBUG,
        debug: Boolean(debug)
    };
}

function requestTakePhoto() {
    return {type: REQUEST_TAKE_PHOTO};
}

function takePhotoError(error) {
    return {
        type: TAKE_PHOTO_ERROR,
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

export function takePhoto() {
    return (dispatch) => {
        dispatch(requestTakePhoto());
        navigator.camera.getPicture(
            (picData) => {
                dispatch(receivePic(
                    `data:image/png;base64,${picData}`, Date.now()
                ));
            },
            (message) => {
                dispatch(takePhotoError(message));
            }
        );
    };
}

export function deletePic(id) {
    return {
        type: DELETE_PIC,
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
        type: SELECT_PIC,
        id
    };
}
