/**
 * CanvasGraphic is a simple drawing api that allows for basic drawing operations.
 *
 * @class CanvasGraphic
 * @constructor
 */
function CanvasGraphic(config) {
    
    this.initializer.apply(this, arguments);
}

CanvasGraphic.prototype = {
    /**
     * Gets the current position of the node in page coordinates.
     *
     * @method getXY
     * @return Array The XY position of the shape.
     */
    getXY: function()
    {
        var node = Y.one(this.node),
            xy = node.getXY();
        return xy;
    },

    /**
     * Indicates whether or not the instance will size itself based on its contents.
     *
     * @property autoSize 
     * @type String
     */
    autoSize: true,
    
    /**
     * Indicates whether or not the instance will automatically redraw after a change is made to a shape.
     * This property will get set to false when batching operations.
     *
     * @property autoDraw
     * @type Boolean
     * @default true
     */
    autoDraw: true,
    
	/**
     * Initializes the class.
     *
     * @method initializer
     * @private
     */
    initializer: function(config) {
        this._shapes = {};
		config = config || {};
        var w = config.width || 0,
            h = config.height || 0;
        this.node = Y.config.doc.createElement('div');
        this.setSize(w, h);
        if(config.render)
        {
            this.render(config.render);
        }
    },

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
                this.node.setAttribute("width", w);
            }
            if(h > this.node.getAttribute("height"))
            {
                this.node.style.height = h + "px";
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
    render: function(render) {
        var node = this.node,
            parentNode = Y.one(render),
            w = parentNode.get("width") || parentNode.get("offsetWidth"),
            h = parentNode.get("height") || parentNode.get("offsetHeight");
        node.style.display = "block";
        node.style.position = "absolute";
        node.style.left = Y.one(node).getStyle("left");
        node.style.top = Y.one(node).getStyle("top");
        node.style.pointerEvents = "visiblePainted";
        parentNode = parentNode || Y.config.doc.body;
        parentNode.appendChild(this.node);
        this.setSize(w, h);
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
     * Adds a shape instance to the graphic instance.
     *
     * @method addShape
     * @param {Shape} shape The shape instance to be added to the graphic.
     */
    addShape: function(shape)
    {
		var node = shape.node,
            parentNode = this._frag || this.node;
        parentNode.appendChild(node);
        if(!this._graphicsList)
        {
            this._graphicsList = [];
        }
        this._graphicsList.push(node);
    },

    /**
     * Generates a shape instance by type.
     *
     * @method getShape
     * @param {String} type type of shape to generate.
     * @param {Object} cfg attributes for the shape
     * @return Shape
     */
    getShape: function(cfg)
    {
        cfg.graphic = this;
        var myclass = this._shapeClass[cfg.type];
		var shape = new this._shapeClass[cfg.type](cfg);
        this._shapes[shape.get("id")] = shape;
        this.addShape(shape);
        return shape;
    },

    /**
     * @private
     */
    _shapeClass: {
        circle: Y.CanvasCircle,
        rect: Y.CanvasRect,
        path: Y.CanvasPath,
        ellipse: Y.CanvasEllipse
    },

	/**
 	 * Allows for creating multiple shapes in order to batch appending and redraw operations.
 	 *
 	 * @method batch
 	 * @param {Function} method Method to execute.
 	 */
    batch: function(method)
    {
        var node = this.node,
            frag = document.createDocumentFragment();
        this._frag = frag;
        this.autoDraw = false;
        method();
        node.appendChild(frag);
        this._frag = null;
        this.autoDraw = true;
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
    }
};

Y.CanvasGraphic = CanvasGraphic;
