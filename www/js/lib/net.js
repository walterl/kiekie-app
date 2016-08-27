import 'whatwg-fetch';

export const
    HTTP_OK = 200,
    HTTP_REDIRECT = 300,
    HTTP_NOT_FOUND = 404;

/**
 * Extracts errors from the given object in a few formats:
 *
 *   * `json.error.message`
 *   * `json.<fieldname> = [<errors>]`
 *   * `json.<error_msg>`
 *
 * @returns list A list of error strings
 */
function extractErrors(json) {
    var messages = [];

    if (json.error && json.error.message) {
        messages = [json.error.message];
    } else {
        Object.keys(json).forEach((key) => {
            var msgs = json[key];

            if (typeof msgs === 'string') {
                msgs = [msgs];
            }
            messages = [...messages, ...msgs];
        });
    }

    return messages;
}

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

    return new Promise((resolve, reject) => {
        if (!(response.status >= HTTP_OK && response.status < HTTP_REDIRECT)) {
            error = new Error(response.statusText);
            error.response = response;
            // Try and parse JSON from the (error) HTTP response
            response.json().then((json) => {
                error.messages = extractErrors(json);
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

function buildHeaders() {
    const token = window.localStorage.getItem('authToken');
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
    };
}

function request(url, options={}) {
    options.headers = buildHeaders();
    return fetch(url, options)
    .then(checkStatus);
}

export function formPost(url, data, options={}) {
    options.method = 'POST';
    options.body = data;
    return request(url, options);
}

export function requestData(url, options={}) {
    return request(url, options)
    .then((response) => response.blob());
}

export function requestDelete(url, options={}) {
    options.method = 'DELETE';
    return request(url, options);
}

function jsonRequest(url, options={}) {
    if (options.body && typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body);
    }

    return request(url, options)
    .then((response) => response.json());
}

export function jsonDelete(url) {
    return jsonRequest(url, {method: 'DELETE'});
}

export function jsonGet(url) {
    return jsonRequest(url);
}

export function jsonPost(url, json) {
    return jsonRequest(url, {
        method: 'POST',
        body: json
    });
}

export function jsonPut(url, json) {
    return jsonRequest(url, {
        method: 'PUT',
        body: json
    });
}
