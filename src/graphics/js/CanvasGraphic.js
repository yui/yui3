/**
 * CanvasGraphic is a simple drawing api that allows for basic drawing operations.
 *
 * @class CanvasGraphic
 * @constructor
 */
function CanvasGraphic(config) {
    
    CanvasGraphic.superclass.constructor.apply(this, arguments);
}

CanvasGraphic.NAME = "canvasGraphic";

CanvasGraphic.ATTRS = {
    render: {},

    /**
     * Key value pairs in which a shape instance is associated with its id.
     *
     *  @attribute shapes
     *  @type Object
     *  @readOnly
     */
    shapes: {
        readOnly: true,

        getter: function()
        {
            return this._shapes;
        }
    },

    /**
     *  Object containing size and coordinate data for the content of a Graphic in relation to the coordSpace node.
     *
     *  @attribute contentBox 
     *  @type Object
     */
    contentBox: {
        readOnly: true,

        getter: function()
        {
            return this._contentBox;
        }
    },

    /**
     *  The html element that represents to coordinate system of the Graphic instance.
     *
     *  @attribute coordPlaneNode
     *  @type HTMLElement
     */
    coordPlaneNode: {
        readOnly: true,

        getter: function()
        {
            return this._coordPlaneNode;
        }
    },

    width: {
        setter: function(val)
        {
            if(this._coordPlaneNode)
            {
                this._coordPlaneNode.style.width = val + 'px';            
                this._coordPlaneNode.setAttribute("width", val);
            }
            return val;
        }
    },

    height: {
        setter: function(val)
        {
            if(this._coordPlaneNode)
            {
                this._coordPlaneNode.style.height = val + 'px';
                this._coordPlaneNode.setAttribute("height", val);
            }
            return val;
        }
    }
};

Y.extend(CanvasGraphic, Y.BaseGraphic, {
    /**
     * Gets the current position of the node in page coordinates.
     *
     * @method getXY
     * @return Array The XY position of the shape.
     */
    getXY: function()
    {
        var node = Y.one(this._coordPlaneNode),
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
        var render = this.get("render"),
            w = this.get("width") || 0,
            h = this.get("height") || 0;
        this._shapes = {};
        this._redrawQueue = {};
		this._contentBox = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        this._coordPlaneNode = DOCUMENT.createElement('div');
        this._coordPlaneNode.style.position = "absolute";
        this.set("width", w);
        this.set("height", h);
        if(render)
        {
            this.render(render);
        }
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
        this._coordPlaneNode.style.left = x + "px";
        this._coordPlaneNode.style.top = y + "px";
    },

    /**
     * Adds the graphics node to the dom.
     * 
     * @method render
     * @param {HTMLElement} parentNode node in which to render the graphics node into.
     */
    render: function(render) {
        var parentNode = Y.one(render),
            node = this._coordPlaneNode,
            w = this.get("width") || parseInt(parentNode.getComputedStyle("width"), 10),
            h = this.get("height") || parseInt(parentNode.getComputedStyle("height"), 10);
        parentNode = parentNode || DOCUMENT.body;
        parentNode.appendChild(node);
        node.style.display = "block";
        node.style.position = "absolute";
        node.style.left = "0px";
        node.style.top = "0px";
        this.set("width", w);
        this.set("height", h);
        this.parentNode = parentNode;
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
        this._coordPlaneNode.style.visibility = val ? "visible" : "hidden";
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
            parentNode = this._frag || this._coordPlaneNode;
        parentNode.appendChild(node);
        if(!this._graphicsList)
        {
            this._graphicsList = [];
        }
        this._graphicsList.push(node);
        if(this.autoDraw) 
        {
            this.updateContentBox();
        }
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
		var shape = new this._shapeClass[cfg.type](cfg);
        this._shapes[shape.get("id")] = shape;
        this.addShape(shape);
        return shape;
    },

    /**
     * Removes a shape instance from from the graphic instance.
     *
     * @method removeShape
     * @param {Shape|String}
     */
    removeShape: function(shape)
    {
        var node;
        if(!(shape instanceof CanvasShape))
        {
            if(Y_LANG.isString(shape))
            {
                shape = this._shapes[shape];
            }
        }
        if(shape && shape instanceof CanvasShape)
        {
            shape.destroy();
            delete this._shapes[shape.get("id")];
        }
        if(this.autoDraw) 
        {
            this.updateContentBox();
        }
        return shape;
    },

    /**
     * Removes all shape instances from the dom.
     *
     * @method removeAllShapes
     */
    removeAllShapes: function()
    {
        var shapes = this._shapes,
            i;
        for(i in shapes)
        {
            if(shapes.hasOwnProperty(i))
            {
                shapes[i].destroy();
            }
        }
        this._shapes = {};
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
        var node = this._coordPlaneNode,
            frag = document.createDocumentFragment();
        this._frag = frag;
        this.autoDraw = false;
        method();
        this.updateContentBox();
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
        this._removeChildren(this._coordPlaneNode);
        if(this._coordPlaneNode && this._coordPlaneNode.parentNode)
        {
            this._coordPlaneNode.parentNode.removeChild(this._coordPlaneNode);
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
     * Updates the size of the graphics container and the position of its children.
     *
     * @method updateContentBox
     */
    updateContentBox: function(e)
    {
        var bounds,
            i,
            shape,
            queue = this.resizeDown ? this._shapes : this._redrawQueue,
            box = this._contentBox,
            left = box.left,
            top = box.top,
            right = box.right,
            bottom = box.bottom;
        for(i in queue)
        {
            if(queue.hasOwnProperty(i))
            {
                shape = queue[i];
                bounds = shape.getBounds();
                box.left = Math.min(left, bounds.left);
                box.top = Math.min(top, bounds.top);
                box.right = Math.max(right, bounds.right);
                box.bottom = Math.max(bottom, bounds.bottom);
            }
        }
        this._redrawQueue = {};
        box.width = box.right - box.left;
        box.height = box.bottom - box.top;
        this._contentBox = box;
    },

    /**
     * Adds a shape to the redraw queue. 
     *
     * @method addToRedrawQueue
     * @param shape {CanvasShape}
     */
    addToRedrawQueue: function(shape)
    {
        var id = shape.get("id");
        this._redrawQueue[id] = shape;
        if(this.autoDraw) 
        {
            this.updateContentBox();
        }
    }
});

Y.CanvasGraphic = CanvasGraphic;
