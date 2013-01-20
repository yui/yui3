function PaginatorCore () {
    PaginatorCore.superclass.constructor.apply(this, arguments);
}

PaginatorCore.NAME = 'paginator-core';

PaginatorCore.ATTRS = {
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
        getter: '_getPages'
    },

    /**
    Total number of items in all pages
    @attribute totalItems
    @type Number
    **/
    totalItems: {
        value: 1,
        setter: '_totalItemsSetterFn'
    }

};

Y.extend(PaginatorCore, Y.Base, {

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

    ////////////////
    // PROTECTED
    ////////////////

    _getPages: function () {
        return Math.ceil(this.get('totalItems') / this.get('itemsPerPage'));
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
        }
        return parseInt(val, 10);
    },

    _totalItemsSetterFn: function (val) {
        return parseInt(val, 10);
    }

});

Y.namespace('Paginator').Core = PaginatorCore;
