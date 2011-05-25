/**
 * VMLGraphic is a simple drawing api that allows for basic drawing operations.
 *
 * @class VMLGraphic
 * @constructor
 */
VMLGraphic = function(config) {
    
    this.initializer.apply(this, arguments);
};

VMLGraphic.prototype = {
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
        config = config || {};
        var w = config.width || 0,
            h = config.height || 0;
        this.id = Y.guid();
        this.node = this._createGraphic();
        this.node.setAttribute("id", this.id);
        this.setSize(w, h);
        this._initProps();
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
        this._removeChildren(this.node);
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        this._removeChildren(this.node);
        this.node.parentNode.removeChild(this.node);
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
     * @method setSize
     * @param w {Number} width to set for the instance.
     * @param h {Number} height to set for the instance.
     */
    setSize: function(w, h) {
        w = Math.round(w);
        h = Math.round(h);
        this.node.style.width = w + 'px';
        this.node.style.height = h + 'px';
        this.node.coordSize = w + ' ' + h;
        this._canvasWidth = w;
        this._canvasHeight = h;
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
        this.node.style.left = x + "px";
        this.node.style.top = y + "px";
    },

    /**
     * Adds the graphics node to the dom.
     * 
     * @method render
     * @param {HTMLElement} parentNode node in which to render the graphics node into.
     */
    render: function(parentNode, addToDom) {
        var w,
            h;
        parentNode = Y.one(parentNode);
        w = parseInt(parentNode.getComputedStyle("width"), 10);
        h = parseInt(parentNode.getComputedStyle("height"), 10);
        parentNode = parentNode || Y.config.doc.body;
        parentNode.appendChild(this.node);
        this.setSize(w, h);
        this._initProps();
        this.parentNode = parentNode._node;
        return this;
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
        this._width = 0;
        this._height = 0;
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
            parentNode = this._frag || this.node;
        parentNode.appendChild(node);
        if(!this._graphicsList)
        {
            this._graphicsList = [];
        }
        if(!this._shapes)
        {
            this._shapes = {};
        }
        this._graphicsList.push(node);
        this._shapes[shape.get("id")] = shape;
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
        this.node.appendChild(child);
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
        this.updateSize();
        node.appendChild(frag);
        this._frag = null;
        this.autoDraw = true;
    },

    /**
     * Updates the size of the graphics container and.
     *
     * @method updateSize
     */
    updateSize: function(e)
    {
        var bounds,
            i,// = 0,
            shape,
            shapes = this._shapes,//this._graphicsList,
            //len = shapes.length,
            w,
            h;
        this._left = 0;
        this._right = 0;
        this._top = 0;
        this._bottom = 0;
        for(i in shapes)
        //for(; i < len; ++i)
        {
            if(shapes.hasOwnProperty(i))
            {
            //shape = this.getShapeById(shapes[i].getAttribute("id"));
                shape = this._shapes[i];
                bounds = shape.getBounds();
                this._left = Math.min(this._left, bounds.left);
                this._top = Math.min(this._top, bounds.top);
                this._right = Math.max(this._right, bounds.right);
                this._bottom = Math.max(this._bottom, bounds.bottom);
            }
        }
        w = this._width = this._right - this._left;
        h = this._height = this._bottom - this._top;
        this.setSize(this._width, this._height);
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
    _bottom: 0
};
Y.VMLGraphic = VMLGraphic;

