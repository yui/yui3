var PaginatorUrl = function() {};

PaginatorUrl.ATTRS = {
    url: {}
};

Y.mix(PaginatorUrl.prototype, {
    prevUrl: function () {
        if (this.hasPrev()) {
            return this.formatUrl(this.get('page') - 1);
        }
        return null;
    },

    nextUrl: function () {
        if (this.hasNext()) {
            return this.formatUrl(this.get('page') + 1);
        }
        return null;
    },

    formatUrl: function (page) {
        return Y.Lang.sub(this.get('url'), {
            page: page || this.get('page')
        });
    }
});


Y.Base.mix(Y.Paginator, [PaginatorUrl]);
