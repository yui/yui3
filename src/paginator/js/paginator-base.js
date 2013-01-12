var Paginator = Y.Base.create('paginator', Y.View, [Y.Paginator.Core, Y.Paginator.Url], {

    template: '{firstTitle} {page} of {pages}',

    initializer: function () {
        var subscriptions = [];

        subscriptions.push(this.on('pageChange', this._pageChange));

        this._subs = subscriptions;
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
        args.unshift('paginator');

        return Y.ClassNameManager.getClassName.apply(this, args);
    },

    _pageChange: function(e) {
        console.log('_pageChange');
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
