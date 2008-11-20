<div class="yui-tooltip-trigger" title="Tooltip 1">Tooltip One</div>

<div class="yui-tooltip-trigger" title="Tooltip 2">Tooltip Two</div>

<div class="yui-tooltip-trigger" title="Tooltip 3">Tooltip Three</div>

<div class="yui-tooltip-trigger" title="Tooltip 4">Tooltip Four</div>

<script type="text/javascript">
YUI(<?php echo getYUIConfig("filter:'raw'") ?>).use(<?php echo $requiredModules ?>, function(Y) {

    var Lang = Y.Lang,
        Node = Y.Node;

    function Tooltip(config) {
        Tooltip.superclass.constructor.apply(this, arguments);
    }

    Tooltip.OFFSET_X = 15;
    Tooltip.OFFSET_Y = 15;

    Tooltip.OFFSCREEN_X = -10000;
    Tooltip.OFFSCREEN_Y = -10000;

    Tooltip.ATTRS = {

        content : {
            value: null
        },

        nodes : {
            value: null,
            set: function(val) {
                if (val && Lang.isString(val)) {
                    val = Node.all(val);
                }
                return val;
            }
        },

        delegate : {
            value: null,
            set: function(val) {
                return Node.get(val) || Node.get("document");
            }
        },

        showDelay : {
            value:500
        },

        hideDelay : {
            value:250
        },

        autoHideDelay : {
            value:2000
        },

        visible : {
            value:false
        },

        xy: {
            value:[Tooltip.OFFSCREEN_X, Tooltip.OFFSCREEN_Y]
        }
    };

    Tooltip.NAME = "tooltip";

    Y.extend(Tooltip, Y.Widget, {

        initializer : function(config) {

            this._triggerClassName = this.getClassName("trigger");

            this._currTrigger = {
                node: null,
                title: null,
                mouseX: Tooltip.OFFSCREEN_X,
                mouseY: Tooltip.OFFSCREEN_Y
            };

            this._eventHandles = {
                delegate: null,
                trigger: {
                    mouseMove : null,
                    mouseOut: null
                }
            };

            this._timers = {
                show: null,
                hide: null
            };
        },

        destructor : function() {
            this._clearCurrTrigger();
            this._clearTimers();
            this._clearHandles();
        },

        bindUI : function() {
            this.after("contentChange", this._afterSetContent);
            this.after("delegateChange", this._afterSetDelegate);
            this.after("nodesChange", this._afterSetNodes);

            this._bindDelegate();
        },

        syncUI : function() {
            this._uiSetContent(this.get("content"));
            this._uiSetNodes(this.get("nodes"));
        },

        hasTooltip : function(node) {
            return (node && node.hasClass(this._triggerClassName));
        },

        _afterSetContent : function(e) {
            this._uiSetContent(e.newVal);
        },

        _afterSetNodes : function(e) {
            this._uiSetNodes(e.newVal);
        },

        _afterSetDelegate : function(e) {
            this._bindDelegate(e.newVal);
        },

        _uiSetNodes : function(nodes) {
            if (this._triggerNodes) {
                this._triggerNodes.removeClass(this._triggerClassName);
            }

            if (nodes) {
                this._triggerNodes = nodes;
                this._triggerNodes.addClass(this._triggerClassName);
            }
        },

        _uiSetContent : function(content) {
            if (content) {
                var contentBox = this.get("contentBox");
                contentBox.set("innerHTML", "");
                if (content instanceof Node) {
                    for (var i = 0, l = content.size(); i < l; ++i) {
                        contentBox.appendChild(content.item(i));
                    }
                } else {
                    contentBox.set("innerHTML", content);
                }
            }
        },

        _bindDelegate : function() {
            var eventHandles = this._eventHandles;

            if (eventHandles.delegate) {
                eventHandles.delegate.detach();
                eventHandles.delegate = null;
            }

            var delegate = this.get("delegate");
            var onMouseOver = Y.bind(this._onDelegateMouseOver, this);

            eventHandles.delegate = Y.on("mouseover", onMouseOver, delegate);
        },

        _onDelegateMouseOver : function(e) {
            var node = e.target;

            if (this.hasTooltip(node)) {
                this._doMouseEnter(node, e.pageX, e.pageY);
            }
        },

        _onNodeMouseOut : function(e) {
            var node = e.target;
            var currNode = this._currTrigger.node;

            if (currNode && currNode.compareTo(node)) {
                this._doMouseLeave(node);
            }
        },

        _onNodeMouseMove : function(e) {
            this._doMouseMove(e.pageX, e.pageY);
        },

        _doMouseEnter : function(node, x, y) {
            this._setCurrTrigger(node, x, y);
            this._clearTimers();

            var delay = (this.get("visible")) ? 0 : this.get("showDelay");

            this._timers.show = Y.later(delay, this, this._showTooltip, [node]);
        },

        _doMouseMove : function(x, y) {
            this._currTrigger.mouseX = x;
            this._currTrigger.mouseY = y;
        },

        _doMouseLeave : function(node) {
            this._clearCurrTrigger();
            this._clearTimers();

            this._timers.hide = Y.later(this.get("hideDelay"), this, this._hideTooltip);
        },

        _showTooltip : function(node) {
            var x = this._currTrigger.mouseX;
            var y = this._currTrigger.mouseY;

            this.move(x + Tooltip.OFFSET_X, y + Tooltip.OFFSET_Y);

            this.show();

            this._timers.hide = Y.later(this.get("autoHideDelay"), this, this._hideTooltip);
        },

        _hideTooltip : function() {
            this._clearTimers();
            this.hide();
        },

        _setCurrTrigger : function(node, x, y) {

            var title = node.getAttribute("title");
            node.setAttribute("title", "");

            this.set("content", title);

            var currTrigger = this._currTrigger;
            var triggerHandles = this._eventHandles.trigger;

            currTrigger.mouseX = x;
            currTrigger.mouseY = y;
            currTrigger.node = node;
            currTrigger.title = title;

            triggerHandles.mouseMove = Y.on("mousemove", Y.bind(this._onNodeMouseMove, this), node);
            triggerHandles.mouseOut = Y.on("mouseout", Y.bind(this._onNodeMouseOut, this), node);
        },

        _clearCurrTrigger : function() {

            var currTrigger = this._currTrigger;
            var triggerHandles = this._eventHandles.trigger;

            if (currTrigger.node) {
                var node = currTrigger.node;
                var title = currTrigger.title || "";

                currTrigger.node = null;
                currTrigger.title = "";

                triggerHandles.mouseMove.detach();
                triggerHandles.mouseOut.detach();

                triggerHandles.mouseMove = null;
                triggerHandles.mouseOut = null;

                node.setAttribute("title", title);
            }
        },

        _clearTimers : function() {
            var timers = this._timers;
            if (timers.hide) {
                timers.hide.cancel();
                timers.hide = null;
            }
            if (timers.show) {
              timers.show.cancel();
              timers.show = null;
            }
        },

        _clearHandles : function() {
            var eventHandles = this._eventHandles;

            if (eventHandles.delegate) {
                this._eventHandles.delegate.detach();
            }
            if (eventHandles.trigger.mouseOut) {
                eventHandles.trigger.mouseOut.detach();
            }
            if (eventHandles.trigger.mouseMove) {
                eventHandles.trigger.mouseMove.detach();
            }
        }
    });

    // dynamic:false = Modify the existing Tooltip class
    Tooltip = Y.Base.build(Tooltip, [Y.WidgetPosition, Y.WidgetStack], {dynamic:false});

    var tt = new Tooltip({nodes:".tooltip", zIndex:2});
    tt.render();
});
</script>
