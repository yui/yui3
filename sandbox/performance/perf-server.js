#!/usr/bin/env node

/**
 * This is a Node.js-based HTTP server for the performance testing framework.
 * See the README for details.
 */

var fs          = require('fs'),
    http        = require('http'),
    mime        = require('./lib/mime'),
    parseURL    = require('url').parse,
    path        = require('path'),
    querystring = require('querystring'),
    sys         = require('sys'),

    config = readConfig('conf/config.json'),
    server = require('./lib/router').Server();

// -- Implementation -----------------------------------------------------------

// Combo URLs.
server.get('/combo/([^/]+)/?', function (root) {
    var body = '',
        expires,
        fullPath,
        i,
        ifModifiedSince = this.request.headers['if-modified-since'],
        lastModified,
        len,
        mimeType,
        mtime,
        query = this.request.parsedURL.search.substr(1).split('&'),
        relativePath,
        rootPath,
        stat;

    // For now, we have to assume all root paths are relative to process.cwd()
    // because Node's realpath() implementation won't traverse above that.
    rootPath = path.normalize(path.join(process.cwd(), config.roots[root]));

    try {
        rootPath = fs.realpathSync(rootPath);
    } catch (ex) {
        this.response.send404();
        this.end();
        return;
    }

    for (i = 0, len = query.length; i <  len; ++i) {
        relativePath = querystring.unescape(query[i], true);

        if (!relativePath) {
            continue;
        }

        fullPath = path.normalize(path.join(rootPath, relativePath));

        // Don't allow traversal above the public root.
        if (fullPath.indexOf(rootPath) !== 0) {
            // Resist the temptation to change this to a 400. That would create
            // an information disclosure vulnerability by signaling that the
            // path exists.
            this.response.send404();
            this.end();
            return;
        }

        mimeType = mime.getType(path.extname(relativePath));

        try {
            body += fs.readFileSync(fullPath, 'utf8') + "\n";
            mtime = new Date(fs.statSync(fullPath).mtime);
        } catch (ex) {
            this.response.send404();
            this.end();
            return;
        }

        if (!lastModified || mtime > lastModified) {
            lastModified = mtime;
        }
    }

    // Respond with a 304 if we can.
    if (ifModifiedSince &&
            (new Date(ifModifiedSince)).getTime() === lastModified.getTime()) {
        this.response.send304();
        this.end();
        return;
    }

    // TODO: Currently, the last file extension is what determines the
    // Content-Type. Need to look into what the real ComboHandler does when
    // multiple file types are requested in a single request.
    this.response.setHeader('Content-Type', mimeType + ';charset=utf-8');
    this.response.setHeader('Cache-Control', 'private;must-revalidate');

    if (lastModified) {
        this.response.setHeader('Last-Modified', lastModified.toUTCString());
    }

    this.end(body + "\n");
});

// Cross-domain request proxy. Currently this doesn't handle redirects of any
// kind. This is still a little rough, but it works.
server.get('/proxy/?', function () {
    var client,
        request,
        result = '',
        that   = this,
        url    = this.query.url;

    if (!url) {
        this.response.sendError(400, 'Missing required "url" parameter.');
        this.end();
        return;
    }

    url = parseURL(url);

    if (!url.hostname) {
        url.port     = config.server.port;
        url.hostname = config.server.host;
        url.host     = url.hostname + ':' + url.port;
    }

    if (!proxyWhitelist(url.hostname)) {
        this.response.sendError(403, 'Proxy whitelist does not allow the requested URL.');
        this.end();
        return;
    }

    if (!url.pathname) {
        url.pathname = '/';
    }

    if (url.pathname.charAt(0) !== '/') {
        url.pathname = '/' + url.pathname;
    }

    client  = http.createClient(url.port || 80, url.hostname, url.protocol === 'https:');
    request = client.request((url.pathname || '/') + (url.search || ''), {host: url.host});

    request.addListener('response', function (response) {
        var header;

        // Copy status and headers from the remote response to our response.
        that.response.statusCode = response.statusCode;

        for (header in response.headers) {
            if (response.headers.hasOwnProperty(header)) {
                that.response.setHeader(header, response.headers[header]);
            }
        }

        response.addListener('data', function (chunk) {
            result += chunk;
        });

        response.addListener('end', function () {
            that.end(result);
        });
    });

    request.end();
});

server.listen(config.server.port, config.server.host);

// -- Private Methods ----------------------------------------------------------
function proxyWhitelist(hostname) {
    return hostname === config.server.host ||
            (config.proxy &&
                config.proxy.hostnames &&
                config.proxy.hostnames.indexOf(hostname) !== -1);
}

function readConfig(filename) {
    var configJSON;

    try {
        configJSON = fs.readFileSync(filename, 'utf8');
    } catch (ex) {
        sys.puts('Error: Config file not found: ' + filename);
        return {};
    }

    try {
        return JSON.parse(configJSON);
    } catch (ex) {
        sys.puts('Error parsing config file: ' + ex.toString());
        return {};
    }
}
