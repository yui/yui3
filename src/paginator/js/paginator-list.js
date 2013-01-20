var Y_Paginator = Y.Paginator,
    Y_Paginator_Templates = Y_Paginator.Templates,

    PaginatorList = Y.Base.create('paginator-list', Y.Paginator.View, [], {

        buildControls: function () {
            console.log('buildControls', '::', 'Y.Paginator.List');

            return Y_Paginator_Templates.list({
                classname: this.classNames.controls,
                first: this.buildControl('first'),
                prev: this.buildControl('prev'),
                next: this.buildControl('next'),
                last: this.buildControl('last'),
                pagesClass: this.classNames.pages,
                pages: this.buildPages()
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
