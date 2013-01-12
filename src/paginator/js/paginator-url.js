function PaginatorUrl () {
    PaginatorUrl.superclass.constructor.apply(this, arguments);
}

PaginatorUrl.NAME = 'paginator-url';

PaginatorUrl.ATTRS = {
    url: {}
};

Y.extend(PaginatorUrl, Y.Base, {
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

Y.namespace('Paginator').Url = PaginatorUrl;

if (Y.Paginator.prototype) {
    console.log('auto mixing url');
    Y.Base.mix(Y.Paginator, [PaginatorUrl]);
}
