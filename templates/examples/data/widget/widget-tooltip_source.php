<div id="delegate">
    <div class="yui-hastooltip" title="Tooltip 1" id="tt1">Tooltip One <span>(content from title)</span></div>
    <div class="yui-hastooltip" title="Tooltip 2" id="tt2">Tooltip Two <span>(content set in event listener)</span></div>
    <div class="yui-hastooltip" title="Tooltip 3" id="tt3">Tooltip Three <span>(content from lookup)</span></div>
    <div class="yui-hastooltip" title="Tooltip 4" id="tt4">Tooltip Four <span>(content from title)</span><label></div>
    <input type="checkbox" id="prevent" /> Prevent Tooltip Four</label>
</div>

<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>, function(Y) {

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

        triggerNodes : {
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
            value:250
        },

        hideDelay : {
            value:10
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

            this.publish("triggerEnter", {defaultFn: this._defTriggerEnterFn, preventable:true});
            this.publish("triggerLeave", {preventable:false});
        },

        destructor : function() {
            this._clearCurrentTrigger();
            this._clearTimers();
            this._clearHandles();
        },

        bindUI : function() {
            this.after("delegateChange", this._afterSetDelegate);
            this.after("nodesChange", this._afterSetNodes);

            this._bindDelegate();
        },

        syncUI : function() {
            this._uiSetNodes(this.get("triggerNodes"));
        },

        setTriggerContent : function(content) {
            var contentBox = this.get("contentBox");
            contentBox.set("innerHTML", "");

            if (content) {
                if (content instanceof Node) {
                    for (var i = 0, l = content.size(); i < l; ++i) {
                        contentBox.appendChild(content.item(i));
                    }
                } else if (Lang.isString(content)) {
                    contentBox.set("innerHTML", content);
                }
            }
        },

        getParentTrigger : function(node) {
            var cn = this._triggerClassName;
            return (node.hasClass(cn)) ? node : node.ancestor(function(node) {node.hasClass(cn)});
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

        _bindDelegate : function() {
            var eventHandles = this._eventHandles;

            if (eventHandles.delegate) {
                eventHandles.delegate.detach();
                eventHandles.delegate = null;
            }
            eventHandles.delegate = Y.on("mouseover", Y.bind(this._onDelegateMouseOver, this), this.get("delegate"));
        },

        _onDelegateMouseOver : function(e) {
            var node = this.getParentTrigger(e.target);
            if (node && (!this._currTrigger.node || !node.compareTo(this._currTrigger.node))) {
                this._enterTrigger(node, e.pageX, e.pageY);
            }
        },

        _onNodeMouseOut : function(e) {
            var to = e.relatedTarget;
            var trigger = e.currentTarget;

            if (!trigger.contains(to)) {
                this._leaveTrigger(trigger);
            }
        },

        _onNodeMouseMove : function(e) {
            this._overTrigger(e.pageX, e.pageY);
        },

        _enterTrigger : function(node, x, y) {
            this._setCurrentTrigger(node, x, y);
            this.fire("triggerEnter", null, node, x, y);
        },

        _defTriggerEnterFn : function(e, node, x, y) {
            if (!this.get("disabled")) {
                this._clearTimers();
                var delay = (this.get("visible")) ? 0 : this.get("showDelay");
                this._timers.show = Y.later(delay, this, this._showTooltip, [node]);
            }
        },
        
        _leaveTrigger : function(node) {
            this.fire("triggerLeave");

            this._clearCurrentTrigger();
            this._clearTimers();

            this._timers.hide = Y.later(this.get("hideDelay"), this, this._hideTooltip);
        },

        _overTrigger : function(x, y) {
            this._currTrigger.mouseX = x;
            this._currTrigger.mouseY = y;
        },

        _showTooltip : function(node) {
            var x = this._currTrigger.mouseX;
            var y = this._currTrigger.mouseY;

            this.move(x + Tooltip.OFFSET_X, y + Tooltip.OFFSET_Y);

            this.show();
            this._clearTimers();

            this._timers.hide = Y.later(this.get("autoHideDelay"), this, this._hideTooltip);
        },

        _hideTooltip : function() {
            this._clearTimers();
            this.hide();
        },

        _setTriggerContent : function(node) {
            var content = this.get("content");
            if (content && !(content instanceof Node || Lang.isString(content))) {
                content = content[node.get("id")] || node.getAttribute("title");
            }
            this.setTriggerContent(content);
        },

        _setCurrentTrigger : function(node, x, y) {

            var currTrigger = this._currTrigger,
                triggerHandles = this._eventHandles.trigger;

            this._setTriggerContent(node);

            triggerHandles.mouseMove = Y.on("mousemove", Y.bind(this._onNodeMouseMove, this), node);
            triggerHandles.mouseOut = Y.on("mouseout", Y.bind(this._onNodeMouseOut, this), node);

            var title = node.getAttribute("title");
            node.setAttribute("title", "");

            currTrigger.mouseX = x;
            currTrigger.mouseY = y;
            currTrigger.node = node;
            currTrigger.title = title;
        },

        _clearCurrentTrigger : function() {

            var currTrigger = this._currTrigger,
                triggerHandles = this._eventHandles.trigger;

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

    var tt = new Tooltip({
        triggerNodes:".yui-hastooltip",
        delegate: "#delegate",
        content: {
            tt3: "Tooltip 3 (from lookup)"
        },
        shim:false,
        zIndex:2
    });
    tt.render();

    tt.on("triggerEnter", function(e, node, x, y) {
        if (node && node.get("id") == "tt2") {
            this.setTriggerContent("Tooltip 2 (from triggerEvent)");
        }
    });

    var prevent = Y.Node.get("#prevent");
    tt.on("triggerEnter", function(e, node, x, y) {
        if (prevent.get("checked")) {
            if (node && node.get("id") == "tt4") {
                e.preventDefault();
            }
        }
    });
});
</script>
