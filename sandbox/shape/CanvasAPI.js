/**
 * CanvasAPI provides an api for drawing objects within the dom.
 */
function CanvasAPI(config)
{
	CanvasAPI.superClass.constructor.apply(this, arguments);
	
};

CanvasAPI.NAME = "canvasAPI";

CanvasAPI.ATTRS = {
	canvas: {
		getter: function() {
			return this._canvas;
		}
	},

	context: {
		getter: function() {
			return this._context;
		}
	}

};

Y.extend(CanvasAPI, Y.Base {
	circle: function(obj)
	{
		var x = obj.x || 0,
			y = obj.y || 0,
			radius = obj.radius,
			startAngle = obj.startAngle * (Math.PI/180),
			endAngle = obj.endAngle * (Math.PI/180),
			anticlockwise = obj.anticlockwise || false,
			ctx = this.get("context");
		return ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
	},

	rectangle: function(obj)
	{
	},

	line: function(obj)
	{
	}
});

Y.CanvasAPI = CanvasAPI;
