var Y_Paginator = Y.namespace('Paginator'),
    getClassName = Y.ClassNameManager.getClassName,
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

        this.after('pageChange', this.syncUI, this);
        this.after('itemsPerPageChange', this.syncUI, this);
        this.after('totalItemsChange', this.syncUI, this);

        this.after('*:first', this._afterUIFirst, this);
        this.after('*:last', this._afterUILast, this);
        this.after('*:prev', this._afterUIPrev, this);
        this.after('*:next', this._afterUINext, this);
        this.after('*:page', this._afterUIPage, this);
        this.after('*:perPage', this._afterUIPerPage, this);

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
    _getConstructor: function(type) {
        return typeof type === 'string' ?
                Y.Object.getValue(Y, type.split('.')) : type;
    },

    _setView: function (view) {
        var ViewConstructor = this.get('viewType'),
            viewConfig;

        // assume view is a config object if not a View instance
        if (!(view instanceof Y.View)) {
            viewConfig = Y.merge(view);

            delete viewConfig.container;
            delete viewConfig.model;

            view = new ViewConstructor(viewConfig);
        }

        view.setAttrs({
            container: this.get('contentBox'),
            model: this
        });

        return view;
    }


}, {
    ATTRS: {

        view: {
            setter: '_setView',
            value: null
        },

        viewType: {
            getter: '_getConstructor',
            value: 'Paginator.View',
            writeOnce: 'initOnly'
        }
    }
});

Y.Paginator = Y.mix(Paginator, Y_Paginator);
