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
