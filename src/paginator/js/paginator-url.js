/**
 Adds in URL options for paginator links.

 @module paginator
 @submodule paginator-url
 @class Url
 @namespace Paginator
 @since 3.10.0
 */

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
     @method prevPageUrl
     @return String | NULL
     */
    prevPageUrl: function () {
        return (this.hasPrevPage() && this.formatPageUrl(this.get('page') - 1)) || null;
    },

    /**
     Returns a formated URL for the next page.
     @method nextPageUrl
     @return String | NULL
     */
    nextPageUrl: function () {
        return (this.hasNextPage() && this.formatPageUrl(this.get('page') + 1)) || null;
    },

    /**
     Returns a formated URL for the provided page number.
     @method formatPageUrl
     @return String | NULL
     */
    formatPageUrl: function (page) {
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

Y.Base.mix(Y.Paginator, [PaginatorUrl]);
