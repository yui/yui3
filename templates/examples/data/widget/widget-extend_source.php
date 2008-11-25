<div id="widget-extend-example">
    Enter a number : <div id="numberField"><input type="text" class="yui-spinner-value" value="20" /></div>
</div>

<script type="text/javascript">
YUI(<?php echo getYUIConfig("filter:'raw'") ?>).use(<?php echo $requiredModules ?>, function(Y) {

    var Lang = Y.Lang,
        Widget = Y.Widget,
        Node = Y.Node;

    function Spinner(config) {
        Spinner.superclass.constructor.apply(this, arguments);
    }

    Spinner.NAME = "spinner";

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
                tooltip: "Press the arrow up/down keys for minor increments, page up/down for major increments.",
                increment: "Increment",
                decrement: "Decrement"
            }
        }
    };

    Spinner.INPUT_CLASS = Y.ClassNameManager.getClassName(Spinner.NAME, "value");

    Spinner.INPUT_TEMPLATE = '<input type="text" class="' + Spinner.INPUT_CLASS + '">';
    Spinner.BTN_TEMPLATE = '<button type="button"></button>';

    Spinner.HTML_PARSER = {
        value: function (contentBox) {
            var node = contentBox.query("." + Spinner.INPUT_CLASS);
            return (node) ? parseInt(node.get("value")) : null;
        }
    };

    Y.extend(Spinner, Widget, {

        initializer: function() {
            // Not doing anything special during initialization
        },

        destructor : function() {
            // Widget's descructor will purge the boundingBox, 
            // but if we wanted to we could implement additional 
            // cleanup code here. e.g.:
            this.inputNode = null;
            this.incrementNode = null;
            this.decrementNode = null;
        },

        renderUI : function() {
            this._renderInput();
            this._renderButtons();
        },
        
        bindUI : function() {
            this.after("valueChange", this._onValueChange);

            var boundingBox = this.get("boundingBox");

            // Looking for a key event which will fire continously across browsers while the key is held down
            // 38, 40 = arrow up/down, 33, 34 = page up/down
            var keyEventSpec = (!Y.UA.opera) ? "down:" : "press:";
            keyEventSpec += "38, 40, 33, 34";

            Y.on("key", Y.bind(this._delegateDirectionKeys, this), boundingBox, keyEventSpec);
            Y.on("mousedown", Y.bind(this._delegateMouseDown, this), boundingBox);
            Y.on("mouseup", Y.bind(this._delegateMouseUp, this), boundingBox.get("ownerDocument"));
        },

        syncUI : function() {
            this._uiSetValue(this.get("value"));
        },

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

        _renderButtons : function() {
            var contentBox = this.get("contentBox"),
                strings = this.get("strings");

            var inc = this._createButton(strings.increment, this.getClassName("increment"));
            var dec = this._createButton(strings.decrement, this.getClassName("decrement"));

            this.incrementNode = contentBox.appendChild(inc);
            this.decrementNode = contentBox.appendChild(dec);
        },

        _createButton : function(text, className) {

            var btn = Y.Node.create(Spinner.BTN_TEMPLATE);
            btn.set("innerHTML", text);
            btn.set("title", text);
            btn.addClass(className);

            return btn;
        },

        _delegateMouseDown : function(e) {
            var node = e.target,
                dir,
                handled = false,
                currVal = this.get("value"),
                minorInc = this.get("minorInc");

            if (node.hasClass(this.getClassName("increment"))) {
                this.set("value", currVal + minorInc);
                dir = 1;
                handled = true;
            } else if (node.hasClass(this.getClassName("decrement"))) {
                this.set("value", currVal - minorInc);
                dir = -1;
                handled = true;
            }

            if (handled) {
                this._mouseDownTimer = Y.later(500, this, function() {
                    this._mousePressTimer = Y.later(100, this, function() {
                        this.set("value", this.get("value") + (dir * minorInc));
                    }, null, true)
                });
            }
        },

        _delegateMouseUp : function(e) {
            if (this._mouseDownTimer) {
                this._mouseDownTimer.cancel();
                this._mouseDownTimer = null;
            }
            if (this._mousePressTimer) {
                this._mousePressTimer.cancel();
                this._mousePressTimer = null;
            }
        },

        _delegateDirectionKeys : function(e) {
            var node = e.target;

            e.preventDefault();

            var currVal = this.get("value"),
                newVal = currVal,
                minorInc = this.get("minorInc"),
                majorInc = this.get("majorInc");

            switch (e.charCode) {
                case 38:
                    newVal += minorInc;
                    break;
                case 40:
                    newVal -= minorInc;
                    break;
                case 33:
                    newVal += majorInc;
                    newVal = Math.min(newVal, this.get("max"));
                    break;
                case 34:
                    newVal -= majorInc;
                    newVal = Math.max(newVal, this.get("min"));
                    break;
            }

            if (newVal !== currVal) {
                this.set("value", newVal);
            }
        },

        _onValueChange : function(e) {
            this._uiSetValue(e.newVal);
        },

        _uiSetValue : function(val) {
            this.inputNode.set("value", val);
        },

        _validateValue: function(val) {
            var min = this.get("min"),
                max = this.get("max");

            return (Lang.isNumber(val) && val >= min && val <= max);
        }
    });

    spinner = new Spinner({
        contentBox: "#numberField",
        max:100,
        min:0
    });
    spinner.render();
    spinner.focus();
});
</script>
