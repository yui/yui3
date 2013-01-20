var Y_Paginator = Y.Paginator,
    PaginatorBase;

PaginatorBase = Y.Base.create('paginator', Y.Base, [Y_Paginator.Core, Y_Paginator.Url], {

    prefix: null,

    initializer: function (config) {
        this.classNames = Y.Paginator.CLASSNAMES;
        this.bind();
    },

    destructor: function () {
        this.view.destroy();

        Y.Array.each(this._subs, function (item) {
            item.detach();
        });
        this._subs = null;
    },

    render: function () {
        var View = this.get('view');

        if (View) {
            (this.view = new View(
                Y.mix({
                    controller: this
                }, this.getAttrs())
            )).render();
        }

        return this;
    },

    bind: function () {
        var subscriptions = [];

        subscriptions.push(
            this.after('pageChange', this._onPageChange, this),
            this.after('itemsPerPageChange', this._onItemsPerPageChange, this ),
            this.after('totalItemsChange', this._onTotalItemsChange, this)
        );

        this._subs = subscriptions;

        return this;
    },

    /////////////////////////////////
    // E V E N T   C A L L B A C K S
    /////////////////////////////////

    _onPageChange: function () {
        this.view.syncPages();
    },

    _onItemsPerPageChange: function () {
        this.view.syncControls();
        this.set('page', 1);
    },

    _onTotalItemsChange: function () {
        this.view.syncControls();
    },




    /////////////////////
    // P R O T E C T E D
    /////////////////////

    _defContainerFn: function () {
        return Y.Node.create('<div class="' + this.className('paginator') + '"></div>');
    },

    _defStringVals: function () {
        return Y.Intl.get("paginator-templates");
    },

    _viewSetter: function (val) {
        this.view = val;
        return val;
    },

    _viewGetter: function () {
        return this.view || this._defViewFn();
    },

    _defViewFn: function () {
        return Y.Paginator.List;
    }


}, {
    ATTRS: {
        view: {
            valueFn: '_defViewFn',
            setter: '_viewSetter',
            getter: '_viewGetter'
        },

        container: {
            valueFn: '_defContainerFn'
        },

        strings : {
            valueFn: '_defStringVals'
        },

        pageSizes: {},

        displayRange: {}
    }
});

Y.Paginator = Y.mix(PaginatorBase, Y_Paginator);
