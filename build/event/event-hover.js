YUI.add('event-hover', function(Y) {

var isFunction = Y.Lang.isFunction,
    noop = function () {},
    conf = {
        processArgs: function (args) {
            // Y.delegate('hover', over, out, '#container', '.filter')
            // comes in as ['hover', over, out, '#container', '.filter'], but
            // node.delegate('hover', over, out, '.filter')
            // comes in as ['hover', over, containerEl, out, '.filter']
            var i = isFunction(args[2]) ? 2 : 3;

            return (isFunction(args[i])) ? args.splice(i,1)[0] : noop;
        },

        on: function (node, sub, notifier, filter) {
            sub._detach = node[(filter) ? "delegate" : "on"]({
                mouseenter: Y.bind(notifier.fire, notifier),
                mouseleave: sub._extra
            }, filter);
        },

        detach: function (node, sub, notifier) {
            sub._detacher.detach();
        }
    };

conf.delegate = conf.on;
conf.detachDelegate = conf.detach;

Y.Event.define("hover", conf);


}, '@VERSION@' ,{requires:['event-mouseenter']});
