/**
Core model for pagination.  Include in
`Y.Base.create(NAME, SuperClass, [ Y.Paginator.Core, ... ])` when creating a
class needing pagination controls.

@module paginator
@submodule paginator-core
@since 3.6.0
**/
var INVALID  = Y.Attribute.INVALID_VALUE,
    isNumber = Y.Lang.isNumber;

/**
Core model class extension for Pagination state attributes. Manages `page`,
`itemsPerPage`, `totalItems`.  Also includes a read-only `pages` attribute.

@class Paginator.Core
@constructor
@since 3.6.0
**/
function PaginatorCore() {}

PaginatorCore.ATTRS = {
    /**
    The total number of items being paged over.  Must be 0 or a positive number.

    @attribute totalItems
    @type {Number}
    @value 0
    **/
    totalItems: {
        value: 0,
        validator: '_validateTotalItems'
    },

    /**
    Number of items to make up what is considered "a page".

    @attribute itemsPerPage
    @type {Number}
    @default 1
    **/
    itemsPerPage: {
        value: 1,
        // TODO: change to setter that forces int
        validator: '_validateItemsPerPage'
    },

    /**
    The current page.  If set to a number greater than the total pages being
    managed, it will be adjusted to the last page.

    If `totalRecords` is 0, this will also be 0.

    @attribute page
    @type {Number}
    @default 1
    **/
    page: {
        valueFn: '_initPage',
        setter: '_setPage'
    },

    /**
    Read only attribute to get the number of pages being managed given the
    current `totalItems` and `itemsPerPage`.

    @attribute pages
    @type {Number}
    @readOnly
    **/
    pages: {
        readOnly: true,
        getter: '_getPages'
    }
};

Y.mix(PaginatorCore.prototype, {
    next: function () {
        this.set('page', this.get('page') + 1);
    },

    previous: function () {
        this.set('page', this.get('page') - 1);
    },

    //--------------------------------------------------------------------------
    // Protected properties and methods
    //--------------------------------------------------------------------------
    _afterItemsPerPageChange: function (e) {
        var currentPage = this.get('page'),
            currentIndex = currentPage ? (currentPage - 1) * e.prevVal : 0;

        this.set('page', Math.floor(currentIndex / e.newVal) + 1, {
            originEvent: e
        });
    },

    _afterTotalItemsChange: function (e) {
        var totalItems   = e.newVal,
            itemsPerPage = this.get('itemsPerPage'),
            offset       = (this.get('page') - 1) * itemsPerPage;

        if (totalItems < e.prevVal && totalItems <= offset) {
            this.set('page', Math.ceil(totalItems / itemsPerPage), {
                originEvent: e
            });
        }
    },

    _getPages: function () {
        return Math.ceil(this.get('totalItems') / this.get('itemsPerPage'));
    },

    initializer: function () {
        this.after({
            totalItemsChange  : Y.bind('_afterTotalItemsChange', this),
            itemsPerPageChange: Y.bind('_afterItemsPerPageChange', this)
        });
    },

    _initPage: function () {
        return this.get('totalItems') > 0 ? 1 : 0;
    },

    _setPage: function (val) {
        var itemsPerPage = this.get('itemsPerPage'),
            totalItems   = this.get('totalItems'),
            offset;

        val = +val;

        if (val > 0) {
            offset = (val - 1) * 'itemsPerPage';

            if (offset >= totalItems) {
                val = Math.ceil(totalItems / itemsPerPage);
            }
        } else {
            val = INVALID;
        }

        return val;
    },

    _validateTotalItems: function (val) {
        return isNumber(val) && val > 0;
    },

    _validateItemsPerPage: function (val) {
        return isNumber(val) && val > 0;
    }
}, true);

Y.namespace('Paginator').Core = PaginatorCore;
