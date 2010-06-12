exports.defaultType = 'application/octet-stream';

exports.types = {
    '.css' : 'text/css',
    '.gif' : 'image/gif',
    '.htm' : 'text/html',
    '.html': 'text/html',
    '.ico' : 'image/vnd.microsoft.icon',
    '.jpeg': 'image/jpeg',
    '.jpg' : 'image/jpeg',
    '.js'  : 'application/javascript',
    '.json': 'application/json',
    '.png' : 'image/png',
    '.txt' : 'text/plain',
    '.xml' : 'application/xml'
};

exports.getType = function getType(extension) {
    extension = (extension.charAt(0) === '.' ? extension : '.' + extension).toLowerCase();
    return exports.types[extension] || exports.defaultType;
};
