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
            <span id="xhint" class="hint"></span>
        </p>
        <p>
            <label for="y">y:</label>
            <input type="text" name="y" id="y" />
            <button type="button" id="setY">Set</button>
            <span id="yhint" class="hint"></span>
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

    Box.BUFFER = 5;

    // Create the box node
    Box.prototype._createNode = function() {
        this._node = Y.Node.create('<div class="yui-box"><p>Positioned Box</p><p class="color"></p></div>');
        this._bind();

    };

    // Bind listeners for attribute change events
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

    // Get min, max unconstrained values for X
    Box.prototype.getXConstraints = function() {
        var parentRegion = this.get("parent").get("region");
        return [parentRegion.left + Box.BUFFER, parentRegion.right - this._node.get("offsetWidth") - Box.BUFFER];
    };

    // Get min, max unconstrained values for Y
    Box.prototype.getYConstraints = function() {
        var parentRegion = this.get("parent").get("region");
        return [parentRegion.top + Box.BUFFER, parentRegion.bottom - this._node.get("offsetHeight") - Box.BUFFER];
    };

    // Constrain the x,y value provided
    Box.prototype.constrain = function(val) {

        // If the X value places the box outside it's parent,
        // modify it's value to place the box inside it's parent.

        var xConstraints = this.getXConstraints();

        if (val[0] < xConstraints[0]) {
            val[0] = xConstraints[0];
        } else {
            if (val[0] > xConstraints[1]) {
                val[0] = xConstraints[1];
            }
        }

        // If the Y value places the box outside it's parent,
        // modify it's value to place the box inside it's parent.

        var yConstraints = this.getYConstraints();

        if (val[1] < yConstraints[0]) {
            val[1] = yConstraints[0];
        } else {
            if (val[1] > yConstraints[1]) {
                val[1] = yConstraints[1];
            }
        }

        return val;
    };

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

                // Returns the constrained xy value, which will
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
    var box = new Box({
        parent : boxParent 
    });

    // Set references to form controls
    var xTxt = Y.Node.get("#x");
    var yTxt = Y.Node.get("#y");
    var colorTxt = Y.Node.get("#color");

    var xHint = Y.Node.get("#xhint");
    var yHint = Y.Node.get("#yhint");

    function getAll() {
        xTxt.set("value", box.get("x"));
        yTxt.set("value", box.get("y"));
        colorTxt.set("value", box.get("color"));
    }

    // Bind DOM events for Form Controls

    // Use Event Delegation for the button clicks
    Y.on("click", function(e) {

        // Get Node target from the event object
        var targetId = e.target && e.target.get("id");

        switch (targetId) {
            case "setXY":
                box.set("xy", [parseInt(xTxt.get("value")), parseInt(yTxt.get("value"))]);
                break;
            case "setX":
                box.set("x", parseInt(xTxt.get("value")));
                break;
            case "setY":
                box.set("y", parseInt(yTxt.get("value")));
                break;
            case "setColor":
                box.set("color", L.trim(colorTxt.get("value")));
                break;
            case "setAll":
                box.set("xy", [parseInt(xTxt.get("value")), parseInt(yTxt.get("value"))]);
                box.set("color", L.trim(colorTxt.get("value")));
                break;
            case "getAll":
                getAll();
                break;
            default:
                break;
        }

    }, "#attrs");

    // Bind listeners to provide min, max unconstrained value hints for x, y
    // (focus/blur doesn't bubble, so bind individual listeners)
    Y.on("focus", function() {
        var minmax = box.getXConstraints();
        xHint.set("innerHTML", "[" + minmax[0] + ", " + minmax[1] + "]");
    }, xTxt);

    Y.on("focus", function() {
        var minmax = box.getYConstraints();
        yHint.set("innerHTML", "[" + minmax[0] + ", " + minmax[1] + "]");
    }, yTxt);

    Y.on("blur", function() {
        xHint.set("innerHTML", "");
    }, xTxt);

    Y.on("blur", function() {
        yHint.set("innerHTML", "");
    }, yTxt);

    getAll();
});
</script>
