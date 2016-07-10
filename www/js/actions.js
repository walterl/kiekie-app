export const
    REQUEST_PHOTO = 'REQUEST_PHOTO',
    RECEIVE_PIC = 'RECEIVE_PIC',
    PHOTO_ERROR = 'PHOTO_ERROR';


function requestPhoto() {
    return {type: REQUEST_PHOTO};
}

function photoError(error) {
    return {
        type: PHOTO_ERROR,
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
        dispatch(requestPhoto());
        navigator.camera.getPicture(
            (picData) => {
                dispatch(receivePic(picData, Date.now()));
            },
            (message) => {
                dispatch(photoError(message));
            }
        );
    };
}
