var getClassName = Y.ClassNameManager.getClassName,
    YLSub = Y.Lang.sub,
    Y_Paginator = Y.Paginator,
    LNAME = NAME + ':: ',
    PaginatorView;

PaginatorView = Y.Base.create('paginator', Y.View, [], {

    templates: Y_Paginator.Templates,

    controls: {},

    classNames: {
        container: getClassName('paginator', 'container'),
        controls: getClassName('paginator', 'controls'),
        control: getClassName('paginator', 'control'),
        controlWrapper: getClassName('paginator', 'control', 'wrapper'),
        controlDisabled: getClassName('paginator', 'control', 'disabled'),
        controlSelected: getClassName('paginator', 'control', 'selected'),
        controlFirst: getClassName('paginator', 'control', 'first'),
        controlPrev: getClassName('paginator', 'control', 'prev'),
        controlNext: getClassName('paginator', 'control', 'next'),
        controlLast: getClassName('paginator', 'control', 'last'),
        pages: getClassName('paginator', 'pages'),
        page: getClassName('paginator', 'page'),
        pageWrapper: getClassName('paginator', 'page', 'wrapper'),
        pageSelect: getClassName('paginator', 'page', 'select'),
        pageInput: getClassName('paginator', 'page', 'input'),
        perPageSelect: getClassName('paginator', 'per-page', 'select')
    },

    events: {
        '.yui3-paginator-control': {
            'click': 'controlClick',
            'change': 'controlChange'
        },
        '.yui3-paginator-page': {
            'click': 'pageClick'
        }
    },

    initializer: function () {
        if (this.get('model')) {
            this.bind();
        }

        if (this.template && typeof this.template !== 'function') {
            this.template = Y.Paginator.Templates.compile(this.template);
        }
    },

    _modelChange: function (e) {
        console.log(LNAME, '_modelChange');
        this.render();
    },

    render: function () {
        console.log(LNAME, 'render');
        this.get('container').setContent(this.renderControls());
        if (!this.bound) {
            this.bind();
        }
    },

    bind: function () {
        this.get('model').on('change', this._modelChange, this);
        this.bound = true;
    },

    renderControls: function () {},

    ///////////////////////////////////////
    // T E M P L A T E   R E N D E R I N G
    ///////////////////////////////////////

    renderControl: function (type) {
        console.log(LNAME, 'renderControl');
        var strings = this.get('strings'),
            attrs = this.getTemplateAttrs(),
            link = '#',
            model = this.get('model'),
            ucType = type[0].toUpperCase() + type.substring(1),
            controlDisabled = this.classNames.controlDisabled,
            data = {
                link: '',
                type: type,
                controlClass: [this.classNames['control' + ucType]],
                title: YLSub(strings[type + 'Title'], attrs),
                display: YLSub(strings[type + 'Display'], attrs)
            };

        if (this.formatUrl) {
            switch (type) {
                case 'first':
                    link = this.formatUrl(1);
                    if (!model.hasPrev()) {
                        data.controlClass.push(controlDisabled);
                    }
                    break;
                case 'prev':
                    link = this.formatUrl(model.get('page') - 1);
                    if (!model.hasPrev()) {
                        data.controlClass.push(controlDisabled);
                    }
                    break;
                case 'next':
                    link = this.formatUrl(model.get('page') + 1);
                    if (!model.hasNext()) {
                        data.controlClass.push(controlDisabled);
                    }
                    break;
                case 'last':
                    link = this.formatUrl(model.get('pages'));
                    if (!model.hasNext()) {
                        data.controlClass.push(controlDisabled);
                    }
                    break;
            }
        }

        this.controls[type] = true;

        data.controlClass = data.controlClass.join(' ');

        data.link = link;

        return this.renderTemplate('control', data);

    },

    renderPages: function () {
        console.log(LNAME, 'renderPages');
        var rangeValues = this.getDisplayRangeValues(),
            minPage = rangeValues.min,
            maxPage = rangeValues.max,
            curPage = this.get('model').get('page'),
            pages = '',
            i,
            l;

        for (i=minPage, l=maxPage; i<=l; i++) {
            pages += this.renderPage(i, curPage);
        }

        this.controls.pages = true;

        return pages;

    },

    renderPage: function (page, curPage) {
        //console.log(LNAME, 'renderPage');
        var strings = this.get('strings'),
            attrs = this.getTemplateAttrs({page: page}),
            data = {
                link: this.formatUrl(page),
                page: page,
                title: YLSub(strings.pageTitle, attrs ),
                display: YLSub(strings.pageDisplay, attrs ),
                selectedClass: curPage === page ? ' ' + this.classNames.controlSelected : ''
            };

        this.controls.page = true;

        return this.renderTemplate('page', data);
    },

    renderPageInput: function () {
        console.log(LNAME, 'renderPageInput');
        var strings = this.get('strings'),
            attrs = this.getTemplateAttrs(),
            data = {
                preLabel: YLSub(strings.pageInputPreLabel, attrs ),
                page: attrs.page,
                type: 'page',
                postLabel: YLSub(strings.pageInputPostLabel, attrs )
            };

        this.controls.pageInput = true;

        return this.renderTemplate('pageInput', data);
    },

    renderPageSelect: function () {
        console.log(LNAME, 'renderPageSelect');
        var strings = this.get('strings'),
            attrs = this.getTemplateAttrs(),
            data = {
                preLabel: YLSub(strings.pageSelectPreLabel, attrs ),
                options: [],
                type: 'page',
                postLabel: YLSub(strings.pageSelectPostLabel, attrs )
            },
            i,
            l;

        for (i = 1, l = attrs.pages; i <= l; i++) {
            data.options.push({
                value: i,
                display: i,
                selected: attrs.page === i
            });
        }

        this.controls.pageSelect = true;

        return this.renderTemplate('pageSelect', data);
    },

    renderPerPageSelect: function () {
        console.log(LNAME, 'renderPerPageSelect');
        var strings = this.get('strings'),
            attrs = this.getTemplateAttrs(),
            data = {
                type: 'perPage',
                preLabel: YLSub(strings.perPagePreLabel, attrs ),
                options: [],
                postLabel: YLSub(strings.perPagePostLabel, attrs )
            },
            pageSizes = attrs.pageSizes,
            option,
            value,
            display,
            i,
            l;

        for (i = 0, l = pageSizes.length; i < l; i++) {
            option = pageSizes[i];
            value = option.value || option;
            display = option.display || option;

            data.options.push({
                value: value,
                display: display,
                selected: attrs.itemsPerPage === value
            });
        }

        this.controls.perPageSelect = true;

        return this.renderTemplate('perPageSelect', data);
    },

    renderTemplate: function(template, data) {
        //console.log(LNAME, 'renderTemplate');
        data.classNames || (data.classNames = this.classNames);

        return this.templates[template](data);
    },

    getTemplateAttrs: function (attrs) {
        var retAttrs = Y.mix(attrs || {}, this.get('model').toJSON());
        return Y.mix(retAttrs, this.getAttrs());
    },

    getDisplayRangeValues: function () {
        console.log('getDisplayRange', '::', 'Y.Paginator.View');
        var model = this.get('model'),
            currentPage = model.get('page'),
            pages = model.get('pages'),
            displayRange = this.get('displayRange'),
            halfRange = Math.floor(displayRange / 2),

            minRange = currentPage - halfRange,
            maxRange = currentPage + halfRange;

        if (minRange < 1) {
          maxRange += -minRange;
        }

        if (maxRange > pages) {
          minRange -= maxRange - pages;
        }

        return {
            min: Math.max(1, minRange),
            max: Math.min(pages, maxRange)
        };
    },

    // EVENT CALL BACKS
    controlClick: function(e) {
        console.log(LNAME, 'controlClick');
        e.preventDefault();

        this.fire(e.currentTarget.getData('type'));
    },

    controlChange: function (e) {
        console.log(LNAME, 'controlChange');
        e.preventDefault();
        var control = e.currentTarget,
            type = control.getData('type'),
            data = {};
        data[type] = e.target.get('value');

        this.fire(type, data);
    },

    pageClick: function(e) {
        console.log(LNAME, 'pageClick');
        e.preventDefault();
        this.fire('page', {page: e.currentTarget.getData('page')});
    },


    //-- PROTECTED ----

    _defStringVals: function () {
        console.log(LNAME, '_defStringVals');
        return Y.Intl.get('paginator-templates');
    }

}, {
    ATTRS: {
        displayRange: {
            value: 10
        },

        strings : {
            valueFn: '_defStringVals'
        }
    }
});

Y.namespace('Paginator').View = PaginatorView;
