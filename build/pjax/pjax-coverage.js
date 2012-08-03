if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/home/yui/src/yui3/src/pjax/build_tmp/pjax.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/home/yui/src/yui3/src/pjax/build_tmp/pjax.js",
    code: []
};
_yuitest_coverage["/home/yui/src/yui3/src/pjax/build_tmp/pjax.js"].code=["YUI.add('pjax', function(Y) {","","/**","Provides seamless, gracefully degrading Pjax (pushState + Ajax) functionality,","which makes it easy to progressively enhance standard links on the page so that","they can be loaded normally in old browsers, or via Ajax (with HTML5 history","support) in newer browsers.","","@module pjax","@main","@since 3.5.0","**/","","/**","Provides seamless, gracefully degrading Pjax (pushState + Ajax) functionality,","which makes it easy to progressively enhance standard links on the page so that","they can be loaded normally in old browsers, or via Ajax (with HTML5 history","support) in newer browsers.","","@class Pjax","@extends Router","@uses PjaxBase","@constructor","@param {Object} [config] Config attributes.","@since 3.5.0","**/","","/**","Fired when an error occurs while attempting to load a URL via Ajax.","","@event error","@param {Object} content Content extracted from the response, if any.","    @param {Node} content.node A `Y.Node` instance for a document fragment","        containing the extracted HTML content.","    @param {String} [content.title] The title of the HTML page, if any,","        extracted using the `titleSelector` attribute. If `titleSelector` is not","        set or if a title could not be found, this property will be `undefined`.","@param {String} responseText Raw Ajax response text.","@param {Number} status HTTP status code for the Ajax response.","@param {String} url The absolute URL that failed to load.","@since 3.5.0","**/","var EVT_ERROR = 'error',","","/**","Fired when a URL is successfully loaded via Ajax.","","@event load","@param {Object} content Content extracted from the response, if any.","    @param {Node} content.node A `Y.Node` instance for a document fragment","        containing the extracted HTML content.","    @param {String} [content.title] The title of the HTML page, if any,","        extracted using the `titleSelector` attribute. If `titleSelector` is not","        set or if a title could not be found, this property will be `undefined`.","@param {String} responseText Raw Ajax response text.","@param {Number} status HTTP status code for the Ajax response.","@param {String} url The absolute URL that was loaded.","@since 3.5.0","**/","EVT_LOAD = 'load';","","Y.Pjax = Y.Base.create('pjax', Y.Router, [Y.PjaxBase], {","    // -- Lifecycle Methods ----------------------------------------------------","    initializer: function () {","        this.publish(EVT_ERROR, {defaultFn: this._defCompleteFn});","        this.publish(EVT_LOAD,  {defaultFn: this._defCompleteFn});","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Extracts and returns the relevant HTML content from an Ajax response. The","    content is extracted using the `contentSelector` attribute as a CSS","    selector. If `contentSelector` is `null`, the entire response will be","    returned.","","    The return value is an object containing two properties:","","      - **node**: A `Y.Node` instance for a document fragment containing the","        extracted HTML content.","","      - **title**: The title of the HTML page, if any, extracted using the","        `titleSelector` attribute (which defaults to looking for a `<title>`","        element). If `titleSelector` is not set or if a title could not be","        found, this property will be `undefined`.","","    @method getContent","    @param {String} responseText Raw Ajax response text.","    @return {Object} Content object with the properties described above.","    @since 3.5.0","    **/","    getContent: function (responseText) {","        var content         = {},","            contentSelector = this.get('contentSelector'),","            frag            = Y.Node.create(responseText || ''),","            titleSelector   = this.get('titleSelector'),","            titleNode;","","        if (contentSelector) {","            content.node = Y.one(frag.all(contentSelector).toFrag());","        } else {","            content.node = frag;","        }","","        if (titleSelector) {","            titleNode = frag.one(titleSelector);","","            if (titleNode) {","                content.title = titleNode.get('text');","            }","        }","","        return content;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Default Pjax route handler. Makes an Ajax request for the requested URL.","","    @method _defaultRoute","    @param {Object} req Request object.","    @protected","    @since 3.5.0","    **/","    _defaultRoute: function (req) {","        var url = req.url;","","        // If there's an outstanding request, abort it.","        this._request && this._request.abort();","","        // Add a 'pjax=1' query parameter if enabled.","        if (this.get('addPjaxParam')) {","            // Captures the path with query, and hash parts of the URL. Then","            // properly injects the \"pjax=1\" query param in the right place,","            // before any hash fragment, and returns the updated URL.","            url = url.replace(/([^#]*)(#.*)?$/, function (match, path, hash) {","                path += (path.indexOf('?') > -1 ? '&' : '?') + 'pjax=1';","                return path + (hash || '');","            });","        }","","        // Send a request.","        this._request = Y.io(url, {","            arguments: {url: url},","            context  : this,","            headers  : {'X-PJAX': 'true'},","            timeout  : this.get('timeout'),","","            on: {","                end    : this._onPjaxIOEnd,","                failure: this._onPjaxIOFailure,","                success: this._onPjaxIOSuccess","            }","        });","    },","","    // -- Event Handlers -------------------------------------------------------","","    /**","    Default event handler for both the `error` and `load` events. Attempts to","    insert the loaded content into the `container` node and update the page's","    title.","","    @method _defCompleteFn","    @param {EventFacade} e","    @protected","    @since 3.5.0","    **/","    _defCompleteFn: function (e) {","        var container = this.get('container'),","            content   = e.content;","","        if (container && content.node) {","            container.setContent(content.node);","        }","","        if (content.title && Y.config.doc) {","            Y.config.doc.title = content.title;","        }","    },","","    /**","    Handles IO end events.","","    @method _onPjaxIOEnd","    @protected","    @since 3.5.0","    **/","    _onPjaxIOEnd: function () {","        this._request = null;","    },","","    /**","    Handles IO failure events and fires our own `error` event.","","    @method _onPjaxIOFailure","    @protected","    @since 3.5.0","    **/","    _onPjaxIOFailure: function (id, res, details) {","        var content = this.getContent(res.responseText);","","        this.fire(EVT_ERROR, {","            content     : content,","            responseText: res.responseText,","            status      : res.status,","            url         : details.url","        });","    },","","    /**","    Handles IO success events and fires our own 'load' event.","","    @method _onPjaxIOSuccess","    @protected","    @since 3.5.0","    **/","    _onPjaxIOSuccess: function (id, res, details) {","        var content = this.getContent(res.responseText);","","        this.fire(EVT_LOAD, {","            content     : content,","            responseText: res.responseText,","            status      : res.status,","            url         : details.url","        });","    }","}, {","    ATTRS: {","        /**","        If `true`, a \"pjax=1\" query parameter will be appended to all URLs","        requested via Pjax.","","        Browsers ignore HTTP request headers when caching content, so if the","        same URL is used to request a partial Pjax page and a full page, the","        browser will cache them under the same key and may later load the","        cached partial page when the user actually requests a full page (or vice","        versa).","","        To prevent this, we can add a bogus query parameter to the URL so that","        Pjax URLs will always be cached separately from non-Pjax URLs.","","        @attribute addPjaxParam","        @type Boolean","        @default true","        @since 3.5.0","        **/","        addPjaxParam: {","            value: true","        },","","        /**","        Node into which content should be inserted when a page is loaded via","        Pjax. This node's existing contents will be removed to make way for the","        new content.","","        If not set, loaded content will not be automatically inserted into the","        page.","","        @attribute container","        @type Node","        @default null","        @since 3.5.0","        **/","        container: {","            value: null,","","            setter: function (node) {","                return node ? Y.one(node) : null;","            }","        },","","        /**","        CSS selector used to extract a specific portion of the content of a page","        loaded via Pjax.","","        For example, if you wanted to load the page `example.html` but only use","        the content within an element with the id \"pjax-content\", you'd set","        `contentSelector` to \"#pjax-content\".","","        If not set, the entire page will be used.","","        @attribute contentSelector","        @type String","        @default null","        @since 3.5.0","        **/","        contentSelector: {","            value: null","        },","","        // Inherited from Router and already documented there.","        routes: {","            value: [","                {path: '*', callback: '_defaultRoute'}","            ]","        },","","        /**","        CSS selector used to extract a page title from the content of a page","        loaded via Pjax.","","        By default this is set to extract the title from the `<title>` element,","        but you could customize it to extract the title from an `<h1>`, or from","        any other element, if that's more appropriate for the content you're","        loading.","","        @attribute titleSelector","        @type String","        @default \"title\"","        @since 3.5.0","        **/","        titleSelector: {","            value: 'title'","        },","","        /**","        Time in milliseconds after which an Ajax request should time out. When a","        timeout occurs, the `error` event will be fired.","","        @attribute timeout","        @type Number","        @default 30000","        @since 3.5.0","        **/","        timeout: {","            value: 30000","        }","    }","});","","","}, '@VERSION@' ,{requires:['pjax-base', 'io-base']});"];
_yuitest_coverage["/home/yui/src/yui3/src/pjax/build_tmp/pjax.js"].lines = {"1":0,"43":0,"62":0,"65":0,"66":0,"93":0,"99":0,"100":0,"102":0,"105":0,"106":0,"108":0,"109":0,"113":0,"127":0,"130":0,"133":0,"137":0,"138":0,"139":0,"144":0,"171":0,"174":0,"175":0,"178":0,"179":0,"191":0,"202":0,"204":0,"220":0,"222":0,"270":0};
_yuitest_coverage["/home/yui/src/yui3/src/pjax/build_tmp/pjax.js"].functions = {"initializer:64":0,"getContent:92":0,"(anonymous 2):137":0,"_defaultRoute:126":0,"_defCompleteFn:170":0,"_onPjaxIOEnd:190":0,"_onPjaxIOFailure:201":0,"_onPjaxIOSuccess:219":0,"setter:269":0,"(anonymous 1):1":0};
_yuitest_coverage["/home/yui/src/yui3/src/pjax/build_tmp/pjax.js"].coveredLines = 32;
_yuitest_coverage["/home/yui/src/yui3/src/pjax/build_tmp/pjax.js"].coveredFunctions = 10;
_yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 1);
YUI.add('pjax', function(Y) {

/**
Provides seamless, gracefully degrading Pjax (pushState + Ajax) functionality,
which makes it easy to progressively enhance standard links on the page so that
they can be loaded normally in old browsers, or via Ajax (with HTML5 history
support) in newer browsers.

@module pjax
@main
@since 3.5.0
**/

/**
Provides seamless, gracefully degrading Pjax (pushState + Ajax) functionality,
which makes it easy to progressively enhance standard links on the page so that
they can be loaded normally in old browsers, or via Ajax (with HTML5 history
support) in newer browsers.

@class Pjax
@extends Router
@uses PjaxBase
@constructor
@param {Object} [config] Config attributes.
@since 3.5.0
**/

/**
Fired when an error occurs while attempting to load a URL via Ajax.

@event error
@param {Object} content Content extracted from the response, if any.
    @param {Node} content.node A `Y.Node` instance for a document fragment
        containing the extracted HTML content.
    @param {String} [content.title] The title of the HTML page, if any,
        extracted using the `titleSelector` attribute. If `titleSelector` is not
        set or if a title could not be found, this property will be `undefined`.
@param {String} responseText Raw Ajax response text.
@param {Number} status HTTP status code for the Ajax response.
@param {String} url The absolute URL that failed to load.
@since 3.5.0
**/
_yuitest_coverfunc("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", "(anonymous 1)", 1);
_yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 43);
var EVT_ERROR = 'error',

/**
Fired when a URL is successfully loaded via Ajax.

@event load
@param {Object} content Content extracted from the response, if any.
    @param {Node} content.node A `Y.Node` instance for a document fragment
        containing the extracted HTML content.
    @param {String} [content.title] The title of the HTML page, if any,
        extracted using the `titleSelector` attribute. If `titleSelector` is not
        set or if a title could not be found, this property will be `undefined`.
@param {String} responseText Raw Ajax response text.
@param {Number} status HTTP status code for the Ajax response.
@param {String} url The absolute URL that was loaded.
@since 3.5.0
**/
EVT_LOAD = 'load';

_yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 62);
Y.Pjax = Y.Base.create('pjax', Y.Router, [Y.PjaxBase], {
    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function () {
        _yuitest_coverfunc("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", "initializer", 64);
_yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 65);
this.publish(EVT_ERROR, {defaultFn: this._defCompleteFn});
        _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 66);
this.publish(EVT_LOAD,  {defaultFn: this._defCompleteFn});
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Extracts and returns the relevant HTML content from an Ajax response. The
    content is extracted using the `contentSelector` attribute as a CSS
    selector. If `contentSelector` is `null`, the entire response will be
    returned.

    The return value is an object containing two properties:

      - **node**: A `Y.Node` instance for a document fragment containing the
        extracted HTML content.

      - **title**: The title of the HTML page, if any, extracted using the
        `titleSelector` attribute (which defaults to looking for a `<title>`
        element). If `titleSelector` is not set or if a title could not be
        found, this property will be `undefined`.

    @method getContent
    @param {String} responseText Raw Ajax response text.
    @return {Object} Content object with the properties described above.
    @since 3.5.0
    **/
    getContent: function (responseText) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", "getContent", 92);
_yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 93);
var content         = {},
            contentSelector = this.get('contentSelector'),
            frag            = Y.Node.create(responseText || ''),
            titleSelector   = this.get('titleSelector'),
            titleNode;

        _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 99);
if (contentSelector) {
            _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 100);
content.node = Y.one(frag.all(contentSelector).toFrag());
        } else {
            _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 102);
content.node = frag;
        }

        _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 105);
if (titleSelector) {
            _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 106);
titleNode = frag.one(titleSelector);

            _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 108);
if (titleNode) {
                _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 109);
content.title = titleNode.get('text');
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 113);
return content;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Default Pjax route handler. Makes an Ajax request for the requested URL.

    @method _defaultRoute
    @param {Object} req Request object.
    @protected
    @since 3.5.0
    **/
    _defaultRoute: function (req) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", "_defaultRoute", 126);
_yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 127);
var url = req.url;

        // If there's an outstanding request, abort it.
        _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 130);
this._request && this._request.abort();

        // Add a 'pjax=1' query parameter if enabled.
        _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 133);
if (this.get('addPjaxParam')) {
            // Captures the path with query, and hash parts of the URL. Then
            // properly injects the "pjax=1" query param in the right place,
            // before any hash fragment, and returns the updated URL.
            _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 137);
url = url.replace(/([^#]*)(#.*)?$/, function (match, path, hash) {
                _yuitest_coverfunc("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", "(anonymous 2)", 137);
_yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 138);
path += (path.indexOf('?') > -1 ? '&' : '?') + 'pjax=1';
                _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 139);
return path + (hash || '');
            });
        }

        // Send a request.
        _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 144);
this._request = Y.io(url, {
            arguments: {url: url},
            context  : this,
            headers  : {'X-PJAX': 'true'},
            timeout  : this.get('timeout'),

            on: {
                end    : this._onPjaxIOEnd,
                failure: this._onPjaxIOFailure,
                success: this._onPjaxIOSuccess
            }
        });
    },

    // -- Event Handlers -------------------------------------------------------

    /**
    Default event handler for both the `error` and `load` events. Attempts to
    insert the loaded content into the `container` node and update the page's
    title.

    @method _defCompleteFn
    @param {EventFacade} e
    @protected
    @since 3.5.0
    **/
    _defCompleteFn: function (e) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", "_defCompleteFn", 170);
_yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 171);
var container = this.get('container'),
            content   = e.content;

        _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 174);
if (container && content.node) {
            _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 175);
container.setContent(content.node);
        }

        _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 178);
if (content.title && Y.config.doc) {
            _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 179);
Y.config.doc.title = content.title;
        }
    },

    /**
    Handles IO end events.

    @method _onPjaxIOEnd
    @protected
    @since 3.5.0
    **/
    _onPjaxIOEnd: function () {
        _yuitest_coverfunc("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", "_onPjaxIOEnd", 190);
_yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 191);
this._request = null;
    },

    /**
    Handles IO failure events and fires our own `error` event.

    @method _onPjaxIOFailure
    @protected
    @since 3.5.0
    **/
    _onPjaxIOFailure: function (id, res, details) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", "_onPjaxIOFailure", 201);
_yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 202);
var content = this.getContent(res.responseText);

        _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 204);
this.fire(EVT_ERROR, {
            content     : content,
            responseText: res.responseText,
            status      : res.status,
            url         : details.url
        });
    },

    /**
    Handles IO success events and fires our own 'load' event.

    @method _onPjaxIOSuccess
    @protected
    @since 3.5.0
    **/
    _onPjaxIOSuccess: function (id, res, details) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", "_onPjaxIOSuccess", 219);
_yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 220);
var content = this.getContent(res.responseText);

        _yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 222);
this.fire(EVT_LOAD, {
            content     : content,
            responseText: res.responseText,
            status      : res.status,
            url         : details.url
        });
    }
}, {
    ATTRS: {
        /**
        If `true`, a "pjax=1" query parameter will be appended to all URLs
        requested via Pjax.

        Browsers ignore HTTP request headers when caching content, so if the
        same URL is used to request a partial Pjax page and a full page, the
        browser will cache them under the same key and may later load the
        cached partial page when the user actually requests a full page (or vice
        versa).

        To prevent this, we can add a bogus query parameter to the URL so that
        Pjax URLs will always be cached separately from non-Pjax URLs.

        @attribute addPjaxParam
        @type Boolean
        @default true
        @since 3.5.0
        **/
        addPjaxParam: {
            value: true
        },

        /**
        Node into which content should be inserted when a page is loaded via
        Pjax. This node's existing contents will be removed to make way for the
        new content.

        If not set, loaded content will not be automatically inserted into the
        page.

        @attribute container
        @type Node
        @default null
        @since 3.5.0
        **/
        container: {
            value: null,

            setter: function (node) {
                _yuitest_coverfunc("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", "setter", 269);
_yuitest_coverline("/home/yui/src/yui3/src/pjax/build_tmp/pjax.js", 270);
return node ? Y.one(node) : null;
            }
        },

        /**
        CSS selector used to extract a specific portion of the content of a page
        loaded via Pjax.

        For example, if you wanted to load the page `example.html` but only use
        the content within an element with the id "pjax-content", you'd set
        `contentSelector` to "#pjax-content".

        If not set, the entire page will be used.

        @attribute contentSelector
        @type String
        @default null
        @since 3.5.0
        **/
        contentSelector: {
            value: null
        },

        // Inherited from Router and already documented there.
        routes: {
            value: [
                {path: '*', callback: '_defaultRoute'}
            ]
        },

        /**
        CSS selector used to extract a page title from the content of a page
        loaded via Pjax.

        By default this is set to extract the title from the `<title>` element,
        but you could customize it to extract the title from an `<h1>`, or from
        any other element, if that's more appropriate for the content you're
        loading.

        @attribute titleSelector
        @type String
        @default "title"
        @since 3.5.0
        **/
        titleSelector: {
            value: 'title'
        },

        /**
        Time in milliseconds after which an Ajax request should time out. When a
        timeout occurs, the `error` event will be fired.

        @attribute timeout
        @type Number
        @default 30000
        @since 3.5.0
        **/
        timeout: {
            value: 30000
        }
    }
});


}, '@VERSION@' ,{requires:['pjax-base', 'io-base']});
