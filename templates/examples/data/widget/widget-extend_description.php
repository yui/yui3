<h3>Extending the <code>Widget</code> class to create new widgets</h3>

<p>TODO:  Basic Structure (same as anything which extends Base)</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    /* Constructor for the new Spinner widget */
    function Spinner(config) {
        Spinner.superclass.constructor.apply(this, arguments);
    }

    /* 
       Required NAME static field, used to identify the Widget class and 
       used as an event prefix, to generate class names etc. (it is set to 
       the class name in camel case).
    */
    Spinner.NAME = "spinner";

    /* 
       Default attributes for the Spinner widget, added to the attributes
       provided by the base Widget class (with the exception of strings)
    */
    Spinner.ATTRS = {
        min : {
            value:0
        },

        max : {
            value:100
        },

        value : {
            value:0,
            validator: function(val) {
                return this._validateValue(val);
            }
        },

        minorInc : {
            value:1
        },

        majorInc : {
            value:10
        },

        strings: {
            value: {
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

<p>TODO: The HTML_PARSER property</p>

<textarea name="code" class="JScript" rows="1" cols="60">

    Spinner.HTML_PARSER = {
        value: function (contentBox) {
            var node = contentBox.query("." + Spinner.INPUT_CLASS);
            return (node) ? parseInt(node.get("value")) : null;
        }
    };

    Spinner.INPUT_CLASS = Y.ClassNameManager.getClassName(Spinner.NAME, "value");
</textarea>

<p>TODO: Lifecycle Methods</p>

<textarea name="code" class="JScript" rows="1" cols="60">

    // Initialization code to set up state, other than attributes
    initializer: function() {
        ...
    },

    // Cleaup code called during destruction. NOTE: The Widget class' desctructor
    // will purge the bounding box of event listeners, so individual destructors
    // only need to clean up listeners attached outside of the bounding box.
    destructor : function() {
        ....
    },

    // Default method invoked by Widget's renderer method, used to 
    // insert new elements for the Widget into the DOM
    renderUI : function() {
        this._renderInput();
        this._renderButtons();
    },

    // Default method invoked by Widget's renderer method, used to 
    // bind event listeners for both attribute changes and DOM interaction
    bindUI : function() {
        this.after("valueChange", this._onValueChange);

        var boundingBox = this.get("boundingBox");

        var keyEventSpec = (!Y.UA.opera) ? "down:" : "press:";
        keyEventSpec += "38, 40, 33, 34";

        Y.on("key", Y.bind(this._delegateDirectionKeys, this), boundingBox, keyEventSpec);
        Y.on("mousedown", Y.bind(this._delegateMouseDown, this), boundingBox);
        Y.on("mouseup", Y.bind(this._delegateMouseUp, this), boundingBox.get("ownerDocument"));
    },

    // Default method invoked by Widget's renderer method, used to update the 
    // state of the DOM (UI) to reflect the current state of the widget.
    syncUI : function() {
        this._uiSetValue(this.get("value"));
    }
</textarea>

<p>TODO: Attribute Supporting Methods</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _onValueChange : function(e) {
        this._uiSetValue(e.newVal);
    },

    _uiSetValue : function(val) {
        this.inputNode.set("value", val);
    },

    _validateValue: function(val) {
        var min = this.get("min"),
            max = this.get("max");

        return (Lang.isNumber(val) && val &gt;= min && val &lt;= max);
    }
</textarea>

<p>TODO: Rendering Support Methods</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _renderInput : function() {
        var contentBox = this.get("contentBox");
        var input = contentBox.query("." + Spinner.INPUT_CLASS);

        if (!input) {
            input = Node.create(Spinner.INPUT_TEMPLATE);
            contentBox.appendChild(input);
        }
        this.inputNode = input;
    },

    _renderButtons : function() {
        var contentBox = this.get("contentBox"),
            strings = this.get("strings");

        var inc = this._createButton(strings.increment, this.getClassName("increment"));
        var dec = this._createButton(strings.decrement, this.getClassName("decrement"));

        this.incrementNode = contentBox.appendChild(inc);
        this.decrementNode = contentBox.appendChild(dec);
    },

    _createButton : function(text, className) {
        ...
    },
</textarea>


<p>TODO: CSS Support Methods</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    Y.ClassNameManager.getClassName(Spinner.NAME, "value");
    ...
    this.getClassName("increment");
</textarea>

<p>TODO: CSS Highlights</p>

<textarea name="code" class="CSS" rows="1" cols="60">

    /* Controlling show/hide/visible state */
    .yui-spinner-hidden {
        display:none;
    }

    /* Bounding Box - Inline Block for this particular control */
    .yui-spinner {
        display:-moz-inline-stack;
        display:inline-block;
        zoom:1;
        *display:inline;
    }

    /* Content Box - Start adding visual treatment */
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