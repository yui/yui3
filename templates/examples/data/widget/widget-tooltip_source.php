<div class="yui-tooltip-node" title="Tooltip 1">Tooltip One</div>

<div class="yui-tooltip-node" title="Tooltip 2">Tooltip Two</div>

<div class="yui-tooltip-node" title="Tooltip 3">Tooltip Three</div>

<div class="yui-tooltip-node" title="Tooltip 4">Tooltip Four</div>

<script type="text/javascript">
YUI(<?php echo getYUIConfig("filter:'raw'") ?>).use(<?php echo $requiredModules ?>, function(Y) {

    var Lang = Y.Lang,
        Node = Y.Node;

    function Tooltip(config) {
        Tooltip.superclass.constructor.apply(this, arguments);
    }

    Tooltip.OFFSET_X = 15;
    Tooltip.OFFSET_Y = 5;

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
        }
    };

    Tooltip.NAME = "tooltip";

    Y.extend(Tooltip, Y.Widget, {

        initializer : function(config) {
            this._ttNodeClassName = this.getClassName("node");

            this._currNode = {};
            this._delegateHandle;
        },

        destructor : function() {
            this._clearCurrNodeState();

            if (this._delegateHandle) {
                this._delegateHandle.detach();
            }
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
            if (this._boundNodes) {
                this._boundNodes.removeClass(this._ttNodeClassName);
            }

            if (nodes) {
                this._boundNodes = nodes;
                this._boundNodes.addClass(this._ttNodeClassName);
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
            if (this._delegateHandle) {
                this._delegateHandle.detach();
            }

            var delegate = this.get("delegate");
            var mouseOverHandler = Y.bind(this._onDelegateMouseOver, this);

            this._delegateHandle = Y.on("mouseover", mouseOverHandler, delegate);
        },

        _onDelegateMouseOver : function(e) {
            if (this.hasTooltip(e.target)) {
                this._doMouseEnter(e.target, e.pageX, e.pageY);
            }
        },

        _onNodeMouseOut : function(e) {
            if (e.target && e.target.compareTo(this._currNode.node)) {
                this._doMouseLeave(e.target);
            }
        },

        _onNodeMouseMove : function(e) {
            this._doMouseMove(e.pageX, e.pageY);
        },

        hasTooltip : function(node) {
            return (node && node.hasClass(this._ttNodeClassName));
        },

        _showTooltip : function(node) {
            var x = this._currNode.mouseX;
            var y = this._currNode.mouseY;

            this.move(x + Tooltip.OFFSET_X, y + Tooltip.OFFSET_Y);

            this.show();

            this._hTimer = Y.later(this.get("autoHideDelay"), this, this._autoHideTooltip);
        },

        _hideTooltip : function() {
            this.hide();
        },

        _autoHideTooltip : function() {
            this._clearTimers();
            this._hideTooltip();
        },

        _setCurrNodeState : function(node, x, y) {

            var title = node.getAttribute("title");
            node.setAttribute("title", "");
            this.set("content", title);

            this._currNode.mouseX = x;
            this._currNode.mouseY = y;

            this._currNode.mouseMoveHandle = Y.on("mousemove", Y.bind(this._onNodeMouseMove, this), node);
            this._currNode.mouseOutHandle = Y.on("mouseout", Y.bind(this._onNodeMouseOut, this), node);

            this._currNode.node = node;
            this._currNode.title = title;
        },

        _clearCurrNodeState : function() {
            if (this._currNode.node) {
                var node = this._currNode.node;
                var title = this._currNode.title || "";

                this._currNode.node = null;
                this._currNode.title = "";

                this._currNode.mouseMoveHandle.detach();
                this._currNode.mouseOutHandle.detach();

                node.setAttribute("title", title);
            }
        },

        _clearTimers : function() {
            if (this._hTimer) {
                this._hTimer.cancel();
                this._hTimer = null;
            }

            if (this._sTimer) {
                this._sTimer.cancel();
                this._sTimer = null;
            }
        },

        _doMouseEnter : function(node, x, y) {
            this._setCurrNodeState(node, x, y);
            this._clearTimers();

            var delay = (this.get("visible")) ? 0 : this.get("showDelay");
            this._sTimer = Y.later(delay, this, this._showTooltip, [node]);
        },

        _doMouseMove : function(x, y) {
            this._currNode.mouseX = x;
            this._currNode.mouseY = y;
        },

        _doMouseLeave : function(node) {
            this._clearCurrNodeState();
            this._clearTimers();
            this._hTimer = Y.later(this.get("hideDelay"), this, this._hideTooltip);
        }
    });

    // dynamic:false = Modify the existing Tooltip class
    Tooltip = Y.Base.build(Tooltip, [Y.WidgetPosition, Y.WidgetStack], {dynamic:false});

    var tt = new Tooltip({nodes:".tooltip"});
    tt.render();
});
</script>
