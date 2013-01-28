var Y_Paginator = Y.namespace('Paginator'),
    YLSub = Y.Lang.sub,
    PaginatorRenderer;

PaginatorRenderer = Y.Base.create('paginator', Y_Paginator.Base, [], {

    templates: Y_Paginator.Templates,

    controls: {},


    ///////////////////////////////////////
    // T E M P L A T E   R E N D E R I N G
    ///////////////////////////////////////

    renderControl: function (type) {
        var strings = this.get('strings'),
            attrs = this.getAttrs(),
            link = '#',
            data = {
                link: '',
                title: YLSub(strings[type + 'Title'], attrs),
                display: YLSub(strings[type + 'Display'], attrs)
            };

        if (this.formatUrl) {
            switch (type) {
                case 'first':
                    link = this.formatUrl(1);
                    break;
                case 'prev':
                    link = this.formatUrl(this.get('page') - 1);
                    break;
                case 'next':
                    link = this.formatUrl(this.get('page') + 1);
                    break;
                case 'last':
                    link = this.formatUrl(this.get('pages'));
                    break;
            }
        }

        this.controls[type] = true;

        data.link = link;

        return this.renderTemplate('control', data);

    },

    renderPages: function () {
        var minPage = 1,
            maxPage = this.get('pages'),
            pages = '',
            i,
            l;

        for (i=minPage, l=maxPage; i<=l; i++) {
            pages += this.renderPage(i);
        }

        this.controls.pages = true;

        return pages;

    },

    renderPage: function (page) {
        var strings = this.get('strings'),
            attrs = Y.mix({page: page}, this.getAttrs()),
            data = {
                link: this.formatUrl(page),
                page: page,
                title: YLSub(strings.pageTitle, attrs ),
                display: YLSub(strings.pageDisplay, attrs )
            };

        this.controls.page = true;

        return this.renderTemplate('page', data);
    },

    renderPageInput: function () {
        var strings = this.get('strings'),
            attrs = this.getAttrs(),
            data = {
                preLabel: YLSub(strings.pageInputPreLabel, attrs ),
                page: attrs.page,
                postLabel: YLSub(strings.pageInputPostLabel, attrs )
            };

        this.controls.pageInput = true;

        return this.renderTemplate('pageInput', data);
    },

    renderPageSelect: function () {
        var strings = this.get('strings'),
            attrs = this.getAttrs(),
            data = {
                preLabel: YLSub(strings.pageSelectPreLabel, attrs ),
                options: [],
                postLabel: YLSub(strings.pageSelectPostLabel, attrs )
            },
            i,
            l;

        for (i = 1, l = attrs.pages; i <= l; i++) {
            data.options.push({
                value: i,
                display: i
            });
        }

        this.controls.pageSelect = true;

        return this.renderTemplate('pageSelect', data);
    },

    renderPerPageSelect: function () {
        var strings = this.get('strings'),
            attrs = this.getAttrs(),
            data = {
                preLabel: YLSub(strings.perPagePreLabel, attrs ),
                options: [],
                postLabel: YLSub(strings.perPagePostLabel, attrs )
            },
            pageSizes = attrs.pageSizes,
            i,
            l;

        for (i = 0, l = pageSizes.length; i < l; i++) {
            data.options.push({
                value: pageSizes[i],
                display: pageSizes[i]
            });
        }

        this.controls.perPageSelect = true;

        return this.renderTemplate('perPageSelect', data);
    },

    renderTemplate: function(template, data) {
        data.classNames || (data.classNames = this.classNames);

        return this.templates[template](data);
    }

}, {});


Y.namespace('Paginator').Renderer = PaginatorRenderer;
