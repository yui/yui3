/**
 * VMLGraphic is a simple drawing api that allows for basic drawing operations.
 *
 * @class VMLGraphic
 * @constructor
 */
VMLGraphic = function() {
    VMLGraphic.superclass.constructor.apply(this, arguments);    
};

VMLGraphic.NAME = "vmlGraphic";

VMLGraphic.ATTRS = {
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
     *  @attribute _coordPlaneNode
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
            }
            return val;
        }
    }
};

Y.extend(VMLGraphic, Y.BaseGraphic, {
    getXY: function()
    {
        var node = Y.one(this.parentNode),
            xy = node.getXY();
        return xy;
    },

    /**
     * Initializes the class.
     *
     * @method initializer
     * @private
     */
    initializer: function(config) {
        var render = this.get("render");
        this._coordPlaneNode = this._createGraphic();
        this._coordPlaneNode.setAttribute("id", this.get("id"));
        this._initProps();
        if(render)
        {
            this.render(render);
        }
    },

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
     * Clears the graphics object.
     *
     * @method clear
     */
    clear: function() {
        this._path = '';
        this._removeAllShapes();
        this._removeChildren(this._coordPlaneNode);
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        this.clear();
        this._coordPlaneNode.parentNode.removeChild(this._coordPlaneNode);
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
     * @param node
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
        var children = Y.one(node).get("children"),
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
     * Sets the size of the graphics object.
     * 
     * @method setContentSize
     * @param w {Number} width to set for the instance.
     * @param h {Number} height to set for the instance.
     */
    setContentSize: function(w, h) {
        w = Math.round(w);
        h = Math.round(h);
        this._coordPlaneNode.style.width = w + 'px';
        this._coordPlaneNode.style.height = h + 'px';
        this._coordPlaneNode.coordSize = w + ' ' + h;
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
        x = Math.round(x);
        y = Math.round(y);
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
            w = this.get("width") || parseInt(parentNode.getComputedStyle("width"), 10),
            h = this.get("height") || parseInt(parentNode.getComputedStyle("height"), 10);
        parentNode = parentNode || DOCUMENT.body;
        parentNode.appendChild(this._coordPlaneNode);
        this.setContentSize(w, h);
        this.parentNode = parentNode;
        this.set("width", w);
        this.set("height", h);
        return this;
    },

    /**
     * Clears the properties
     *
     * @method _initProps
     * @private
     */
    _initProps: function() {
        this._fillColor = null;
        this._strokeColor = null;
        this._strokeOpacity = null;
        this._strokeWeight = 0;
        this._fillProps = null;
        this._path = '';
		this._contentBox = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        this._x = 0;
        this._y = 0;
        this._fill = null;
        this._stroke = 0;
        this._stroked = false;
        this._dashstyle = null;
    },

    /**
     * Creates a group element
     *
     * @method _createGraphic
     * @private
     */
    _createGraphic: function() {
        var group = document.createElement('<group xmlns="urn:schemas-microsft.com:vml" style="behavior:url(#default#VML);display:block;zoom:1;" />');
		group.style.display = "block";
        group.style.position = 'absolute';
        return group;
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
    _createGraphicNode: function(type)
    {
        return document.createElement('<' + type + ' xmlns="urn:schemas-microsft.com:vml" style="behavior:url(#default#VML);display:inline-block;zoom:1;" />');
    
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
        if(!this._shapes)
        {
            this._shapes = {};
        }
        this._shapes[shape.get("id")] = shape;
        if(this.autoDraw)
        {
            this.updateContentBox();
        }
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
        return this._shapes[id];
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
        if(!shape instanceof VMLShape)
        {
            if(Y_LANG.isString(shape))
            {
                shape = this._shapes[shape];
            }
        }
        if(shape && shape instanceof VMLShape)
        {
            shape.destroy();
            delete this._shapes[shape.get("id")];
        }
        if(this.autoDraw)
        {
            this.updateContentBox();
        }
    },

    /**
     * @private
     */
    _shapeClass: {
        circle: Y.VMLCircle,
        rect: Y.VMLRect,
        path: Y.VMLPath,
        ellipse: Y.VMLEllipse
    },
    
    /**
     * Adds a child to the <code>node</code>.
     *
     * @method addChild
     * @param {HTMLElement} element to add
     * @private
     */
    addChild: function(child)
    {
        this._coordPlaneNode.appendChild(child);
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
     * Updates the size of the graphics container and.
     *
     * @method updateContentBox
     */
    updateContentBox: function(e)
    {
        var bounds,
            i,
            shape,
            shapes = this._shapes,
            w,
            h,
            box = this._contentBox,
            left = box.left,
            top = box.top,
            right = box.right,
            bottom = box.bottom;
        for(i in shapes)
        {
            if(shapes.hasOwnProperty(i))
            {
                shape = this._shapes[i];
                bounds = shape.getBounds();
                box.left = Math.min(left, bounds.left);
                box.top = Math.min(top, bounds.top);
                box.right = Math.max(right, bounds.right);
                box.bottom = Math.max(bottom, bounds.bottom);
            }
        }
        w = box.width = box.right - box.left;
        h = box.height = box.bottom - box.top;
        this._contentBox = box;
    }
});
Y.VMLGraphic = VMLGraphic;

