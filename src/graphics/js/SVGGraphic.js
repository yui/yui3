/**
 * Graphic is a simple drawing api that allows for basic drawing operations.
 *
 * @module graphics
 * @class SVGGraphic
 * @constructor
 */
SVGGraphic = function(cfg) {
    SVGGraphic.superclass.constructor.apply(this, arguments);
};

SVGGraphic.NAME = "svgGraphic";

SVGGraphic.ATTRS = {
    render: {},
	
    /**
	 * Unique id for class instance.
	 *
	 * @attribute id
	 * @type String
	 */
	id: {
		valueFn: function()
		{
			return Y.guid();
		},

		setter: function(val)
		{
			var node = this._node;
			if(node)
			{
				node.setAttribute("id", val);
			}
			return val;
		}
	},

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
     *  @attribute contentBounds
     *  @type Object 
     *  @readOnly
     */
    contentBounds: {
        readOnly: true,

        getter: function()
        {
            return this._contentBounds;
        }
    },

    /**
     *  The html element that represents to coordinate system of the Graphic instance.
     *
     *  @attribute node
     *  @type HTMLElement
     *  @readOnly
     */
    node: {
        readOnly: true,

        getter: function()
        {
            return this._node;
        }
    },
    
    width: {
        setter: function(val)
        {
            if(this._node)
            {
                this._node.style.width = val + "px";
            }
            return val; 
        }
    },

    height: {
        setter: function(val)
        {
            if(this._node)
            {
                this._node.style.height = val  + "px";
            }
            return val;
        }
    },

    /**
     *  Determines how the size of instance is calculated. If true, the width and height are determined by the size of the contents.
     *  If false, the width and height values are either explicitly set or determined by the size of the parent node's dimensions.
     *
     *  @attribute autoSize
     *  @type Boolean
     *  @default false
     */
    autoSize: {
        value: false
    },

    /**
     * When overflow is set to true, by default, the contentBounds will resize to greater values but not to smaller values. (for performance)
     * When resizing the contentBounds down is desirable, set the resizeDown value to true.
     *
     * @attribute resizeDown 
     * @type Boolean
     */
    resizeDown: {
        getter: function()
        {
            return this._resizeDown;
        },

        setter: function(val)
        {
            this._resizeDown = val;
            this._redraw();
            return val;
        }
    },

	/**
	 * Indicates the x-coordinate for the instance.
	 *
	 * @attribute x
	 * @type Number
	 */
    x: {
        getter: function()
        {
            return this._x;
        },

        setter: function(val)
        {
            this._x = val;
            if(this._node)
            {
                this._node.style.left = val + "px";
            }
            return val;
        }
    },

	/**
	 * Indicates the y-coordinate for the instance.
	 *
	 * @attribute y
	 * @type Number
	 */
    y: {
        getter: function()
        {
            return this._y;
        },

        setter: function(val)
        {
            this._y = val;
            if(this._node)
            {
                this._node.style.top = val + "px";
            }
            return val;
        }
    },

    /**
     * Indicates whether or not the instance will automatically redraw after a change is made to a shape.
     * This property will get set to false when batching operations.
     *
     * @attribute autoDraw
     * @type Boolean
     * @default true
     * @private
     */
    autoDraw: {
        value: true
    },
    
    visible: {
        value: true,

        setter: function(val)
        {
            this._toggleVisible(val);
            return val;
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
     * @private
     */
    _x: 0,

    /**
     * @private
     */
    _y: 0,

    /**
     * Gets the current position of the graphic instance in page coordinates.
     *
     * @method getXY
     * @return Array The XY position of the shape.
     */
    getXY: function()
    {
        var node = Y.one(this._node),
            xy;
        if(node)
        {
            xy = node.getXY();
        }
        return xy;
    },

    /**
     * @private
     * @property _resizeDown 
     * @type Boolean
     */
    _resizeDown: false,

    /**
     * Initializes the class.
     *
     * @method initializer
     * @private
     */
    initializer: function() {
        var render = this.get("render");
        this._shapes = {};
		this._contentBounds = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        this._gradients = {};
        this._node = DOCUMENT.createElement('div');
        this._node.style.position = "absolute";
        this._node.style.left = this.get("x") + "px";
        this._node.style.top = this.get("y") + "px";
        this._contentNode = this._createGraphics();
        this._contentNode.setAttribute("id", this.get("id"));
        this._node.appendChild(this._contentNode);
        if(render)
        {
            this.render(render);
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
        parentNode.appendChild(this._node);
        this.parentNode = parentNode;
        this.set("width", w);
        this.set("height", h);
        this.parentNode = parentNode;
        return this;
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        this.removeAllShapes();
        this._removeChildren(this._node);
        if(this._node && this._node.parentNode)
        {
            this._node.parentNode.removeChild(this._node);
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
        var shapeClass = this._getShapeClass(cfg.type),
            shape = new shapeClass(cfg);
        this.addShape(shape);
        return shape;
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
        if(this.get("autoDraw")) 
        {
            parentNode.appendChild(node);
        }
        else
        {
            this._getDocFrag().appendChild(node);
        }
    },

    /**
     * Removes a shape instance from from the graphic instance.
     *
     * @method removeShape
     * @param {Shape|String} shape The instance or id of the shape to be removed.
     */
    removeShape: function(shape)
    {
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
        if(this.get("autoDraw")) 
        {
            this._redraw();
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
     * Clears the graphics object.
     *
     * @method clear
     */
    clear: function() {
        this.removeAllShapes();
    },

    /**
     * Toggles visibility
     *
     * @method _toggleVisible
     * @param {Boolean} val indicates visibilitye
     * @private
     */
    _toggleVisible: function(val)
    {
        var i,
            shapes = this._shapes,
            visibility = val ? "visible" : "hidden";
        if(shapes)
        {
            for(i in shapes)
            {
                if(shapes.hasOwnProperty(i))
                {
                    shapes[i].set("visible", val);
                }
            }
        }
        this._contentNode.style.visibility = visibility;
        this._node.style.visibility = visibility;
    },

    /**
     * @private
     */
    _getShapeClass: function(val)
    {
        var shape = this._shapeClass[val];
        if(shape)
        {
            return shape;
        }
        return val;
    },

    /**
     * @private
     */
    _shapeClass: {
        circle: Y.SVGCircle,
        rect: Y.SVGRect,
        path: Y.SVGPath,
        ellipse: Y.SVGEllipse,
        pieslice: Y.SVGPieSlice
    },
    
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
        var autoDraw = this.get("autoDraw");
        this.set("autoDraw", false);
        method();
        this._redraw();
        this.set("autoDraw", autoDraw);
    },
    
    _getDocFrag: function()
    {
        if(!this._frag)
        {
            this._frag = DOCUMENT.createDocumentFragment();
        }
        return this._frag;
    },

    _redraw: function()
    {
        var box = this.get("resizeDown") ? this._getUpdatedContentBounds() : this._contentBounds;
        this._contentNode.style.left = box.left + "px";
        this._contentNode.style.top = box.top + "px";
        this._contentNode.setAttribute("width", box.width);
        this._contentNode.setAttribute("height", box.height);
        this._contentNode.style.width = box.width + "px";
        this._contentNode.style.height = box.height + "px";
        this._contentNode.setAttribute("viewBox", "" + box.left + " " + box.top + " " + box.width + " " + box.height + "");
        if(this.get("autoSize"))
        {
            this.set("width", box.right);
            this.set("height", box.bottom);
        }
        if(this._frag)
        {
            this._contentNode.appendChild(this._frag);
            this._frag = null;
        }
    },

    /**
     * Adds a shape to the redraw queue and calculates the contentBounds. 
     *
     * @method addToRedrawQueue
     * @param shape {SVGShape}
     */
    addToRedrawQueue: function(shape)
    {
        var shapeBox,
            box;
        this._shapes[shape.get("id")] = shape;
        if(!this.get("resizeDown"))
        {
            shapeBox = shape.getBounds();
            box = this._contentBounds;
            box.left = box.left < shapeBox.left ? box.left : shapeBox.left;
            box.top = box.top < shapeBox.top ? box.top : shapeBox.top;
            box.right = box.right > shapeBox.right ? box.right : shapeBox.right;
            box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;
            box.width = box.right - box.left;
            box.height = box.bottom - box.top;
            this._contentBounds = box;
        }
        if(this.get("autoDraw")) 
        {
            this._redraw();
        }
    },
    
    _getUpdatedContentBounds: function()
    {
        var bounds,
            i,
            shape,
            queue = this._shapes,
            box = {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            };
        for(i in queue)
        {
            if(queue.hasOwnProperty(i))
            {
                shape = queue[i];
                bounds = shape.getBounds();
                box.left = Math.min(box.left, bounds.left);
                box.top = Math.min(box.top, bounds.top);
                box.right = Math.max(box.right, bounds.right);
                box.bottom = Math.max(box.bottom, bounds.bottom);
            }
        }
        box.width = box.right - box.left;
        box.height = box.bottom - box.top;
        this._contentBounds = box;
        return box;
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
        contentNode.style.top = "px";
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
        var node = DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "svg:" + type),
            v = pe || "none";
        if(type !== "defs" && type !== "stop" && type !== "linearGradient" && type != "radialGradient")
        {
            node.setAttribute("pointer-events", v);
        }
        return node;
    },

    /**
     * Returns a reference to a gradient definition based on an id and type.
     *
     * @method getGradientNode
     * @param {String} key id that references the gradient definition
     * @param {String} type description of the gradient type
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

