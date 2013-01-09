Y.namespace('Paginator').Url = PaginatorUrl = function() {};

PaginatorUrl.ATTRS = {
    url: {}
};

Y.mix(PaginatorUrl.prototype,{
    prevUrl: function () {
        if (this.hasPrevPage()) {
            return this.formatUrl(this.get('currentPage') - 1);
        }
        return null;
    },

    nextUrl: function () {
        if (this.hasNextPage()) {
            return this.formatUrl(this.get('currentPage') + 1);
        }
        return null;
    },

    formatUrl: function (page) {
        return Y.Lang.sub(this.get('url'), {
            page: page || this.get('currentPage')
        });
    }
});

Y.Base.mix(Y.Paginator, [PaginatorUrl]);