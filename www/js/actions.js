import uuid from 'uuid';


export const
    REQUEST_TAKE_PHOTO = 'REQUEST_TAKE_PHOTO',
    RECEIVE_PIC = 'RECEIVE_PIC',
    TAKE_PHOTO_ERROR = 'TAKE_PHOTO_ERROR',
    DELETE_PIC = 'DELETE_PIC',
    SAVE_PIC = 'SAVE_PIC';


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
                dispatch(receivePic(picData, Date.now()));
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
