/**
 * <a href="http://www.w3.org/TR/NOTE-VML">VML</a> implementation of the <a href="Path.html">`Path`</a> class. 
 * `VMLPath` is not intended to be used directly. Instead, use the <a href="Path.html">`Path`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> and <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> 
 * capabilities, the <a href="Path.html">`Path`</a> class will point to the `VMLPath` class.
 *
 * @module graphics
 * @class VMLPath
 * @extends VMLShape
 */
VMLPath = function()
{
	VMLPath.superclass.constructor.apply(this, arguments);
};

VMLPath.NAME = "vmlPath";
Y.extend(VMLPath, Y.VMLShape);
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
			var val = Math.max(this._right - this._left, 0);
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
			return Math.max(this._bottom - this._top, 0);
		}
	},
	
	/**
	 * Indicates the path used for the node.
	 *
	 * @config path
	 * @type String
     * @readOnly
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
