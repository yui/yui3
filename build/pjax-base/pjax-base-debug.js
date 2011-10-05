YUI.add('pjax-base', function(Y) {

var win          = Y.config.win,
    originalRoot = getRoot(),

    CLASS_PJAX   = Y.ClassNameManager.getClassName('pjax'),
    EVT_NAVIGATE = 'navigate';

function getRoot() {
    var segments = (win && win.location.pathname.split('/')) || [];
    segments.pop();
    return segments.join('/');
}

// PjaxBase is a mixin for Controller.
function PjaxBase() {}

PjaxBase.prototype = {
    // -- Properties -----------------------------------------------------------
    _resolved: {},
    _regexUrl: /^((?:([^:]+):(?:\/\/)?|\/\/)[^\/]*)?([^?#]*)(.*)$/i,

    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function () {
        this._pjaxRoot = originalRoot;
        this.publish(EVT_NAVIGATE, {defaultFn: this._defNavigateFn});
        this._pjaxBindUI();
    },

    destructor: function () {
        this._pjaxEvents && this._pjaxEvents.detach();
    },

    // -- Public Prototype Methods ---------------------------------------------
    load: function (url) {
        this.save(this._resolveUrl(url));

        if (this.get('scrollToTop') && Y.config.win) {
            // Scroll to the top of the page. The timeout ensures that the
            // scroll happens after navigation begins, so that the current
            // scroll position will be restored if the user clicks the back
            // button.
            setTimeout(function () {
                Y.config.win.scroll(0, 0);
            }, 1);
        }
    },

    // -- Protected Prototype Methods ------------------------------------------
    _getRoot: getRoot,

    _normalizePath: function (path) {
        var dots  = '..',
            slash = '/',
            i, len, normalized, parts, part, stack;

        if (!path) {
            return path;
        }

        parts = path.split(slash);
        stack = [];

        for (i = 0, len = parts.length; i < len; ++i) {
            part = parts[i];

            if (part === dots) {
                stack.pop();
            } else if (part) {
                stack.push(part);
            }
        }

        normalized = stack.join(slash);

        // Append a slash if necessary.
        if (path.charAt(path.length - 1) === slash) {
            normalized += slash;
        }

        return normalized;
    },

    _pjaxBindUI: function () {
        if (this.html5) {
            this._pjaxEvents = Y.one('body').delegate('click',
                this._onLinkClick, this.get('linkSelector'), this);
        }
    },

    _resolvePath: function (path) {
        var root = this._pjaxRoot;

        if (!path) {
            return root;
        }

        // Path is host relative.
        if (path.charAt(0) === '/') {
            return path;
        }

        return this._normalizePath(root + '/' + path);
    },

    _resolveUrl: function (url) {
        var self        = this,
            resolved    = self._resolved,
            resolvedUrl = resolved[url];

        if (resolvedUrl) {
            return resolvedUrl;
        }

        function resolve(match, prefix, scheme, path, suffix) {
            if (scheme && scheme.toLowerCase().indexOf('http') !== 0) {
                return match;
            }

            return (prefix || '') + self._resolvePath(path) + (suffix || '');
        }

        // Cache resolved URL.
        resolvedUrl = resolved[url] = url.replace(self._regexUrl, resolve);

        return resolvedUrl;
    },

    // -- Protected Event Handlers ---------------------------------------------
    _defNavigateFn: function (e) {
        this.load(e.url);
    },

    _onLinkClick: function (e) {
        var url = this._resolveUrl(e.currentTarget.get('href'));

        // Allow the native behavior on middle/right-click, or when Ctrl or
        // Command are pressed.
        if (e.button !== 1 || e.ctrlKey || e.metaKey) { return; }

        // Do nothing if there's no matching route for this URL.
        if (!this.hasRoute(url)) { return; }

        e.preventDefault();

        this.fire(EVT_NAVIGATE, {
            originEvent: e,
            url        : url
        });
    }
};

PjaxBase.ATTRS = {

    linkSelector: {
        value    : 'a.' + CLASS_PJAX,
        writeOnce: 'initOnly'
    },

    scrollToTop: {
        value: true
    }
};

Y.PjaxBase = PjaxBase;


}, '@VERSION@' ,{requires:['classnamemanager', 'controller', 'node-event-delegate']});
