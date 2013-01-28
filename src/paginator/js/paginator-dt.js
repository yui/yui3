var PaginatorDT;

PaginatorDT = Y.Base.create('paginator-dt', Y.Paginator.Renderer, [], {

    /**
     @method renderUI
     @param {Event} [e]
     **/
    renderUI: function () {
        // build full ui
        this.get('contentBox').setHTML(this.renderControls());
    },

    /**
     @method syncUI
     @param {Event} [e]
     **/
    syncUI: function (e) {
        if (e && e.src === 'page') {
            this.syncPages();
        } else {
            this.syncControls();
        }
    },

    syncPages: function () {
        // update pages node

        // disable controls
    },

    syncControls: function () {
        // update all controls

        // disable controls
    },


    renderControls: function () {
        console.log('buildControls', '::', 'Y.Paginator.DataTable');

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

