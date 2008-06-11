/**
 * @extension Y.widget.Position
 *
 * @requires-events
 * @requires-attrs widget, root
 * @requires-methods syncUI, bindUI
 */

YUI.add("widget-position", function(Y) {

        var Lang = Y.Lang,

            POSITION = "position",
            X_COORD = "x",
            Y_COORD = "y",
            XY_COORD = "xy",

            ROOT = "root",
            RENDERUI = "renderUI",
            BINDUI = "bindUI",
            SYNCUI = "syncUI",

            PositionEvent = "positionChange",
            XY = "xyChange";

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

        Position.CLASSNAMES = {
            positioned: "yui-positioned"
        };

        var CLASSNAMES = Position.CLASSNAMES;

        Position.prototype = {

            initPosition: function(config) {
                this._posEl = this.get(ROOT);

                // WIDGET METHOD OVERLAP
                Y.after(this._positionRenderUI, this, RENDERUI);
                Y.after(this._positionSyncUI, this, SYNCUI);
                Y.after(this._positionBindUI, this, BINDUI);
            },

            _positionRenderUI : function() {
                this._posEl.addClass(CLASSNAMES.positioned);
            },

            _positionSyncUI : function() {
                this._uiSetPosition();
                this._uiSetXY();
            },

            _positionBindUI :function() {
                this.onUI(PositionEvent, Y.bind(this._uiSetPosition, this));
                this.onUI(XY, Y.bind(this._uiSetXY, this));
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
                var rArgs = arguments,
                    nArgs = (Lang.isArray(rArgs[0])) ? rArgs[0] : [rArgs[0], rArgs[1]];
                    this.set(XY_COORD, nArgs);
            },

            /**
             * Synchronizes the Panel's "xy", "x", and "y" properties with the 
             * Widget's position in the DOM.
             * 
             * @method syncXY
             */
            syncXY : function () {
                this.setUI(XY_COORD, this._posEl.getXY());
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

            _getY : function(val) {
                return this.get(XY_COORD)[1];
            },

            _uiSetPosition : function() {
                this._posEl.setStyle(POSITION, this.get(POSITION));
            },

            _uiSetXY : function() {
                this._posEl.setXY(this.get(XY_COORD));
            }
        };

        Y.WidgetPosition = Position;

        /* TODO: If Plugin */
        /*
          Y.extend(Position, Y.Base, proto);
        */

}, "3.0.0");
