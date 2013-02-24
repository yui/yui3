function PaginatorUrl () {}

PaginatorUrl.ATTRS = {
    /**
    Index of the first item on the page.
    @attribute index
    @type String
    **/
    url: {}
};

PaginatorUrl.prototype = {
    /**
     Returns a formated URL for the previous page.
     @method prevUrl
     @returns String | NULL
     */
    prevUrl: function () {
        return (this.hasPrev() && this.formatUrl(this.get('page') - 1)) || null;
    },

    /**
     Returns a formated URL for the next page.
     @method nextUrl
     @returns String | NULL
     */
    nextUrl: function () {
        return (this.hasNext() && this.formatUrl(this.get('page') + 1)) || null;
    },

    /**
     Returns a formated URL for the provided page number.
     @method formatUrl
     @returns String | NULL
     */
    formatUrl: function (page) {
        var url = this.get('url');
        if (url) {
            return Y.Lang.sub(url, {
                page: page || this.get('page')
            });
        }
        return null;
    }
};

Y.namespace('Paginator').Url = PaginatorUrl;
