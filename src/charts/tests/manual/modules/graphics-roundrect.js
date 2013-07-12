YUI.add('graphics-roundrect', function (Y, NAME) {
        /**
         * Allows for the creation of Rectangle with rounded corners.
         *
         * @constructor
         * @param {Object} config An object literal containing properties used for the shape.
         * @module graphics-roundrect
         */
        Y.RoundRect = function()
        {
            Y.RoundRect.superclass.constructor.apply(this, arguments);
        };
        Y.RoundRect.NAME = "roundedRect";
        Y.extend(Y.RoundRect, Y.Shape, {
            /**
             * Draws the shape.
             *
             * @method _draw
             * @private
             */
            _draw: function()
            {
                var w = this.get("width"),
                    h = this.get("height"),
                    ew = this.get("ellipseWidth"),
                    eh = this.get("ellipseHeight");
                this.clear();
                if(w > (ew + ew) && h > (eh + eh))
                {
                    this.drawRoundRect(0, 0, w, h, ew, eh); 
                }
                else
                {
                    this.drawEllipse(0, 0, w, h);
                }
                this.end();
            }
        }, {
            ATTRS: Y.mix({
                /**
                 * Indicates the width of the ellipse on the corners.
                 *
                 * @config ellipseWidth
                 * @type Number
                 */
                ellipseWidth: {
                    value: 4
                },

                /**
                 * Indicates the height of the ellipse on the corners.
                 *
                 * @config ellipseHeight
                 * @type Number
                 */
                ellipseHeight: {
                    value: 4
                }
            }, Y.Shape.ATTRS)
        }); 

}, '@VERSION@', {"requires": ["graphics"]});
