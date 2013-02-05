var PaginatorList,
    LNAME = NAME + '::';

PaginatorList = Y.Base.create('paginator-list', Y.Paginator.View, [Y.Paginator.Url], {

    template:   '<ul class="<%= data.classNames.list %>">' +
                    '<%== data.first %><%== data.prev %>' +
                    '<li class="<%= data.classNames.controlWrapper %>">' +
                    '<ul class="<%= data.classNames.pages %>">' +
                        '<%== data.pages %>' +
                    '</ul>' +
                    '</li>' +
                    '<%== data.next %><%== data.last %>' +
                '</ul>',

    renderControls: function () {
        console.log(LNAME, 'renderControls');

        return this.template({
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
