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
    this.get("styles");
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

	/**
	 * @private
	 */
	drawStackedFill: function()
	{
        if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var xcoords = this.get("xcoords"),
			ycoords = this.get("ycoords"),
            allXCoords,
            allYCoords,
            len = xcoords.length,
			firstX = xcoords[0],
			firstY = ycoords[0],
            lastValidX = firstX,
			lastValidY = firstY,
			nextX,
			nextY,
			i = 0,
			styles = this.get("area"),
			graphic = this.get("graphic"),
            color = styles.color || this._getDefaultColor(this.get("graphOrder"));
        allXCoords = this._getAllStackedCoordinates("xcoords");
        allYCoords = this._getAllStackedCoordinates("ycoords");
        firstX = allXCoords[0];
        firstY = allYCoords[0];
        len = allXCoords.length;
        graphic.clear();
        graphic.beginFill(color, styles.alpha);
        graphic.moveTo(firstX, firstY);
        for(i = 1; i < len; i = ++i)
		{
			nextX = allXCoords[i];
			nextY = allYCoords[i];
			if(isNaN(nextY))
			{
				lastValidX = nextX;
				lastValidY = nextY;
				continue;
			}
            graphic.lineTo(nextX, nextY);
            lastValidX = nextX;
			lastValidY = nextY;
        }
        graphic.end();
	},
	
    /**
	 * @private
	 */
	drawAreaSpline: function()
	{
        if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var xcoords = this.get("xcoords"),
			ycoords = this.get("ycoords"),
            curvecoords = this.getCurveControlPoints(xcoords, ycoords),
			len = curvecoords.length,
            cx1,
            cx2,
            cy1,
            cy2,
            x,
            y,
            i = 0,
			firstX = xcoords[0],
            firstY = ycoords[0],
            styles = this.get("area"),
			graphic = this.get("graphic"),
            color = styles.color || this._getDefaultColor(this.get("graphOrder"));
        graphic.beginFill(color, styles.alpha);
        graphic.moveTo(firstX, firstY);
        for(; i < len; i = ++i)
		{
            x = curvecoords[i].endx;
            y = curvecoords[i].endy;
            cx1 = curvecoords[i].ctrlx1;
            cx2 = curvecoords[i].ctrlx2;
            cy1 = curvecoords[i].ctrly1;
            cy2 = curvecoords[i].ctrly2;
            graphic.curveTo(cx1, cy1, cx2, cy2, x, y);
        }
        if(this.get("direction") === "vertical")
        {
            graphic.lineTo(this._leftOrigin, y);
            graphic.lineTo(this._leftOrigin, firstY);
        }
        else
        {
            graphic.lineTo(x, this._bottomOrigin);
            graphic.lineTo(firstX, this._bottomOrigin);
        }
        graphic.lineTo(firstX, firstY);
        graphic.end();
	},
    
    /**
	 * @private
	 */
	drawStackedAreaSpline: function()
	{
        if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var xcoords = this.get("xcoords"),
			ycoords = this.get("ycoords"),
            curvecoords,
            order = this.get("order"),
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            prevXCoords,
            prevYCoords,
			len,
            cx1,
            cx2,
            cy1,
            cy2,
            x,
            y,
            i = 0,
			firstX,
            firstY,
            styles = this.get("area"),
			graphic = this.get("graphic"),
            color = styles.color || this._getDefaultColor(this.get("graphOrder"));
		firstX = xcoords[0];
        firstY = ycoords[0];
        curvecoords = this.getCurveControlPoints(xcoords, ycoords);
        len = curvecoords.length;
        graphic.beginFill(color, styles.alpha);
        graphic.moveTo(firstX, firstY);
        for(; i < len; i = ++i)
		{
            x = curvecoords[i].endx;
            y = curvecoords[i].endy;
            cx1 = curvecoords[i].ctrlx1;
            cx2 = curvecoords[i].ctrlx2;
            cy1 = curvecoords[i].ctrly1;
            cy2 = curvecoords[i].ctrly2;
            graphic.curveTo(cx1, cy1, cx2, cy2, x, y);
        }
        if(order > 0)
        {
            prevXCoords = seriesCollection[order - 1].get("xcoords").concat().reverse();
            prevYCoords = seriesCollection[order - 1].get("ycoords").concat().reverse();
            curvecoords = this.getCurveControlPoints(prevXCoords, prevYCoords);
            i = 0;
            len = curvecoords.length;
            graphic.lineTo(prevXCoords[0], prevYCoords[0]);
            for(; i < len; i = ++i)
            {
                x = curvecoords[i].endx;
                y = curvecoords[i].endy;
                cx1 = curvecoords[i].ctrlx1;
                cx2 = curvecoords[i].ctrlx2;
                cy1 = curvecoords[i].ctrly1;
                cy2 = curvecoords[i].ctrly2;
                graphic.curveTo(cx1, cy1, cx2, cy2, x, y);
            }
        }
        else
        {
            if(this.get("direction") === "vertical")
            {
                graphic.lineTo(this._leftOrigin, ycoords[ycoords.length-1]);
                graphic.lineTo(this._leftOrigin, firstY);
            }
            else
            {
                graphic.lineTo(xcoords[xcoords.length-1], this._bottomOrigin);
                graphic.lineTo(firstX, this._bottomOrigin);
            }

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
