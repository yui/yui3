/**
 * The nav controller keeps track the views for part of an application,
 * and manages the state that is ultimately saved by the app controller.
 * It can navigate to multiple views and can handle the
 * history tasks for managing additional view state.
 * @class Nav
 * @constructor
 * @param o The configuration options
 * @extends Base
 * @uses RenderTarget
 */
var Nav = function(o) {
    Nav.superclass.constructor.apply(this, arguments);
};

Nav.NAME = 'nav';

Nav.ATTRS = {

    /**
     * The nav control id
     * @attribute id
     * @type string
     */
    id: DEFAULT,

    /**
     * The app control host
     * @attribute parent
     * @type App
     */
    parent: DEFAULT,

    /**
     * The id of the default view.  This is used when navigate()
     * is called without a view specified and there is no saved state.
     * If not specified, the first view registered with this
     * instance becomes the default.
     * @attribute defaultViewId
     * @type string
     */
    defaultViewId: DEFAULT,

    /**
     * The id of the current view.  This is populated when navigate
     * is called, and if called without a view specified it will try
     * to populate this field from the history hash.
     * @attribute currentViewId
     * @type string
     */
    currentViewId: DEFAULT,

    /**
     * Extra state can be stored along with the view, and this is represented
     * in the history hash as viewid|extrastuff by default.  The pipe delimiter
     * is configurable.
     * @attribute stateDelimeter
     * @type string
     */
    stateDelimiter: {
        value: '|'
    },

    /**
     * A function used to render whatever scaffolding
     * the nav control plumbs in.  This might be nothing,
     * or it could be a container for the views it will
     * host.
     * @attribute renderer
     * @type function
     */
    renderer: DEFAULT
};

Y.extend(Nav, Y.Base, {

    initializer: function() {
        var self = this;

        self.views = {};

        Y.on('history:change', function (e) {
            if (e.src === 'hash' || e.src === 'popstate') {
                var id = self.get(ID),
                    changed = e.changed[id];
                if (changed) {
                    self.navigate(function(){
Y.log('hash change nav: ' + id + '=' + changed.newVal, 'info', 'app');
                    }, changed.newVal);
                } else if (e.removed.nav) { }
            }
        });

    },

    /**
     * Register a view with this nav control
     * @method addView
     * @param view {View} a view instance
     * @return {Nav} the nav control
     * @chainable
     */
    addView: function(view) {
        var id = view.get('id');
        this.views[id] = view;
        if (!this.get(DEFAULT_VIEW_ID)) {
            this.set(DEFAULT_VIEW_ID, id);
        }
        view.set(PARENT, this);
        return this;
    },

    /**
     * Unregister a view.
     * @method removeView
     * @param view {string|View} the view to remove
     * @return {View} the removed view
     */
    removeView: function(view) {
        var id = this.getViewId(view)[0],
            removed = this.getView(view);
        delete this.views[id];
        return removed;
    },

    /**
     * Gets the view name and extra state if provided delimited
     * in the id or view object.
     * @method getViewId
     * @param view {view|string} the view string or instance to parse
     * @return Array an array containing the id and state
     */
    getViewId: function(view) {
        var id = view, parts, state;
        if (Y.Lang.isObject(view)) {
            id = view.get(ID);
            state = view.get(VIEW_STATE);
        }

        parts = id.split(this.get(STATE_DELIMITER));
        if (!parts[1] && state) {
            parts[1] = state;
        }

        return parts;
    },

    /**
     * Returns the view when supplied a valid view id or instance
     * @method getView
     * @param view {view|string} the view string or instance to get
     * @return {View} the view instance.
     */
    getView: function(view) {
        var id = this.getViewId(view)[0];
        return this.views[id];
    },

    /**
     * Navigates to a view.  When the view name isn't supplied, it
     * renders the view that is in the current history state,
     * or the view registered as default -- in that order.  Navigation
     * is handled asynchronously because the view is rendered
     * asynchronously.
     *
     * @method navigate
     * @param callback {callback} the function to execute when the navigation is complete
     * @param view {string|View} the view to navigate to
     * @return {Nav} the nav control instance
     * @chainable
     */
    navigate: function(callback, view) {
        var self = this, saved, parts, cb = callback, history,

            prevView = self.get(CURRENT_VIEW_ID), transitioner,

            completeNavigate = function() {
                // no arg: use the current view if available or the default view
                view = self.getView(parts[0]);

                // We allow the additional arbitrary state via the view|data format
                // supported by this instance.
                if (parts[1]) {
                    view.set('viewState', parts[1]);
                }

                Y.log('navigate: ' + parts, 'info', 'app');

                view.render(function() {
                    // Y.log('view render callback for nav: ' + parts);
                    self.set(CURRENT_VIEW_ID, view.get(ID));
                    if (cb) {
                        cb.call(self, view);
                    }
                }, parts[1]);
            };

        // when no argument is passed, try to get the current view from history
        if (!view) {
            history = self.get(PARENT).history;
            if (history) {
                saved = history.get(self.get(ID));
            }
        }

        parts = self.getViewId(view ||
                               saved ||
                               prevView ||
                               self.get(DEFAULT_VIEW_ID));

        if (prevView) {
            prevView = self.getView(prevView);
            transitioner = prevView.get('transitioner');
            if (transitioner) {
                transitioner.call(self, function() {
                    self.fire('transitionComplete');
                    completeNavigate();
                }, view);
            } else {
                completeNavigate();
            }
        } else {
            completeNavigate();
        }

    }

});

Y.augment(Nav, Y.RenderTarget);

Y.Nav = Nav;

