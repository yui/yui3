YUI.add('test-console', function (Y) {
    new Y.Console({
        style: 'block',
        width: Y.UA.ie ? '100%' : 'inherit',

        entryTemplate:
            '<div class="{entry_class} {cat_class} {src_class}">' +
                '<pre class="{entry_content_class}">{message}</pre>' +
            '</div>',

        on: {
            entry: function (e) {
                var m = e.message,
                    node;

                if (m.category === 'info' &&
                    /\s(?:case|suite)\s|yuitests\d+|began/.test(m.message)) {
                        m.category = 'status';
                } else if (m.category === 'fail') {
                    this.printBuffer();
                    m.category = 'error';
                }
            }
        },

        after: {
            render: function () {
                this.get('contentBox').insertBefore(this._foot, this._body);
            }
        }
    }).plug(Y.Plugin.ConsoleFilters, {
        category: {
            pass: false,
            status: false
        }
    }).render('#log');
    
}, '@VERSION@', {requires: ['console-filters']});
