<div class="attrs">
    <div class="header">Enter new values and click the "Change" button:</div>
    <div class="body">
        <label for"w">Width (defaults to ems if no unit):</label>
        <input type="text" name="w" id="w" />
        <label for"h">Height (defaults to ems if no unit):</label>
        <input type="text" name="h" id="h" />
        <label for"txt">Content:</label>
        <input type="text" name="txt" id="txt" />
    </div>
    <div class="footer">
        <button type="button" id="change">Change</button>
        <button type="button" id="showdims">Show Area</button>
    </div>
</div>

<div id="example-container"></div>

<script type="text/javascript">
(function() {

    // Get a new YUI instance 
    var Y = YUI().use("attribute");

    // Shortcut for Y.Lang;
    var L = Y.Lang;

    // Setup a custom class with attribute support
    function Box(cfg) {
        this._createNode();
        this._initAtts(Box.ATTRIBUTES, cfg);
    }

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
        },

        "area" : {
            get: function() {
                if (this._node) {
                    return this._node.get("offsetWidth") * this._node.get("offsetHeight") + "sq. pixels";
                } else {
                    return 0;
                }
            }
        },

        "content" : {
           value:"Box Content",

           set: function(val) {
               return val.toUpperCase();
           },

           validator: function(val) {
               return L.isString(val);
           }
        }
    };

    Y.augment(Box, Y.Attribute);

    Y.Event.onDOMReady(function() { 

        var b = new Box();

        var w = Y.Node.get("#w");
        var h = Y.Node.get("#h");
        var txt = Y.Node.get("#txt");

        w.set("value", b.get("width"));
        h.set("value", b.get("height"));
        txt.set("value", b.get("content"));

        Y.on("click", function() {
            b.set("width", w.get("value"));
            b.set("height", h.get("value"));
            b.set("content", txt.get("value"));
        }, "#change");

        Y.on("click", function() {
            b.set("content", b.get("area"));
        }, "#showdims");
    });
})();
</script>
