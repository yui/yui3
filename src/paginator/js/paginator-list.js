/**
 A base paginator view displaying first, previous, next and last buttons,
    as well as a list of numbers

 @module paginator
 @submodule paginator-list
 @class List
 @namespace Paginator
 @since 3.10.0
 */

var PaginatorList;

PaginatorList = Y.Base.create('paginator-list', Y.Paginator.View, [Y.Paginator.Url], {

    /**
     Template for this view's content. The template is compiled in the
       `initializer` of `Y.Paginator.View`

     @property template
     @type {String}
     */
    template:   '<ul class="<%= data.classNames.list %>">' +
                    '<%== data.first %><%== data.prev %>' +
                    '<li class="<%= data.classNames.controlWrapper %>">' +
                    '<ul class="<%= data.classNames.pages %>">' +
                        '<%== data.pages %>' +
                    '</ul>' +
                    '</li>' +
                    '<%== data.next %><%== data.last %>' +
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
            pages: this.renderPages()
        });
    },

    /**
     Sets the href for controls, modifying the data object used to
       generate the controls from templates.

     @method preRender
     @param {String} template Name of template used
     @param {Object} data Original data object used to render template
     @return {Object} modified data object
     */
    preRender: function (template, data) {
        switch(template) {
            case 'control':
                if (data.type === 'first') {
                    data.href = this.formatUrl(1);
                } else if (data.type === 'last') {
                    data.href = this.formatUrl(data.attrs.pages);
                } else if (data.type === 'prev') {
                    data.href = this.formatUrl(data.attrs.page - 1);
                } else if (data.type === 'next') {
                    data.href = this.formatUrl(data.attrs.page + 1);
                }
                break;

            case 'page':
                data.href = this.formatUrl(data.page);
                break;
        }

        return data;
    }

}, {
    ATTRS: {
        /**
         The number of list items to be displayed at any given time. The
           list items will attempt to place current page item in the middle
           of the display range.

         @attribute displayRange
         @type {Number}
         @default 10
         */
        displayRange: {
            value: 10
        }
    }
});

Y.namespace('Paginator').List = PaginatorList;
