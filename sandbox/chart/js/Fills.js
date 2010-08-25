function Fills(){}

Fills.prototype = {
    /**
	 * @protected
	 */
	drawFill: function()
	{
        if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var xcoords = this.get("xcoords"),
			ycoords = this.get("ycoords"),
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
			styles = this.get("styles"),
			graphic = this.get("graphic");
        graphic.clear();
        graphic.beginFill(styles.color, styles.alpha);
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
	}
};

Y.Fills = Fills;
