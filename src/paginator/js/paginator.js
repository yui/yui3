/**
 A collection of generic paginator methods and properties.

 @module paginator
 @submodule paginator
 @class Core
 @namespace Paginator
 @since 3.10.0
 */
 var Paginator = Y.Base.create('paginator', Y.Base, [], {

    /**
     Sets the page to the first page in the set.
     @method firstPage
     */
    firstPage: function () {
        this.set('page', 1);
    },

    /**
     Sets the page to the last page in the set.
     Goes to next page if totalItems is not set
     @method lastPage
     */
    lastPage: function () {
        if (this.hasNextPage()) {
            if (this.get('totalItems')) {
                this.set('page', this.get('totalPages'));
            } else {
                this.nextPage();
            }
        }
    },

    /**
     Sets the page to the previous page in the set.
     @method prevPage
     */
    prevPage: function () {
        if (this.hasPrevPage()) {
            this.set('page', this.get('page') - 1);
        }
    },

    /**
     Sets the page to the next page in the set.
     @method nextPage
     */
    nextPage: function () {
        if (this.hasNextPage()) {
            this.set('page', this.get('page') + 1);
        }
    },

    /**
     Returns True if there is a previous page in the set.
     @method hasPrevPage
     @return Boolean
     */
    hasPrevPage: function () {
        return this.get('page') > 1;
    },

    /**
     Returns True if there is a previous page in the set.

     If totalItems isn't set, assume there is always next page;

     @method hasNextPage
     @return Boolean
     */
    hasNextPage: function () {
        return (!this.get('totalItems') || this.get('page') < this.get('totalPages'));
    },


    //--- P R O T E C T E D

    /**
     Sets the current page to the value provided.
     @protected
     @method _setPageFn
     @param {Number} val
     @return Number
     */
    _setPageFn: function (val) {
        return parseInt(val, 10);
    },

    /**
     Returns the total number of pages based on the total number of
       items provided and the number of items per page
     @protected
     @method _getTotalPagesFn
     @return Number
     */
    _getTotalPagesFn: function () {
        var itemsPerPage = this.get('itemsPerPage');

        return (itemsPerPage < 1) ? 1 : Math.ceil(this.get('totalItems') / itemsPerPage);
    },

    /**
     Sets the number of items to be displayed per page
     @protected
     @method _setItemsPerPageFn
     @param {Number} val
     @return Number
     */
    _setItemsPerPageFn: function (val) {
        if (!val) {
            return Y.Attribute.INVALID_VALUE;
        }

        if (val.toString().toLowerCase() === 'all' || val === '*') {
            val = -1;
        }

        return parseInt(val, 10);
    },

    /**
     Sets the total number of items in the set.
     @protected
     @method _setTotalItemsFn
     @param {Number} val
     @return Number
     */
    _setTotalItemsFn: function (val) {
        return parseInt(val, 10);
    }

}, {
    ATTRS: {
        /**
         Current page count. First page is 1
         @attribute page
         @type Number
         **/
        page: {
            value: 1,
            setter: '_setPageFn'
        },

        /**
         Total number of pages to display
         @readOnly
         @attribute totalPages
         @type Number
         **/
        totalPages: {
            readOnly: true,
            getter: '_getTotalPagesFn'
        },

        /**
         Maximum number of items per page. A value of negative one (-1) indicates
             all items on one page.
         @attribute itemsPerPage
         @type Number
         **/
        itemsPerPage: {
            value: 1,
            setter: '_setItemsPerPageFn'
        },

        /**
         Total number of items in all pages.
         @attribute totalItems
         @type Number
         **/
        totalItems: {
            value: null,
            setter: '_setTotalItemsFn'
        }
    }
});

Y.Paginator = Paginator;