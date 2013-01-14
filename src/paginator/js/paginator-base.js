var Y_Paginator = Y.Paginator,
    Y_Paginator_Templates = Y_Paginator.Templates,
    PaginatorBase;

PaginatorBase = Y.Base.create('paginator', Y.View, [Y_Paginator.Core, Y_Paginator.Url], {

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

        console.log(classNames.control);

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
    _onPageChange: function() {
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

    replaceControls: function () {
        this.get('container').setHTML(this.buildControls());

        return this;
    },

    replacePages: function () {
        var container = this.get('container'),
            pages = container.one('.' + this.classNames.pages);
        pages.insertBefore(this.buildPages());
        pages.remove();

        return this;
    },

    buildControls: function () {
        return Y_Paginator_Templates.list({
            classname: this.classNames.controls,
            first: this.buildControl('first'),
            prev: this.buildControl('prev'),
            next: this.buildControl('next'),
            last: this.buildControl('last'),
            pagesClass: this.classNames.pages,
            pages: this.buildPages()
        });
    },

    buildControl: function (type) {
        var link,
            title,
            label,
            strings = this.get('strings');

        switch (type) {
            case 'first':
                link = this.formatUrl(1);
                title = strings.firstTitle;
                label = strings.firstText;
                disabled = !this.hasPrev();
                break;
            case 'prev':
                link = this.formatUrl(this.get('page') - 1);
                title = strings.prevTitle;
                label = strings.prevText;
                disabled = !this.hasPrev();
                break;
            case 'next':
                link = this.formatUrl(this.get('page') + 1);
                title = strings.nextTitle;
                label = strings.nextText;
                disabled = !this.hasNext();
                break;
            case 'last':
                link = this.formatUrl(this.get('pages'));
                title = strings.lastTitle;
                label = strings.lastText;
                disabled = !this.hasNext();
                break;
        }

        return Y_Paginator_Templates.controlWrapper({
            classname: this.classNames.control + '-' + type,
            control: Y_Paginator_Templates.control({
                link: link,
                title: title,
                classname: this.classNames.control,
                label: label
            })
        });

    },

    buildPages: function () {
        var range = this.getDisplayRange(),
            pages = '',
            i,
            l;

        for(i = range.min, l = range.max; i <= l; i++) {
            pages += this.buildPage(i);
        }

        return pages;
    },

    buildPage: function (pageNumber) {
        return Y_Paginator_Templates.pageWrapper({
            classname: this.classNames.page + '-' + pageNumber,
            page: Y_Paginator_Templates.page({
                link: this.formatUrl(pageNumber),
                title: pageNumber,
                classname: this.classNames.page,
                label: pageNumber
            })
        });
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

    getDisplayRange: function () {
        var currentPage = this.get('page'),
            pages = this.get('pages'),
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
                firstText: '<<',

                lastTitle: 'Last Page',
                lastText: '>>',

                prevTitle: 'Previous Page',
                prevText: '<',

                nextTitle: 'Next Page',
                nextText: '<',

                pageTitle: 'Page {page}',
                pageText: '{page}'
            }, Y.Intl.get("paginator-templates"), true);
    }


}, {
    ATTRS: {
        container: {
            valueFn: '_defContainerFn'
        },

        strings : {
            valueFn: '_defStringVals'
        },

        displayRange: {
            value: 10
        }
    }
});

Y.Paginator = Y.mix(PaginatorBase, Y_Paginator);
