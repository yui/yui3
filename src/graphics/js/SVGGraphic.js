/**
 * Graphic is a simple drawing api that allows for basic drawing operations.
 *
 * @class Graphic
 * @constructor
 */
var SVGGraphic = function(cfg) {
    SVGGraphic.superclass.constructor.apply(this, arguments);
};

SVGGraphic.NAME = "svgGraphic";

SVGGraphic.ATTRS = {
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
     *  @readOnly
     */
    //todo rename to avoid confusion with widget contentbox
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
     *  @readOnly
     */
    coordPlaneNode: {
        readOnly: true,

        getter: function()
        {
            return this._coordPlaneNode;
        }
    },
    
    /**
     *  Indicates the pointer-events setting for the svg:svg element.
     *
     *  @attribute pointerEvents
     *  @type String
     */
    pointerEvents: {
        value: "none"
    }
};

Y.extend(SVGGraphic, Y.BaseGraphic, {
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
     * Indicates whether or not the instance will automatically redraw after a change is made to a shape.
     * This property will get set to false when batching operations.
     *
     * @property autoDraw
     * @type Boolean
     * @default true
     * @private
     */
    autoDraw: true,

    /**
     * Initializes the class.
     *
     * @method initializer
     * @private
     */
    //todo document that this is stop-gap until we can use node to style svg
    initializer: function() {
        var render = this.get("render");
        this._shapeInstances = {
            ellipse: null,
            circle: null,
            path: null,
            rect: null
        };
        this._shapes = {};
        this._redrawQueue = {};
		this._contentBox = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        this._gradients = {};
        this._coordPlaneNode = DOCUMENT.createElement('div');
        this._coordPlaneNode.style.position = "absolute";
        this._contentNode = this._createGraphics();
        this._contentNode.setAttribute("id", this.get("id"));
        this._coordPlaneNode.appendChild(this._contentNode);
        if(render)
        {
            this.render(render);
        }
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        this.removeAllShapes();
        this._removeChildren(this._coordPlaneNode);
        if(this._coordPlaneNode && this._coordPlaneNode.parentNode)
        {
            this._coordPlaneNode.parentNode.removeChild(this._coordPlaneNode);
        }
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
        this._toggleVisible(this._coordPlaneNode, val);
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
        this.removeAllShapes();
    },

    /**
     * Sets the size of the graphics object.
     * 
     * @method _updateContentSize
     * @param w {Number} width to set for the instance.
     * @param h {Number} height to set for the instance.
     */
    _updateContentSize: function(w, h) {
        if(w > this._contentNode.getAttribute("width"))
        {
            this._contentNode.setAttribute("width",  w);
        }
        if(h > this._contentNode.getAttribute("height"))
        {
            this._contentNode.setAttribute("height", h);
        }
    },

    /**
     * Adds the graphics node to the dom.
     * 
     * @method render
     * @param {HTMLElement} parentNode node in which to render the graphics node into.
     */
    render: function(render) {
        var parentNode = Y.one(render),
            w = this.get("width") || parseInt(parentNode.getComputedStyle("width"), 10),
            h = this.get("height") || parseInt(parentNode.getComputedStyle("height"), 10);
        parentNode = parentNode || DOCUMENT.body;
        parentNode.appendChild(this._coordPlaneNode);
        this._updateContentSize(w, h);
        this.parentNode = parentNode;
        this._coordPlaneNode.style.width = w + "px";
        this._coordPlaneNode.style.height = h  + "px";
        this.set("width", w);
        this.set("height", h);
        this.parentNode = parentNode;
        return this;
    },

    /**
     * Creates a contentNode element
     *
     * @method _createGraphics
     * @private
     */
    _createGraphics: function() {
        var contentNode = this._createGraphicNode("svg"),
            pointerEvents = this.get("pointerEvents");
        contentNode.style.position = "absolute";
        contentNode.style.top = "0px";
        contentNode.style.left = "0px";
        contentNode.style.overflow = "auto";
        contentNode.setAttribute("overflow", "auto");
        contentNode.setAttribute("pointer-events", pointerEvents);
        return contentNode;
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
            parentNode = this._frag || this._contentNode;
        parentNode.appendChild(node);
        if(this.autoDraw) 
        {
            this.updateContentBox();
        }
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
        if(!(shape instanceof SVGShape))
        {
            if(Y_LANG.isString(shape))
            {
                shape = this._shapes[shape];
            }
        }
        if(shape && shape instanceof SVGShape)
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
        var node = this._contentNode,
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
        this._contentNode.style.left = box.left + "px";
        this._contentNode.style.top = box.top + "px";
        this._contentNode.setAttribute("width", box.width);
        this._contentNode.setAttribute("height", box.height);
        this._contentNode.style.width = box.width + "px";
        this._contentNode.style.height = box.height + "px";
        this._contentNode.setAttribute("viewBox", "" + box.left + " " + box.top + " " + box.width + " " + box.height + "");
        this._contentBox = box;
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
            this.updateContentBox();
        }
    },

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
                this._contentNode.appendChild(this._defs);
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

});

Y.SVGGraphic = SVGGraphic;

