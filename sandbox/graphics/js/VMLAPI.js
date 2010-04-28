/**
 * VMLAPI provides an api for drawing objects within the dom.
 */
function VMLAPI(config)
{
	VMLAPI.superclass.constructor.apply(this, arguments);
}

VMLAPI.NAME = "vmlAPI";

VMLAPI.ATTRS = {
	parent: {
		getter: function()
		{
			return this._parent;
		},

		setter: function(value)
		{
			if(Y.Lang.isString(value))
			{
				this._parent = document.getElementById(value);
			}
			else
			{
				this._parent = value;
			}
			return this._parent;
		}
	},
	
    canvas: {
		getter: function() {
			if(!this._canvas)
			{
				this._setCanvas();
			}
			return this._canvas;
		}
	}
};

Y.extend(VMLAPI, Y.Base, {
	_canvas: null,

	_setCanvas: function()
	{
		var parent = this.get("parent"),
            w = parseInt(parent.style.width, 10),
            h = parseInt(parent.style.height, 10);
        this._canvas = document.createElement("v:group");
        this._canvas.setAttribute("id", "engine");
		this._canvas.style.width = w + "px";
		this._canvas.style.height = h + "px";
		this._canvas.setAttribute("coordsize", w + " " + h); 
        parent.appendChild(this._canvas);
	},

	circle: function(obj)
	{
		var x = obj.x || 0,
			y = obj.y || 0,
			diameter = obj.radius * 2,
			sc = obj.strokeColor,
			lw = obj.lineWidth,
			fc = obj.fillColor,
            circ = document.createElement("v:oval");
            circ.setAttribute("strokeweight", lw + "px");
            circ.setAttribute("strokecolor", sc);
            circ.style.left = x + "px";
            circ.style.top = y + "px";
            circ.style.width = diameter + "px";
            circ.style.height = diameter + "px";
            circ.fillcolor = fc;
            this.get("canvas").appendChild(circ);
	},

	rectangle: function(obj)
	{
		var w = obj.width,
			h = obj.height,
			x = obj.x || 0,
			y = obj.y || 0,
			lw = obj.lineWidth || 1,
			fc = obj.fillColor,
			sc = obj.strokeColor,
            rect = document.createElement("v:rect");
        rect.setAttribute("strokeweight", lw + "px");
        rect.style.width = w + "px";
        rect.style.height = h + "px";
        rect.style.top = y;
        rect.style.left = x;
        rect.fillcolor = fc;
        rect.strokecolor = sc;
        this.get("canvas").appendChild(rect);
    }
});

Y.VMLAPI = VMLAPI;
