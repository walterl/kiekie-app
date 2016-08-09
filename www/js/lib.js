const noop = () => {};
var browserPic = 0;


/**
 * Cycle through `1.jpg` through `5.jpg` in the `ignoreme` directory.
 */
export function nextDebugPic() {
    browserPic = browserPic % 5 + 1;
    return `/ignoreme/${browserPic}.jpg`;
}

export function copyPic(uri, destDir, callback, errorCallback) {
    callback = callback || noop;
    errorCallback = errorCallback || noop;

    window.resolveLocalFileSystemURL(uri, (fileEntry) => {
        fileEntry.copyTo(destDir, fileEntry.name, callback, errorCallback);
    });
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
                copyPic(uri, outputDir, callback, errorCallback);
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
