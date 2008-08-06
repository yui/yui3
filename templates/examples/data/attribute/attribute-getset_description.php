<h3>Get, Set And Validator Functions</h3>

<p>Attribute lets you configure <code>get</code> and <code>set</code> functions for each attribute. These functions are invoked when the user calls Attribute's <code>get</code> and <code>set</code> methods, and provide a way to modify the value returned or the value stored respectively.</p>

<p>You can also define a validator function for each attribute, which is used to validate the final value before it gets stored.</p>

<h4>Creating The Box Class - The X, Y And XY Attributes</h4>

<p>In this example, we'll set up a custom <code>Box</code> class representing a positionable element, with <code>x</code>, <code>y</code> and <code>xy</code> attributes.</p>

<p>Only the <code>xy</code> attribute will actually store the page co-ordinate position of the box. The <code>x</code> and <code>y</code> attributes provide the user a convenient way to set only one of the co-ordinates. However we don't want to store the actual values in the <code>x</code> and <code>y</code> attributes, to avoid having to constantly sync state between all three. The <code>get</code> and <code>set</code> functions provide us with an easy way to achieve this. We'll define <code>get</code> and <code>set</code> functions for both the <code>x</code> and <code>y</code> attributes, which simply pass through to the <code>xy</code> attribute to retrieve and store values:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
// Setup a custom Box class
function Box(cfg) {
    ...
    this._initAtts(Box.ATTRIBUTES, cfg);
}

// Setup Box's attribute configuration
Box.ATTRIBUTES = {

    ...

    "x" : {
        set: function(val) {
            // Pass through x value to xy
            this.set("xy", [parseInt(val), this.get("y")]);
        },

        get: function() {
            // Get x value from xy
            return this.get("xy")[0];
        }
    },

    "y" : {
        set: function(val) {
            // Pass through y value to xy
            this.set("xy", [this.get("x"), parseInt(val)]);
        },

        get: function() {
            // Get x value from xy
            return this.get("xy")[1];
        }
    },

    "xy" : {

        // Actual stored xy co-ordinates
        value: [0, 0],

        set: function(val) {
            // Constrain XY value to the parent element.

            // Returns the constrained xy value, which will
            // be the final value stored.
            return this.constrain(val);
        },

        validator: function(val) {
            // Ensure we're storing a valid data value
            return (L.isArray(val) && val.length == 2 && L.isNumber(val[0]) && L.isNumber(val[1]));
        }
    },

    ...
}
</textarea>

<p>The <code>validator</code> function for <code>xy</code> ensures that only valid values finally end up being stored.</p>

<p>The <code>xy</code> attribute also has a <code>set</code> function configured, which makes sure that the box is always constrained to it's parent element. The <code>constrain</code> function which it delegates to, takes the xy value the user it trying to set and returns a modified, constrained value if required. The value which is returned by the <code>set</code> handler is the value which is ultimately stored for the <code>xy</code> attribute:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    Box.prototype.constrain = function(val) {

        var parentRegion = this.get("parent").get("region");
        var BUFFER = Box.BUFFER;

        // If the X value places the box outside it's parent,
        // modify it's value to place the box inside it's parent.

        if (val[0] < parentRegion.left + BUFFER) {
            val[0] = parentRegion.left + BUFFER;
        } else {
            if (val[0] + this._node.get("offsetWidth") > parentRegion.right - BUFFER) {
                val[0] = parentRegion.right - this._node.get("offsetWidth") - BUFFER;
            }
        }

        // If the Y value places the box outside it's parent,
        // modify it's value to place the box inside it's parent.

        if (val[1] < parentRegion.top + BUFFER) {
            val[1] = parentRegion.top + BUFFER;
        } else {
            if (val[1] + this._node.get("offsetHeight") > parentRegion.bottom - BUFFER) {
                val[1] = parentRegion.bottom - this._node.get("offsetHeight") - BUFFER;
            }
        }

        return val;
    };
</textarea>

<h4>The Color Attribute - Normalizing Stored Values Through Get</h4>

<p>The <code>Box</code> class also has a <code>color</code> attribute which also has a <code>get</code> handler and a <code>validator</code> defined:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    ...
    "color" : {
        value: "olive",

        get: function(val) {
            if (val) {
                return Y.Color.toHex(val);
            } else {
                return null;
            }
        },

        validator: function(val) {
            return (Y.Color.re_RGB.test(val) || Y.Color.re_hex.test(val) || Y.Color.KEYWORDS[val]);
        }
    }
    ...
</textarea>

<p>The role of the <code>get</code> handler in this case is to normalize the actual stored value of the <code>color</code> attribute, so that users always receive the hex value, regardless of the actual value stored, which maybe a color keyword (e.g. <code>"red"</code>), an rgb value (e.g.<code>rbg(255,0,0)</code>), or a hex value (<code>#ff0000</code>). The <code>validator</code> ensures the the stored value is one of these three formats.</p>

<h4>Syncing Changes Using Events</h4>

<p>Another interesting aspect of this example, is it's use of attribute change events to listen for changes to the attribute values. <code>Box</code>'s <code>_bind</code> method configures a set of attribute change event listeners which monitor changes to the <code>xy</code>, <code>color</code> and <code>parent</code> attributes and update the rendered DOM for the Box in response:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    Box.prototype._bind = function() {

        // Reflect any changes in xy, to the rendered Node
        this.after("xyChange", function() {
            this._node.setXY(this.get("xy"));
        });

        // Reflect any changes in color, to the rendered Node
        // and output the color value received from get
        this.after("colorChange", function(event) {
            this._node.setStyle("backgroundColor", this.get("color"));
            this._node.query("span.color").set("innerHTML", this.get("color"));
        });

        // Append the rendered node to the parent provided
        this.after("parentChange", function(event) {
            var p = event.newVal;
            p.appendChild(this._node);
        });

    }
</textarea>

<p>Since only <code>xy</code> stores the final co-ordinates, we don't need to monitor the <code>x</code> and <code>y</code> attributes individually for changes.</p>
