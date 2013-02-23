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
    },

    preRender: function (template, data) {
        console.log(LNAME, 'preRender');

        switch(template) {
            case 'control':
                if (data.type === 'first') {
                    data.href = this.formatUrl(1);
                } else if (data.type === 'last') {
                    data.href = this.formatUrl(data.attrs.pages);
                } else if (data.type === 'prev') {
                    data.href = this.formatUrl(data.attrs.page - 1);
                } else if (data.type === 'next') {
                    data.href = this.formatUrl(data.attrs.page + 1);
                }
                break;

            case 'page':
                data.href = this.formatUrl(data.page);
                break;
        }

        return data;
    },

    _afterContainerChanged: function () {
        var container = this.get('container'),
            getClassName = Y.ClassNameManager.getClassName,
            mainClass = getClassName('paginator');

        if(!container.hasClass(mainClass)) {
            container = container.ancestor('.' + mainClass);
        }

        container.addClass(getClassName(NAME));
    }

}, {
    ATTRS: {
        displayRange: {
            value: 10
        }
    }
});

Y.namespace('Paginator').List = PaginatorList;
