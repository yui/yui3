function PaginatorModel () {
    PaginatorModel.superclass.constructor.apply(this, arguments);
}

PaginatorModel.NAME = 'paginator-model';

PaginatorModel.ATTRS = {
    /**
    Total number of pages to display
    @readOnly
    **/
    numberOfPages: {
        readOnly: true
    },

    /**
    First item index. (CurrentPage - 1) * itemsPerPage + 1
    @readOnly
    **/
    currentIndex: {
        value: 1
    },

    /**
    Current page count. First page is 1
    **/
    currentPage: {
        value: 1
    },

    /**
    Total number of items in all pages
    **/
    totalItems: {},

    /**
    Maximum number of items per page
    **/
    itemsPerPage: {
        value: 10
    }
};

Y.extend(PaginatorModel, Y.Model, {

    gotoPage: function(pageNumber) {
        this.set('currentPage', pageNumber);
    },

    gotoFirstPage: function() {
        if (this.hasPrevPage()) {
            this.gotoPage(1);
        }
    },

    gotoLastPage: function() {
        if (this.hasNextPage()) {
            this.gotoPage(this.get('numberOfPages'));
        }
    },

    gotoPrevPage: function() {
        if (this.hasPrevPage()) {
            this.gotoPage(this.get('currentPage') - 1);
        }
    },

    gotoNextPage: function() {
        if (this.hasNextPage()) {
            this.gotoPage(this.get('currentPage') + 1);
        }
    },

    hasPrevPage: function() {
        return (this.get('currentPage') > 1);
    },

    hasNextPage: function() {
        return (this.get('currentPage') + 1 <= this.get('numberOfPages'));
    }

});

Y.namespace('Paginator').Model = PaginatorModel;