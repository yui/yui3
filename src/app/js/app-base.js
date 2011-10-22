/**
Provides a top-level application component which manages navigation and views.

@submodule app-base
@since 3.5.0
**/

var Lang = Y.Lang,
    App;

/**
Provides a top-level application component which manages navigation and views.

  * TODO: Add more description.
  * TODO: Should this extend `Y.Base` and mix in `Y.Router` along with
    `Y.PjaxBase` and `Y.View`? Also need to make sure the `Y.Base`-based
    extensions are doing the proper thing w.r.t. multiple inheritance.

@class App
@constructor
@extends Base
@uses View
@uses Router
@uses PjaxBase
@since 3.5.0
**/
App = Y.Base.create('app', Y.Base, [Y.View, Y.Router, Y.PjaxBase], {
    // -- Public Properties ----------------------------------------------------

    /**
    Hash of view-name to metadata used to declaratively describe an
    application's views and their relationship with the app and other views.

    The view info in `views` is an Object keyed to a view name and can have any
    or all of the following properties:

      * `type`: Function or a string representing the view constructor to use to
        create view instances. If a string is used, the constructor function is
        assumed to be on the `Y` object; e.g. `"SomeView"` -> `Y.SomeView`.

      * `preserve`: Boolean for whether the view instance should be retained. By
        default, the view instance will be destroyed when it is no longer the
        active view. If `true` the view instance will simply be `removed()` from
        the DOM when it is no longer active. This is useful when the view is
        frequently used and may be expensive to re-create.

      * `parent`: String to another named view in this hash that represents
        parent view within the application's view hierarchy; e.g. a `"photo"`
        view could have `"album"` has its `parent` view. This parent/child
        relationship is used a queue for which transition to use.

      * `instance`: Used internally to manage the current instance of this named
        view. This can be used if your view instance is created up-front, or if
        you would rather manage the View lifecyle, but you probably should just
        let this be handled for you.

    If `views` are passed at instantiation time, they will override any views
    set on the prototype.

    @property views
    @type Object
    @default {}
    **/
    views: {},

    // -- Protected Properties -------------------------------------------------

    /**
    Map of view instance id (via `Y.stamp()`) to view-info object in `views`.

    This mapping is used to tie a specific view instance back to its metadata by
    adding a reference to the the related view info on the `views` object.

    @property _viewInfoMap
    @type Object
    @default {}
    @protected
    **/

    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        config || (config = {});

        this.views = config.views ?
            Y.merge(this.views, config.views) : this.views;

        this._viewInfoMap = {};

        this.after('activeViewChange', this._afterActiveViewChange);
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Creates and returns this app's `container` node from the specified HTML
    string, DOM element, or existing `Y.Node` instance. This method is called
    internally when the view is initialized.

    This node is also stamped with the CSS class specified by `Y.App.CSS_CLASS`.

    By default, the created node is _not_ added to the DOM automatically.

    @method create
    @param {HTMLElement|Node|String} container HTML string, DOM element, or
        `Y.Node` instance to use as the container node.
    @return {Node} Node instance of the created container node.
    **/
    create: function () {
        var container = Y.View.prototype.create.apply(this, arguments);
        return container && container.addClass(App.CSS_CLASS);
    },

    /**
    Renders this application by appending the `viewContainer` node to the
    `container` node, and showing the `activeView`.

    You should call this method at least once, usually after the initialization
    of your `Y.App` instance.

    @method render
    @chainable
    **/
    render: function () {
        var viewContainer = this.get('viewContainer'),
            activeView    = this.get('activeView');

        activeView && viewContainer.setContent(activeView.get('container'));
        viewContainer.appendTo(this.get('container'));

        return this;
    },

    /**
    Returns the metadata associated with a view instance or view name defined on
    the `views` object.

    @method getViewInfo
    @param {View|String} view View instance, or name of a view defined on the
      `views` object.
    @return {Object} The metadata for the view, or `undefined` if the view is
      not registered.
    **/
    getViewInfo: function (view) {
        if (view instanceof Y.View) {
            return this._viewInfoMap[Y.stamp(view, true)];
        }

        return this.views[view];
    },

    /**
    Creates and returns a new view instance using the provided `name` to look up
    the view info metadata defined in the `views` object. The passed-in `config`
    object is passed to the view constructor function.

    This function also maps a view instance back to its view info metadata.

    @method createView
    @param {String} name The name of a view defined on the `views` object.
    @param {Object} [config] The configuration object passed to the view
      constructor function when creating the new view instance.
    @return {View} The new view instance.
    **/
    createView: function (name, config) {
        var viewInfo        = this.getViewInfo(name),
            type            = (viewInfo && viewInfo.type) || Y.View,
            ViewConstructor = Lang.isString(type) ? Y[type] : type,
            view;

        // Create the view instance and map it with its metadata.
        view = new ViewConstructor(config).render();
        this._viewInfoMap[Y.stamp(view, true)] = viewInfo;

        return view;
    },

    /**
    Sets which view is visible/active within the application.

    This will set the application's `activeView` attribute to the view instance
    passed-in, or when a view name is provided, the `activeView` attribute will
    be set to either the preserved instance, or a new view instance will be
    created using the passed in `config`.

    A callback function can be specified as either the third or fourth argument,
    and this function will be called after the new `view` is the `activeView`
    and ready to use.

    @method showView
    @param {String|View} view The name of a view defined in the `views` object,
      or a view instance.
    @param {Object} [config] Optional configuration to use when creating a new
      view instance.
    @param {Object} [options] Optional object containing any of the following
        properties:
      @param {Boolean} [options.prepend] Whether the new view should be
        prepended instead of appended to the `viewContainer`.
      @param {Object} [options.transitions] An object that contains transition
          configuration overrides for the following properties:
        @param {Object} [options.transitions.viewIn] Transition overrides for
          the view being transitioned-in.
        @param {Object} [options.transitions.viewOut] Transition overrides for
          the view being transitioned-out.
    @param {Function} [callback] Optional callback Function to call after the
        new `activeView` is ready to use, the function will be passed:
      @param {View} view
    @chainable
    **/
    showView: function (view, config, options, callback) {
        var viewInfo;

        if (Lang.isString(view)) {
            viewInfo = this.getViewInfo(view) || {};
            view     = viewInfo.instance || this.createView(view, config);
        }

        options || (options = {});

        if (callback) {
            options.callback = callback;
        } else if (Lang.isFunction(options)) {
            options = {callback: options};
        }

        return this._set('activeView', view, options);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Determines if the `view` passed in is configured as a child of the `parent`
    view passed in. This requires both views to be either named-views, or view
    instanced created using configuration data that exists in the `views`
    object.

    @method _isChildView
    @param {View|String} view The name of a view defined in the `views` object,
      or a view instance.
    @param {View|String} parent The name of a view defined in the `views`
      object, or a view instance.
    @return {Boolean} Whether the view is configured as a child of the parent.
    @protected
    **/
    _isChildView: function (view, parent) {
        var viewInfo   = this.getViewInfo(view),
            parentInfo = this.getViewInfo(parent);

        if (viewInfo && parentInfo) {
            return this.getViewInfo(viewInfo.parent) === parentInfo;
        }

        return false;
    },

    /**
    Determines if the `view` passed in is configured as a parent of the `child`
    view passed in. This requires both views to be either named-views, or view
    instanced created using configuration data that exists in the `views`
    object.

    @method _isParentView
    @param {View|String} view The name of a view defined in the `views` object,
      or a view instance.
    @param {View|String} parent The name of a view defined in the `views`
      object, or a view instance.
    @return {Boolean} Whether the view is configured as a parent of the child.
    @protected
    **/
    _isParentView: function (view, child) {
        var viewInfo  = this.getViewInfo(view),
            childInfo = this.getViewInfo(child);

        if (viewInfo && childInfo) {
            return this.getViewInfo(childInfo.parent) === viewInfo;
        }

        return false;
    },

    /**
    Adds the `Y.App.VIEWS_CSS_CLASS` to the `viewContainer`.

    @method _setViewContainer
    @param {HTMLElement|Node|String} container HTML string, DOM element, or
      `Y.Node` instance to use as the container node.
    @return {Node} Node instance of the created container node.
    @protected
    **/
    _setViewContainer: function (viewContainer) {
        viewContainer = Y.one(viewContainer);
        return viewContainer && viewContainer.addClass(App.VIEWS_CSS_CLASS);
    },

    /**
    Helper method to attach the view instance to the application by making the
    application a bubble target of the view, and assigning the view instance to
    the `instance` property of the associated view info metadata.

    @method _attachView
    @param {View} view View to attach.
    @param {Boolean} prepend Whether the view should be prepended instead of
      appended to the `viewContainer`.
    @protected
    **/
    _attachView: function (view, prepend) {
        if (!view) {
            return;
        }

        var viewInfo      = this.getViewInfo(view),
            viewContainer = this.get('viewContainer');

        view.addTarget(this);
        viewInfo && (viewInfo.instance = view);

        // Insert view into the DOM.
        viewContainer[prepend ? 'prepend' : 'append'](view.get('container'));
    },

    /**
    Helper method to detach the view instance from the application by removing
    the application as a bubble target of the view, and either just removing the
    view if it is intended to be preserved, or destroying the instance
    completely.

    @method _detachView
    @param {View} view View to detach.
    @protected
    **/
    _detachView: function (view) {
        if (!view) {
            return;
        }

        var viewInfo = this.getViewInfo(view) || {};

        if (viewInfo.preserve) {
            view.remove();
        } else {
            view.destroy();

            // Remove from view to view-info map.
            delete this._viewInfoMap[Y.stamp(view, true)];

            // Remove from view-info instance property.
            if (view === viewInfo.instance) {
                delete viewInfo.instance;
            }
        }

        view.removeTarget(this);
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles the application's `activeViewChange` event (which is fired when the
    `activeView` attribute changes) by detaching the old view, attaching the new
    view.

    The `activeView` attribute is read-only, so the public API to change its
    value is through the `showView()` method.

    @method _afterActiveViewChange
    @param {EventFacade} e
    @protected
    **/
    _afterActiveViewChange: function (e) {
        var newView  = e.newVal,
            oldView  = e.prevVal,
            callback = e.callback,
            isChild  = this._isChildView(newView, oldView),
            isParent = !isChild && this._isParentView(newView, oldView),
            prepend  = !!e.prepend || isParent;

        // Prevent detaching (thus removing) the view we want to show.
        // Also hard to animate out and in, the same view.
        if (newView === oldView) {
            return callback && callback.call(this, newView);
        }

        // TODO: Remove `viewContainer` before making DOM updates?
        this._attachView(newView, prepend);
        this._detachView(oldView);

        callback && callback.call(this, newView);
    }
}, {
    ATTRS: {
        /**
        Container node which represents the application's bounding-box.

        @attribute container
        @type HTMLElement|Node|String
        @default "body"
        @initOnly
        **/
        container: {
            value: 'body'
        },

        /**
        Container node into which all application views will be rendered.

        @attribute viewContainer
        @type HTMLElement|Node|String
        @default Y.Node.create('<div/>')
        @initOnly
        **/
        viewContainer: {
            valueFn: function () {
                return Y.Node.create('<div/>');
            },

            setter   : '_setViewContainer',
            writeOnce: 'initOnly'
        },

        /**
        This attribute is provided by `PjaxBase`, but the default value is
        overridden to match all links on the page.

        @attribute linkSelector
        @type String|Function
        @default "a"
        **/
        linkSelector: {
            value: 'a'
        },

        /**
        The application's active/visible view.

        This attribute is read-only, to set the `activeView`, use the
        `showView()` method.

        @attribute activeView
        @type View
        @readOnly
        @see showView
        **/
        activeView: {
            readOnly: true
        }
    },

    CSS_CLASS      : Y.ClassNameManager.getClassName('app'),
    VIEWS_CSS_CLASS: Y.ClassNameManager.getClassName('app', 'views')
});

// -- Namespace ----------------------------------------------------------------
Y.namespace('App').Base = App;
Y.App = Y.mix(Y.Base.create('app', Y.App.Base, []), Y.App, true);
