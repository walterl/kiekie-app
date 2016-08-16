/**
 * Checks the HTTP response's status. Any non 2xx status results in an error
 * being thrown.
 *
 * @param {Object} response - HTTP response to check.
 * @returns {Object} `response` if `response.status` is a 2xx status code.
 */
function checkStatus(response) {
    var error = null;
    const HTTP_OK = 200,
        HTTP_REDIRECT = 300;

    if (!(response.status >= HTTP_OK && response.status < HTTP_REDIRECT)) {
        error = new Error(response.statusText);
        error.response = response;
        throw error;
    }

    return response;
}

function buildHeaders(token) {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }

    return headers;
}

export function jsonGet(url, token) {
    return fetch(url, {headers: buildHeaders(token)})
        .then(checkStatus)
        .then((response) => response.json());
}

export function jsonPost(url, json, token) {
    return fetch(url, {
        method: 'POST',
        headers: buildHeaders(token),
        body: JSON.stringify(json)
    })
    .then(checkStatus)
    .then((response) => response.json());
}
