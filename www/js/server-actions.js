export const
    LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL',
    LOGIN_FAILED = 'LOGIN_FAILED',
    REGISTER_ACCOUNT = 'REGISTER_ACCOUNT';


function loginSuccessful(userId, sessionId) {
    return {
        type: LOGIN_SUCCESSFUL,
        userId, sessionId
    };
}

function loginFailed(userId, error) {
    return {
        type: LOGIN_FAILED,
        userId, error
    };
}

export function loginOnServer(userId) {
    return (dispatch) => {
        dispatch(loginFailed(userId, 'Not yet implemented'));
    };
}

export function registerAccount() {
    return {
        type: REGISTER_ACCOUNT
    };
}
