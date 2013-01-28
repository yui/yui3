var getClassName = Y.ClassNameManager.getClassName,
    LNAME = NAME + '::',
    PaginatorBase;

PaginatorBase = Y.Base.create('paginator', Y.Widget, [], {

    classNames: {
        container: getClassName('paginator', 'container'),
        controls: getClassName('paginator', 'controls'),
        control: getClassName('paginator', 'control'),
        controlWrapper: getClassName('paginator', 'control-wrapper'),
        controlDisabled: getClassName('paginator', 'control-disabled'),
        controlSelected: getClassName('paginator', 'control-selected'),
        controlFirst: getClassName('paginator', 'control-first'),
        controlPrev: getClassName('paginator', 'control-prev'),
        controlNext: getClassName('paginator', 'control-next'),
        controlLast: getClassName('paginator', 'control-last'),
        pages: getClassName('paginator', 'pages'),
        page: getClassName('paginator', 'page'),
        pageWrapper: getClassName('paginator', 'page-wrapper'),
        pageSelect: getClassName('paginator', 'page-select'),
        pageInput: getClassName('paginator', 'page-input'),
        perPageSelect: getClassName('paginator', 'per-page-select')
    },

    initializer: function () {
        this.lastPage = null;
        this.lastTotalItems = null;
        this.lastItemsPerPage = null;
    },

    destructor: function () {
        this.view.destroy();

        Y.Array.each(this._subs, function (item) {
            item.detach();
        });
        this._subs = null;
    },


//-- L I F E   C Y C L E ----

    renderUI: function () {
    },

    bindUI: function () {
        var subscriptions = [];

        subscriptions.push(
            this.after({
                'pageChange': this._afterPageChange,
                'itemsPerPageChange': this._afterItemsPerPageChange,
                'totalItemsChange': this._afterTotalItemsChange
            })
        );

        this._subs = subscriptions;

        return this;
    },

    syncUI: function () {
        console.info(LNAME, 'syncUI');
    },


//-- C O R E   M E T H O D S ----------

    select: function (pageNumber) {
        this.set('page', pageNumber);
    },

    first: function () {
        if (this.hasPrev()) {
            this.select(1);
        }
    },

    last: function () {
        if (this.hasNext()) {
            this.select(this.get('pages'));
        }
    },

    prev: function () {
        if (this.hasPrev()) {
            this.select(this.get('page') - 1);
        }
    },

    next: function () {
        if (this.hasNext()) {
            this.select(this.get('page') + 1);
        }
    },

    hasPrev: function () {
        return (this.get('page') > 1);
    },

    hasNext: function () {
        return (this.get('page') + 1 <= this.get('pages'));
    },


//-- E V E N T   C A L L B A C K S -------

    _afterPageChange: function (e) {
        this.lastPage = e.prevVal;
        e.src = 'page';
        this.syncUI(e);
    },

    _afterItemsPerPageChange: function (e) {
        this.lastItemsPerPage = e.prevVal;
        e.src = 'itemsPerPage';
        this.syncUI(e);
        this.set('page', 1);
    },

    _afterTotalItemsChange: function (e) {
        this.lastTotalItems = e.prevVal;
        e.src = 'totalItems';
        this.syncUI(e);
    },




//-- P R O T E C T E D ----



//-- D E F A U L T   F U N C T I O N S ----

    _defContainerFn: function () {
        return Y.Node.create('<div class="' + this.className('paginator') + '"></div>');
    },

    _defStringVals: function () {
        return Y.Intl.get("paginator-templates");
    },


//-- G E T T E R S ----

    _pagesGetterFn: function () {
        return Math.ceil(this.get('totalItems') / this.get('itemsPerPage'));
    },

    _indexGetterFn: function () {
        return (this.get('page') - 1) * this.get('itemsPerPage') + 1;
    },

//-- S E T T E R S ----

    _pageSetterFn: function (val) {
        val = parseInt(val, 10);

        if (val <= this.get('pages')) {
            return parseInt(val, 10);
        }

        return Y.Attribute.INVALID_VALUE;
    },

    _itemsPerPageSetterFn: function (val) {
        this._viewItemsPerPage = val;

        if (val.toString().toLowerCase() === 'all' || val === '*') {
            val = this.get('totalItems');
        }

        return parseInt(val, 10);
    },

    _totalItemsSetterFn: function (val) {
        return parseInt(val, 10);
    }


}, {
    NAME: 'paginator',

    ATTRS: {
        /**
         Index of the first item on the page.
         @readOnly
         @attribute index
         @type Number
         **/
        index: {
            readOnly: true,
            getter: '_indexGetterFn'
        },

        /**
         Maximum number of items per page
         @attribute itemsPerPage
         @type Number
         **/
        itemsPerPage: {
            value: 1,
            setter: '_itemsPerPageSetterFn'
        },

        /**
         Current page count. First page is 1
         @attribute page
         @type Number
         **/
        page: {
            value: 1,
            setter: '_pageSetterFn'
        },

        /**
         Total number of pages to display
         @readOnly
         @attribute pages
         @type Number
         **/
        pages: {
            readOnly: true,
            getter: '_pagesGetterFn'
        },

        /**
         Array of items to display per page
         @attribute pageSizes
         @type {Array}
         @default [10, 25, '*']
         **/
        pageSizes: {
            value: [10, 25, '*']
        },

        /**
         Total number of items in all pages
         @attribute totalItems
         @type Number
         **/
        totalItems: {
            value: 1,
            setter: '_totalItemsSetterFn'
        },

        strings : {
            valueFn: '_defStringVals'
        }
    }
});

Y.namespace('Paginator').Base = PaginatorBase;
Y.Paginator = Y.mix(PaginatorBase, Y.namespace('Paginator'));
