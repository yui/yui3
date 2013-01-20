var Y_Paginator = Y.Paginator,
    Y_Paginator_Templates = Y_Paginator.Templates,

    PaginatorDT = Y.Base.create('paginator-dt', Y.Paginator.View, [], {

        buildControls: function () {
            console.log('buildControls', '::', 'Y.Paginator.Dt');

            return Y_Paginator_Templates.dt({
                classname: Y_Paginator.controls,
                first: this.buildControl('first'),
                prev: this.buildControl('prev'),
                next: this.buildControl('next'),
                last: this.buildControl('last'),
                pageInput: this.buildPageInput(),
                pageSelect: this.buildPageSelect(),
                perPageSelect: this.buildPerPageSelect()
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
