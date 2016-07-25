export function resizeImage(path, options) {
    const dir = options.outputDir || 'default_dir';
    if (path.startsWith('/')) {
        path = path.slice(1);
    }
    return `/generated/${dir}/${path}`;
}
