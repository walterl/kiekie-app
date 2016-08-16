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


export function jsonPost(url, json, token) {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }

    return fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(json)
    })
    .then(checkStatus)
    .then((response) => response.json());
}
