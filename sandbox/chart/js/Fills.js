function Fills(cfg)
{
    var attrs = {
        area: {
            getter: function()
            {
                return this._defaults || this._getAreaDefaults();
            },

            setter: function(val)
            {
                var defaults = this._defaults || this._getAreaDefaults();
                this._defaults = Y.merge(defaults, val);
            }
        }
    };
    this.addAttrs(attrs, cfg);
}

Fills.prototype = {
    /**
     * @private
     */
    _defaults: null,

    /**
	 * @protected
	 */
	drawFill: function()
	{
        if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var xcoords = this.get("xcoords").concat(),
			ycoords = this.get("ycoords").concat(),
			len = xcoords.length,
			firstX = xcoords[0],
			firstY = ycoords[0],
			lastX = firstX,
            lastY = firstY,
            lastValidX = lastX,
			lastValidY = lastY,
			nextX,
			nextY,
			i,
			styles = this.get("area"),
			graphic = this.get("graphic"),
            color = styles.color || this._getDefaultColor(this.get("graphOrder"));
        graphic.beginFill(color, styles.alpha);
        graphic.moveTo(lastX, lastY);
        for(i = 1; i < len; i = ++i)
		{
			nextX = xcoords[i];
			nextY = ycoords[i];
			if(isNaN(nextY))
			{
				lastValidX = nextX;
				lastValidY = nextY;
				continue;
			}
            graphic.lineTo(nextX, nextY);
			lastX = lastValidX = nextX;
			lastY = lastValidY = nextY;
        }
        if(this.get("direction") === "vertical")
        {
            graphic.lineTo(this._leftOrigin, lastY);
            graphic.lineTo(this._leftOrigin, firstY);
        }
        else
        {
            graphic.lineTo(lastX, this._bottomOrigin);
            graphic.lineTo(firstX, this._bottomOrigin);
        }
        graphic.lineTo(firstX, firstY);
        graphic.end();
	},

	_getAreaDefaults: function()
    {
        return {
            alpha: 0.5
        };
    }
};
Y.augment(Fills, Y.Attribute);
Y.Fills = Fills;
