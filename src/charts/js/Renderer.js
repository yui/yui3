/**
 * The Renderer class is a base class for chart components that use the <code>styles</code>
 * attribute.
 *
 * @class Renderer
 * @constructor
 */
function Renderer(){}

Renderer.ATTRS = {
        /**
         * Hash of style properties for class
         * 
         * @attribute styles
         * @type Object
         */
        styles:
        {
            getter: function()
            {
                this._styles = this._styles || this._getDefaultStyles();
                return this._styles;
            },

            setter: function(val)
            {
                this._styles = this._setStyles(val);
            }
        },
        
        /**
         * The graphic in which drawings will be rendered.
         *
         * @attribute graphic
         * @type Graphic
         */
        graphic: {}
};
Renderer.NAME = "renderer";

Renderer.prototype = {
    /**
     * @private
     */
	_styles: null,
	
    /**
     * @protected
     *
     * Method used by <code>styles</code> setter.
     *
     * @method _setStyles
     * @param {Object} newStyles Hash of properties to update.
     * @return Object
     */
	_setStyles: function(newstyles)
	{
		var styles = this.get("styles");
        return this._mergeStyles(newstyles, styles);
	},
    
    /**
     * @protected
     *
     * Merges to object literals so that only specified properties are 
     * overwritten.
     *
     * @method _mergeStyles
     * @param {Object} a Hash of new styles
     * @param {Object} b Hash of original styles
     * @return Object
     */
    _mergeStyles: function(a, b)
    {
        if(!b)
        {
            b = {};
        }
        var newstyles = Y.merge(b, {});
        Y.Object.each(a, function(value, key, a)
        {
            if(b.hasOwnProperty(key) && Y.Lang.isObject(value) && !Y.Lang.isArray(value))
            {
                newstyles[key] = this._mergeStyles(value, b[key]);
            }
            else
            {
                newstyles[key] = value;
            }
        }, this);
        return newstyles;
    },

    /**
     * @protected
     *
     * Gets the default value for the <code>styles</code> attribute. 
     *
     * @method _getDefaultStyles
     * @return Object
     */
    _getDefaultStyles: function()
    {
        return {padding:{
            top:0,
            right: 0,
            bottom: 0,
            left: 0
        }};
    }
};

Y.augment(Renderer, Y.Attribute);
Y.Renderer = Renderer;

