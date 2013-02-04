var PaginatorDT,
    LNAME = NAME + '::';

PaginatorDT = Y.Base.create('paginator-dt', Y.Paginator.View, [], {

    renderControls: function () {
        console.log(LNAME, 'renderControls');

        return this.templates.dt({
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
        pageSizes: {
            value: [10, 50, 100]
        }
    }
});

Y.namespace('Paginator').DataTable = PaginatorDT;

