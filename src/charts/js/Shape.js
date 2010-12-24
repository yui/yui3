/**
 * The Shape class creates a graphic object with editable 
 * properties.
 *
 * @class Shape
 * @extends Graphic
 * @constructor
 */
function Shape(cfg)
{
    this._initialize(cfg);
    this._draw();
}

Y.extend(Shape, Y.Graphic, {
    /**
     * Indicates the type of shape. 
     *
     * @property type 
     * @type string
     */
    type: "shape",

    /**
     * Indicates whether or not the instance will size itself based on its contents.
     *
     * @property autoSize 
     * @type string
     */
    autoSize: false,

    /**
     * Determines whether the instance will receive mouse events.
     * 
     * @property pointerEvents
     * @type string
     */
    pointerEvents: "visiblePainted", 

    /**
     * Initializes the graphic instance.
     *
     * @method _initialize
     * @private
     */
    _initialize: function(cfg) 
    {
        if(!cfg.graphic)
        {
            cfg.graphic = new Y.Graphic();
        }
        this._setProps(cfg);
    },
  
    /**
     * Updates properties for the shape.
     *
     * @method _setProps
     * @param {Object} cfg Properties to update.
     * @private
     */
    _setProps: function(cfg)
    {
        this.autoSize = cfg.autoSize || this.autoSize; 
        this.pointerEvents = cfg.pointerEvents || this.pointerEvents;
        this.width = cfg.width || this.width;
        this.height = cfg.height || this.height;
        this.border = cfg.border || this.border;
        this.graphics = cfg.graphic || this.graphics;
        this.canvas = this.graphics;
        this.parentNode = this.graphics.node;
        this.fill = cfg.fill || this.fill;
        this.type = cfg.shape || this.type;
        this.nodetype = this._getNodeShapeType(this.type); 
        this.props = cfg.props || this.props;
        this.path = cfg.path || this.path;
    },

    /**
     * Draws the graphic.
     *
     * @method _draw
     * @private
     */
    _draw: function()
    {
        var cx,
            cy,
            rx,
            ry,
            parentNode = this.parentNode,
            borderWeight = 0,
            fillWidth = this.width || 0,
            fillHeight = this.height || 0;
        if(!this.node)
        {
            this.node = this._createGraphicNode(this.nodetype, this.pointerEvents);
            parentNode.appendChild(this.node);
        }
        if(this.type == "wedge")
        {
            this.path = this._getWedgePath(this.props);
        }
        if(this.nodetype == "path")
        {
            this._setPath();
        }
        if(this.border && this.border.weight && this.border.weight > 0)
        {
            borderWeight = this.border.weight;
            fillWidth -= borderWeight * 2;
            fillHeight -= borderWeight * 2;
        }
        this._addBorder();
        if(this.nodetype === "ellipse")
        {
            rx = this.width/2;
            cx = this.width/2;
            ry = this.height/2;
            cy = this.height/2;
            rx -= borderWeight;
            ry -= borderWeight;
            this.node.setAttribute("cx", cx);
            this.node.setAttribute("cy", cy);
            this.node.setAttribute("rx", rx);
            this.node.setAttribute("ry", ry);
        }
        else
        {
            this.node.setAttribute("width", fillWidth);
            this.node.setAttribute("height", fillHeight);
            this.node.style.width = fillWidth + "px";
            this.node.style.height = fillHeight + "px";
        }
        this._addFill();
        parentNode.style.width = this.width + "px";
        parentNode.style.height = this.height + "px";
        parentNode.setAttribute("width", this.width);
        parentNode.setAttribute("height", this.height);
        this.node.style.visibility = "visible";
        this.node.setAttribute("x", borderWeight); 
        this.node.setAttribute("y", borderWeight); 
        return this;       
    },

    /**
     * Adds a path to the shape node.
     * 
     * @method _setPath
     * @private
     */
    _setPath: function()
    {
        if(this.path)
        {
            this.path += " Z";
            this.node.setAttribute("d", this.path);
        }
    },

    /**
     * Adds a border to the shape node.
     *
     * @method _addBorder
     * @private
     */
    _addBorder: function()
    {
        if(this.border && this.border.weight && this.border.weight > 0)
        {
            var borderAlpha = this.border.alpha;
            this.border.color = this.border.color || "#000000";
            this.border.weight = this.border.weight || 1;
            this.border.alpha = Y.Lang.isNumber(borderAlpha) ? borderAlpha : 1;
            this.border.linecap = this.border.linecap || "square";
            this.node.setAttribute("stroke", this.border.color);
            this.node.setAttribute("stroke-linecap", this.border.linecap);
            this.node.setAttribute("stroke-width",  this.border.weight);
            this.node.setAttribute("stroke-opacity", this.border.alpha);
        }
        else
        {
            this.node.setAttribute("stroke", "none");
        }
    },

    /**
     * Adds a fill to the shape node.
     *
     * @method _addFill
     * @private
     */
    _addFill: function()
    {
        var fillAlpha;
        if(this.fill.type === "linear" || this.fill.type === "radial")
        {
            this.beginGradientFill(this.fill);
            this.node.appendChild(this._getFill());
        }
        else if(this.fill.type === "bitmap")
        {
            this.beginBitmapFill(this.fill);
            this.node.appendChild(this._getFill());
        }
        else
        {
            if(!this.fill.color)
            {
                this.node.setAttribute("fill", "none");
            }
            else
            {
                fillAlpha = this.fill.alpha; 
                this.fill.alpha = Y.Lang.isNumber(fillAlpha) ? fillAlpha : 1;
                this.node.setAttribute("fill", this.fill.color);
                this.node.setAttribute("fill-opacity", fillAlpha);
            }
        }
    },

    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        this._setPath();
    },

    /**
     * Updates the properties of the shape instance.
     *
     * @method update
     * @param {Object} cfg Object literal containing properties to update.
     */
    update: function(cfg)
    {
        this._setProps(cfg);
        this._draw();
        return this;
    },
    
    /**
     * Converts a shape type to the appropriate node attribute.
     *
     * @private
     * @method _getNodeShapeType
     * @param {String} type The type of shape.
     * @return String
     */
    _getNodeShapeType: function(type)
    {
        if(this._typeConversionHash.hasOwnProperty(type))
        {
            type = this._typeConversionHash[type];
        }
        return type;
    },

    /**
     * Sets the visibility of a shape.
     * 
     * @method toggleVisible
     * @param {Boolean} val indicates whether or not the shape is visible.
     */
    toggleVisible: function(val)
    {
        var visibility = val ? "visible" : "hidden";
        if(this.node)
        {
            this.node.style.visibility = visibility;
        }
    },

    /**
     * Adds a class to the shape's node.
     *
     * @method addClass
     * @param {String} className Name of the class to add.
     */
    addClass: function(className)
    {
        var node = this.node;
        if(node)
        {
            if(node.className && node.className.baseVal)
            {
                node.className.baseVal = Y.Lang.trim([node.className.baseVal, className].join(' '));
            }
            else
            {
                node.setAttribute("class", className);
            }
        }
    },

    /**
     * Positions the parent node of the shape.
     *
     * @method setPosition
     * @param {Number}, x The x-coordinate
     * @param {Number}, y The y-coordinate
     */
    setPosition: function(x, y)
    {
        var pNode = Y.one(this.parentNode),
            hotspot = this.hotspot;
        pNode.setStyle("position", "absolute");
        pNode.setStyle("left", x);
        pNode.setStyle("top", y);
        if(hotspot)
        {
            hotspot.setStyle("position", "absolute");
            hotspot.setStyle("left", x);
            hotspot.setStyle("top", y);
        }
    },

    /**
     * Used to convert shape declarations to the appropriate node type.
     *
     * @property _typeConversionHash
     * @type Object
     * @private
     */
    _typeConversionHash: {
        circle: "ellipse",
        wedge: "path"
    }
});

Y.Shape = Shape;
