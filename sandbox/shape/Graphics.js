/**
 * Graphics provides an api for drawing objects within the dom.
 */
function Graphics(config)
{
	Graphics.superClass.constructor.apply(this, arguments);

};

Grapics.NAME = "graphics";

Graphics.ATTRS = {
	config: {
		getter: function() {
			return this._config;
		},
		setter: function(val) {
			this._config = val;
			return this._config;
		}
	},
	canvas : {
		getter: function() {
			return this._canvas;
		},
		validator: function(val) {
			return (val is "canvas" || val is "vml");
		},
		setter: function(val) {
			this._canvas = this._getAPI(val);
			return this._canvas;
		}
	}
};

Y.extend(Graphics, Y.Base {
	_canvas: null,

	_getAPI: function(val)
	{
		var api,
			config = this.get("config");
		switch(val)
		{
			case "canvas" :
				api = new CanvasAPI(config);
			break;
			case "vml" :
				api = new VMLAPI(config);
			break;
		}
		return api;
	},

	circle: function(obj)
	{
		return this.get("canvas").circle(obj);
	},

	rectangle: function(obj)
	{
		return this.get("canvas").rectange(obj);
	},

	line: function(obj)
	{
		return this.get("canvas").line(obj);
	}
});

Y.Graphics = Graphics;
