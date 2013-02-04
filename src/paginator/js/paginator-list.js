var PaginatorList,
    LNAME = NAME + '::';

PaginatorList = Y.Base.create('paginator-list', Y.Paginator.View, [Y.Paginator.Url], {

    renderControls: function () {
        console.log('buildControls', '::', 'Y.Paginator.List');

        return this.templates.list({
            classNames: this.classNames,
            first: this.renderControl('first'),
            prev: this.renderControl('prev'),
            next: this.renderControl('next'),
            last: this.renderControl('last'),
            pages: this.renderPages()
        });
    }

}, {
    ATTRS: {
        displayRange: {
            value: 10
        }
    }
});

Y.namespace('Paginator').List = PaginatorList;
