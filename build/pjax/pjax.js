YUI.add('pjax', function(Y) {

var CLASS_PJAX = Y.ClassNameManager.getClassName('pjax'),

    EVT_ERROR    = 'error',
    EVT_LOAD     = 'load',
    EVT_NAVIGATE = 'navigate';

function Pjax() {
    Pjax.superclass.constructor.apply(this, arguments);
}

Y.extend(Pjax, Y.Base, {
    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function () {
        this.publish(EVT_NAVIGATE, {defaultFn: this._defNavigateFn});
        this._bindUI();
    },

    destructor: function () {
        var controller = this.get('controller');

        this._events && this._events.detach();

        // Destroy the controller, but only if we own it.
        if (controller && controller._pjaxOwner === this) {
            controller.destroy();
        }
    },

    // -- Public Prototype Methods ---------------------------------------------
    load: function (url, callback) {
        var controller = this.get('controller');

        Y.io(url, {
            context: this,
            headers: {'X-PJAX': 'true'},

            on: {
                failure: this._onIOFailure,
                success: this._onIOSuccess
            },

            arguments: [callback]
        });

        controller.save(controller.removeRoot(url));

        if (this.get('scrollToTop') && Y.config.win) {
            // Scroll to the top of the page. The timeout ensures that the
            // scroll happens after navigation begins, so that the current
            // scroll position will be restored if the user clicks the back
            // button.
            setTimeout(function () {
                Y.config.win.scroll(0, 0);
            }, 1);
        }
    },

    // -- Protected Prototype Methods ------------------------------------------
    _bindUI: function () {
        if (this.get('controller').html5) {
            this._events = Y.one('body').delegate('click', this._onLinkClick,
                this.get('linkSelector'), this);
        }
    },

    _getContent: function (responseText) {
        var content         = {},
            contentSelector = this.get('contentSelector'),
            frag            = Y.Node.create(responseText || ''),
            titleSelector   = this.get('titleSelector'),
            titleNode;

        if (contentSelector) {
            content.node = Y.one(frag.all(contentSelector).toFrag());
        } else {
            content.node = frag;
        }

        if (titleSelector) {
            titleNode = frag.one(titleSelector);

            if (titleNode) {
                content.title = titleNode.get('text');
            }
        }

        return content;
    },

    // -- Protected Event Handlers ---------------------------------------------

    _defNavigateFn: function (e) {
        this.load(e.url);
    },

    _onIOFailure: function (id, res, args) {
        var callback = args[0],
            content  = this._getContent(res.responseText);

        this.fire(EVT_ERROR, {
            content     : content,
            responseText: res.responseText,
            status      : res.status
        });

        callback && callback.call(this,
            res.statusText || res.responseText || 'XHR error', content, res);
    },

    _onIOSuccess: function (id, res, args) {
        var callback = args[0],
            content  = this._getContent(res.responseText);

        this.fire(EVT_LOAD, {
            content     : content,
            responseText: res.responseText,
            status      : res.status
        });

        callback && callback.call(this, null, content, res);
    },

    _onLinkClick: function (e) {
        // Allow the native behavior on middle/right-click, or when Ctrl or
        // Command are pressed.
        if (e.button !== 1 || e.ctrlKey || e.metaKey) { return; }

        e.preventDefault();

        this.fire(EVT_NAVIGATE, {
            originEvent: e,
            url        : e.currentTarget.get('href')
        });
    }
}, {
    NAME: 'pjax',

    ATTRS: {
        contentSelector: {
            value: null
        },

        controller: {
            valueFn: function () {
                var controller = new Y.Controller();

                // Put our mark on the controller so we know we own it and can
                // destroy it if the plugin is destroyed.
                controller._pjaxOwner = this;

                return controller;
            }
        },

        linkSelector: {
            value    : 'a.' + CLASS_PJAX,
            writeOnce: 'initOnly'
        },

        scrollToTop: {
            value: true
        },

        titleSelector: {
            value: 'title'
        }
    }
});

Y.Pjax = Pjax;


}, '@VERSION@' ,{requires:['classnamemanager', 'controller', 'io-base', 'node-base', 'node-event-delegate']});
