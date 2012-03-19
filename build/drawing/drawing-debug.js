YUI.add('drawing', function(Y) {

/**
 * Wrapper for a canvas' context2d object.
 *
 * @class Context2d
 */
function Context2d(canvas)
{
    this._context = canvas.getContext("2d");
}

Context2d.prototype = {
    save: function()
    {
        return this._context.save.apply(this._context, arguments);
    },

    restore: function()
    {
        return this._context.restore.apply(this._context, arguments);
    },

    scale: function()
    {
        return this._context.scalee.apply(this._context, arguments);
    },

    rotate: function()
    {
        return this._context.rotate.apply(this._context, arguments);
    },

    translate: function()
    {
        return this._context.translate.apply(this._context, arguments);
    },

    transform: function()
    {
        return this._context.transform.apply(this._context, arguments);
    },

    setTransform: function()
    {
        return this._context.setTransform.apply(this._context, arguments);
    },

    createLinearGradient: function()
    {
        return this._context.createLinearGradient.apply(this._context, arguments);
    },

    createRadialGradient: function()
    {
        return this._context.createRadialGradient.apply(this._context, arguments);
    },

    createPattern: function()
    {
        return this._context.createPattern.apply(this._context, arguments);
    },

    clearRect: function()
    {
        return this._context.clearRect.apply(this._context, arguments);
    },

    fillRect: function()
    {
        return this._context.fillRect.apply(this._context, arguments);
    },

    strokeRect: function()
    {
        return this._context.strokeRect.apply(this._context, arguments);
    },

    beginPath: function()
    {
        return this._context.beginPath.apply(this._context, arguments);
    },

    closePath: function()
    {
        return this._context.closePath.apply(this._context, arguments);
    },

    moveTo: function()
    {
        return this._context.moveTo.apply(this._context, arguments);
    },

    lineTo: function()
    {
        return this._context.lineTo.apply(this._context, arguments);
    },

    quadraticCurveTo: function()
    {
        return this._context.quadraticCurveTo.apply(this._context, arguments);
    },

    bezierCurveTo: function()
    {
        return this._context.bezierCurveTo.apply(this._context, arguments);
    },

    arcTo: function()
    {
        return this._context.arcTo.apply(this._context, arguments);
    },

    arc: function()
    {
        return this._context.arc.apply(this._context, arguments);
    },

    rect: function()
    {
        return this._context.rect.apply(this._context, arguments);
    },

    fill: function()
    {
        return this._context.fill.apply(this._context, arguments);
    },

    stroke: function()
    {
        return this._context.stroke.apply(this._context, arguments);
    },

    clip: function()
    {
        return this._context.clip.apply(this._context, arguments);
    },

    fillText: function()
    {
        return this._context.fillText.apply(this._context, arguments);
    },

    strokeText: function()
    {
        return this._context.strokeText.apply(this._context, arguments);
    },

    measureText: function()
    {
        return this._context.measureText.apply(this._context, arguments);
    },

    drawImage: function()
    {
        return this._context.drawImage.apply(this._context, arguments);
    },

    isPointInPath: function()
    {
        return this._context.isPointInPath.apply(this._context, arguments);
    },

    getImageData: function()
    {
        return this._context.getImageData.apply(this._context, arguments);
    },

    putImageData: function()
    {
        return this._context.putImageData.apply(this._context, arguments);
    },

    createImageData: function()
    {
        return this._context.createImageData.apply(this._context, arguments);
    },

    drawWindow: function()
    {
        return this._context.drawWindow.apply(this._context, arguments);
    },

    asyncDrawXULElement: function()
    {
        return this._context.asyncDrawXULElement.apply(this._context, arguments);
    },
    
    set: function(prop, val)
    {
        this._context[prop] = val;
    },

    get: function(prop)
    {
        return this._context[prop];
    }
};
Y.Context2d = Context2d;
/**
 * Normalizes HTML5 Canvas across all browsers.
 *
 * @module drawing
 */

/**
 * Wrapper for the Canvas Object
 *
 * @class Canvas
 */

var DOCUMENT = Y.config.doc,
    Base = Y.Base,
    Canvas,
    Drawing;

Canvas = function()
{
    this._initialize();
};

Canvas.prototype = {
    /**
     * Initializes the canvas object.
     *
     * @method initialize
     * @protected
     */
    _initialize: function()
    {
        this._node = DOCUMENT.createElement("canvas");
        this._context = new Y.Context2d(this._node);
    },
  
    /**
     * Returns the context for the canvas.
     *
     * @method getContext
     * @return Object
     */
    getContext: function()
    {
        return this._context;
    },

    /**
     * Adds the canvas object to its parent node.
     *
     * @method render
     * @param {Node|String|HTML} node
     */
    render: function(node)
    {
        Y.one(node).appendChild(this._node);
    },

    /**
     * Sets a property on the canvas object.
     *
     * @method set
     * @param {String} prop Value to change on the canvas. 
     * @param {String} val Value to set on the canvas.
     */
    set: function(prop, val)
    {
        this._canvas.setAttribute(prop, val);
    }
};
Y.Canvas = Canvas;
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


}, '@VERSION@' ,{requires:['node','base']});
