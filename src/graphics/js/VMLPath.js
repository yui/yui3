/**
 * The VMLPath class creates a graphic object with editable 
 * properties.
 *
 * @class VMLPath
 * @extends VMLShape
 */
VMLPath = function()
{
	VMLPath.superclass.constructor.apply(this, arguments);
};

VMLPath.NAME = "vmlPath";
Y.extend(VMLPath, Y.VMLShape, {
	/**
	 * @private
	 */
    _updateHandler: function()
    {   
        var host = this;
            host._fillChangeHandler();
            host._strokeChangeHandler();
        host._updateTransform();
    }
});
VMLPath.ATTRS = Y.merge(Y.VMLShape.ATTRS, {
	/**
	 * Indicates the width of the shape
	 * 
	 * @config width 
	 * @type Number
	 */
	width: {
		getter: function()
		{
			return this._width;
		},

		setter: function(val)
		{
			this._width = val;
			return val;
		}
	},

	/**
	 * Indicates the height of the shape
	 * 
	 * @config height
	 * @type Number
	 */
	height: {
		getter: function()
		{
			return this._height;
		},

		setter: function(val)
		{
			this._height = val;
			return val;
		}
	},
	
	/**
	 * Indicates the path used for the node.
	 *
	 * @config path
	 * @type String
	 */
	path: {
		readOnly: true,

		getter: function()
		{
			return this._path;
		}
	}
});
Y.VMLPath = VMLPath;
