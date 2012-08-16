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
_yuitest_coverage["/build/app-content/app-content.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/app-content/app-content.js",
    code: []
};
_yuitest_coverage["/build/app-content/app-content.js"].code=["YUI.add('app-content', function(Y) {","","/**","`Y.App` extension that provides pjax-style content fetching and handling.","","@module app","@submodule app-content","@since 3.7.0","**/","","var PjaxContent = Y.PjaxContent;","","/**","`Y.App` extension that provides pjax-style content fetching and handling.","","This makes it easy to fetch server rendered content for URLs using Ajax. The","HTML content returned from the server will be view-ified and set as the app's","main content, making it seamless to use a mixture of server and client rendered","views.","","When the `\"app-content\"` module is used, it will automatically mix itself into","`Y.App`, and it provides three main features:","","  - **`Y.App.Content.route`**: A stack of middleware which forms a pjax-style","    conent route.","","  - **`loadContent()`**: Route middleware which load content from a server. This","    makes an Ajax request for the requested URL, parses the returned content and","    puts it on the route's response object.","","  - **`showContent()`**: Method which provides an easy way to view-ify HTML","    content which should be shown as an app's active/visible view.","","The following is an example of how these features can be used:","","    // Creates a new app and registers the `\"post\"` view.","    var app = new Y.App({","        views: {","            post: {type: Y.PostView}","        }","    });","","    // Uses a simple server rendered content route for the About page.","    app.route('/about/', Y.App.Content.route);","","    // Uses the `loadContent()` middleware to fetch the contents of the post","    // from the server and shows that content in a `\"post\"` view.","    app.route('/posts/:id/', 'loadContent', function (req, res, next) {","        this.showContent(res.content.node, {view: 'post'});","    });","","@class App.Content","@uses PjaxContent","@extensionfor App","@since 3.7.0","**/","function AppContent() {","    PjaxContent.apply(this, arguments);","}","","/**","A stack of middleware which forms a pjax-style content route.","","This route will load the rendered HTML content from the server, then create and","show a new view using those contents.","","@property route","@type Array","@static","@since 3.7.0","**/","AppContent.route = ['loadContent', '_contentRoute'];","","AppContent.prototype = {","    // -- Public Methods -------------------------------------------------------","","    /**","    Sets this app's `activeView` attribute using the specified `content`.","","    This provides an easy way to view-ify HTML content which should be shown as","    this app's active/visible view. This method will determine the appropriate","    view `container` node based on the specified `content`. By default, a new","    `Y.View` instance will be created unless `options.view` is specified.","","    Under the hood, this method calls the `showView()` method, so refer to its","    docs for more information.","","    @method showContent","    @param {HTMLElement|Node|String} content The content to show, it may be","        provided as a selector string, a DOM element, or a `Y.Node` instance.","    @param {Object} [options] Optional objects containing any of the following","        properties in addition to any `showView()` options:","","      @param {Object|String} [options.view] The name of a view defined in this","          app's `views`, or an object with the following properties:","","        @param {String} options.view.name The name of a view defined in this","            app's `views`.","        @param {Object} [options.view.config] Optional configuration to use when","            creating the new view instance. This config object can also be used","            to update an existing or preserved view's attributes when","            `options.update` is `true`. **Note:** If a `container` is specified,","            it will be overriden by the `content` specified in the first","            argument.","","    @param {Function} [callback] Optional callback function to call after the","        new `activeView` is ready to use. **Note:** this will override","        `options.callback` and it can be specified as either the second or thrid","        argument. The function will be passed the following:","","      @param {View} callback.view A reference to the new `activeView`.","","    @since 3.7.0","    @see App.showView()","    **/","    showContent: function (content, options, callback) {","        // Makes sure we have a node instance, and will query selector strings.","        content = Y.one(content);","","        // Support the callback function being either the second or third arg.","        if (typeof options === 'function') {","            options  = {callback: options};","            callback = null;","        }","","        // Mix in default option to *not* render the view because presumably we","        // have pre-rendered content here. This also creates a copy so we can","        // modify the object.","        options = Y.merge({render: false}, options);","","        var view       = options.view || '',","            viewName   = typeof view === 'string' ? view : view.name,","            viewConfig = typeof view !== 'string' ? view.config : {},","            viewInfo   = this.getViewInfo(viewName),","            container, template, type, ViewConstructor;","","        // Remove `view` from the `options` which will be passed along to the","        // `showView()` method.","        delete options.view;","","        // Determine the `container` node for the view. This deals with document","        // fragments and does its best to find and use the correct node for the","        // `container`.","        if (content.isFragment()) {","            if (content.get('children').size() === 1) {","                container = content.get('firstChild');","            } else {","                type = (viewInfo && viewInfo.type) || Y.View;","","                // Looks for a namespaced constructor function on `Y`.","                ViewConstructor = typeof type === 'string' ?","                        Y.Object.getValue(Y, type.split('.')) : type;","","                // Find the correct node template for the view.","                template  = ViewConstructor.prototype.containerTemplate;","                container = Y.Node.create(template);","","                // Append the document fragment to the newly created","                // `container` node. This is the worst case where we have to","                // create a wrapper node around the `content`.","                container.append(content);","            }","        } else {","            container = content;","        }","","        // Makes sure the view is created using _our_ `container` node.","        viewConfig = Y.merge(viewConfig, {container: container});","","        // Finally switch to the new `activeView`. We want to make sure `view`","        // is a string if it's falsy, that way a new view will be created.","        return this.showView(viewName, viewConfig, options, callback);","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Provides a default content route which will show a server rendered view.","","    **Note:** This route callback assumes that it's called after the","    `loadContent()` middleware.","","    @method _contentRoute","    @param {Object} req Request object.","    @param {Object} res Response Object.","    @param {Function} next Function to pass control to the next route callback.","    @protected","    @since 3.7.0","    @see Y.App.Content.route","    **/","    _contentRoute: function (req, res, next) {","        var content = res.content,","            doc     = Y.config.doc,","            activeViewHandle;","","        // We must have some content to work with.","        if (!(content && content.node)) { return next(); }","","        if (content.title && doc) {","            // Make sure the `activeView` does actually change before we go","            // messing with the page title.","            activeViewHandle = this.onceAfter('activeViewChange', function () {","                doc.title = content.title;","            });","        }","","        this.showContent(content.node);","","        // Detach the handle just in case.","        if (activeViewHandle) {","            activeViewHandle.detach();","        }","","        next();","    }","};","","// Mix statics.","Y.mix(AppContent, PjaxContent);","// Mix prototype.","Y.mix(AppContent, PjaxContent, false, null, 1);","","// -- Namespace ----------------------------------------------------------------","Y.App.Content = AppContent;","Y.Base.mix(Y.App, [AppContent]);","","","}, '@VERSION@' ,{requires:['app-base', 'pjax-content']});"];
_yuitest_coverage["/build/app-content/app-content.js"].lines = {"1":0,"11":0,"57":0,"58":0,"72":0,"74":0,"118":0,"121":0,"122":0,"123":0,"129":0,"131":0,"139":0,"144":0,"145":0,"146":0,"148":0,"151":0,"155":0,"156":0,"161":0,"164":0,"168":0,"172":0,"192":0,"197":0,"199":0,"202":0,"203":0,"207":0,"210":0,"211":0,"214":0,"219":0,"221":0,"224":0,"225":0};
_yuitest_coverage["/build/app-content/app-content.js"].functions = {"AppContent:57":0,"showContent:116":0,"(anonymous 2):202":0,"_contentRoute:191":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/app-content/app-content.js"].coveredLines = 37;
_yuitest_coverage["/build/app-content/app-content.js"].coveredFunctions = 5;
_yuitest_coverline("/build/app-content/app-content.js", 1);
YUI.add('app-content', function(Y) {

/**
`Y.App` extension that provides pjax-style content fetching and handling.

@module app
@submodule app-content
@since 3.7.0
**/

_yuitest_coverfunc("/build/app-content/app-content.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/app-content/app-content.js", 11);
var PjaxContent = Y.PjaxContent;

/**
`Y.App` extension that provides pjax-style content fetching and handling.

This makes it easy to fetch server rendered content for URLs using Ajax. The
HTML content returned from the server will be view-ified and set as the app's
main content, making it seamless to use a mixture of server and client rendered
views.

When the `"app-content"` module is used, it will automatically mix itself into
`Y.App`, and it provides three main features:

  - **`Y.App.Content.route`**: A stack of middleware which forms a pjax-style
    conent route.

  - **`loadContent()`**: Route middleware which load content from a server. This
    makes an Ajax request for the requested URL, parses the returned content and
    puts it on the route's response object.

  - **`showContent()`**: Method which provides an easy way to view-ify HTML
    content which should be shown as an app's active/visible view.

The following is an example of how these features can be used:

    // Creates a new app and registers the `"post"` view.
    var app = new Y.App({
        views: {
            post: {type: Y.PostView}
        }
    });

    // Uses a simple server rendered content route for the About page.
    app.route('/about/', Y.App.Content.route);

    // Uses the `loadContent()` middleware to fetch the contents of the post
    // from the server and shows that content in a `"post"` view.
    app.route('/posts/:id/', 'loadContent', function (req, res, next) {
        this.showContent(res.content.node, {view: 'post'});
    });

@class App.Content
@uses PjaxContent
@extensionfor App
@since 3.7.0
**/
_yuitest_coverline("/build/app-content/app-content.js", 57);
function AppContent() {
    _yuitest_coverfunc("/build/app-content/app-content.js", "AppContent", 57);
_yuitest_coverline("/build/app-content/app-content.js", 58);
PjaxContent.apply(this, arguments);
}

/**
A stack of middleware which forms a pjax-style content route.

This route will load the rendered HTML content from the server, then create and
show a new view using those contents.

@property route
@type Array
@static
@since 3.7.0
**/
_yuitest_coverline("/build/app-content/app-content.js", 72);
AppContent.route = ['loadContent', '_contentRoute'];

_yuitest_coverline("/build/app-content/app-content.js", 74);
AppContent.prototype = {
    // -- Public Methods -------------------------------------------------------

    /**
    Sets this app's `activeView` attribute using the specified `content`.

    This provides an easy way to view-ify HTML content which should be shown as
    this app's active/visible view. This method will determine the appropriate
    view `container` node based on the specified `content`. By default, a new
    `Y.View` instance will be created unless `options.view` is specified.

    Under the hood, this method calls the `showView()` method, so refer to its
    docs for more information.

    @method showContent
    @param {HTMLElement|Node|String} content The content to show, it may be
        provided as a selector string, a DOM element, or a `Y.Node` instance.
    @param {Object} [options] Optional objects containing any of the following
        properties in addition to any `showView()` options:

      @param {Object|String} [options.view] The name of a view defined in this
          app's `views`, or an object with the following properties:

        @param {String} options.view.name The name of a view defined in this
            app's `views`.
        @param {Object} [options.view.config] Optional configuration to use when
            creating the new view instance. This config object can also be used
            to update an existing or preserved view's attributes when
            `options.update` is `true`. **Note:** If a `container` is specified,
            it will be overriden by the `content` specified in the first
            argument.

    @param {Function} [callback] Optional callback function to call after the
        new `activeView` is ready to use. **Note:** this will override
        `options.callback` and it can be specified as either the second or thrid
        argument. The function will be passed the following:

      @param {View} callback.view A reference to the new `activeView`.

    @since 3.7.0
    @see App.showView()
    **/
    showContent: function (content, options, callback) {
        // Makes sure we have a node instance, and will query selector strings.
        _yuitest_coverfunc("/build/app-content/app-content.js", "showContent", 116);
_yuitest_coverline("/build/app-content/app-content.js", 118);
content = Y.one(content);

        // Support the callback function being either the second or third arg.
        _yuitest_coverline("/build/app-content/app-content.js", 121);
if (typeof options === 'function') {
            _yuitest_coverline("/build/app-content/app-content.js", 122);
options  = {callback: options};
            _yuitest_coverline("/build/app-content/app-content.js", 123);
callback = null;
        }

        // Mix in default option to *not* render the view because presumably we
        // have pre-rendered content here. This also creates a copy so we can
        // modify the object.
        _yuitest_coverline("/build/app-content/app-content.js", 129);
options = Y.merge({render: false}, options);

        _yuitest_coverline("/build/app-content/app-content.js", 131);
var view       = options.view || '',
            viewName   = typeof view === 'string' ? view : view.name,
            viewConfig = typeof view !== 'string' ? view.config : {},
            viewInfo   = this.getViewInfo(viewName),
            container, template, type, ViewConstructor;

        // Remove `view` from the `options` which will be passed along to the
        // `showView()` method.
        _yuitest_coverline("/build/app-content/app-content.js", 139);
delete options.view;

        // Determine the `container` node for the view. This deals with document
        // fragments and does its best to find and use the correct node for the
        // `container`.
        _yuitest_coverline("/build/app-content/app-content.js", 144);
if (content.isFragment()) {
            _yuitest_coverline("/build/app-content/app-content.js", 145);
if (content.get('children').size() === 1) {
                _yuitest_coverline("/build/app-content/app-content.js", 146);
container = content.get('firstChild');
            } else {
                _yuitest_coverline("/build/app-content/app-content.js", 148);
type = (viewInfo && viewInfo.type) || Y.View;

                // Looks for a namespaced constructor function on `Y`.
                _yuitest_coverline("/build/app-content/app-content.js", 151);
ViewConstructor = typeof type === 'string' ?
                        Y.Object.getValue(Y, type.split('.')) : type;

                // Find the correct node template for the view.
                _yuitest_coverline("/build/app-content/app-content.js", 155);
template  = ViewConstructor.prototype.containerTemplate;
                _yuitest_coverline("/build/app-content/app-content.js", 156);
container = Y.Node.create(template);

                // Append the document fragment to the newly created
                // `container` node. This is the worst case where we have to
                // create a wrapper node around the `content`.
                _yuitest_coverline("/build/app-content/app-content.js", 161);
container.append(content);
            }
        } else {
            _yuitest_coverline("/build/app-content/app-content.js", 164);
container = content;
        }

        // Makes sure the view is created using _our_ `container` node.
        _yuitest_coverline("/build/app-content/app-content.js", 168);
viewConfig = Y.merge(viewConfig, {container: container});

        // Finally switch to the new `activeView`. We want to make sure `view`
        // is a string if it's falsy, that way a new view will be created.
        _yuitest_coverline("/build/app-content/app-content.js", 172);
return this.showView(viewName, viewConfig, options, callback);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Provides a default content route which will show a server rendered view.

    **Note:** This route callback assumes that it's called after the
    `loadContent()` middleware.

    @method _contentRoute
    @param {Object} req Request object.
    @param {Object} res Response Object.
    @param {Function} next Function to pass control to the next route callback.
    @protected
    @since 3.7.0
    @see Y.App.Content.route
    **/
    _contentRoute: function (req, res, next) {
        _yuitest_coverfunc("/build/app-content/app-content.js", "_contentRoute", 191);
_yuitest_coverline("/build/app-content/app-content.js", 192);
var content = res.content,
            doc     = Y.config.doc,
            activeViewHandle;

        // We must have some content to work with.
        _yuitest_coverline("/build/app-content/app-content.js", 197);
if (!(content && content.node)) { return next(); }

        _yuitest_coverline("/build/app-content/app-content.js", 199);
if (content.title && doc) {
            // Make sure the `activeView` does actually change before we go
            // messing with the page title.
            _yuitest_coverline("/build/app-content/app-content.js", 202);
activeViewHandle = this.onceAfter('activeViewChange', function () {
                _yuitest_coverfunc("/build/app-content/app-content.js", "(anonymous 2)", 202);
_yuitest_coverline("/build/app-content/app-content.js", 203);
doc.title = content.title;
            });
        }

        _yuitest_coverline("/build/app-content/app-content.js", 207);
this.showContent(content.node);

        // Detach the handle just in case.
        _yuitest_coverline("/build/app-content/app-content.js", 210);
if (activeViewHandle) {
            _yuitest_coverline("/build/app-content/app-content.js", 211);
activeViewHandle.detach();
        }

        _yuitest_coverline("/build/app-content/app-content.js", 214);
next();
    }
};

// Mix statics.
_yuitest_coverline("/build/app-content/app-content.js", 219);
Y.mix(AppContent, PjaxContent);
// Mix prototype.
_yuitest_coverline("/build/app-content/app-content.js", 221);
Y.mix(AppContent, PjaxContent, false, null, 1);

// -- Namespace ----------------------------------------------------------------
_yuitest_coverline("/build/app-content/app-content.js", 224);
Y.App.Content = AppContent;
_yuitest_coverline("/build/app-content/app-content.js", 225);
Y.Base.mix(Y.App, [AppContent]);


}, '@VERSION@' ,{requires:['app-base', 'pjax-content']});
