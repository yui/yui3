function PaginatorModel () {
    PaginatorModel.superclass.constructor.apply(this, arguments);
}

PaginatorModel.NAME = 'paginator-model';

PaginatorModel.ATTRS = {
    /**
    Index of the first item on the page.
    @readOnly
    @attribute index
    @type Number
    **/
    index: {
        readOnly: true,
        getter: '_getIndex'
    },

    /**
    Maximum number of items per page. A value of negative one (-1) indicates
        all items on one page.
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
        getter: '_getPages'
    },

    /**
    Total number of items in all pages.
    @attribute totalItems
    @type Number
    **/
    totalItems: {
        value: 1,
        setter: '_totalItemsSetterFn'
    }

};

Y.extend(PaginatorModel, Y.Model, {

    page: function (pageNumber) {
        if (pageNumber && pageNumber >= 1 && pageNumber <= this.get('pages')){
            this.set('page', pageNumber);
        }
    },

    first: function () {
        if (this.hasPrev()) {
            this.page(1);
        }
    },

    last: function () {
        if (this.hasNext()) {
            this.page(this.get('pages'));
        }
    },

    prev: function () {
        if (this.hasPrev()) {
            this.page(this.get('page') - 1);
        }
    },

    next: function () {
        if (this.hasNext()) {
            this.page(this.get('page') + 1);
        }
    },

    hasPrev: function () {
        return (this.get('page') > 1);
    },

    hasNext: function () {
        return (this.get('page') + 1 <= this.get('pages'));
    },

    perPage: function (itemsPerPage) {
        this.set('itemsPerPage', itemsPerPage);
        this.page(1);
    },

    ////////////////
    // PROTECTED
    ////////////////

    _getPages: function () {
        var itemsPerPage = this.get('itemsPerPage');

        if (itemsPerPage < 1) {
            return 1;
        } else {
            return Math.ceil(this.get('totalItems') / itemsPerPage);
        }
    },

    _getIndex: function () {
        return (this.get('page') - 1) * this.get('itemsPerPage') + 1;
    },

    _pageSetterFn: function (val) {
        return parseInt(val, 10);
    },

    _itemsPerPageSetterFn: function (val) {
        if (val.toString().toLowerCase() === 'all' || val === '*') {
            val = this.get('totalItems');
            val = -1;
        }

        return parseInt(val, 10);
    },

    _totalItemsSetterFn: function (val) {
        return parseInt(val, 10);
    }

});

Y.namespace('Paginator').Model = PaginatorModel;
