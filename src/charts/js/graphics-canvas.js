/**
 * CanvasGraphics is a fallback drawing api used for basic drawing operations when SVG is not available.
 *
 * @class CanvasGraphics
 * @constructor
 */
Y.CanvasGraphic = Y.Base.create("graphic",  Y.CanvasDrawingUtil, [], {
    autoSize: true,

    /**
     * Sets the size of the graphics object.
     * 
     * @method setSize
     * @param w {Number} width to set for the instance.
     * @param h {Number} height to set for the instance.
     */
    setSize: function(w, h) {
        if(this.autoSize)
        {
            if(w > this.node.getAttribute("width"))
            {
                this.node.style.width = w + "px";
                this._canvas.style.width = w + "px";
                this._canvas.width = w;
                this.node.setAttribute("width", w);
            }
            if(h > this.node.getAttribute("height"))
            {
                this.node.style.height = h + "px";
                this._canvas.style.height = h + "px";
                this._canvas.height = h;
                this.node.setAttribute("height", h);
            }
        }
    },

    /**
     * Updates the size of the graphics object
     *
     * @method _trackSize
     * @param {Number} w width
     * @param {Number} h height
     * @private
     */
    _trackSize: function(w, h) {
        if (w > this._width) {
            this._width = w;
        }
        if (h > this._height) {
            this._height = h;
        }
        this.setSize(w, h);
    },

    /**
     * Sets the positon of the graphics object.
     *
     * @method setPosition
     * @param {Number} x x-coordinate for the object.
     * @param {Number} y y-coordinate for the object.
     */
    setPosition: function(x, y)
    {
        this.node.style.left = x + "px";
        this.node.style.top = y + "px";
    },

    /**
     * Adds the graphics node to the dom.
     * 
     * @method render
     * @param {HTMLElement} parentNode node in which to render the graphics node into.
     */
    render: function(node) {
        node = node || Y.config.doc.body;
        this.node = document.createElement("div");
        this.node.style.width = node.offsetWidth + "px";
        this.node.style.height = node.offsetHeight + "px";
        this.node.style.display = "block";
        this.node.style.position = "absolute";
        this.node.style.left = node.getStyle("left");
        this.node.style.top = node.getStyle("top");
        this.node.style.pointerEvents = "none";
        node.appendChild(this.node);
        this.node.appendChild(this._canvas);
        this._canvas.width = node.offsetWidth > 0 ? node.offsetWidth : 100;
        this._canvas.height = node.offsetHeight > 0 ? node.offsetHeight : 100;
        this._canvas.style.position = "absolute";

        return this;
    },
    
    /**
     * Shows and and hides a the graphic instance.
     *
     * @method toggleVisible
     * @param val {Boolean} indicates whether the instance should be visible.
     */
    toggleVisible: function(val)
    {
        this.node.style.visibility = val ? "visible" : "hidden";
    },

    /**
     * Creates a graphic node
     *
     * @method _createGraphicNode
     * @param {String} type node type to create
     * @param {String} pe specified pointer-events value
     * @return HTMLElement
     * @private
     */
    _createGraphicNode: function(pe)
    {
        var node = Y.config.doc.createElement('canvas');
        node.style.pointerEvents = pe || "none";
        if(!this._graphicsList)
        {
            this._graphicsList = [];
        }
        this._graphicsList.push(node);
        return node;
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        this._removeChildren(this.node);
        if(this.node && this.node.parentNode)
        {
            this.node.parentNode.removeChild(this.node);
        }
    },
    
    /**
     * Removes all child nodes.
     *
     * @method _removeChildren
     * @param {HTMLElement} node
     * @private
     */
    _removeChildren: function(node)
    {
        if(node.hasChildNodes())
        {
            var child;
            while(node.firstChild)
            {
                child = node.firstChild;
                this._removeChildren(child);
                node.removeChild(child);
            }
        }
    },

    /**
     * @private
     * Reference to the node for the graphics object
     */
    node: null
});

if(DRAWINGAPI == "canvas")
{
    Y.Graphic = Y.CanvasGraphic;
}
