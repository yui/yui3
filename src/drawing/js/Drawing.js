/**
 * Drawing API utilizing the HTML5 Canvas Element.
 *
 * @extends Base
 * @class Drawing
 * @module Drawing
 */
Drawing = Base.create("drawing", Base, [], {
    initializer: function()
    {
        var parentNode = this.get("parentNode"),
            canvas = this.get("canvas");
        if(parentNode)
        {
            canvas.render(parentNode);
        }
    }
}, {
    ATTRS: {
        /**
         * Reference to the Canvas instance
         *
         * @attr canvas
         * @type Object
         * @readOnly
         */
        canvas: {
            readOnly: true,

            valueFn: function()
            {
                return new Y.Canvas();
            }
        },

        /**
         * 2d context for the canvas.
         *
         * @attr context2d
         * @type Object
         * @readOnly
         */
        context2d: {
            getter: function() 
            {
                var context,
                    canvas = this.get("canvas");
                if(canvas)
                {
                    context = canvas.getContext("2d");
                }
                return context;
            }
        },

        /**
         * Width for the canvas.
         *
         * @attr width
         * @type Number
         */
        width: {
            setter: function(val) 
            {
                var canvas = this.get("canvas");
                if(canvas)
                {
                    canvas.set("width", val);
                }
                return val;
            }
        },
        
        /**
         * Height for the canvas.
         *
         * @attr height
         * @type Number
         */
        height: {
            setter: function(val) 
            {
                var canvas = this.get("canvas");
                if(canvas)
                {
                    canvas.set("height", val);
                }
                return val;
            }
        },

        /**
         * Reference to the parent node of the canvas.
         *
         * @attr parentNode
         * @type Node
         */
        parentNode: {
            setter: function(val)
            {
                var canvas = this.get("canvas");
                val = Y.one(val);
                if(canvas)
                {
                    canvas.render(val);
                }
                return val;
            }
        }
    }
});
Y.Drawing = Drawing;
