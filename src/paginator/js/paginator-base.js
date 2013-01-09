function PaginatorCore () {
    PaginatorCore.superclass.constructor.apply(this, arguments);
}

PaginatorCore.NAME = 'paginator-core';

PaginatorCore.ATTRS = {
    /**
    Index of the first item on the page.
    @readOnly
    @attribute currentIndex
    @type Number
    **/
    currentIndex: {
        readOnly: true,
        getter: '_getIndex'
    },

    /**
    Maximum number of items per page
    @attribute itemsPerPage
    @type Number
    **/
    itemsPerPage: {
        value: 10
    },

    /**
    Current page count. First page is 1
    @attribute page
    @type Number
    **/
    page: {
        value: 1
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
    totalItems: {}

};

Y.extend(PaginatorCore, Y.Base, {

    goto: function(pageNumber) {
        this.set('currentPage', pageNumber);
    },

    first: function() {
        if (this.hasPrevPage()) {
            this.goto(1);
        }
    },

    last: function() {
        if (this.hasNextPage()) {
            this.goto(this.get('numberOfPages'));
        }
    },

    prev: function() {
        if (this.hasPrevPage()) {
            this.goto(this.get('currentPage') - 1);
        }
    },

    next: function() {
        if (this.hasNextPage()) {
            this.goto(this.get('currentPage') + 1);
        }
    },

    hasPrev: function() {
        return (this.get('currentPage') > 1);
    },

    hasNext: function() {
        return (this.get('currentPage') + 1 <= this.get('numberOfPages'));
    },

    ////////////////
    // PROTECTED
    ////////////////

    _getPages: function () {
        return Math.ceil(this.get('totalItems') / this.get('itemsPerPage'));
    },

    _getIndex: function () {
        return (this.get('page') - 1) * this.get('itemsPerPage') + 1;
    }

});

Y.namespace('Paginator').Core = PaginatorCore;

Y.Paginator = Y.mix(Y.Base.create('paginator', Y.Widget, [Y.Paginator.Core]), {

    fooga: function () {
        consol.log('i has fooga');
    }

}, Y.Paginator);
