/**
 A base paginator view displaying first, previous, next and last buttons,
    as well as a list of numbers

 @module paginator
 @submodule paginator-table
 @class Table
 @namespace Paginator
 @since 3.10.0
 */

var PaginatorTable;

PaginatorTable = Y.Base.create('paginator-table', Y.Paginator.View, [], {

    /**
     Template for this view's content. The template is compiled in the
       `initializer` of `Y.Paginator.View`

     @property template
     @type {String}
     */
    template:   '<ul class="<%= data.classNames.dt %>">' +
                    '<%== data.first %><%== data.prev %>' +
                    '<%== data.pageInput %>' +
                    '<%== data.next %><%== data.last %>' +
                    '<%== data.perPageSelect %>' +
                '</ul>',

    /**
     Returns the template string compiled with the corresponding controls provided
       by `Y.Paginator.View`
     @method renderControls
     @return {String}
     */
    renderControls: function () {
        return this.template({
            classNames: this.classNames,
            first: this.renderControl('first'),
            prev: this.renderControl('prev'),
            next: this.renderControl('next'),
            last: this.renderControl('last'),
            pageInput: this.renderPageInput(),
            pageSelect: this.renderPageSelect(),
            perPageSelect: this.renderPerPageSelect()
        });
    }

}, {
    ATTRS: {
        /**
         Each value in the array corresponds to

         A value can be a number or an Object with the keys of 'value' and 'display'.
         If the value is a number, the `&lt;option>` tag created will have the `value`
           attribute set to that of the number AND and display text set to the number
           as well.

         If the value is an Object, the `&lt;option>` tag created will have the `value`
           attribute set to `Object.value` and the display text is set to `Object.display`.

         @attribute pageSizes
         @type {Array}
         */
        pageSizes: {
            value: [10, 50, 100]
        }
    }
});

Y.namespace('Paginator').Table = PaginatorTable;

