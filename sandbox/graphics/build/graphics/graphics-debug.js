YUI.add('graphics', function(Y) {

/**
 * Graphics provides an api for drawing objects within the dom.
 */
function Graphics(config)
{
	this._config = config;
	Graphics.superclass.constructor.apply(this, arguments);
}

Graphics.NAME = "graphics";

Graphics.ATTRS = {
	engine : {
		getter: function() {
			return this._engine;
		},
		validator: function(val) {
			return (val == "canvas" || val == "vml");
		},
		setter: function(val) {
			this._engine = this._getAPI(val);
			return this._engine;
		}
	}
};

Y.extend(Graphics, Y.Base, {
	_config: null,

	_engine: null,

	_getAPI: function(val)
	{
		var api,
			config = this._config;
		switch(val)
		{
			case "canvas" :
				api = new Y.CanvasAPI(config);
			break;
			case "vml" :
				api = new Y.VMLAPI(config);
			break;
		}
		return api;
	},

	circle: function(obj)
	{
		return this.get("engine").circle(obj);
	},

	rectangle: function(obj)
	{
		return this.get("engine").rectangle(obj);
	}
});

Y.Graphics = Graphics;
/**
 * CanvasAPI provides an api for drawing objects within the dom.
 */
function CanvasAPI(config)
{
	CanvasAPI.superclass.constructor.apply(this, arguments);
}

CanvasAPI.NAME = "canvasAPI";

CanvasAPI.ATTRS = {
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
	},

	context: {
		getter: function() {
			if(!this._context)
			{
				this._context = this.get("canvas").getContext("2d");
			}
			return this._context;
		}
	}

};

Y.extend(CanvasAPI, Y.Base, {
	_setCanvas: function()
	{
		var parent = this.get("parent");
		this._canvas = document.createElement("canvas");
		this._canvas.width = parseInt(this._parent.style.width, 10) || parent.width;
		this._canvas.height = parseInt(this._parent.style.height, 10) || parent.height;
		this._context = this._canvas.getContext("2d");
		parent.appendChild(this._canvas);
	},

	_canvas: null,

	_context: null,

	circle: function(obj)
	{
		var x = obj.x || 0,
			y = obj.y || 0,
			radius = obj.radius,
			startAngle = obj.startAngle || 0,
			endAngle =  obj.endAngle || 360,
			anticlockwise = obj.anticlockwise || false,
			sc = obj.strokeColor,
			lw = obj.lineWidth,
			fc = obj.fillColor,
			ctx = this.get("context"); 
		obj.startAngle *= (Math.PI/180);
		obj.endAngle *= (Math.PI/180);
		ctx.beginPath();
		ctx.arc(x + radius, y + radius, radius, startAngle, endAngle, anticlockwise);
		if(sc)
		{
			ctx.lineWidth = lw;
			ctx.strokeStyle = sc;
			ctx.stroke();
		}
		if(fc)
		{
			ctx.fillStyle = fc;
			ctx.fill();
		}
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
			ctx = this.get("context");
			if(fc)
			{
				ctx.fillStyle = fc;
				ctx.fillRect(x, y, w, h);
			}
			if(sc)
			{
				ctx.strokeStyle = sc;
				ctx.lineWidth = lw;
				ctx.strokeRect(x, y, w, h);
			}
	}
});

Y.CanvasAPI = CanvasAPI;
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


}, '@VERSION@' );
