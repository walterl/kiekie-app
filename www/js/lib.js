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

export function resizeImage(path, options) {
    const dir = options.outputDir || 'default_dir';
    if (path.startsWith('/')) {
        path = path.slice(1);
    }
    return `/generated/${dir}/${path}`;
}
