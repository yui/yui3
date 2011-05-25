/**
 * Graphic is a simple drawing api that allows for basic drawing operations.
 *
 * @class Graphic
 * @constructor
 */
function SVGGraphic(config) {
    
    this.initializer.apply(this, arguments);
}

SVGGraphic.prototype = {
    /**
     * Gets the current position of the node's parentNode in page coordinates.
     *
     * @method getXY
     * @return Array The XY position of the shape.
     */
    getXY: function()
    {
        var parentNode = Y.one(this.parentNode),
            parentXY;
        if(parentNode)
        {
            parentXY = parentNode.getXY();
        }
        return parentXY;
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
        this._shapeInstances = {
            ellipse: null,
            circle: null,
            path: null,
            rect: null
        };
        this._shapes = {};
        this._redrawQueue = {};
        config = config || {};
        var w = config.width || 0,
            h = config.height || 0;
        this._gradients = {};
        this.id = Y.guid();
        this.node = Y.config.doc.createElement('div');
        this.node.style.position = "absolute";
        this.group = this._createGraphics();
        this.group.setAttribute("id", this.id);
        this.node.appendChild(this.group);
        this.setSize(w, h);
        
        if(config.render)
        {
            this.render(config.render);
        }
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
     * Shows and and hides a the graphic instance.
     *
     * @method toggleVisible
     * @param val {Boolean} indicates whether the instance should be visible.
     */
    toggleVisible: function(val)
    {
        this._toggleVisible(this.node, val);
    },

    /**
     * Toggles visibility
     *
     * @method _toggleVisible
     * @param {HTMLElement} node element to toggle
     * @param {Boolean} val indicates visibilitye
     * @private
     */
    _toggleVisible: function(node, val)
    {
        var children = Y.Selector.query(">/*", node),
            visibility = val ? "visible" : "hidden",
            i = 0,
            len;
        if(children)
        {
            len = children.length;
            for(; i < len; ++i)
            {
                this._toggleVisible(children[i], val);
            }
        }
        node.style.visibility = visibility;
    },

    /**
     * Clears the graphics object.
     *
     * @method clear
     */
    clear: function() {
        if(this._graphicsList)
        {
            while(this._graphicsList.length > 0)
            {
                this.group.removeChild(this._graphicsList.shift());
            }
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
                this.group.setAttribute("width",  w);
            }
            if(h > this.group.getAttribute("height"))
            {
                this.group.setAttribute("height", h);
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
        if (w > this._right) {
            this._right = w;
        }
        if(w < this._left)
        {
            this._left = w;    
        }
        if (h < this._top)
        {
            this._top = h;
        }
        if (h > this._bottom) 
        {
            this._bottom = h;
        }
        this._width = this._right - this._left;
        this._height = this._bottom - this._top;
        this.node.style.left = this._left + "px";
        this.node.style.top = this._top + "px";
        this.setSize(this._width, this._height);
    },

    /**
     * Adds the graphics node to the dom.
     * 
     * @method render
     * @param {HTMLElement} parentNode node in which to render the graphics node into.
     */
    render: function(render) {
        var parentNode = Y.one(render),
            w = parseInt(parentNode.getComputedStyle("width"), 10),
            h = parseInt(parentNode.getComputedStyle("height"), 10);
        parentNode = parentNode || Y.config.doc.body;
        parentNode.appendChild(this.node);
        this.setSize(w, h);
        this.parentNode = parentNode;
        return this;
    },

    /**
     * Creates a group element
     *
     * @method _createGraphics
     * @private
     */
    _createGraphics: function() {
        var group = this._createGraphicNode("svg");
        this._styleGroup(group);
        return group;
    },

    /**
     * Styles a group element
     *
     * @method _styleGroup
     * @private
     */
    _styleGroup: function(group)
    {
        group.style.position = "absolute";
        group.style.top = "0px";
        group.style.left = "0px";
        group.style.overflow = "auto";
        group.setAttribute("overflow", "auto");
        group.setAttribute("pointer-events", "none");
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
    _createGraphicNode: function(type, pe)
    {
        var node = document.createElementNS("http://www.w3.org/2000/svg", "svg:" + type),
            v = pe || "none";
        if(type !== "defs" && type !== "stop" && type !== "linearGradient" && type != "radialGradient")
        {
            node.setAttribute("pointer-events", v);
        }
        return node;
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
            parentNode = this._frag || this.group;
        parentNode.appendChild(node);
        if(!this._graphicsList)
        {
            this._graphicsList = [];
        }
        this._graphicsList.push(node);
        if(this.autoDraw) 
        {
            this.updateCoordSpace();
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
     * When overflow is set to true, by default, the viewBox will resize to greater values but not values. (for performance)
     * When resizing the viewBox down is desirable, set the resizeDown value to true.
     *
     * @property resizeDown 
     * @type Boolean
     */
    resizeDown: false,

    /**
     * @private
     */
    _shapeClass: {
        circle: Y.SVGCircle,
        rect: Y.SVGRect,
        path: Y.SVGPath,
        ellipse: Y.SVGEllipse
    },

    /**
     * @private
     */
    _shapeIntances: null,
    
    /**
     * Returns a shape based on the id of its dom node.
     *
     * @method getShapeById
     * @param {String} id Dom id of the shape's node attribute.
     * @return Shape
     */
    getShapeById: function(id)
    {
        var shape = this._shapes[id];
        return shape;
    },

	/**
	 * Allows for creating multiple shapes in order to batch appending and redraw operations.
	 *
	 * @method batch
	 * @param {Function} method Method to execute.
	 */
    batch: function(method)
    {
        var node = this.group,
            frag = document.createDocumentFragment();
        this._frag = frag;
        this.autoDraw = false;
        method();
        this.updateCoordSpace();
        node.appendChild(frag);
        this._frag = null;
        this.autoDraw = true;
    },

    /**
     * Updates the size of the graphics container and the position of its children.
     *
     * @method updateCoordSpace
     */
    updateCoordSpace: function(e)
    {
        var bounds,
            i,
            shape,
            queue = this.resizeDown ? this._shapes : this._redrawQueue;
        for(i in queue)
        {
            if(queue.hasOwnProperty(i))
            {
                shape = queue[i];
                bounds = shape.getBounds();
                this._left = Math.min(this._left, bounds.left);
                this._top = Math.min(this._top, bounds.top);
                this._right = Math.max(this._right, bounds.right);
                this._bottom = Math.max(this._bottom, bounds.bottom);
            }
        }
        
        this._redrawQueue = {};
        this._width = this._right - this._left;
        this._height = this._bottom - this._top;
        this.node.style.width = this._width + "px";
        this.node.style.height = this._height + "px";
        this.node.style.left = this._left + "px";
        this.node.style.top = this._top + "px";
        this.group.setAttribute("width", this._width);
        this.group.setAttribute("height", this._height);
        this.group.style.width = this._width + "px";
        this.group.style.height = this._height + "px";
        this.group.setAttribute("viewBox", "" + this._left + " " + this._top + " " + this._width + " " + this._height + "");
    },

    /**
     * Adds a shape to the redraw queue. 
     *
     * @method addToRedrawQueue
     * @param shape {SVGShape}
     */
    addToRedrawQueue: function(shape)
    {
        var id = shape.get("id");
        this._redrawQueue[id] = shape;
        if(this.autoDraw) 
        {
            this.updateCoordSpace();
        }
    },

    /**
     * @private
     */
    _left: 0,

    /**
     * @private
     */
    _right: 0,

    /**
     * @private
     */
    _top: 0,

    /**
     * @private
     */
    _bottom: 0,

    /**
     * Returns a reference to a gradient definition based on an id and type.
     *
     * @method getGradientNode
     * @key {String} id that references the gradient definition
     * @type {String} description of the gradient type
     * @return HTMLElement
     */
    getGradientNode: function(key, type)
    {
        var gradients = this._gradients,
            gradient,
            nodeType = type + "Gradient";
        if(gradients.hasOwnProperty(key) && gradients[key].tagName.indexOf(type) > -1)
        {
            gradient = this._gradients[key];
        }
        else
        {
            gradient = this._createGraphicNode(nodeType);
            if(!this._defs)
            {
                this._defs = this._createGraphicNode("defs");
                this.group.appendChild(this._defs);
            }
            this._defs.appendChild(gradient);
            key = key || "gradient" + Math.round(100000 * Math.random());
            gradient.setAttribute("id", key);
            if(gradients.hasOwnProperty(key))
            {
                this._defs.removeChild(gradients[key]);
            }
            gradients[key] = gradient;
        }
        return gradient;
    }

};
Y.SVGGraphic = SVGGraphic;

