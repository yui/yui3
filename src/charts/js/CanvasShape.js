/**
 * The Shape class creates a graphic object with editable 
 * properties.
 *
 * @class CanvasShape
 * @extends CanvasGraphic
 * @constructor
 */
function CanvasShape(cfg)
{
    this._dummy = this._createDummy();
    this._canvas = this._createGraphic();
    this.node = this._canvas;
    this._context = this._canvas.getContext('2d');
    this._initialize(cfg);
    this._validate();
}

Y.extend(CanvasShape, Y.CanvasDrawingUtil, {
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
     * Initializes the graphic instance.
     *
     * @method _initialize
     * @private
     */
    _initialize: function(cfg) 
    {
        this._canvas.style.position = "absolute";
        if(cfg.graphic)
        {
            cfg.graphic.node.appendChild(this._canvas);
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
        this.width = cfg.width || this.width;
        this.height = cfg.height || this.height;
        this.border = cfg.border || this.border;
        this.graphics = cfg.graphic || this.graphics;
        this.fill = cfg.fill || this.fill;
        this.type = cfg.shape || this.type;
        this.props = cfg.props || this.props;
        this.path = cfg.path || this.path;
        this.props = cfg.props || this.props;
        this.parentNode = this.graphics.node;
    },

    /**
     * Draws the graphic.
     *
     * @method _validate
     * @private
     */
    _validate: function()
    {
        var w = this.width,
            h = this.height,
            border = this.border,
            type = this.type,
            fill = this.fill;
        this.clear();
        this.setSize(this.width, this.height);
        this._canvas.style.top = "0px";
        this._canvas.style.left = "0px";
        if(border && border.weight && border.weight > 0)
        {
            border.color = border.color || "#000";
            border.alpha = border.alpha || 1;
            this.lineStyle(border.weight, border.color, border.alpha);
        }
        if(fill.type === "radial" || fill.type === "linear")
        {
            this.beginGradientFill(fill);
        }
        else if(fill.type === "bitmap")
        {
            this.beginBitmapFill(fill);
        }   
        else
        {
            this.beginFill(fill.color, fill.alpha);
        }
        switch(type)
        {
            case "circle" :
                this.drawEllipse(0, 0, w, h);
            break;
            case "rect" :
                this.drawRect(0, 0, w, h);
            break;
            case "wedge" :
                this.drawWedge(this.props);
            break;
        }
        return this;       
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
        this._validate();
        return this;
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
     * Positions the parent node of the shape.
     *
     * @method setPosition
     * @param {Number}, x The x-coordinate
     * @param {Number}, y The y-coordinate
     */
    setPosition: function(x, y)
    {
        var pNode = Y.one(this.parentNode);
        pNode.setStyle("position", "absolute");
        pNode.setStyle("left", x);
        pNode.setStyle("top", y);
    },
    
    /**
     * Adds a class to the shape's node.
     *
     * @method addClass
     * @param {String} className Name of the class to add.
     */
    addClass: function(val)
    {
        if(this.node)
        {
            this.node.style.pointerEvents = "painted";
            this.node.setAttribute("class", val);
        }
    }
});

Y.CanvasShape = CanvasShape;

if(DRAWINGAPI == "canvas")
{
    Y.Shape = Y.CanvasShape;
}
