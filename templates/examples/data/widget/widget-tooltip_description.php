<h3>Creating A Tooltip Widget Class</h3>

<h4>Basic Class Structure</h4>

<p>As with the basic <a href="widget-extend.html">"Extending Widget"</a> example, the <code>Tooltip</code> class will extend the <code>Widget</code> base class and follows the same pattern we use for other classes which extend Base.</p>

<p>Namely:</p>

<ul>
    <li>Set up the constructor to invoke the superclass constructor</li>
    <li>Define a <code>NAME</code> property, to identify the class</li>
    <li>Define the default attribute configuration, using the <code>ATTRS</code> property</li>
    <li>Implement prototype methods</li>
</ul>

<p>This basic structure is shown below:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    /* Tooltip constructor */
    function Tooltip(config) {
        Tooltip.superclass.constructor.apply(this, arguments);
    }

    /* 
     *  Required NAME static field, used to identify the Widget class and 
     *  used as an event prefix, to generate class names etc. (set to the 
     *  class name in camel case). 
     */
    Tooltip.NAME = "tooltip";

    /* Default Tooltip Attributes */
    Tooltip.ATTRS = {

        /* 
         * The tooltip content. This can either be a fixed content value, 
         * or a map of id-to-values, designed to be used when a single
         * tooltip is mapped to multiple trigger elements.
         */
        content : {
            value: null
        },

        /* 
         * The set of nodes to bind to the tooltip instance. Can be a string, 
         * or a node instance.
         */
        triggerNodes : {
            value: null,
            set: function(val) {
                if (val && Lang.isString(val)) {
                    val = Node.all(val);
                }
                return val;
            }
        },

        /*
         * The delegate node to which event listeners should be attached.
         * This node should be an ancestor of all trigger nodes bound
         * to the instance. By default the document is used.
         */
        delegate : {
            value: null,
            set: function(val) {
                return Node.get(val) || Node.get("document");
            }
        },

        /*
         * The time to wait, after the mouse enters the trigger node,
         * to display the tooltip
         */
        showDelay : {
            value:250
        },

        /*
         * The time to wait, after the mouse leaves the trigger node,
         * to hide the tooltip
         */
        hideDelay : {
            value:10
        },

        /*
         * The time to wait, after the tooltip is first displayed for 
         * a trigger node, to hide it, if the mouse has not left the 
         * trigger node
         */
        autoHideDelay : {
            value:2000
        },

        /*
         * Override the default visibility set by the widget base class
         */
        visible : {
            value:false
        },

        /*
         * Override the default XY value set by the widget base class,
         * to position the tooltip offscreen
         */
        xy: {
            value:[Tooltip.OFFSCREEN_X, Tooltip.OFFSCREEN_Y]
        }
    };

    Y.extend(Tooltip, Y.Widget, { 
        // Prototype methods/properties
    });
</textarea>

<h4>Adding WidgetPosition and WidgetStack Extension Support</h4>

<p>The Tooltip class also needs basic positioning and stacking (z-index, shimming) support. As with the <a href="widget-build.html">Custom Widget Classes</a> example, we use
<code>Base.build</code> to add this support to the <code>Tooltip</code> class, however in this case, we need to modify the Tooltip class, as opposed to extending it 
to create a completely new class, hence we set the <code>dynamic</code> configuration property to <code>false</code>:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    // dynamic:false = Modify the existing Tooltip class
    Tooltip = Y.Base.build(Tooltip, [Y.WidgetPosition, Y.WidgetStack], {dynamic:false});
</textarea>

<h4>Lifecycle Methods: initializer, destructor</h4>

<p>The <code>initializer</code> method is invoked during the <code>init</code> lifecycle phase, after the attributes are configured for each class. <code>Tooltip</code> uses it 
to setup the private state variables it will use to store the trigger node currently being serviced by the tooltip instance, event handles and show/hide timers.</p>

<textarea name="code" class="JScript" rows="1" cols="60">

    initializer : function(config) {

        this._triggerClassName = this.getClassName("trigger");

        // Currently bound trigger node information
        this._currTrigger = {
            node: null,
            title: null,
            mouseX: Tooltip.OFFSCREEN_X,
            mouseY: Tooltip.OFFSCREEN_Y
        };

        // Event handles - mouse over is set on the delegate
        // element, mousemove and mouseout are set on the trigger node
        this._eventHandles = {
            delegate: null,
            trigger: {
                mouseMove : null,
                mouseOut: null
            }
        };

        // Show/hide timers
        this._timers = {
            show: null,
            hide: null
        };

        // Publish events introduced by Tooltip. Note the triggerEnter event is preventable,
        // with the default behavior defined in the _defTriggerEnterFn method 
        this.publish("triggerEnter", {defaultFn: this._defTriggerEnterFn, preventable:true});
        this.publish("triggerLeave", {preventable:false});
    }
</textarea>

<p>The <code>destructor</code> is used to clear out stored state, detach any event handles and clear out the show/hide timers:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    destructor : function() {
        this._clearCurrentTrigger();
        this._clearTimers();
        this._clearHandles();
    }
</textarea>

<h4>Lifecycle Methods: bindUI, syncUI</h4>

<p>The <code>bindUI</code> and <code>syncUI</code> are invoked by the base Widget class' <code>renderer</code> method.</p>

<p><code>bindUI</code> is used to bind the attribute change listeners used to update the rendered UI from the current state of the widget and also to bind
the DOM listeners required to enable the UI for interaction.</p>

<p><code>syncUI</code> is used to sync the UI state from the current widget state, when initially rendered.</p>

<p><em>NOTE:</em> Widget's <code>renderer</code> method also invokes the <code>renderUI</code> method, which is responsible for laying down any additional content elements a widget requires. However
tooltip does not have any additional elements in needs to add to the DOM, outside of the default Widget boundingBox and contentBox.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    bindUI : function() {
        this.after("delegateChange", this._afterSetDelegate);
        this.after("nodesChange", this._afterSetNodes);

        this._bindDelegate();
    },

    syncUI : function() {
        this._uiSetNodes(this.get("triggerNodes"));
    }
</textarea>

<h4>Attribute Supporting Methods</h4>

<p>Tooltip's <code>triggerNodes</code>, which defines the set of nodes which should trigger this tooltip instance,
has a couple of supporting methods associated with it.</p>

<p>The <code>_afterSetNodes</code> method is the default attribute change event handler for the <code>triggerNodes</code>
attribute. It invokes the <code>_uiSetNodes</code> method, which marks all trigger nodes with a trigger class name (<code>yui-tooltip-trigger</code>) when set.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _afterSetNodes : function(e) {
        this._uiSetNodes(e.newVal);
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
</textarea>

<p>Similarly the <code>_afterSetDelegate</code> method is the default attributechange listener for the <code>delegate</code> attribute,
and invokes <code>_bindDelegate</code> to set up the listeners when a new delegate node is set.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _afterSetDelegate : function(e) {
        this._bindDelegate(e.newVal);
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

<h4>DOM Event Handlers</h4>

<p>Tooltips interaction revolves around the <code>mouseover</code>, <code>mousemove</code> and <code>mouseout</code> DOM events. The mouseover listener is the only listener set up initially, on the <code>delegate</code> node:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _onDelegateMouseOver : function(e) {
        var node = this.getParentTrigger(e.target);
        if (node && (!this._currTrigger.node || !node.compareTo(this._currTrigger.node))) {
            this._enterTrigger(node, e.pageX, e.pageY);
        }
    }
</textarea>

<p>It attempts to determine if the mouse is entering a trigger node. It ignores mouseover events generated from elements 
inside the current trigger node (for example when mousing out of a child element of a trigger node). If it determines that the mouse is entering a trigger node,
the delegates to the <code>_enterTrigger</code> method to setup the current trigger state and attaches mousemove and mouseout listeners on the current trigger node.</p>

<p>The mouse out listener delegates to the <code>_leaveTrigger</code> method, if it determines the mouse is leaving the trigger node:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _onNodeMouseOut : function(e) {
        var to = e.relatedTarget;
        var trigger = e.currentTarget;

        if (!trigger.contains(to)) {
            this._leaveTrigger(trigger);
        }
    }
</textarea>

<p>The mouse move listener delegates to the <code>_overTrigger</code> method to store the current mouse XY co-ordinates (used to position the Tooltip when it is displayed after the <code>showDelay</code>):</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _onNodeMouseMove : function(e) {
        this._overTrigger(e.pageX, e.pageY);
    }
</textarea>

<h4>Trigger Event Delegates: _enterTrigger, _leaveTrigger, _overTrigger</h4>

<p>As seen above, the DOM event handlers delegate to the <code>_enterTrigger, _leaveTrigger and _overTrigger</code> methods to update the 
Tooltip state based on the currently active trigger node.</p>

<p>The <code>_enterTrigger</code> method sets the current trigger state (which node is the current tooltip trigger, 
what the current mouse XY position is, etc.). The method also fires the <code>triggerEnter</code> event, whose default function actually handles 
showing the tooltip after the configured <code>showDelay</code> period. The <code>triggerEnter</code> event can be prevented by listeners, allowing 
users to prevent the tooltip from being shown if required. (<code>triggerEnter</code> listeners are passed the current trigger node and x,y mouse co-ordinates as arguments):</p>

<textarea name="code" class="JScript" rows="1" cols="60">
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
</textarea>

<p>Similarly the <code>_leaveTrigger</code> method is invoked when the mouse leaves a trigger node, and clears any stored state, timers and listeners before setting up
the <code>hideDelay</code> timer. It fires a <code>triggerLeave</code> event, but cannot be prevented, and has no default behavior to prevent:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _leaveTrigger : function(node) {
        this.fire("triggerLeave");

        this._clearCurrentTrigger();
        this._clearTimers();

        this._timers.hide = Y.later(this.get("hideDelay"), this, this._hideTooltip);
    },
</textarea>

<p>As mentioned previously, the <code>_overTrigger</code> method simply stores the current mouse XY co-ordinates for use when the tooltip is shown:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _overTrigger : function(x, y) {
        this._currTrigger.mouseX = x;
        this._currTrigger.mouseY = y;
    }
</textarea>

<h4>Setting Tooltip Content</h4>

<p>Since the content for a tooltip is usually a function of the trigger node and not constant, <code>Tooltip</code> provides a number of ways to set the content.</p>

<ol>
    <li>Setting the <code>content</code> attribute to a string or node. In this case, the value of the <code>content</code> attribute is used
    for all triggerNodes</li>
    <li>Setting the <code>content</code> attribute to an object literal, containing a map of triggerNode id to content. The content for a trigger node
    will be set using the map, when the tooltip is triggered for the node.</li>
    <li>Setting the title attribute on the trigger node. The value of the title attribute is used to set the tooltip content,
    when triggered for the node.</li>
    <li>By calling the <code>setTriggerContent</code> method to set content for a specific trigger node, in a <code>triggerEnter</code> event listener.</li>
</ol>

<p>The precedence of these methods is handled in the <code>_setTriggerContent</code> method, invoked when the mouse enters a trigger:</p>

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

<p>Calling the public <code>setTriggerContent</code> in a <code>triggerEvent</code> listener will over-ride content set using the <code>content</code> attribute or the trigger node's title value.</p>

<h4>Using Tooltip</h4>

<p>For this example, we set up 4 DIV elements which will act as tooltip triggers. They are all marked using a <code>yui-hastooltip</code> class, so that they can be queried using a simple selector, passed as the value for the <code>triggerNodes</code> attribute in the tooltip's cconstructor Also all 4 trigger nodes are contained in a wrapper DIV with <code>id="delegate"</code> which will act as the <code>delegate</code> node.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
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
</textarea>

<p>The tooltip content for each of the trigger nodes is setup differently. The first trigger node uses the title attribute to set it's content. The third trigger node's content is set using the content map set in the constructor above. The second trigger node's content is set using a <code>triggerEnter</code> event listener and the <code>setTriggerContent</code> method as shown below:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    tt.on("triggerEnter", function(e, node, x, y) {
        if (node && node.get("id") == "tt2") {
            this.setTriggerContent("Tooltip 2 (from triggerEvent)");
        }
    });
</textarea>

<p>The fourth trigger node's content is set using it's title attribute, however it also has a <code>triggerEvent</code> listener which prevents the tooltip from being displayed for it, if the checkbox is checked.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    var prevent = Y.Node.get("#prevent");
    tt.on("triggerEnter", function(e, node, x, y) {
        if (prevent.get("checked")) {
            if (node && node.get("id") == "tt4") {
                e.preventDefault();
            }
        }
    });
</textarea>