
YUI.add("widget-position", function(Y) {

        var Lang = Y.Lang,

            POSITION = "position",
            X_COORD = "x",
            Y_COORD = "y",
            XY_COORD = "xy",

            POSITIONED = "positioned",
            BOUNDING_BOX = "boundingBox",
            RENDERUI = "renderUI",
            BINDUI = "bindUI",
            SYNCUI = "syncUI",

            PositionEvent = "positionChange",
            XYEvent = "xyChange";

        function Position(config) {
            /* TODO: If Plugin */
            // Position.constructor.superclass.apply(this, arguments);
        }

        Position.ATTRS = {
            x: {
                set: function(val) {
                    this._setX(val);
                },
                get: function() {
                    return this._getX();
                }
            },

            y: {
                set: function(val) {
                    this._setY(val);
                },
                get: function() {
                    return this._getY();
                }
            },

            xy: {
                value:[0,0],
                validator: function(val) {
                    return this._validateXY(val);
                }
            },

            position: {
                value:"absolute"
            }
        };

        Position.prototype = {

            _initPosition: function(config) {

                this._posEl = this.get(BOUNDING_BOX);

                // WIDGET METHOD OVERLAP
                Y.after(this._positionRenderUI, this, RENDERUI);
                Y.after(this._positionSyncUI, this, SYNCUI);
                Y.after(this._positionBindUI, this, BINDUI);
            },

            _positionRenderUI : function() {
                this._posEl.addClass(this.getClassName(POSITIONED));
            },

            _positionSyncUI : function() {
                this._uiSetPosition(this.get(POSITION));
                this._uiSetXY(this.get(XY_COORD));
            },

            _positionBindUI :function() {
                this.after("positionChange", this._uiSetPosition);
                this.after("xyChange", this._uiSetXY);
            },

            /**
             * Moves the Overlay to the specified position page x, y co-ordinate position.
             *
             * @method move
             *
             * @param {Number} x The new x position
             * @param {Number} y The new y position
             * <p>Or</p>
             * @param {Array} x, y values passed as an array (x = index 0, y = index 1), to support
             * simple pass through of Y.Node.getXY_COORD results
             */
            move: function () {
                var args = arguments,
                    coord = (Lang.isArray(args[0])) ? args[0] : [args[0], args[1]];
                    this.set(XY_COORD, coord);
            },

            /**
             * Synchronizes the Panel's "xy", "x", and "y" properties with the 
             * Widget's position in the DOM.
             *
             * @method syncXY
             */
            syncXY : function () {
                this.set(XY_COORD, this._posEl.getXY(), {src: UI});
            },

            _validateXY : function(val) {
                return (Lang.isArray(val) && Lang.isNumber(val[0]) && Lang.isNumber(val[1]));
            },

            _setX : function(val) {
                this.set(XY_COORD, [val, this.get(XY_COORD)[0]]);
            },

            _setY : function(val) {
                this.set(XY_COORD, [this.get(XY_COORD)[1], val]);
            },

            _getX : function() {
                return this.get(XY_COORD)[0];
            },

            _getY : function() {
                return this.get(XY_COORD)[1];
            },

            _uiSetPosition : function(val) {
                this._posEl.setStyle(POSITION, val);
            },

            _uiSetXY : function(val) {
                this._posEl.setXY(val);
            }
        };

        Y.WidgetPosition = Position;

}, "3.0.0");
