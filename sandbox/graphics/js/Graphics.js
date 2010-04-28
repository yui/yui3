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
