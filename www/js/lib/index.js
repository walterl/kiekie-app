import {requestData} from './net';

const noop = () => {};
var browserPic = 0;


/**
 * Cycle through `1.jpg` through `5.jpg` in the `ignoreme` directory.
 */
export function nextDebugPic() {
    browserPic = browserPic % 5 + 1;
    return requestData(`/ignoreme/${browserPic}.jpg`)
    .then((blob) => window.URL.createObjectURL(blob));
}

export function copyLocalFile(uri, destDir, callback, errorCallback) {
    callback = callback || noop;
    errorCallback = errorCallback || noop;

    window.resolveLocalFileSystemURL(uri, (fileEntry) => {
        fileEntry.copyTo(destDir, fileEntry.name, callback, errorCallback);
    }, errorCallback);
}

export function resizeImage(uri, options, callback, errorCallback) {
    const maxHeight = options.height || 1280,
        maxWidth = options.width || 1280,
        outputDir = options.outputDir;
    callback = callback || noop;
    errorCallback = errorCallback || noop;

    window.imageResizer.getImageSize(
        (result) => {
            var height = 0,
                width = 0;

            if (result.height <= maxHeight && result.width <= maxWidth) {
                copyLocalFile(uri, outputDir, callback, errorCallback);
                return;
            }

            height = Math.min(result.height, maxHeight);
            width = Math.min(result.width, maxWidth);

            if (result.height > result.width) {
                width = 0;
            } else {
                height = 0;
            }

            window.imageResizer.resizeImage(
                callback, errorCallback,
                uri,
                width, height, {
                    directory: outputDir.toURL(),
                    filename: uri.split('/').pop(),
                    storeImage: true
                }
            );
        },
        errorCallback,
        uri
    );
}

export function storeCreds(userName, authToken) {
    const storage = window.localStorage;
    storage.setItem('authToken', authToken);
    storage.setItem('userName', userName);
}

export function fileExists(uri) {
    return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(
            uri,
            (entry) => resolve({uri, exists: entry.isFile}),
            (error) => {
                if (error.code === FileError.NOT_FOUND_ERR) {
                    resolve({uri, exists: false});
                    return;
                }
                reject(error);
            }
        );
    });
}

export function readBlob(uri) {
    if (uri.startsWith('blob:')) {
        return fetch(uri)
        .then((response) => response.blob());
    }

    return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(
            uri,
            (entry) => entry.file((f) => resolve(f), (e) => reject(e)),
            (error) => reject(error)
        );
    });
}

export function writeBlob(blob, dir, filename) {
    return new Promise((resolve, reject) => {
        const options = {create: true, exclusive: true},
            rejectOnError = (error) => reject(error);
        dir.getFile(
            filename, options,
            (entry) => entry.createWriter(
                (writer) => {
                    writer.onwriteend = () => resolve(entry.toURL());
                    writer.onerror = rejectOnError;
                    writer.write(blob);
                },
                rejectOnError
            ),
            rejectOnError
        );
    });
}
