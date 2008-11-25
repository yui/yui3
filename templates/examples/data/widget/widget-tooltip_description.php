<h3>Creating a Tooltip widget class</h3>

<p>TODO:  Basic Structure (same as anything which extends Base)</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    /* Constructor for the new Tooltip widget */
    function Tooltip(config) {
        Tooltip.superclass.constructor.apply(this, arguments);
    }

    /* 
       Required NAME static field, used to identify the Widget class and 
       used as an event prefix, to generate class names etc. (set to the 
       class name in camel case). 
    */
    Tooltip.NAME = "tooltip";

    /*
       Default attributes for the Tooltip widget, added to the attributes
       provided by the base Widget class, (with the exception of xy)
    */
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

    Y.extend(Tooltip, Y.Widget, { ... });
</textarea>

<p>TODO: Adding WidgetPosition and WidgetStack extension support</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    // dynamic:false = Modify the existing Tooltip class
    Tooltip = Y.Base.build(Tooltip, [Y.WidgetPosition, Y.WidgetStack], {dynamic:false});
</textarea>

<p>TODO: Lifecycle Methods</p>

<textarea name="code" class="JScript" rows="1" cols="60">

    initializer : function(config) {
    
        /* Store default class name for trigger elements */
        this._triggerClassName = this.getClassName("trigger");
    
        /* Setup initial private state */
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
    
        /* 
           Publish events introduced by Tooltip. Note the triggerEnter event is preventable,
           with the default behavior defined in the _defTriggerEnterFn method 
        */
        this.publish("triggerEnter", {defaultFn: this._defTriggerEnterFn, preventable:true});
        this.publish("triggerLeave", {preventable:false});
    },
    
    destructor : function() {
    
        /* Destroy privately held state and detach event listeners (handles) */
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
    }
</textarea>

<p>TODO: Attribute Supporting Methods</p>

<textarea name="code" class="JScript" rows="1" cols="60">
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
</textarea>

<p>TODO: DOM Event Handlers, and Supporting Methods</p>

<textarea name="code" class="JScript" rows="1" cols="60">
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
    }
</textarea>

<p>TODO: Rendering Method, Setting Content</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _setTriggerContent : function(node) {
        var content = this.get("content");
        if (content && !(content instanceof Node || Lang.isString(content))) {
            content = content[node.get("id")] || node.getAttribute("title");
        }
        this.setTriggerContent(content);
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
    }
</textarea>