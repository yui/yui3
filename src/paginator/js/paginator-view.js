/**
 A base paginator view

 @module paginator
 @submodule paginator-view
 @class View
 @namespace Paginator
 @since 3.10.0
 */

var getClassName = Y.ClassNameManager.getClassName,
    YLSub = Y.Lang.sub,
    Y_Paginator = Y.Paginator,
    PaginatorView;

PaginatorView = Y.Base.create('paginator', Y.View, [], {

    /**
     Local templates to be used in various render methods
     @property templates
     @type {Object}
     @default Y.Paginator.Templates
     */
    templates: Y_Paginator.Templates,

    /**
     Classnames used in rendering templates
     @property classNames
     @type {Ojbect}
     */
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

    /**
     Default generic events for control clicks and changes
     @property events
     @type {Object}
     */
    events: {
        '.yui3-paginator-control': {
            'click': 'controlClick',
            'change': 'controlChange'
        },
        '.yui3-paginator-page': {
            'click': 'pageClick'
        }
    },

    /**
     Compiles the template string if it exists and is not already compiled
       Binds the container change event
     @method initializer
     */
    initializer: function () {
        if (this.template && typeof this.template !== 'function') {
            this.template = Y.Paginator.Templates.compile(this.template);
        }

        this.after('containerChange', this._afterContainerChanged, this);
    },

    /**
     Sets the content of the container to the renter value of renderControls
     @method render
     */
    render: function () {
        this.get('container').setContent(this.renderControls());
    },

    ///////////////////////////////////////
    // T E M P L A T E   R E N D E R I N G
    ///////////////////////////////////////

    /**
     Placeholder method for rendering controls
     @method renderControls
     */
    renderControls: function () {},

    /**
     Placeholder method for modifying template render data
     @method preRender
     @param {String} type
     @param {Object} data
     */
    preRender: function () {},

    /**
     Generates a control based on the type provided and the control template
     @method renderControl
     @param {String} type
     @return {String}
     */
    renderControl: function (type) {
        var strings = this.get('strings'),
            attrs = this.getTemplateAttrs(),
            model = this.get('model'),
            ucType = type[0].toUpperCase() + type.substring(1),
            controlDisabled = this.classNames.controlDisabled,
            data = {
                type: type,
                attrs: attrs,
                controlClass: [this.classNames['control' + ucType]],
                title: YLSub(strings[type + 'Title'], attrs),
                display: YLSub(strings[type + 'Display'], attrs)
            };

        switch (type) {
            case 'first':
                if (!model.hasPrev()) {
                    data.controlClass.push(controlDisabled);
                }
                break;
            case 'prev':
                if (!model.hasPrev()) {
                    data.controlClass.push(controlDisabled);
                }
                break;
            case 'next':
                if (!model.hasNext()) {
                    data.controlClass.push(controlDisabled);
                }
                break;
            case 'last':
                if (!model.hasNext()) {
                    data.controlClass.push(controlDisabled);
                }
                break;
        }

        data.controlClass = data.controlClass.join(' ');

        return this.renderTemplate('control', data);

    },

    /**
     Creates a list of pages based on the displayRange, totoal number of
       pages and the current page being displayed
     @method renderPages
     @return {String}
     */
    renderPages: function () {
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

        return pages;
    },

    /**
     Creates a page control based on the page number provided and the current
       page displayed
     @method renderPage
     @param {Number} page
     @param {Number} curPage
     @return {String}
     */
    renderPage: function (page, curPage) {
        var strings = this.get('strings'),
            attrs = this.getTemplateAttrs({page: page}),
            data = {
                page: page,
                attrs: attrs,
                title: YLSub(strings.pageTitle, attrs ),
                display: YLSub(strings.pageDisplay, attrs ),
                selectedClass: curPage === page ? ' ' + this.classNames.controlSelected : ''
            };

        return this.renderTemplate('page', data);
    },

    /**
     Creates a page input control based on the page input template
     @method renderPageInput
     @return {String}
     */
    renderPageInput: function () {
        var strings = this.get('strings'),
            attrs = this.getTemplateAttrs(),
            data = {
                preLabel: YLSub(strings.pageInputPreLabel, attrs ),
                page: attrs.page,
                type: 'page',
                postLabel: YLSub(strings.pageInputPostLabel, attrs )
            };

        return this.renderTemplate('pageInput', data);
    },

    /**
     Creates a page select control based on the page select template
     @method renderPageSelect
     @return {String}
     */
    renderPageSelect: function () {
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

        return this.renderTemplate('pageSelect', data);
    },

    /**
     Creates a per page select control based on the per page select template
     @method renderPerPageSelect
     @return {String}
     */
    renderPerPageSelect: function () {
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

        return this.renderTemplate('perPageSelect', data);
    },

    /**
     Processes the template with classnames and a preRender()
     @method renderTemplate
     @param {String} template
     @param {Object} data
     @return {String}
     */
    renderTemplate: function(template, data) {
        data.classNames || (data.classNames = this.classNames);

        if (this.preRender) {
            this.preRender(template, data);
        }

        return this.templates[template](data);
    },

    /**
     Mixes the provided attr Object with the `model`s `toJSON()` method and the `view`s
       `getAttrs()` method.
     @method getTemplateAttrs
     @param {Ojbect} attrs
     @return {Object}
     */
    getTemplateAttrs: function (attrs) {
        var retAttrs = Y.mix(attrs || {}, this.get('model').toJSON());
        return Y.mix(retAttrs, this.getAttrs());
    },

    /**
     Calculates the min and max page to display based on the displayRange,
       the current page, and the total number of pages.
     @method getDisplayRangeValues
     @return {Object}
     */
    getDisplayRangeValues: function () {
        var model = this.get('model'),
            currentPage = model.get('page'),
            pages = model.get('pages'),
            displayRange = this.get('displayRange'),
            halfRange = Math.floor(displayRange / 2),

            minRange = Math.max(1, currentPage - halfRange),
            maxRange = minRange + displayRange - 1;

        if (maxRange > pages) {
          minRange -= maxRange - pages;
        }

        return {
            min: Math.max(1, minRange),
            max: Math.min(pages, maxRange)
        };
    },

    // EVENT CALL BACKS
    /**
     Fires an event as the type of control that was clicked.
     @method controlClick
     @param {EventFacade}
     */
    controlClick: function(e) {
        e.preventDefault();

        this.fire(e.currentTarget.getData('type'));
    },

    /**
     Fires an event as the type of control that was changed with the value from the control
     @method controlChange
     @param {EventFacade}
     */
    controlChange: function (e) {
        e.preventDefault();

        this.fire(e.currentTarget.getData('type'), { val: e.newVal });
    },

    /**
     Fires a page event with the value of the page number that was clicked
     @method pageClick
     @param {EventFacade}
     */
    pageClick: function(e) {
        e.preventDefault();

        this.fire('page', { val: e.currentTarget.getData('page') });
    },

    //-- PROTECTED ----

    /**
     Returns the default string values used in the template for internationalization
     @method _stringValueFn
     @return {Object}
     */
    _stringValueFn: function () {
        return Y.Intl.get('paginator-templates');
    }

}, {
    ATTRS: {
        /**
         @attribute displayRange
         @type {Number}
         @default 10
         */
        displayRange: {
            value: 10
        },

        /**
         @attribute strings
         @type {Object}
         */
        strings : {
            valueFn: '_stringValueFn',
            writeOnce: 'initOnly'
        }
    }
});

Y.namespace('Paginator').View = PaginatorView;
