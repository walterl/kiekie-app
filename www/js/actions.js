export const
    REQUEST_TAKE_PHOTO = 'REQUEST_TAKE_PHOTO',
    RECEIVE_PIC = 'RECEIVE_PIC',
    TAKE_PHOTO_ERROR = 'TAKE_PHOTO_ERROR';


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
