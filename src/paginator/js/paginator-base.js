var Paginator = Y.Base.create('paginator', Y.View, [Y.Paginator.Core, Y.Paginator.Url], {

    prefix: null,

    template: '{firstTitle} {page} of {pages}',

    initializer: function () {
        this.generateClassNames();
        this.bind();
    },

    destructor: function () {
        Y.Array.each(this._subs, function (item) {
            item.detach();
        });
        this._subs = null;
    },

    render: function () {
        var container = this.get('container'),
            strings = this.get('strings'),
            html      = Y.Lang.sub(this.template, Y.mix(strings, this.getAttrs()));

        console.log(strings);

        // Render this view's HTML into the container element.
        container.setHTML(html);

        // Append the container element to the DOM if it's not on the page already.
        if (!container.inDoc()) {
          Y.one('body').append(container);
        }

        return this;
    },

    bind: function () {
        var subscriptions = [],
            classNames = this.classNames,
            container = this.get('container');

        subscriptions.push(
            this.on('pageChange', this._onPageChange, this),
            this.on('itemsPerPageChange', this._onItemsPerPageChange, this ),
            this.on('totalItemsChange', this._onTotalItemsChange, this),
            container.delegate('click', this._onControlClick, '.' + classNames.control, this),
            container.delegate('click', this._onPageClick, '.' + classNames.page, this),
            container.delegate('change', this._onPageInputChange, '.' + classNames.pageInput, this),
            container.delegate('change', this._onPageSelectChange, '.' + classNames.pageSelect, this),
            container.delegate('change', this._onItemsSelectChange, '.' + classNames.itemsSelect, this)
        );

        this._subs = subscriptions;

        return this;
    },

    generateClassNames: function () {
        var _getClassName = this._getClassName,
            classNames = {
                container: _getClassName('container'),
                controls: _getClassName('controls'),
                control: _getClassName('control'),
                pages: _getClassName('pages'),
                page: _getClassName('page'),
                pageSelect: _getClassName('page','select'),
                pageInput: _getClassName('page', 'input'),
                itemsSelect: _getClassName('items','select')
            };

        this.classNames = classNames;
    },

    /////////////////////////////////
    // E V E N T   C A L L B A C K S
    /////////////////////////////////
    _onPageChange: function(e) {
        console.log('_pageChange');
        // should rebuild {pages} container only for minimum ui update
        // should disable first/prev/next/last controls
    },

    _onItemsPerPageChange: function() {
        console.log('itemsPerPage was changed');
        // should rebuild all controls
    },

    _onTotalItemsChange: function () {
        console.log('totalItems was changed');
        // should rebuild all controls
    },

    _onControlClick: function() {
        console.log('control was clicked');
        // sets page based on type of control clicked
    },

    _onPageClick: function() {
        console.log('page was clicked');
        // set page to specific page clicked
    },

    _onPageInputChange: function() {
        console.log('page input was changed');
        // set page to input value if within range
    },

    _onPageSelectChange: function() {
        console.log('page select was changed');
        // set page to selected page value
    },

    _onItemsSelectChange: function() {
        console.log('items select was changed');
        // update items per page
    },


    ///////////////////////////////////////
    // T E M P L A T E   R E N D E R I N G
    ///////////////////////////////////////

    orderOfTemplateBuilding: function() {
        // build pages
        var pages = function() {
            // build page links starting from previous "lookBackward" range
            // build current page link
            // build page links using "lookFoward" range and "totalDisplay"
        };

        var controls = function () {
            // controls should include:
            // * prev && next
            // * first && last
            // * {pages}
            // * pageInput
            // * pageSelect
            // * itemsSelect
        };

        var container = function() {
            // general housing template to load in {controls}
        }

        // smush the container html into the container
        // container.setHTML(container<-controls<-pages);
    },

    replaceControls: function () {
        this.get('container').setHTML(this.buildContainer());

        return this;
    },

    replacePages: function () {
        var container = this.get('container'),
            pages = container.one('.' + this.classNames.pages);
        pages.insertBefore(this.buildPages());
        pages.remove();

        return this;
    },

    buildContainer: function () {
        // return container template populated with controls
    },

    buildControls: function () {
        // return controls container template populated with controls
    },

    buildControl: function () {
        // return a single rendered control template
    },

    buildPages: function () {
        // loop through all pages (within range)

        // return pages template with pages
    },

    buildPage: function () {
        // return a single rendered page template
    },

    buildPageInput: function () {
        // return <input> template with label and classnames
    },

    buildPageSelect: function () {
        // loop through items and build options

        // return <select> template with label, classnames and <option>s
    },

    buildItemsSelect: function () {
        // options should be predefined in template
        // return <select> template with label, classnames and <option>s
    },

    /////////////////////
    // P R O T E C T E D
    /////////////////////

    _getTemplate: function() {
        // going to do something here with paginator-templates.js
    },

    _getClassName: function() {
        var args = [];
        if (arguments && arguments.length > 0) {
            args = Array.prototype.slice.call(arguments);
        }
        args.unshift(this.prefix || 'paginator');

        return Y.ClassNameManager.getClassName.apply(this, args);
    },

    _defContainerFn: function () {
        return Y.Node.create('<div class="yui3-paginator"></div>');
    },

    _defStringVals: function() {

        return Y.mix({
                firstTitle: 'First Page',
                firstText: '&lt;&lt;',

                lastTitle: 'Last Page',
                lastText: '&gt;&gt;',

                prevTitle: 'Previous Page',
                prevText: '&lt;',

                nextTitle: 'Next Page',
                nextText: '&gt;',

                pageTitle: 'Page {page}',
                pageText: '{page}'
            }, Y.Intl.get("paginator-base"), true);
    }


}, {
    ATTRS: {
        container: {
            valueFn: '_defContainerFn'
        },

        strings : {
            valueFn: '_defStringVals'
        }
    }
});

Y.Paginator = Y.mix(Paginator, Y.Paginator);
