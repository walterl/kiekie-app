const noop = () => {};
var tempFileN = 1;

export function copyPic(uri, destDir, callback, errorCallback) {
    callback = callback || noop;
    errorCallback = errorCallback || noop;

    window.resolveLocalFileSystemURL(uri, (fileEntry) => {
        fileEntry.copyTo(destDir, fileEntry.name, callback, errorCallback);
    });
}

function httpGet(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.response;
}

export function downloadToTemp(url, rootDir, callback) {
    const data = httpGet(url),
        filename = `${tempFileN}.jpg`,
        options = {create: true, exclusive: false};
    tempFileN += 1;
    callback = callback || noop;

    rootDir.getDirectory('temp', options, (dirEntry) => {
        dirEntry.getFile(filename, options, (fileEntry) => {
            fileEntry.createWriter((writer) => writer.write(data));
            return callback(fileEntry.toURL());
        });
    });
}

export function resizeImage(path, options, callback, errorCallback) {
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
                copyPic(path, outputDir, callback, errorCallback);
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
                path,
                width, height, {
                    directory: outputDir.toURL(),
                    filename: path.split('/').pop(),
                    storeImage: true
                }
            );
        },
        errorCallback,
        path
    );
}
