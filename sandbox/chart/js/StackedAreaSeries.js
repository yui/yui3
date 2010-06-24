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
        value:"stacked"
    },
    direction: {
        value:"horizontal"
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
        var direction = this.get("direction"),
            node = Y.Node.one(this._parentNode).get("parentNode"),
            h = node.get("offsetHeight"),
            order = this.get("order"),
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            xcoords = this.get("xcoords"),
			ycoords = this.get("ycoords"),
			prevXCoords,
            prevYCoords,
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
        if(order > 0)
        {
            prevXCoords = seriesCollection[order - 1].get("xcoords").concat();
            prevYCoords = seriesCollection[order - 1].get("ycoords").concat();
            if(direction === "vertical")
            {
                len = prevXCoords.length;
                for(; i < len; ++i)
                {
                    if(!isNaN(prevXCoords[i]) && !isNaN(xcoords[i]))
                    {
                        xcoords[i] += prevXCoords[i];
                    }
                }
            }
            else
            {
                len = prevYCoords.length;
                for(; i < len; ++i)
                {
                    if(!isNaN(prevYCoords[i]) && !isNaN(ycoords[i]))
                    {
                        ycoords[i] = prevYCoords[i] - (h - ycoords[i]);
                    }
                }
            }
            allYCoords = ycoords.concat();
            allXCoords = xcoords.concat();
            allXCoords = allXCoords.concat(prevXCoords.concat().reverse());
            allYCoords = allYCoords.concat(prevYCoords.concat().reverse());
            firstX = allXCoords[0];
            firstY = allYCoords[0];
            allXCoords.push(firstX);
            allYCoords.push(firstY);
        }
        else
        {
            allYCoords = ycoords.concat();
            allXCoords = xcoords.concat();
            if(direction === "vertical")
            {
                allXCoords.push(this._leftOrigin);
                allXCoords.push(this._leftOrigin);
                allYCoords.push(allYCoords[allYCoords.length-1]);
                allYCoords.push(firstY);
            }
            else
            {
                allXCoords.push(allXCoords[allXCoords.length-1]);
                allXCoords.push(firstX);
                allYCoords.push(this._bottomOrigin);
                allYCoords.push(this._bottomOrigin);
            }
            allXCoords.push(firstX);
            allYCoords.push(firstY);
        }
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


		

		
