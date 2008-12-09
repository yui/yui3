<h3>Extending The <code>Widget</code> Class</h3>

<h4>Basic Class Structure</h4>

<p>Widgets classes follow the general pattern implemented by the <code>Spinner</code> class, shown in the code snippet below. The basic pattern for setting up a new widget class involves:</p>

<ol>
    <li>Defining the constructor function for the new widget class, which invokes the superclass constructor to kick of the initialization chain <em>(line 2)</em></li>
    <li>Defining the static <code>NAME</code> property for the class, which is normally the class name in camel case, and is used to prefix events and CSS classes fired/created by the class <em>(line 11)</em></li>
    <li>Defining the static <code>ATTRS</code> property for the class, which defines the set of attribute which the class will introduce, in addition to the superclass attributes <em>(line 18-57)</em></li>
    <li>Extending the <code>Widget</code> class, and adding/over-riding any prototype properties/methods <em>(line 59)</em></li>
</ol>

<textarea name="code" class="JScript" rows="1" cols="60">
    /* Spinner class constructor */
    function Spinner(config) {
        Spinner.superclass.constructor.apply(this, arguments);
    }

    /* 
     * Required NAME static field, to identify the Widget class and 
     * used as an event prefix, to generate class names etc. (set to the 
     * class name in camel case). 
     */
    Spinner.NAME = "spinner";

    /*
     * The attribute configuration for the Spinner widget. Attributes can be
     * defined with default values, get/set functions and validator functions
     * as with any other class extending Base.
     */
    Spinner.ATTRS = {
        // The minimum value for the spinner.
        min : {
            value:0
        },

        // The maximum value for the spinner.
        max : {
            value:100
        },

        // The current value of the spinner.
        value : {
            value:0,
            validator: function(val) {
                return this._validateValue(val);
            }
        },

        // Amount to increment/decrement the spinner when the buttons, or arrow up/down keys are pressed.
        minorStep : {
            value:1
        },

        // Amount to increment/decrement the spinner when the page up/down keys are pressed.
        majorStep : {
            value:10
        },

        // The localizable strings for the spinner. This attribute is 
        // defined by the base Widget class but has an empty value. The
        // spinner is simply providing a default value for the attribute.
        strings: {
            value: {
                tooltip: "Press the arrow up/down keys for minor increments, page up/down for major increments.",
                increment: "Increment",
                decrement: "Decrement"
            }
        }
    };

    Y.extend(Spinner, Widget, {
        // Methods/properties to add to the prototype of the new class
        ...
    });
</textarea>

<p>Note that these steps are the same for any class which is derived from <a href="http://developer.yahoo.com/yui/3/base/"><code>Base</code></a>, nothing Widget specific is involved yet. 
Widget adds the concept of a rendered UI to the existing Base lifecycle (viz. init, destroy and attribute state configuration), which we'll see show up in Widget specific areas below.</p>

<h4>The HTML_PARSER Property</h4>

<p>
The first Widget specific property <code>Spinner</code> implements is the static <a href="../../api/Widget.html#property_HTML_PARSER"><code>HTML_PARSER</code></a> property. It is used to set the initial widget configuration based on markup, providing basic progressive enhancement support.
</p>
<p> 
The value of the <code>HTML_PARSER</code> property is an object literal, where each property is a widget attribute name, and the value is either a selector string (if the attribute is a node reference) or a function which is executed to provide 
a value for the attribute from the markup on the page. Markup is essentially thought of as an additional data source for the user to set initial attribute values, outside of the configuration object passed to the constructor 
<em>(values passed to the constructor will take precedence over values picked up from markup)</em>.
</p>

<p>For <code>Spinner</code>, <code>HTML_PARSER</code> defines a function for the <code>value</code> attribute, which sets the initial value of the spinner based on an input field if present in the markup.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    /* 
     * The HTML_PARSER static constant is used by the Widget base class to populate 
     * the configuration for the spinner instance from markup already on the page.
     *
     * The Spinner class attempts to set the value of the spinner widget if it
     * finds the appropriate input element on the page.
     */
    Spinner.HTML_PARSER = {
        value: function (contentBox) {
            var node = contentBox.query("." + Spinner.INPUT_CLASS);
            return (node) ? parseInt(node.get("value")) : null;
        }
    };
</textarea>

<h4>Lifecycle Methods: initializer, destructor</h4>

<p>The <code>initializer</code> and <code>destructor</code> lifecycle methods are carried over from <code>Base</code>, and can be used to setup initial state during construction, and cleanup state during destruction respectively.</p>

<p>For <code>Spinner</code>, there is nothing special we need to do in the <code>initializer</code> (attribute setup is already taken care of), but it's left in the example to round out the lifecycle discussion.</p>

<p>The <code>destructor</code> takes care of detaching any event listeners <code>Spinner</code> adds outside of the bounding box (event listeners on/inside the bounding box are purged by <code>Widget</code>'s <code>destructor</code>).</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    /*
     * initializer is part of the lifecycle introduced by 
     * the Widget class. It is invoked during construction,
     * and can be used to setup instance specific state.
     * 
     * The Spinner class does not need to perform anything
     * specific in this method, but it is left in as an example.
     */
    initializer: function(config) {
        // Not doing anything special during initialization
    },

    /*
     * destructor is part of the lifecycle introduced by 
     * the Widget class. It is invoked during destruction,
     * and can be used to cleanup instance specific state.
     * 
     * The spinner cleans up any node references it's holding
     * onto. The Widget classes destructor will purge the 
     * widget's bounding box of event listeners, so spinner 
     * only needs to clean up listeners it attaches outside of 
     * the bounding box.
     */
    destructor : function() {
        this._documentMouseUpHandle.detach();

        this.inputNode = null;
        this.incrementNode = null;
        this.decrementNode = null;
    }
</textarea>

<h4>Rendering Lifecycle Methods: renderer, renderUI, bindUI, syncUI</h4>

<p>Widget adds a <code>render</code> method to the <code>init</code> and <code>destroy</code> lifecycle methods provided by Base. The <code>init</code> and <code>destroy</code> methods invoke the corresponding <code>initializer</code> and <code>destructor</code> implementations for the widget. Similarly, the <code>render</code> method invokes the <code>renderer</code> implementation for the widget. Note that the <code>renderer</code> method is not chained automatically, unlike the <code>initializer</code> and <code>destructor</code> methods.</p>

<p>The <code>Widget</code> class already provides a default <code>renderer</code> implementation, which invokes the following abstract methods in the order shown <em>(with their respective responsibilities)</em>:</p>

<ol>
    <li><code>renderUI()</code> : responsible for creating/adding elements to the DOM to render the widget.</li>
    <li><code>bindUI()</code> : responsible for binding event listeners (both attribute change and DOM event listeners) to 'activate' the rendered UI.</li>
    <li><code>syncUI()</code> : responsible for updating the rendered UI based on the current state of the widget.</li>
</ol>

<p>Since the <code>Spinner</code> class has no need to modify the <code>Widget</code> <code>renderer</code> implementation, it simply implements the above 3 methods to handle the render phase:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    /*
     * For spinner the method adds the input (if it's not already 
     * present in the markup), and creates the increment/decrement buttons
     */
    renderUI : function() {
        this._renderInput();
        this._renderButtons();
    },

    /*
     * For spinner, the method:
     *
     * - Sets up the attribute change listener for the "value" attribute
     *
     * - Binds key listeners for the arrow/page keys
     * - Binds mouseup/down listeners on the boundingBox, document respectively.
     * - Binds a simple change listener on the input box.
     */
    bindUI : function() {
        this.after("valueChange", this._afterValueChange);

        var boundingBox = this.get("boundingBox");

        // Looking for a key event which will fire continuously across browsers while the key is held down. 38, 40 = arrow up/down, 33, 34 = page up/down
        var keyEventSpec = (!Y.UA.opera) ? "down:" : "press:";
        keyEventSpec += "38, 40, 33, 34";


        Y.on("change", Y.bind(this._onInputChange, this), this.inputNode);
        Y.on("key", Y.bind(this._onDirectionKey, this), boundingBox, keyEventSpec);
        Y.on("mousedown", Y.bind(this._onMouseDown, this), boundingBox);
        this._documentMouseUpHandle = Y.on("mouseup", Y.bind(this._onDocMouseUp, this), boundingBox.get("ownerDocument"));
    },

    /*
     * For spinner, the method sets the value of the input field,
     * to match the current state of the value attribute.
     */
    syncUI : function() {
        this._uiSetValue(this.get("value"));
    }
</textarea>

<h5>A Note On Key Event Listeners</h5>

<p>The PR2 release adds basic support for <code>"key"</code> events, which are used by <code>Spinner</code> to setup a listener for arrow up/down and page up/down keys on the spinner's bounding box (line 30).</p>

<p>Event's <code>"key"</code> support allows <code>Spinner</code> to define a single listener, which is only invoked for the key specification provided. The key specification in the above use case is <code>"down:38, 40, 33, 34"</code> for most browsers, indicating that 
the <code>_onDirectionKey</code> method should only be called if the bounding box receives a keydown event with a character code which is either 38, 40, 33 or 34. <code>"key"</code> specifications can also contain more <a href="../../api/YUI.html#event_key">advanced filter criteria</a>, involving modifiers such as CTRL and SHIFT.</p>

<p>For the Spinner widget, we're looking for a key event which fires repeatedly while the key is held down. This differs for Opera, so we need to fork for the key event we're interested in. Future versions of <code>"key"</code> support will aim to provide this type of higher level cross-browser abstraction also.</p>

<h4>Attribute Supporting Methods</h4>

<p>Since all widgets are attribute driven, they all follow a pretty similar pattern when it comes to how those attributes are used. For a given attribute, widgets will generally have:</p>
<ul>
    <li>A prototype method to listen for changes in the attribute</li>
    <li>A prototype method to update the state of the rendered UI, to reflect the value of an attribute.</li>
    <li>A prototype method used to set/get/validate the attribute.</li>
</ul>

<p>These methods are kept on the prototype to facilitate customization at any of the levels - event handling, ui updates, set/get/validation logic.</p>

<p>For <code>Spinner</code>, these corresponding methods for the <code>value</code> attribute are: <code>_afterValueChange</code>, <code>_uiSetValue</code> and <code>_validateValue</code>:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    /*
     * value attribute change listener. Updates the 
     * value in the rendered input box, whenever the 
     * attribute value changes.
     */
    _afterValueChange : function(e) {
        this._uiSetValue(e.newVal);
    },

    /*
     * Updates the value of the input box to reflect 
     * the value passed in
     */
    _uiSetValue : function(val) {
        this.inputNode.set("value", val);
    },

    /*
     * value attribute default validator. Verifies that
     * the value being set lies between the min/max value
     */
    _validateValue: function(val) {
        var min = this.get("min"),
            max = this.get("max");

        return (Lang.isNumber(val) && val &gt;= min && val &lt;= max);
    }
</textarea>

<p>Since this example focuses on general patterns for widget development, validator/set/get functions are not defined for attributes such as min/max in the interests of keeping the example simple, but could be, in a production ready spinner.</p>

<h4>Rendering Support Methods</h4>

<p><code>Spinner</code>'s <code>renderUI</code> method hands off creation of the input field and buttons to the following helpers which use markup templates to generate node instances:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    /*
     * Creates the input field for the spinner and adds it to
     * the widget's content box, if not already in the markup.
     */
    _renderInput : function() {
        var contentBox = this.get("contentBox"),
            input = contentBox.query("." + Spinner.INPUT_CLASS),
            strings = this.get("strings");

        if (!input) {
            input = Node.create(Spinner.INPUT_TEMPLATE);
            contentBox.appendChild(input);
        }

        input.set("title", strings.tooltip);
        this.inputNode = input;
    },

    /*
     * Creates the button controls for the spinner and add them to
     * the widget's content box, if not already in the markup.
     */
    _renderButtons : function() {
        var contentBox = this.get("contentBox"),
            strings = this.get("strings");

        var inc = this._createButton(strings.increment, this.getClassName("increment"));
        var dec = this._createButton(strings.decrement, this.getClassName("decrement"));

        this.incrementNode = contentBox.appendChild(inc);
        this.decrementNode = contentBox.appendChild(dec);
    },

    /*
     * Utility method, to create a spinner button
     */
    _createButton : function(text, className) {

        var btn = Y.Node.create(Spinner.BTN_TEMPLATE);
        btn.set("innerHTML", text);
        btn.set("title", text);
        btn.addClass(className);

        return btn;
    }
</textarea>

<h4>DOM Event Listeners</h4>

<p>The DOM event listeners attached during <code>bindUI</code> are straightforward event listeners, which receive the event facade for the DOM event, and update the spinner state accordingly.</p>

<p>A couple of interesting points worth noting: In the <code>"key"</code> listener we set up, we can call <code>e.preventDefault()</code> without having to check the character code, since the <code>"key"</code> event specifier will only invoke the listener 
if one of the specified keys is pressed (arrow/page up/down)</p>

<p>Also, to allow the spinner to update it's value while the mouse button is held down, we setup a timer, which gets cleared out when we receive a mouseup event on the document.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    /*
     * Bounding box Arrow up/down, Page up/down key listener.
     *
     * Increments/Decrement the spinner value, based on the key pressed.
     */
    _onDirectionKey : function(e) {
        e.preventDefault();
        ...
        switch (e.charCode) {
            case 38:
                newVal += minorStep;
                break;
            case 40:
                newVal -= minorStep;
                break;
            case 33:
                newVal += majorStep;
                newVal = Math.min(newVal, this.get("max"));
                break;
            case 34:
                newVal -= majorStep;
                newVal = Math.max(newVal, this.get("min"));
                break;
        }

        if (newVal !== currVal) {
            this.set("value", newVal);
        }
    },

    /*
     * Bounding box mouse down handler. Will determine if the mouse down
     * is on one of the spinner buttons, and increment/decrement the value
     * accordingly.
     * 
     * The method also sets up a timer, to support the user holding the mouse
     * down on the spinner buttons. The timer is cleared when a mouse up event
     * is detected.
     */
    _onMouseDown : function(e) {
        var node = e.target
        ...
        if (node.hasClass(this.getClassName("increment"))) {
            this.set("value", currVal + minorStep);
            ...
        } else if (node.hasClass(this.getClassName("decrement"))) {
            this.set("value", currVal - minorStep);
            ...
        }

        if (handled) {
            this._setMouseDownTimers(dir);
        }
    },

    /*
     * Document mouse up handler. Clears the timers supporting
     * the "mouse held down" behavior.
     */
    _onDocMouseUp : function(e) {
        this._clearMouseDownTimers();
    },

    /*
     * Simple change handler, to make sure user does not input a invalid value
     */
    _onInputChange : function(e) {
        if (!this._validateValue(this.inputNode.get("value"))) {
            // If the entered value is not valid, re-display the stored value
            this.syncUI();
        }
    }
</textarea>

<h4>ClassName Support Methods</h4>

<p>A key part of developing widgets which work with the DOM, is defining class names which it will use to mark the nodes it renders. These class names could be used to mark a node for later retrieval/lookup, for CSS application (both functional as well as cosmetic) or to indicate the current state of the widget.</p>

<p>The widget infrastructure uses the <code>ClassNameManager</code> utility, to generate consistently named classes to apply to the nodes it adds to the page:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    Y.ClassNameManager.getClassName(Spinner.NAME, "value");
    ...
    this.getClassName("increment");
</textarea>

<p>
Class names generated by the Widget's <code>getClassName</code> prototype method use the NAME field of the widget, to generate a prefixed classname through <code>ClassNameManager</code> - e.g. for spinner the <code>this.getClassName("increment")</code> above will generate the class name <code>yui-spinner-increment</code> ("yui" being the system level prefix, "spinner" being the widget name).
When you need to generate standard class names in static code (where you don't have a reference to <code>this.getClassName()</code>), you can use the ClassNameManager directly, as shown in line 1 above, to achieve the same results.
</p>

<h4>CSS Considerations</h4>

<p>Since widget uses the <code>getClassName</code> method to generate state related class names and to mark the bounding box/content box of the widget (e.g. "yui-[widgetname]-content", "yui-[widgetname]-hidden", "yui-[widgetname]-disabled"), we need to provide the default CSS handling for states we're interested in handling for the new Spinner widget. The "yui-[widgetname]-hidden" class is probably one state class, which all widgets will provide implementations for.</p>

<textarea name="code" class="CSS" rows="1" cols="60">

    /* Controlling show/hide state using display (since this control is inline-block) */
    .yui-spinner-hidden {
        display:none;
    }

    /* Bounding Box - Set the bounding box to be "inline block" for spinner */
    .yui-spinner {
        display:-moz-inline-stack;
        display:inline-block;
        zoom:1;
        *display:inline;
    }

    /* Content Box - Start adding visual treatment for the spinner */
    .yui-spinner-content {
        padding:1px;
    }

    /* Input Text Box, generated through getClassName("value") */
    .yui-spinner-value {
        ...
    }

    /* Button controls, generated through getClassName("increment") */
    .yui-spinner-increment, .yui-spinner-decrement {
        ...
    }
</textarea>

<h4>Using The Spinner Widget</h4>

<p>For the example, we have an input field already on the page, which we'd like to enhance to create a Spinner instance:</p>

<textarea name="code" class="HTML" rows="1" cols="60">
    <div id="numberField">
        <input type="text" class="yui-spinner-value" value="20" />
    </div>
</textarea>

<p>We provide the constructor for the Spinner with the <code>contentBox</code> which contains the input field with our initial value. The <code>HTML_PARSER</code> code we saw earlier, will extract the value from the input field, and use it as the initial value for the Spinner instance:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    // Create a new Spinner instance, drawing it's 
    // starting value from an input field already on the 
    // page (contained in the #numberField content box)
    var spinner = new Spinner({
        contentBox: "#numberField",
        max:100,
        min:0
    });
    spinner.render();
    spinner.focus();
</textarea>
