var PaginatorDT,
    LNAME = NAME + '::';

PaginatorDT = Y.Base.create('paginator-dt', Y.Paginator.View, [], {

    /**
     @property template
     */
    template:   '<ul class="<%= data.classNames.dt %>">' +
                    '<%== data.first %><%== data.prev %>' +
                    '<%== data.pageInput %>' +
                    '<%== data.next %><%== data.last %>' +
                    '<%== data.perPageSelect %>' +
                '</ul>',

    /**
     @method renderControls
     */
    renderControls: function () {
        console.log(LNAME, 'renderControls');

        return this.template({
            classNames: this.classNames,
            first: this.renderControl('first'),
            prev: this.renderControl('prev'),
            next: this.renderControl('next'),
            last: this.renderControl('last'),
            pageInput: this.renderPageInput(),
            pageSelect: this.renderPageSelect(),
            perPageSelect: this.renderPerPageSelect()
        });

    },

    /**
     @protected
     @method _afterContainerChanged
     */
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
        pageSizes: {
            value: [10, 50, 100]
        }
    }
});

Y.namespace('Paginator').DataTable = PaginatorDT;

