
/**
 * The application framework provides a main application controller
 * that can host multiple navigation controllers, each which can
 * navigate to multiple views and keeps state about where it is
 * in the navigation scheme.  It provides a simple rendering framework
 * that is asynchronous and not DOM focused.  It ties into the
 * history manager to manage the nav state when this feature is
 * available.
 * @module app
 * @since 3.4.0
 * @requires base-base
 * @optional history
 * @beta
 */

/**
 * The application control handles the application level
 * functional in the framework.  In addition to hosting
 * the various nav controls for the app, it handles saving
 * state since that needs to be centralized.
 * @class App
 * @constructor
 * @param o The configuration options
 * @extends Base
 * @uses RenderTarget
 */
var DEFAULT = {},

    APP_STATE_CHANGE = 'appStateChange',
    CURRENT_VIEW_ID = 'currentViewId',
    DEFAULT_VIEW_ID = 'defaultViewId',
    ID = 'id',
    PARENT = 'parent',
    STATE_DELIMITER = 'stateDelimiter',
    VIEW_STATE = 'viewState',

    App = function(o) {
        App.superclass.constructor.apply(this, arguments);
    };

App.NAME = 'app';

App.ATTRS = {

    /**
     * The app control id
     * @attribute id
     * @type string
     */
    id: DEFAULT,

    /**
     * A property that can be used by the navs/views
     * to determine if it is okay to operate.  Not
     * currently modified by the app framework.
     * @attribute modal
     * @type bool
     * @default false
     */
    modal: DEFAULT,

    /**
     * The id of a nav control that has focus
     * Not currently modified by the app framework.
     * @attribute modalFocus
     * @type string
     */
    modalFocus: DEFAULT,

    /**
     * A function used to render whatever scaffolding
     * the app control plumbs in.  This might be nothing,
     * or it could be a container for the various app
     * controls.
     * @attribute renderer
     * @type function
     */
    renderer: DEFAULT
};

Y.extend(App, Y.Base, {

    /**
     * Executed when the appState attribute is updated.  This notifies
     * all nav controllers and the current view that the state change
     * happened.
     * @method _stateChangeNotifier
     * @param {Event} e the change event
     * @param e.newVal the new state
     * @param e.prevVal the old state
     * @private
     */
    _stateChangeNotifier: function(e) {
        var i, nav, viewId, navs = this.navs;
        for (i in navs) {
            if (navs.hasOwnProperty(i)) {
                nav = navs[i];
                viewId = nav.get(CURRENT_VIEW_ID);
                nav.fire(APP_STATE_CHANGE, e);
                nav.getView(viewId).fire(APP_STATE_CHANGE, e);
            }
        }
    },

    initializer: function() {

        if (Y.History) {
            /**
             * History control instance
             * @property history
             */
            this.history = new Y.History();
        } else {
            Y.log('History component not found, state will not be maintained', 'warn', 'app');
        }

        /**
         * Hash of navigation controls
         * @property navs
         */
        this.navs = {};

        this.on(APP_STATE_CHANGE, this._stateChangeNotifier);
    },

    /**
     * Add a nav control instance to this app control
     * @method addNav
     * @param nav {Nav} a nav control to add
     * @return {App} the app control
     * @chainable
     */
    addNav: function(nav) {
        var self = this,
            id = nav.get(ID);

        self.navs[id] = nav;
        nav.set(PARENT, self);

        nav.on(CURRENT_VIEW_ID + 'Change', function(e) {
// Y.log('change- ' + e.newVal + ',' + (e.prevVal||''), 'info', 'app');
            self.save(nav, nav.getView(e.newVal));
        });

        return nav;
    },

    /**
     * Remove a nav control from this app control instance
     * @method removeNav
     * @param nav {string|Nav} a nav control to remove
     * @return {Nav} the removed nav control
     */
    removeNav: function(nav) {
        var id = nav, removed;
        if (Y.Lang.isObject(nav)) {
            id = nav.get(ID);
        }
        delete this.navs[id];
        return removed || nav;
    },

    /**
     * Save the current state of the application.  This happens automatically
     * when a nav controller navigates to a new view, but it can also be
     * called directly if updating the extra state for a view.
     * @method save
     * @property nav {Nav} a navigation control
     * @property view {View} a view control
     * @property [options] an optional object containing configuration options
     * that will be passed to the history component. See the history utility
     * for a list of the valid configuration options.  The url and
     * title properties are automatically propagated from the view if these
     * attributes are set on the view.  This only matters when using HTML5
     * history.
     * @return {App} The app control
     * @chainable
     */
    save: function(nav, view, options) {
        if (!view.get('ephemeral')) {
            var url, title,
                xtra = view.get('state'),
                viewval = view.get(ID);
            if (xtra) {
                viewval += nav.get(STATE_DELIMITER) + xtra;
            }
            if (this.history) {
                url = view.get('url');
                title = view.get('title');
                if (url || title) {
                    options = (options) ? Y.merge(options) : {};
                    options.url = options.url || url;
                    options.title = options.title || title;
                }
                this.history.addValue(nav.get(ID), viewval, options);
                Y.log('history updated: ' + viewval, 'info', 'app');
            }
        } else {
            Y.log('not saved', 'info', 'app');
        }

        return this;
    }

});

Y.augment(App, Y.RenderTarget);

Y.App = App;


//   Modality control
//   Visibility/focus of nav controllers?
//   State change Orientation change / view size - implementer
//   The app controller is DOM agnostic code for the most part
