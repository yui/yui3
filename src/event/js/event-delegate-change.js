/**
 * Adds event delegation change support to the library for Internet Explorer < 9
 *
 * @module event
 * @submodule event-delegate-change
 */

var YObject = Y.Object,
    YEvent = Y.Event,
    YNode = Y.Node,
    Selector = Y.Selector,

    EVENT_BEFOREACTIVATE = 'beforeactivate',
    EVENT_CHANGE = 'change';

YEvent.define(
    EVENT_CHANGE,
    {
        /**
         * <p>Implementation logic for subscriptions done via <code>node.delegate(type, fn, filter)</code> or <code>Y.delegate(type, fn, container, filter)</code>.
         *
         * @method delegate
         * @param node {Node} the node the subscription is being applied to
         * @param subscription {Subscription} the object to track this subscription
         * @param notifier {SyntheticEvent.Notifier} call notifier.fire(..) to trigger the execution of the subscribers
         * @param filter {String|Function} Selector string or function that accepts an event object and returns null, a Node, or an array of Nodes matching the criteria for processing.
         */
        delegate: function (node, subscription, notifier, filter) {
            this._attachEvents(node, subscription, notifier, filter);
        },

        /**
         * Implementation logic for detaching subscriptions done via <code>node.on(type, fn)</code>.<br>
         * This function cleans up any subscriptions made in the <code>on()</code> phase.
         *
         * @method detach
         * @param node {Node} the node the subscription was applied to
         * @param subscription {Subscription} the object tracking this subscription
         * @param notifier {SyntheticEvent.Notifier} the Notifier used to trigger the execution of the subscribers
         */
        detach: function (node, subscription, notifier) {
            this._detachEvents(node, subscription, notifier);
        },

        /**
         * <p>Implementation logic for detaching subscriptions done via <code>node.delegate(type, fn, filter)</code> or
         * <code>Y.delegate(type, fn, container, filter)</code>. <br>
         * This function cleans up any subscriptions made in the <code>delegate()</code> phase.</p>
         *
         * @method detachDelegate
         * @param node {Node} the node the subscription was applied to
         * @param subscription {Subscription} the object tracking this subscription
         * @param notifier {SyntheticEvent.Notifier} the Notifier used to trigger the execution of the subscribers
         * @param filter {String|Function} Selector string or function that accepts an event object and returns null, a Node, or an array of Nodes matching the criteria for processing.
         */
        detachDelegate: function (node, subscription, notifier) {
            this._detachEvents(node, subscription, notifier);
        },

        /**
         * Implementation logic for subscriptions done via <code>node.on(type, fn)</code> or <code>Y.on(type, fn, target)</code>. <br>
         *
         * @method on
         * @param node {Node} the node the subscription is being applied to
         * @param subscription {Subscription} the object to track this subscription
         * @param notifier {SyntheticEvent.Notifier} call notifier.fire(..) to trigger the execution of the subscribers
         */
        on: function (node, subscription, notifier) {
            this._attachEvent(node, subscription, notifier);
        },

        /**
         * Attaches one of "change" or "click" events to the supplied node and invokes the registered listeners on triggering the event
         *
         * @method _attachEvent
         * @private
         * @param node {Y.Node} The node to which events will be attached
         * @param subscription {Subscription} The object tracking this subscription
         * @param notifier {SyntheticEvent.Notifier} The triggering mechanism used by SyntheticEvents
         * @param delegateNode {Y.Node} The node, on which the event has been delegated
         * @param filter {String | Function} Selector string or function that accepts an event object and returns null, a Node, or an array of Nodes matching the criteria for processing.
         */
        _attachEvent: function(node, subscription, notifier, delegateNode, filter) {
            var handles = this._prepareHandles(subscription, node),
                type = this._getEventName(node),
                self = this;

            var fireFn = function(event) {
                var result = true;

                if (filter) {
                    if (!event.stopped) {
                        var delegateEl = YNode.getDOMNode(delegateNode);

                        var tmpEl = YNode.getDOMNode(node);

                        do {
                            if (tmpEl && Selector.test(tmpEl, filter)) {
                                event.currentTarget = Y.one(tmpEl);
                                event.container = node;

                                result = notifier.fire(event);
                            }

                            tmpEl = tmpEl.parentNode;
                        }
                        while (result !== false && !event.stopped && tmpEl && tmpEl !== delegateEl);

                        result = ((result !== false) && (event.stopped !== 2));
                    }
                }
                else {
                    if (!event._stoppedWithFalse && notifier.fire(event) === false) {
                        event._stoppedWithFalse = true;
                    }
                }

                return result;
            };

            if (!YObject.owns(handles, type)) {
                handles[type] = YEvent._attach([type, fireFn, node, notifier]);
            }
        },

        /**
         * Attaches "beforeactivate" event to the node and then one of "change" or "click" events
         *
         * @method _attachEvents
         * @private
         * @param node {Y.Node} The node to which events will be attached
         * @param subscription {Subscription} The object tracking this subscription
         * @param notifier {SyntheticEvent.Notifier} The triggering mechanism used by SyntheticEvents
         * @param filter {String | Function} Selector string or function that accepts an event object and returns null, a Node, or an array of Nodes matching the criteria for processing.
         */
        _attachEvents: function(node, subscription, notifier, filter) {
            var handles = this._prepareHandles(subscription, node),
                self = this;

            handles[EVENT_BEFOREACTIVATE] = node.delegate(
                EVENT_BEFOREACTIVATE,
                function(event) {
                    var activeElement = event.target;

                    self._attachEvent(activeElement, subscription, notifier, node, filter);
                },
                filter
            );
        },

        /**
         * Detaches all the nodes, registered to the supplied subscription
         *
         * @method _detachEvents
         * @private
         * @param node {Y.Node} The node the subscription was applied to
         * @param subscription {Subscription} The object tracking this subscription
         * @param notifier {SyntheticEvent.Notifier} The triggering mechanism used by SyntheticEvents
         */
        _detachEvents: function(node, subscription, notifier) {
            Y.each(
                subscription._handles,
                function(events) {
                    Y.each(
                        events,
                        function(handle, event) {
                            handle.detach();
                        }
                    );
                }
            );

            delete subscription._handles;
        },

        /**
         * Retrieves the name of the native event which should be attached.
         * For input elements of type "checkbox" and "radio", the event will be "click".
         * For any others it will be "change"
         *
         * @method _getEventName
         * @private
         * @param activeElement {Y.Node} The element to check for the event
         * @return {String} The name of the event
         */
        _getEventName: Y.cached(
            function(activeElement) {
                var eventName = EVENT_CHANGE,
                    tagName = activeElement.get('tagName').toLowerCase(),
                    type = activeElement.get('type').toLowerCase();

                if (tagName === 'input' && (type === 'checkbox' || type === 'radio')) {
                    eventName = 'click';
                }

                return eventName;
            }
        ),

        /**
         * Creates _handles property to the subscription if not exists.
         * Creates an empty object in _handles property which belongs to the node, passed as argument
         *
         * @method _prepareHandles
         * @private
         * @param subscription {Function} The callback function
         * @param node {Y.Node} The node for which the handles will be registered
         * @return {Object} The value of the created handle object for the passed node
         */
        _prepareHandles: function(subscription, node) {
            var handles;

            if (!YObject.owns(subscription, '_handles')) {
                subscription._handles = {};
            }

            handles = subscription._handles;

            if (!YObject.owns(handles, node)) {
                handles[node] = {};
            }

            return handles[node];
        }
    },
    true
);