<h3>Get And Set Functions</h3>

<p>Attribute lets you define get and set functions for each attribute. These functions are invoked when the user calls Attribute's <code>get</code> and <code>set</code> methods, and provide a way to modify the value returned or the value stored respectively.</p>

<h3>Setting Up The Box Class Attributes</h3>

<p>In this example, we'll set up a Box class, with width and height attributes. We'll define a <code>set</code> function for these attributes, which appends a default unit suffix ("em") to the value passed to the Attribute <code>set</code> method, if none is provided by the caller:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    function Box(cfg) {
        ...
        this._initAtts(Box.ATTRIBUTES, cfg);
    }

    Box.prototype._dimensionSetter = function(val) {
        if (L.isNumber(val)) {
            val = val + Box.DEF_UNIT;
        } else {
            val = L.trim(val);
            if (val.match(Box.NUM_RE)) {
                val = val + Box.DEF_UNIT;
            }
        }
        return val;
    };

    Box.DEF_UNIT = "em";
    Box.NUM_RE = /^\d+?$/;

    // Setup attribute configuration
    Box.ATTRIBUTES = {
        "width" : {
            value:"20",

            set: function(val) {
                return this._dimensionSetter(val);
            },

            validator: function(val) {
                return (L.isString(val) || L.isNumber(val));
            }
        },

        "height" : {
            value:"10",

            set: function(val) {
                return this._dimensionSetter(val);
            },

            validator: function(val) {
                return (L.isString(val) || L.isNumber(val));
            }
        }
        ...
    }
</textarea>

<p>As seen above, we also setup <code>validator</code> functions for these attributes which ensure that we only store valid values. </p>

<p>A <code>content</code> attribute is also setup, which has a <code>set</code> function which changes all content set using this attribute to upper case.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    ...    
    "content" : {
       value:"Box Content",

       set: function(val) {
           return val.toUpperCase();
       },

       validator: function(val) {
           return L.isString(val);
       }
    }
    ...
</textarea>

<h3>Get Configuration</h3>

<p>The example also has an attribute named <code>area</code>. This attribute has a <code>get</code> function defined, which always returns the calculated area of the box. This attribute is different, in that it doesn't actually have a stored value, but simply returns a calculated value, based on other properties of the host.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    ...
    "area" : {
        get: function() {
            if (this._node) {
                return this._node.get("offsetWidth") * 
                            this._node.get("offsetHeight") + "sq. pixels";
            } else {
                return 0;
             }
        }
    },
    ...
</textarea>

<h3>Syncing Up Changes Using Events</h3>

<p>We use attribute change events, to listen for changes in the <code>width, height and content</code> attributes, and update the respective areas of the rendered DOM for the box:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    Box.prototype._createNode = function() {
        this._node = Y.Node.create('<div class="yui-box"></div>');
        Y.Node.get("#example-container").appendChild(this._node);

        this.after("widthChange", function() {
            this._node.setStyle("width", this.get("width"));
        });

        this.after("heightChange", function() {
            this._node.setStyle("height", this.get("height"));
        });

        this.after("contentChange", function() {
            this._node.set("innerHTML", this.get("content"));
        });
    };
</textarea>
