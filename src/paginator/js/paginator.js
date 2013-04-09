/**
 The Paginator Control allows you to reduce the page size and render
    time of your site or web application by breaking up large data sets
    into discrete pages. Paginator addresses the navigation aspect of
    chunked content, offering a set of controls that it can render into
    your UI to allow users to navigate through logical sections of local
    or remote data.

 @module paginator
 @class Paginator
 @since 3.10.0
 */

var Y_Paginator = Y.namespace('Paginator'),
    Paginator;

Paginator = Y.Base.create('paginator', Y.Widget, [Y.Paginator.Core], {

    /**
     Requests the view so we can be sure the view is initialized. We
       render the view in syncUI so the render only happens once on initialization.
     @method renderUI
     */
    renderUI: function () {
        // initialize the view since syncUI will render the UI
        this.get('view');
    },

    /**
     Registers change events to update the view. Registers view events
       to update local attrs.
     @method bindUI
     */
    bindUI: function () {
        var view = this.get('view');

        this.after(['pageChange', 'itemsPerPageChange', 'totalItemsChange'], this.syncUI, this);

        this.after({
            '*:first': this._afterUIFirst,
            '*:last': this._afterUILast,
            '*:prev': this._afterUIPrev,
            '*:next': this._afterUINext,
            '*:page': this._afterUIPage,
            '*:perPage': this._afterUIPerPage
        }, null, this);

        view.addTarget(this);
        view.attachEvents();
    },

    /**
     Calls render() on the view to resync the view
     @method syncUI
     */
    syncUI: function () {
        this.get('view').render();
    },

    /**
     Returns an object of the current ATTRS to be used in the view.
     @method toJSON
     @retuns Object
     */
    toJSON: function () {
        var attrs = this.getAttrs();

        delete attrs.boundingBox;
        delete attrs.contentBox;
        delete attrs.srcNode;
        delete attrs.view;
        delete attrs.viewType;

        return attrs;
    },

    //---- PROTECTED ----

    // UI Events
    /**
     Called when the view fires a 'first' event.
     @protected
     @method _afterUIFirst
     @param {EventFacade} e
     */
    _afterUIFirst: function () {
        this.first();
    },

    /**
     Called when the view fires a 'last' event.
     @protected
     @method _afterUILast
     @param {EventFacade} e
     */
    _afterUILast: function () {
        this.last();
    },

    /**
     Called when the view fires a 'prev' event.
     @protected
     @method _afterUIPrev
     @param {EventFacade} e
     */
    _afterUIPrev: function () {
        this.prev();
    },

    /**
     Called when the view fires a 'next' event.
     @protected
     @method _afterUINext
     @param {EventFacade} e
     */
    _afterUINext: function () {
        this.next();
    },

    /**
     Called when the view fires a 'page' event.
     @protected
     @method _afterUIPage
     @param {EventFacade} e
     */
    _afterUIPage: function (e) {
        this.page(e.val);
    },

    /**
     Called when the view fires a 'perPage' event.
     @protected
     @method _afterUIPerPage
     @param {EventFacade} e
     */
    _afterUIPerPage: function (e) {
        this.perPage(e.val);
    },

    // View
    /**
     Sets the view of the paginator. If the view provided is a String,
       we construct a new view and save that locally.
     @protected
     @method _viewSetterFn
     @param {String|Object} view
     @return Y.View
     */
    _viewSetterFn: function (view) {
        if (typeof view === 'string') {
            view = this._createView(view);
        } else {
            if (!view.get('container')) {
                view.set('container', this.get('contentBox'));
            }

            if (!view.get('model')) {
                view.set('model', this);
            }
        }

        return view;
    },

    /**
     Creates a View instance based on the provided viewType using the viewConfig ATTRS
     @protected
     @method _createView
     @param {String} viewType
     @return Y.View
     */
    _createView: function (viewType) {
        var ViewConstructor = Y.Object.getValue(Y, viewType.split('.')),
            viewConfig = this.get('viewConfig'),
            view;

        viewConfig = Y.merge(viewConfig);

        delete viewConfig.container;
        delete viewConfig.model;

        view = new ViewConstructor(viewConfig);

        view.setAttrs({
            container: this.get('contentBox'),
            model: this
        });

        return view;
    }


}, {
    ATTRS: {

        /**
         The view to be rendered within the paginator. If the view provided is a String,
           a new view will be instantiated using the viewConfig.
         @property view
         @type {Y.View|String}
         @initOnly
         */
        view: {
            setter: '_viewSetterFn',
            value: 'Paginator.View',
            writeOnce: 'initOnly'
        },

        /**
         Configuration for the view created IF `view` is a String to a Y.View constructor
         @property viewConfig
         @type {Object}
         @initOnly
         */
        viewConfig: {
            value: {},
            writeOnce: 'initOnly'
        }
    }
});

Y.Paginator = Y.mix(Paginator, Y_Paginator);
