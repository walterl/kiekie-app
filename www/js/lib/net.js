/**
 * Returns a `Promise` that checks the HTTP response's status. Any non 2xx
 * status results in the promise rejecting with an error. If the reponse status
 * is good (2xx), the promise resolves with the response.
 *
 * This function is meant to be used with the promises returned by `fetch()`.
 *
 * @param {Object} response - HTTP response to check.
 * @returns {Object} `response` if `response.status` is a 2xx status code.
 */
function checkStatus(response) {
    var error = null;
    const HTTP_OK = 200,
        HTTP_REDIRECT = 300;

    return new Promise((resolve, reject) => {
        if (!(response.status >= HTTP_OK && response.status < HTTP_REDIRECT)) {
            error = new Error(response.statusText);
            error.response = response;
            // Try and parse JSON from the (error) HTTP response
            response.json().then((json) => {
                var messages = [];

                Object.keys(json).forEach((key) => {
                    messages = [...messages, ...json[key]];
                });
                error.messages = messages;
                error.json = json;
                reject(error);
            },
             // If the JSON parsing fails, fail with the error we have:
            () => reject(error));
            return;
        }
        resolve(response);
    });
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
