var Y_Paginator = Y.namespace('Paginator'),
    LNAME = NAME + '::',
    Paginator;

Paginator = Y.Base.create('paginator', Y.Widget, [Y.Paginator.Core], {

    renderUI: function () {
        console.log(LNAME, 'renderUI');
        // initialize the view since syncUI will render the UI
        this.get('view');
    },

    bindUI: function () {
        console.log(LNAME, 'bindUI');
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

    syncUI: function () {
        console.log(LNAME, 'syncUI');
        this.get('view').render();
    },


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
    _afterUIFirst: function () {
        this.first();
    },

    _afterUILast: function () {
        this.last();
    },

    _afterUIPrev: function () {
        this.prev();
    },

    _afterUINext: function () {
        this.next();
    },

    _afterUIPage: function (e) {
        this.page(e.val);
    },

    _afterUIPerPage: function (e) {
        this.perPage(e.val);
    },

    // View
    _viewSetterFn: function (view) {
        console.log(LNAME, '_viewSetterFn');

        if (typeof view === 'string') {
            view = this._createView(view);
        }

        return view;
    },

    _createView: function (viewType) {
        console.log(LNAME, '_createView');

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
