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
        var container = this.get('container');

        // Render this view's HTML into the container element.
        container.setHTML(this.buildControls());
        this.updatePageInput();
        this.updatePageSelect();

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
            this.after('pageChange', this._onPageChange, this),
            this.after('itemsPerPageChange', this._onItemsPerPageChange, this ),
            this.after('totalItemsChange', this._onTotalItemsChange, this),
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
                controlWrapper: _getClassName('control','wrapper'),
                controlFirst: _getClassName('control', 'first'),
                controlPrev: _getClassName('control', 'prev'),
                controlNext: _getClassName('control', 'next'),
                controlLast: _getClassName('control', 'last'),
                pages: _getClassName('pages'),
                page: _getClassName('page'),
                pageWrapper: _getClassName('page', 'wrapper'),
                pageSelect: _getClassName('page','select'),
                pageInput: _getClassName('page', 'input'),
                itemsSelect: _getClassName('items','select'),
                controlSelected: _getClassName('control', 'selected')
            };

        this.classNames = classNames;
    },

    /////////////////////////////////
    // E V E N T   C A L L B A C K S
    /////////////////////////////////
    _onPageChange: function(e) {
        console.log('_pageChange');

        this.updatePageInput();
        this.updatePageSelect();

        if (this.get('container').one('.' + this.classNames.pages)) {
            this.replacePages();
        }


        // should disable first/prev/next/last controls
    },

    _onItemsPerPageChange: function(e) {
        console.log('itemsPerPage was changed');
        // should rebuild all controls
    },

    _onTotalItemsChange: function () {
        console.log('totalItems was changed');
        // should rebuild all controls
    },

    _onControlClick: function(e) {
        var control = e.target,
            classNames = this.classNames;

        if (control.hasClass(classNames.controlFirst)) {
            this.first();
        } else if (control.hasClass(classNames.controlPrev)) {
            this.prev();
        } else if (control.hasClass(classNames.controlNext)) {
            this.next();
        } else if (control.hasClass(classNames.controlLast)) {
            this.last();
        }
    },

    _onPageClick: function(e) {
        console.log('page was clicked');
        this.set('page', e.target.getData('page'));
    },

    _onPageInputChange: function (e) {
        this.set('page', e.target.get('value'));
    },

    _onPageSelectChange: function (e) {
        this.set('page', e.target.get('value'));
    },

    _onItemsSelectChange: function (e) {
        this.set('itemsPerPage', e.target.get('value'));
        this.replaceControls();
        this.set('page', 1);
    },


    /////////////////////////////////////
    // T E M P L A T E   U P D A T I N G
    /////////////////////////////////////
    updatePageInput: function() {
        var pageInput = this.get('container').one('.' + this.classNames.pageInput);

        if (pageInput) {
            pageInput.one('input').set('value', this.get('page'));
        }
    },

    updatePageSelect: function() {
        var pageSelect = this.get('container').one('.' + this.classNames.pageSelect);

        if (pageSelect) {
            pageSelect.one('select').set('value', this.get('page'));
        }
    },

    updateItemSelect: function() {
        var itemsSelect = this.get('container').one('.' + this.classNames.itemsSelect);

        if (itemsSelect) {
            itemsSelect.one('select').set('value', this.get('itemsPerPage'));
        }
    },

    replaceControls: function () {

        this.get('container').setHTML(this.buildControls());

        this.updatePageInput();
        this.updatePageSelect();
        this.updateItemSelect();

        return this;
    },

    replacePages: function () {
        var container = this.get('container'),
            pages = container.one('.' + this.classNames.pages);

        pages.setHTML(this.buildPages());

        return this;
    },

    ///////////////////////////////////////
    // T E M P L A T E   R E N D E R I N G
    ///////////////////////////////////////


    buildControls: function (template) {
        template || (template = this.get('template'));

        return Y_Paginator_Templates[template]({
            classname: this.classNames.controls,
            first: this.buildControl('first'),
            prev: this.buildControl('prev'),
            next: this.buildControl('next'),
            last: this.buildControl('last'),
            pagesClass: this.classNames.pages,
            pages: this.buildPages(),
            pageInput: this.buildPageInput(),
            pageSelect: this.buildPageSelect(),
            itemsSelect: this.buildItemsSelect()
        });
    },

    buildControl: function (type) {
        var link,
            title,
            label,
            classNames = this.classNames,
            controlClasses = [classNames.control],
            strings = this.get('strings');

        switch (type) {
            case 'first':
                link = this.formatUrl(1);
                title = strings.firstTitle;
                label = strings.firstText;
                controlClasses.push(classNames.controlFirst);
                disabled = !this.hasPrev();
                break;
            case 'prev':
                link = this.formatUrl(this.get('page') - 1);
                title = strings.prevTitle;
                label = strings.prevText;
                controlClasses.push(classNames.controlPrev);
                disabled = !this.hasPrev();
                break;
            case 'next':
                link = this.formatUrl(this.get('page') + 1);
                title = strings.nextTitle;
                label = strings.nextText;
                controlClasses.push(classNames.controlNext);
                disabled = !this.hasNext();
                break;
            case 'last':
                link = this.formatUrl(this.get('pages'));
                title = strings.lastTitle;
                label = strings.lastText;
                controlClasses.push(classNames.controlLast);
                disabled = !this.hasNext();
                break;
        }

        return Y_Paginator_Templates.controlWrapper({
            classname: classNames.controlWrapper,
            control: Y_Paginator_Templates.control({
                link: link,
                title: title,
                classname: controlClasses.join(' '),
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
        var classNames = this.classNames,
            pageClasses = [
                classNames.page,
                classNames.page + '-' + pageNumber
                ];

        if (pageNumber === this.get('page')) {
            pageClasses.push(classNames.controlSelected);
        }

        return Y_Paginator_Templates.pageWrapper({
            classname: classNames.pageWrapper,
            page: Y_Paginator_Templates.page({
                link: this.formatUrl(pageNumber),
                title: pageNumber,
                classname: pageClasses.join(' '),
                label: pageNumber,
                number: pageNumber
            })
        });
    },

    buildPageInput: function () {
        var classNames = this.classNames,
            inputClasses = [classNames.control, classNames.pageInput];
        // return <input> template with label and classnames
        return Y_Paginator_Templates.pageInput({
            classname: inputClasses.join(' ')
        });
    },

    buildPageSelect: function () {
        // loop through items and build options
        var classNames = this.classNames,
            selectClasses = [classNames.control, classNames.pageSelect],
            pageOptions = '',
            currentPage = this.get('page'),
            i,
            l;

        for (i = 1, l = this.get('pages'); i <= l; i++) {
            pageOptions += Y_Paginator_Templates.pageSelectOption({
                pageNumber: i,
                selected: i === currentPage
            });
        }
        // return <select> template with label, classnames and <option>s
        return Y_Paginator_Templates.pageSelect({
            pageOptions: pageOptions,
            classname: selectClasses.join(' ')
        });
    },

    buildItemsSelect: function () {
        // options should be predefined in template
        // return <select> template with label, classnames and <option>s
        var classNames = this.classNames,
            selectClasses = [classNames.control, classNames.itemsSelect];

        return Y_Paginator_Templates.itemsSelect({
            classname: selectClasses.join(' ')
        });
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
        template: {
            value: 'list'
        },

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
