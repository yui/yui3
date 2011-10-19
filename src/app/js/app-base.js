/**
Provides a top-level application component which manages navigation and views.

@submodule app-base
@since 3.5.0
**/

var Lang = Y.Lang;

/**
Provides a top-level application component which manages navigation and views.

  * TODO: Add more description.
  * TODO: Should this extend Y.Base and mix in Y.Router along with
    Y.PjaxBase and Y.View?

@class App
@constructor
@extends Base
@uses Router
@uses PjaxBase
@uses View
@since 3.5.0
**/
Y.App = Y.Base.create('app', Y.Base, [Y.Router, Y.PjaxBase, Y.View], {
    // -- Public Properties ----------------------------------------------------

    /**
    Hash of view-name to meta data used to declaratively describe an
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

    /**
    Transitions to use when the `activeView` changes.

    TODO: Implement transitions.

    If `transitions` are passed at instantiation time, they will override any
    transitions set on the prototype.

    @property transitions
    @type Object
    @default {}
    **/
    transitions: {},

    // -- Protected Properties -------------------------------------------------

    /**
    Map of view instance id (via `Y.stamp()`) to view-info object in `views`.

    This mapping is used to tie a specific view instance back to its meta data
    by adding a reference to the the related view info on the `views` object.

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

        this.transitions = config.transitions ?
            Y.merge(this.transitions, config.transitions) : this.transitions;

        this._viewInfoMap = {};

        this.after('activeViewChange', this._afterActiveViewChange);
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Returns the meta data associated with a view instance or view name defined
    on the `views` object.

    @method getViewInfo
    @param {View|String} view View instance, or name of a view defined on the
      `views` object.
    @return {Object} The meta data for the view.
    **/
    getViewInfo: function (view) {
        if (view instanceof Y.View) {
            return this._viewInfoMap[Y.stamp(view, true)];
        }

        return this.views[view];
    },

    /**
    Creates and returns a new view instance using the provided `name` to look up
    the view info meta data defined in the `views` object. The passed-in
    `config` object is passed to the view constructor function.

    This function also maps a view instance back to its view info meta data.

    @method createView
    @param {String} name The name of a view defined on the `views` object.
    @param {Object} [config] The configuration object passed to the view
      constructor function when creating the new view instance.
    @return {View} The new view instance.
    **/
    createView: function (name, config) {
        var viewInfo        = this.getViewInfo(name),
            type            = viewInfo && viewInfo.type,
            ViewConstructor = Lang.isString(type) ? Y[type] : type,
            view;

        // TODO: Default to `Y.View` or throw error if `ViewConstructor` is not
        // a function?
        if (Lang.isFunction(ViewConstructor)) {
            view = new ViewConstructor(config).render();
            this._viewInfoMap[Y.stamp(view, true)] = viewInfo;
        }

        return view;
    },

    /**
    Sets which view is visible/active within the application.

    This will set the application's `activeView` attribute to  the view instance
    passed-in, or when a view name is provided, the `activeView`
    attribute will be set to either the preserved instance, or a new view
    instance will be created using the passed in `config`.

    TODO: Document transition info and config.

    @method showView
    @param {String|View} view The name of a view defined in the `views` object,
      or a view instance.
    @param {Object} [config] Optional configuration to use when creating a new
      view instance.
    @param {Function|Object} [options] Optional callback Function, or object
        containing any of the following properties:
      @param {Function} [options.callback] Function to callback after setting
        the new active view.
    @chainable
    **/
    showView: function (view, config, options) {
        var viewInfo;

        if (Lang.isString(view)) {
            viewInfo = this.getViewInfo(view) || {};
            view     = viewInfo.instance || this.createView(view, config);
        }

        Lang.isFunction(options) && (options = {callback: options});

        return this._set('activeView', view, options);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Transitions the `oldView` out and the `newView` using the provided
    `transition`, or determining which transition to use.

    @method _transitionViews
    @param {View} newView The view instance to transition-in (if any).
    @param {View} oldView The view instance to transition-out (if any).
    @param {String} [transition] Optional name of the transition to use. By
      default the transition is determined by the application's `transitions`
      configuration and relationship between the `newView` and `oldView`.
    @param {Function} [callback] Optional function to call once the transition
      has completed.
    @protected
    **/
    _transitionViews: function (newView, oldView, transition, callback) {
        // TODO: Actually implement the transitions.
        newView && newView.get('container').appendTo(this.get('container'));
        callback && callback.call(this);
    },

    /**
    Helper method to attach the view instance to the application by making the
    application a bubble target of the view, and assigning the view instance to
    the `instance` property of the associated view info meta data.

    @method _attachView
    @param {View} view View to attach.
    @protected
    **/
    _attachView: function (view) {
        var viewInfo;

        if (view) {
            view.addTarget(this);
            // TODO: Should this happen eagerly, before the transition?
            viewInfo = this.getViewInfo(view);
            viewInfo && (viewInfo.instance = view);
        }
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
    `activeView` attribute changes) by transitioning between the old and new
    view and calling the callback function passed into `showView()`.

    @method _afterActiveViewChange
    @param {EventFacade} e
    @protected
    **/
    _afterActiveViewChange: function (e) {
        var newView    = e.newVal,
            oldView    = e.prevVal,
            callback   = e.callback,
            transition = e.transition;

        if (newView === oldView) {
            return callback && callback.call(this, newView);
        }

        this._transitionViews(newView, oldView, transition, function () {
            this._detachView(oldView);
            this._attachView(newView);

            callback && callback.call(this, newView);
        });
    }

}, {
    ATTRS: {
        /**
        Container node into which represents the application's bounding-box.

        @attribute container
        @type HTMLElement|Node|String
        @default Y.one('body')
        @initOnly
        **/
        container: {
            value: Y.one('body')
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
    }
});
