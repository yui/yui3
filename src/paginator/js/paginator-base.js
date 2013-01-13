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
            this.on('pageChange', this._onPageChange),
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
    },

    _onControlClick: function() {
        console.log('control was clicked');
    },

    _onPageClick: function() {
        console.log('page was clicked');
    },

    _onPageInputChange: function() {
        console.log('page input was changed');
    },

    _onPageSelectChange: function() {
        console.log('page select was changed');
    },

    _onItemsSelectChange: function() {
        console.log('items select was changed');
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
