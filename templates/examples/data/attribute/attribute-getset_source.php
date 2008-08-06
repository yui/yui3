<div id="attrs" class="attrs">
    <div class="header">Enter new values and click the "Set" buttons</div>
    <div class="body">
        <ul class="hints">
            <li>Try entering both valid and invalid values for x, y; or values which would place the box outside it's parent.</li>
            <li>Try entering rgb (<em>e.g. rgb(255,0,0)</em>), hex (<em>e.g. #ff0000</em>) or keyword (<em>e.g. red</em>) color values.</li>
        </ul>
        <p>
            <label for="x">x:</label>
            <input type="text" name="x" id="x" />
            <button type="button" id="setX">Set</button>
        </p>
        <p>
            <label for="y">y:</label>
            <input type="text" name="y" id="y" />
            <button type="button" id="setY">Set</button>
        </p>
        <p>
            <label for="color">color:</label>
            <input type="text" name="color" id="color" />
            <button type="button" id="setColor">Set</button>
        </p>
    </div>
    <div class="footer">
        <button type="button" id="setXY">Set XY</button>
        <button type="button" id="setAll">Set All</button>
        <button type="button" id="getAll">Get All</button>
    </div>
</div>

<div id="boxParent"></div>

<script type="text/javascript">
// Get a new YUI instance 
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>, function(Y) {

    // Shortcut for Y.Lang;
    var L = Y.Lang;

    var boxParent = Y.Node.get("#boxParent");

    // Setup a custom class with attribute support
    function Box(cfg) {
        this._createNode(cfg);
        this._initAtts(Box.ATTRIBUTES, cfg);
    }

    Box.prototype._createNode = function() {
        this._node = Y.Node.create('<div class="yui-box"><p>Positioned Box</p><p class="color"></p></div>');
        this._bind();

    };

    Box.prototype._bind = function() {

        // Reflect any changes in xy, to the rendered Node
        this.after("xyChange", function() {
            this._node.setXY(this.get("xy"));
        });

        // Reflect any changes in color, to the rendered Node
        // and output the color value received from get
        this.after("colorChange", function(event) {
            this._node.setStyle("backgroundColor", this.get("color"));
            this._node.query("p.color").set("innerHTML", "(" + this.get("color") + ")");
        });

        // Append the rendered node to the parent provided
        this.after("parentChange", function(event) {
            var p = event.newVal;
            p.appendChild(this._node);
        });

    };

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

    Box.BUFFER = 5;

    // Setup attribute configuration
    Box.ATTRIBUTES = {

        "parent" : {
            value: null
        },

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
                // Get y value from xy
                return this.get("xy")[1];
            }
        },

        "xy" : {
            // Actual stored xy co-ordinates
            value: [0, 0],

            set: function(val) {
                // Constrain XY value to the parent element.
                // Return the constrain xy value, which will
                // be the final value stored.
                return this.constrain(val);
            },

            validator: function(val) {
                // Ensure we only store a valid data value
                return (L.isArray(val) && val.length == 2 && L.isNumber(val[0]) && L.isNumber(val[1]));
            }
        },

        "color" : {
            value: "olive",

            get: function(val) {
                // Always normalize the returned value to 
                // a hex color value,  even if the stored 
                // value is a keyword, or an rgb value.
                if (val) {
                    return Y.Color.toHex(val);
                } else {
                    return null;
                }
            },

            validator: function(val) {
                // Ensure we only store rgb, hex or keyword values.
                return (Y.Color.re_RGB.test(val) || Y.Color.re_hex.test(val) || Y.Color.KEYWORDS[val]); 
            }
        }
    };

    Y.augment(Box, Y.Attribute);

    // ------

    // Create a new instance of Box
    var b = new Box({
        parent : boxParent 
    });

    // Set and bind form controls
    var x = Y.Node.get("#x");
    var y = Y.Node.get("#y");
    var color = Y.Node.get("#color");

    function getAll() {
        x.set("value", b.get("x"));
        y.set("value", b.get("y"));
        color.set("value", b.get("color"));
    }

    Y.on("click", function() {
        b.set("xy", [parseInt(x.get("value")), parseInt(y.get("value"))]);
    }, "#setXY");

    Y.on("click", function() {
        b.set("x", parseInt(x.get("value")));
    }, "#setX");
    
    Y.on("click", function() {
        b.set("y", parseInt(y.get("value")));
    }, "#setY");
    
    Y.on("click", function() {
        b.set("color", L.trim(color.get("value")));
    }, "#setColor");
 
    Y.on("click", function() {
        b.set("xy", [parseInt(x.get("value")), parseInt(y.get("value"))]);
        b.set("color", L.trim(color.get("value")));
    }, "#setAll");
 
    Y.on("click", function() {
        getAll();
    }, "#getAll");

    getAll();
});
</script>
