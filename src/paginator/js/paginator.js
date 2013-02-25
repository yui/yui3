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
     @method syncUI
     */
    syncUI: function () {
        this.get('view').render();
    },

    /**
     @method toJSON
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
     @protected
     @method _afterUIFirst
     */
    _afterUIFirst: function () {
        this.first();
    },

    /**
     @protected
     @method _afterUILast
     */
    _afterUILast: function () {
        this.last();
    },

    /**
     @protected
     @method _afterUIPrev
     */
    _afterUIPrev: function () {
        this.prev();
    },

    /**
     @protected
     @method _afterUINext
     */
    _afterUINext: function () {
        this.next();
    },

    /**
     @protected
     @method _afterUIPage
     */
    _afterUIPage: function (e) {
        this.page(e.val);
    },

    /**
     @protected
     @method _afterUIPerPage
     */
    _afterUIPerPage: function (e) {
        this.perPage(e.val);
    },

    // View
    /**
     @protected
     @method _viewSetterFn
     */
    _viewSetterFn: function (view) {
        if (typeof view === 'string') {
            view = this._createView(view);
        }

        return view;
    },

    /**
     @protected
     @method _createView
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

        view: {
            setter: '_viewSetterFn',
            value: 'Paginator.View',
            writeOnce: 'initOnly'
        },

        viewConfig: {
            value: {},
            writeOnce: 'initOnly'
        }
    }
});

Y.Paginator = Y.mix(Paginator, Y_Paginator);
