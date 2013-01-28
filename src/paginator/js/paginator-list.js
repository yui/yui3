var PaginatorList;

PaginatorList = Y.Base.create('paginator-list', Y.Paginator.Renderer, [Y.Paginator.Url], {

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
