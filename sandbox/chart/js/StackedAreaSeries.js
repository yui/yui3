function StackedAreaSeries(config)
{
	StackedAreaSeries.superclass.constructor.apply(this, arguments);
}

StackedAreaSeries.NAME = "stackedSeries";

StackedAreaSeries.ATTRS = {
	type: {
		/**
		 * Indicates the type of graph.
		 */
        value:"stackedArea"
    }
};

Y.extend(StackedAreaSeries, Y.CartesianSeries, {
	/**
	 * @private
	 */
	drawSeries: function()
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
			styles = this.get("styles"),
			graphic = this.get("graphic");
        this._stackCoordinates();
        allXCoords = this._getAllStackedCoordinates("xcoords");
        allYCoords = this._getAllStackedCoordinates("ycoords");
        firstX = allXCoords[0];
        firstY = allYCoords[0];
        len = allXCoords.length;
        graphic.clear();
        graphic.beginFill(styles.color, styles.alpha);
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
	
	_getDefaultStyles: function()
    {
        return {
            color: "#000000",
            alpha: 1,
            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    }
});

Y.StackedAreaSeries = StackedAreaSeries;


		

		
