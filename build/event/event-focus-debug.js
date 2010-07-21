YUI.add('event-focus', function(Y) {

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
                notifiers = node.getData(nodeDataKey),
                yuid      = Y.stamp(e.currentTarget),
                handle;

            notifier.currentTarget = (delegate) ? node : e.currentTarget;

            // Maintain a list to handle subscriptions from nested containers
            // div#a>div#b>input #a.on(focus..) #b.on(focus..), use one focus
            // or blur subscription that fires notifiers from #b then #a to
            // emulate bubble sequence.
            if (!notifiers) {
                notifiers = {};
                node.setData(nodeDataKey, notifiers);

                handle = Event._attach([type, this._notify, el]);
                // remove element level subscription after execution
                handle.sub.once = true;
            }

            if (!notifiers[yuid]) {
                notifiers[yuid] = [];
            }
            notifiers[yuid].push(notifier);
        },

        _notify: function (e) {
            var node      = e.currentTarget,
                notifiers = node.getData(nodeDataKey),
                            // document.get('ownerDocument') returns null
                doc       = node.get('ownerDocument') || node,
                target    = node,
                nots      = [],
                i, len;

            // Walk up the parent axis until the origin node, 
            while (target && target !== doc) {
                nots.push.apply(nots, notifiers[Y.stamp(target)] || []);
                target = target.get('parentNode');
            }
            nots.push.apply(nots, notifiers[Y.stamp(doc)] || []);

            for (i = 0, len = nots.length; i < len; ++i) {
                e.currentTarget = nots[i].currentTarget;

                nots[i].fire(e);
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


}, '@VERSION@' ,{requires:['event-synthetic']});
