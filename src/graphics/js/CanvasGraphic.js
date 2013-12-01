/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the `Graphic` class.
 * `CanvasGraphic` is not intended to be used directly. Instead, use the <a href="Graphic.html">`Graphic`</a> class.
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Graphic.html">`Graphic`</a>
 * class will point to the `CanvasGraphic` class.
 *
 * @module graphics
 * @class CanvasGraphic
 * @constructor
 */
function CanvasGraphic() {

    CanvasGraphic.superclass.constructor.apply(this, arguments);
}

CanvasGraphic.NAME = "canvasGraphic";

CanvasGraphic.ATTRS = {
    /**
     * Whether or not to render the `Graphic` automatically after to a specified parent node after init. This can be a Node
     * instance or a CSS selector string.
     *
     * @config render
     * @type Node | String
     */
    render: {},

    /**
	 * Unique id for class instance.
	 *
	 * @config id
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
     *  @config shapes
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
     *  Object containing size and coordinate data for the content of a Graphic in relation to the graphic instance's position.
     *
     *  @config contentBounds
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
     *  The outermost html element of the Graphic instance.
     *
     *  @config node
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

	/**
	 * Indicates the width of the `Graphic`.
	 *
	 * @config width
	 * @type Number
	 */
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

	/**
	 * Indicates the height of the `Graphic`.
	 *
	 * @config height
	 * @type Number
	 */
    height: {
        setter: function(val)
        {
            if(this._node)
            {
                this._node.style.height = val + "px";
            }
            return val;
        }
    },

    /**
     *  Determines the sizing of the Graphic.
     *
     *  <dl>
     *      <dt>sizeContentToGraphic</dt><dd>The Graphic's width and height attributes are, either explicitly set through the
     *      <code>width</code> and <code>height</code> attributes or are determined by the dimensions of the parent element. The
     *      content contained in the Graphic will be sized to fit with in the Graphic instance's dimensions. When using this
     *      setting, the <code>preserveAspectRatio</code> attribute will determine how the contents are sized.</dd>
     *      <dt>sizeGraphicToContent</dt><dd>(Also accepts a value of true) The Graphic's width and height are determined by the
     *      size and positioning of the content.</dd>
     *      <dt>false</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code>
     *      and <code>height</code> attributes or are determined by the dimensions of the parent element. The contents of the
     *      Graphic instance are not affected by this setting.</dd>
     *  </dl>
     *
     *
     *  @config autoSize
     *  @type Boolean | String
     *  @default false
     */
    autoSize: {
        value: false
    },

    /**
     * Determines how content is sized when <code>autoSize</code> is set to <code>sizeContentToGraphic</code>.
     *
     *  <dl>
     *      <dt>none<dt><dd>Do not force uniform scaling. Scale the graphic content of the given element non-uniformly if necessary
     *      such that the element's bounding box exactly matches the viewport rectangle.</dd>
     *      <dt>xMinYMin</dt><dd>Force uniform scaling position along the top left of the Graphic's node.</dd>
     *      <dt>xMidYMin</dt><dd>Force uniform scaling horizontally centered and positioned at the top of the Graphic's node.<dd>
     *      <dt>xMaxYMin</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the top.</dd>
     *      <dt>xMinYMid</dt>Force uniform scaling positioned horizontally from the left and vertically centered.</dd>
     *      <dt>xMidYMid (the default)</dt><dd>Force uniform scaling with the content centered.</dd>
     *      <dt>xMaxYMid</dt><dd>Force uniform scaling positioned horizontally from the right and vertically centered.</dd>
     *      <dt>xMinYMax</dt><dd>Force uniform scaling positioned horizontally from the left and vertically from the bottom.</dd>
     *      <dt>xMidYMax</dt><dd>Force uniform scaling horizontally centered and position vertically from the bottom.</dd>
     *      <dt>xMaxYMax</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the bottom.</dd>
     *  </dl>
     *
     * @config preserveAspectRatio
     * @type String
     * @default xMidYMid
     */
    preserveAspectRatio: {
        value: "xMidYMid"
    },

    /**
     * The contentBounds will resize to greater values but not smaller values. (for performance)
     * When resizing the contentBounds down is desirable, set the resizeDown value to true.
     *
     * @config resizeDown
     * @type Boolean
     */
    resizeDown: {
        value: false
    },

	/**
	 * Indicates the x-coordinate for the instance.
	 *
	 * @config x
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
	 * @config y
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
     * @config autoDraw
     * @type Boolean
     * @default true
     * @private
     */
    autoDraw: {
        value: true
    },

	/**
	 * Indicates whether the `Graphic` and its children are visible.
	 *
	 * @config visible
	 * @type Boolean
	 */
    visible: {
        value: true,

        setter: function(val)
        {
            this._toggleVisible(val);
            return val;
        }
    }
};

Y.extend(CanvasGraphic, Y.GraphicBase, {
    /**
     * Sets the value of an attribute.
     *
     * @method set
     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can
     * be passed in to set multiple attributes at once.
     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as
     * the name param.
     */
	set: function()
	{
		var host = this,
            attr = arguments[0],
            redrawAttrs = {
                autoDraw: true,
                autoSize: true,
                preserveAspectRatio: true,
                resizeDown: true
            },
            key,
            forceRedraw = false;
		AttributeLite.prototype.set.apply(host, arguments);
        if(host._state.autoDraw === true && Y.Object.size(this._shapes) > 0)
        {
            if(Y_LANG.isString && redrawAttrs[attr])
            {
                forceRedraw = true;
            }
            else if(Y_LANG.isObject(attr))
            {
                for(key in redrawAttrs)
                {
                    if(redrawAttrs.hasOwnProperty(key) && attr[key])
                    {
                        forceRedraw = true;
                        break;
                    }
                }
            }
        }
        if(forceRedraw)
        {
            host._redraw();
        }
	},

    /**
     * Storage for `x` attribute.
     *
     * @property _x
     * @type Number
     * @private
     */
    _x: 0,

    /**
     * Storage for `y` attribute.
     *
     * @property _y
     * @type Number
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
        var node = this._node,
            xy;
        if(node)
        {
            xy = Y.DOM.getXY(node);
        }
        return xy;
    },

	/**
     * Initializes the class.
     *
     * @method initializer
     * @param {Object} config Optional attributes
     * @private
     */
    initializer: function() {
        var render = this.get("render"),
            visibility = this.get("visible") ? "visible" : "hidden",
            w = this.get("width") || 0,
            h = this.get("height") || 0;
        this._shapes = {};
        this._redrawQueue = {};
		this._contentBounds = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        this._node = DOCUMENT.createElement('div');
        this._node.style.position = "absolute";
        this._node.style.visibility = visibility;
        this.set("width", w);
        this.set("height", h);
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
        var parentNode = render || DOCUMENT.body,
            node = this._node,
            w,
            h;
        if(render instanceof Y.Node)
        {
            parentNode = render._node;
        }
        else if(Y.Lang.isString(render))
        {
            parentNode = Y.Selector.query(render, DOCUMENT.body, true);
        }
        w = this.get("width") || parseInt(Y.DOM.getComputedStyle(parentNode, "width"), 10);
        h = this.get("height") || parseInt(Y.DOM.getComputedStyle(parentNode, "height"), 10);
        parentNode.appendChild(node);
        node.style.display = "block";
        node.style.position = "absolute";
        node.style.left = this.get("x") + "px";
        node.style.top = this.get("y") + "px";
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
        if(this._node)
        {
            this._removeChildren(this._node);
            if(this._node.parentNode)
            {
                this._node.parentNode.removeChild(this._node);
            }
            this._node = null;
        }
    },

    /**
     * Generates a shape instance by type.
     *
     * @method addShape
     * @param {Object} cfg attributes for the shape
     * @return Shape
     */
    addShape: function(cfg)
    {
        cfg.graphic = this;
        if(!this.get("visible"))
        {
            cfg.visible = false;
        }
        var ShapeClass = this._getShapeClass(cfg.type),
            shape = new ShapeClass(cfg);
        this._appendShape(shape);
        return shape;
    },

    /**
     * Adds a shape instance to the graphic instance.
     *
     * @method _appendShape
     * @param {Shape} shape The shape instance to be added to the graphic.
     * @private
     */
    _appendShape: function(shape)
    {
        var node = shape.node,
            parentNode = this._frag || this._node;
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
        if(!(shape instanceof CanvasShape))
        {
            if(Y_LANG.isString(shape))
            {
                shape = this._shapes[shape];
            }
        }
        if(shape && shape instanceof CanvasShape)
        {
            shape._destroy();
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
     * Clears the graphics object.
     *
     * @method clear
     */
    clear: function() {
        this.removeAllShapes();
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
        if(node && node.hasChildNodes())
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
        if(this._node)
        {
            this._node.style.visibility = visibility;
        }
    },

    /**
     * Returns a shape class. Used by `addShape`.
     *
     * @method _getShapeClass
     * @param {Shape | String} val Indicates which shape class.
     * @return Function
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
     * Look up for shape classes. Used by `addShape` to retrieve a class for instantiation.
     *
     * @property _shapeClass
     * @type Object
     * @private
     */
    _shapeClass: {
        circle: Y.CanvasCircle,
        rect: Y.CanvasRect,
        path: Y.CanvasPath,
        ellipse: Y.CanvasEllipse,
        pieslice: Y.CanvasPieSlice
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
        this.set("autoDraw", autoDraw);
    },

    /**
     * Returns a document fragment to for attaching shapes.
     *
     * @method _getDocFrag
     * @return DocumentFragment
     * @private
     */
    _getDocFrag: function()
    {
        if(!this._frag)
        {
            this._frag = DOCUMENT.createDocumentFragment();
        }
        return this._frag;
    },

    /**
     * Redraws all shapes.
     *
     * @method _redraw
     * @private
     */
    _redraw: function()
    {
        var autoSize = this.get("autoSize"),
            preserveAspectRatio = this.get("preserveAspectRatio"),
            box = this.get("resizeDown") ? this._getUpdatedContentBounds() : this._contentBounds,
            contentWidth,
            contentHeight,
            w,
            h,
            xScale,
            yScale,
            translateX = 0,
            translateY = 0,
            matrix,
            node = this.get("node");
        if(autoSize)
        {
            if(autoSize === "sizeContentToGraphic")
            {
                contentWidth = box.right - box.left;
                contentHeight = box.bottom - box.top;
                w = parseFloat(Y_DOM.getComputedStyle(node, "width"));
                h = parseFloat(Y_DOM.getComputedStyle(node, "height"));
                matrix = new Y.Matrix();
                if(preserveAspectRatio === "none")
                {
                    xScale = w/contentWidth;
                    yScale = h/contentHeight;
                }
                else
                {
                    if(contentWidth/contentHeight !== w/h)
                    {
                        if(contentWidth * h/contentHeight > w)
                        {
                            xScale = yScale = w/contentWidth;
                            translateY = this._calculateTranslate(preserveAspectRatio.slice(5).toLowerCase(), contentHeight * w/contentWidth, h);
                        }
                        else
                        {
                            xScale = yScale = h/contentHeight;
                            translateX = this._calculateTranslate(preserveAspectRatio.slice(1, 4).toLowerCase(), contentWidth * h/contentHeight, w);
                        }
                    }
                }
                Y_DOM.setStyle(node, "transformOrigin", "0% 0%");
                translateX = translateX - (box.left * xScale);
                translateY = translateY - (box.top * yScale);
                matrix.translate(translateX, translateY);
                matrix.scale(xScale, yScale);
                Y_DOM.setStyle(node, "transform", matrix.toCSSText());
            }
            else
            {
                this.set("width", box.right);
                this.set("height", box.bottom);
            }
        }
        if(this._frag)
        {
            this._node.appendChild(this._frag);
            this._frag = null;
        }
    },

    /**
     * Determines the value for either an x or y value to be used for the <code>translate</code> of the Graphic.
     *
     * @method _calculateTranslate
     * @param {String} position The position for placement. Possible values are min, mid and max.
     * @param {Number} contentSize The total size of the content.
     * @param {Number} boundsSize The total size of the Graphic.
     * @return Number
     * @private
     */
    _calculateTranslate: function(position, contentSize, boundsSize)
    {
        var ratio = boundsSize - contentSize,
            coord;
        switch(position)
        {
            case "mid" :
                coord = ratio * 0.5;
            break;
            case "max" :
                coord = ratio;
            break;
            default :
                coord = 0;
            break;
        }
        return coord;
    },

    /**
     * Adds a shape to the redraw queue and calculates the contentBounds. Used internally
     * by `Shape` instances.
     *
     * @method addToRedrawQueue
     * @param Shape shape The shape instance to add to the queue
     * @protected
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
            this._contentBounds = box;
        }
        if(this.get("autoDraw"))
        {
            this._redraw();
        }
    },

    /**
     * Recalculates and returns the `contentBounds` for the `Graphic` instance.
     *
     * @method _getUpdatedContentBounds
     * @return {Object}
     * @private
     */
    _getUpdatedContentBounds: function()
    {
        var bounds,
            i,
            shape,
            queue = this._shapes,
            box = {};
        for(i in queue)
        {
            if(queue.hasOwnProperty(i))
            {
                shape = queue[i];
                bounds = shape.getBounds();
                box.left = Y_LANG.isNumber(box.left) ? Math.min(box.left, bounds.left) : bounds.left;
                box.top = Y_LANG.isNumber(box.top) ? Math.min(box.top, bounds.top) : bounds.top;
                box.right = Y_LANG.isNumber(box.right) ? Math.max(box.right, bounds.right) : bounds.right;
                box.bottom = Y_LANG.isNumber(box.bottom) ? Math.max(box.bottom, bounds.bottom) : bounds.bottom;
            }
        }
        box.left = Y_LANG.isNumber(box.left) ? box.left : 0;
        box.top = Y_LANG.isNumber(box.top) ? box.top : 0;
        box.right = Y_LANG.isNumber(box.right) ? box.right : 0;
        box.bottom = Y_LANG.isNumber(box.bottom) ? box.bottom : 0;
        this._contentBounds = box;
        return box;
    },

    /**
     * Inserts shape on the top of the tree.
     *
     * @method _toFront
     * @param {CanvasShape} Shape to add.
     * @private
     */
    _toFront: function(shape)
    {
        var contentNode = this.get("node");
        if(shape instanceof Y.CanvasShape)
        {
            shape = shape.get("node");
        }
        if(contentNode && shape)
        {
            contentNode.appendChild(shape);
        }
    },

    /**
     * Inserts shape as the first child of the content node.
     *
     * @method _toBack
     * @param {CanvasShape} Shape to add.
     * @private
     */
    _toBack: function(shape)
    {
        var contentNode = this.get("node"),
            targetNode;
        if(shape instanceof Y.CanvasShape)
        {
            shape = shape.get("node");
        }
        if(contentNode && shape)
        {
            targetNode = contentNode.firstChild;
            if(targetNode)
            {
                contentNode.insertBefore(shape, targetNode);
            }
            else
            {
                contentNode.appendChild(shape);
            }
        }
    }
});

Y.CanvasGraphic = CanvasGraphic;
