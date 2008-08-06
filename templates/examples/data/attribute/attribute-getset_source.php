<div id="attrs" class="attrs">
    <div class="header">Enter new values and click the "Change" button:</div>
    <div class="body">
        <p>
            <label for="x">X:</label>
            <input type="text" name="x" id="x" />
            <button type="button" id="changeX">Change</button>
        </p>
        <p>
            <label for="y">Y:</label>
            <input type="text" name="y" id="y" />
            <button type="button" id="changeY">Change</button>
        </p>
        <p>
            <label for="color">Color:</label>
            <input type="text" name="color" id="color" />
            <button type="button" id="changeColor">Change</button>
        </p>
    </div>
    <div class="footer">
        <button type="button" id="changeXY">Change XY</button>
        <button type="button" id="changeAll">Change All</button>
        <button type="button" id="getAll">Get All</button>
    </div>
</div>

<div id="example-container"></div>

<script type="text/javascript">
// Get a new YUI instance 
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>, function(Y) {

    // Shortcut for Y.Lang;
    var L = Y.Lang;

    var exampleBox = Y.Node.get("#example-container");

    // Setup a custom class with attribute support
    function Box(cfg) {
        this._createNode(cfg);
        this._initAtts(Box.ATTRIBUTES, cfg);
    }

    Box.prototype._createNode = function() {
        this._node = Y.Node.create('<div class="yui-box">Positioned Box (<span class="color"></span>)</div>');
        this._bind();

    };

    Box.prototype._bind = function() {

        this.after("xyChange", function() {
            this._node.setXY(this.get("xy"));
        });

        this.after("parentChange", function(event) {
            var p = event.newVal;
            p.appendChild(this._node);
        });

        this.after("colorChange", function(event) {
            this._node.setStyle("backgroundColor", this.get("color"));
            this._node.query("span.color").set("innerHTML", this.get("color"));
        });
    }

    Box.prototype.constrain = function(val) {

        var parentRegion = this.get("parent").get("region");
        var BUFFER = Box.BUFFER;

        if (val[0] < parentRegion.left + BUFFER) {
            val[0] = parentRegion.left + BUFFER;
        } else {
            if (val[0] + this._node.get("offsetWidth") > parentRegion.right - BUFFER) {
                val[0] = parentRegion.right - this._node.get("offsetWidth") - BUFFER;
            }
        }

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
                this.set("xy", [parseInt(val), this.get("y")]);
            },

            get: function() {
                return this.get("xy")[0];
            }
        },

        "y" : {
            set: function(val) {
                this.set("xy", [this.get("x"), parseInt(val)]);
            },

            get: function() {
                return this.get("xy")[1];
            }
        },

        "xy" : {
            value: [0, 0],

            set: function(val) {
                return this.constrain(val);
            },

            validator: function(val) {
                return (L.isArray(val) && val.length == 2 && L.isNumber(val[0]) && L.isNumber(val[1]));
            }
        },

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
    };

    Y.augment(Box, Y.Attribute);

    var b = new Box({
        id : "b1",
        parent : exampleBox
    });

    var x = Y.Node.get("#x");
    var y = Y.Node.get("#y");
    var color = Y.Node.get("#color");

    function getAll() {
        x.set("value", b.get("x"));
        y.set("value", b.get("y"));
        color.set("value", b.get("color"));
    }

    Y.on("click", function() {
        b.set("xy", [x.get("value"), y.get("value")]);
    }, "#changeXY");

    Y.on("click", function() {
        b.set("x", x.get("value"));
    }, "#changeX");
    
    Y.on("click", function() {
        b.set("y", y.get("value"));
    }, "#changeY");
    
    Y.on("click", function() {
        b.set("color", L.trim(color.get("value")));
    }, "#changeColor");
 
    Y.on("click", function() {
        b.set("xy", [x.get("value"), y.get("value")]);
        b.set("color", L.trim(color.get("value")));
    }, "#changeAll");
 
    Y.on("click", function() {
        getAll();
    }, "#getAll");

    getAll();
});
</script>
