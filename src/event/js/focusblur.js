var Event    = Y.Event,
    isString = Y.Lang.isString;

function define(type, proxy) {
    var nodeDataKey = '_' + type + 'Notifiers';

    Y.Event.define(type, {
        _attach: function (el, notifier, delegate) {
            return Event._attach(
                [this._proxyEvent, this._proxy, el, this, notifier, delegate],
                { capture: true });
        },

        _proxyEvent: proxy,

        _proxy: function (e, notifier, delegate) {
            var node      = e.target,
                el        = node._node,
                thisObj   = (delegate) ? node : e.currentTarget,
                notifiers = node.getData(nodeDataKey),
                handle;

            // Maintain a list to handle subscriptions from nested containers
            // div#a>div#b>input #a.on(focus..) #b.on(focus..), use one focus
            // or blur subscription that fires notifiers from #b then #a to
            // emulate bubble sequence.
            if (!notifiers) {
                notifiers = [];
                node.setData(nodeDataKey, notifiers);

                handle = Event._attach([type, this._notify, el, thisObj]);
                // remove element level subscription after execution
                handle.sub.once = true;
            }

            notifiers.push(notifier);
        },

        _notify: function (e) {
            var node      = e.currentTarget,
                notifiers = node.getData(nodeDataKey),
                i;

            e.currentTarget = this;

            // reverse order to emulate bubble notification
            for (i = notifiers.length - 1; i >= 0; --i) {
                notifiers[i].fire(e);
            }

            // leaving the element pristine, as if nothing ever happened...
            node.clearData(nodeDataKey);
        },

        on: function (node, sub, notifier) {
            sub.onHandle = this._attach(node._node, notifier);
        },

        detach: function (node, sub) {
            sub.onHandle.detach();
        },

        delegate: function (node, sub, notifier, filter) {

            if (isString(filter)) {
                filter = Y.delegate.compileFilter(filter);
            }

            var handle = this._attach(node._node, notifier, true);
            handle.sub.getCurrentTarget = filter;
            handle.sub._notify = Y.delegate.notifySub;

            sub.delegateHandle = handle;
        },

        detachDelegate: function (node, sub) {
            sub.delegateHandle.detach();
        }
    }, true);
}

define('focus', ('onfocusin'  in Y.config.doc) ? "beforeactivate"   : "focus");
define('blur',  ('onfocusout' in Y.config.doc) ? "beforedeactivate" : "blur");
