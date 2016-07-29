var tempFileN = 1;

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

    rootDir.getDirectory('temp', options, (dirEntry) => {
        dirEntry.getFile(filename, options, (fileEntry) => {
            fileEntry.createWriter((writer) => writer.write(data));

            if (typeof callback === 'function') {
                return callback(fileEntry.toURL());
            }
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
