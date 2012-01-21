/**
 * Contains algorithms for rendering a top axis.
 *
 * @module charts
 * @class TopAxisLayout
 * @constructor
 */
TopAxisLayout = function(){};

TopAxisLayout.prototype = {
    /**
     *  Default margins for text fields.
     *
     *  @private
     *  @method _getDefaultMargins
     *  @return Object
     */
    _getDefaultMargins: function() 
    {
        return {
            top: 0,
            left: 0,
            right: 0,
            bottom: 4
        };
    },
    
    /**
     * Sets the length of the tick on either side of the axis line.
     *
     * @method setTickOffsets
     * @protected
     */
    setTickOffsets: function()
    {
        var host = this,
            majorTicks = host.get("styles").majorTicks,
            tickLength = majorTicks.length,
            halfTick = tickLength * 0.5,
            display = majorTicks.display;
        host.set("leftTickOffset",  0);
        host.set("rightTickOffset",  0);
        switch(display)
        {
            case "inside" :
                host.set("bottomTickOffset", tickLength);
                host.set("topTickOffset", 0);
            break;
            case "outside" : 
                host.set("bottomTickOffset", 0);
                host.set("topTickOffset",  tickLength);
            break;
            case "cross" :
                host.set("topTickOffset", halfTick);
                host.set("bottomTickOffset", halfTick);
            break;
            default:
                host.set("topTickOffset", 0);
                host.set("bottomTickOffset", 0);
            break;
        }
    },

    /**
     * Calculates the coordinates for the first point on an axis.
     *
     * @method getLineStart
     * @protected
     */
    getLineStart: function()
    {
        var host = this,
            style = host.get("styles"),
            padding = style.padding,
            majorTicks = style.majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display,
            pt = {x:0, y:padding.top};
        if(display === "outside")
        {
            pt.y += tickLength;
        }
        else if(display === "cross")
        {
            pt.y += tickLength/2;
        }
        return pt; 
    },
    
    /**
     * Draws a tick
     *
     * @method drawTick
     * @param {Path} path reference to the path `Path` element in which to draw the tick.
     * @param {Object} pt hash containing x and y coordinates
     * @param {Object} tickStyles hash of properties used to draw the tick
     * @protected
     */
    drawTick: function(path, pt, tickStyles)
    {
        var host = this,
            style = host.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:pt.x, y:padding.top},
            end = {x:pt.x, y:tickLength + padding.top};
        host.drawLine(path, start, end);
    },
    
    /**
     * Calculates the point for a label.
     *
     * @method getLabelPoint
     * @param {Object} pt hash containing x and y coordinates
     * @return Object
     * @protected
     */
    getLabelPoint: function(pt)
    {
        return {x:pt.x, y:pt.y - this.get("topTickOffset")};
    },
    
    /**
     * Updates the value for the `maxLabelSize` for use in calculating total size.
     *
     * @method updateMaxLabelSize
     * @param {HTMLElement} label to measure
     * @protected
     */
    updateMaxLabelSize: function(label)
    {
        var host = this,
            props = this._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            sinRadians = props.sinRadians,
            cosRadians = props.cosRadians,
            labelWidth = label.offsetWidth,
            labelHeight = label.offsetHeight,
            max;
        this._labelWidths.push(Math.round(labelWidth));
        this._labelHeights.push(Math.round(labelHeight));
        if(rot === 0)
        {
            max = labelHeight;
        }
        else if(absRot === 90)
        {
            max = labelWidth;
        }
        else
        {
            max = (sinRadians * labelWidth) + (cosRadians * labelHeight); 
        }
        host._maxLabelSize = Math.max(host._maxLabelSize, max);
    },

    /**
     * Rotate and position title.
     *
     * @method positionTitle
     * @param {HTMLElement} label to rotate position
     * @protected
     */
    positionTitle: function(label)
    {
        var host = this,
            max,
            styles = host.get("styles").title,
            props = this._getTextRotationProps(styles),
            rot = props.rot,
            absRot = props.absRot,
            sinRadians = props.sinRadians,
            cosRadians = props.cosRadians,
            x = this.get("width")/2,
            y = styles.margin.top,
            leftOffset = 0,
            topOffset = 0,
            labelWidth = label.offsetWidth,
            labelHeight = label.offsetHeight;
        if(Y.config.doc.createElementNS)
        {
            if(rot === 0)
            {
                max = labelHeight;
                leftOffset -= labelWidth * 0.5;
            }
            else if(absRot === 90)
            {
                max = labelWidth;
                if(rot === 90)
                {
                    leftOffset += labelHeight/2;
                }
                else
                {
                    topOffset += labelWidth;
                    leftOffset -= labelHeight/2;
                }
            }
            else
            {
                max = (sinRadians * labelWidth) + (cosRadians * labelHeight);
                if(rot > 0)
                {
                    leftOffset -= (cosRadians * labelWidth)/2 - (sinRadians * labelHeight)/2;
                }
                else
                {
                    topOffset += (sinRadians * labelWidth);
                    leftOffset -= (cosRadians * labelWidth)/2 + (sinRadians * labelHeight)/2;
                }
            }
            x += leftOffset;
            y += topOffset;
            props.x = Math.round(x);
            props.y = Math.round(y);
        }
        else
        {
            label.style.filter = null; 
            labelWidth = Math.round(label.offsetWidth);
            labelHeight = Math.round(label.offsetHeight);
            if(rot === 0)
            {
                leftOffset -= labelWidth * 0.5;
                max = labelHeight;
            }
            else if(rot === 90)
            {
                leftOffset -= labelHeight * 0.5;
                max = labelWidth;
            }
            else if(rot === -90)
            {
                leftOffset -= labelHeight * 0.5;
                max = labelWidth;
            }
            else
            {
                max = (sinRadians * labelWidth) + (cosRadians * labelHeight);
                leftOffset -= ((cosRadians * labelWidth) + (sinRadians * labelHeight))/2;
            }
            x += leftOffset;
            y += topOffset;
            props.x = Math.round(x);
            props.y = Math.round(y);
        }
        this._titleSize = max;
        this._rotate(label, props);
    },

    /**
     * Rotate and position labels.
     *
     * @method positionLabel
     * @param {HTMLElement} label to rotate position
     * @param {Object} pt hash containing the x and y coordinates in which the label will be positioned
     * against.
     * @protected
     */
    positionLabel: function(label, pt, styles, i)
    {
        var host = this,
            titleStyles = styles.title,
            totalTitleSize = this.get("title") ? this._titleSize + titleStyles.margin.top + titleStyles.margin.bottom : 0,
            maxLabelSize = host._maxLabelSize,
            leftOffset = pt.x,
            topOffset = pt.y + totalTitleSize + maxLabelSize,
            props = this._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            labelWidth = this._labelWidths[i],
            labelHeight = this._labelHeights[i];
        if(rot === 0)
        {
            props.transformOrigin = [0, 0];
            leftOffset -= labelWidth * 0.5;
            topOffset -= labelHeight;
        }
        else
        {
            if(rot === 90)
            {
                leftOffset -= labelWidth;
                topOffset -= (labelHeight * 0.5);
                props.transformOrigin = [1, 0.5];
            }
            else if (rot === -90)
            {
                props.transformOrigin = [0, 0.5];
                topOffset -= (labelHeight * 0.5);
            }    
            else if(rot > 0)
            {
                props.transformOrigin = [1, 0.5];
                leftOffset -= labelWidth;
                topOffset -= labelHeight - (labelHeight * rot/180);
            }
            else
            {
                props.transformOrigin = [0, 0.5];
                topOffset -= labelHeight - (labelHeight * absRot/180);
            }
        }
        props.x = Math.round(leftOffset);
        props.y = Math.round(topOffset);
        props.labelWidth = labelWidth;
        props.labelHeight = labelHeight;
        this._rotate(label, props);
    },

    /**
     * Calculates the size and positions the content elements.
     *
     * @method setSizeAndPosition
     * @protected
     */
    setSizeAndPosition: function()
    {
        var host = this,
            labelSize = host._maxLabelSize,
            tickOffset = host.get("topTickOffset"),
            style = host.get("styles"),
            margin = style.label.margin,
            graphic = host.get("graphic"),
            sz = tickOffset + labelSize,
            titleMargin = style.title.margin;
        if(margin && margin.bottom)
        {
            sz += margin.bottom;
        }
        if(this.get("title"))
        {
            sz += this._titleSize + titleMargin.top + titleMargin.bottom;
        }
        host.set("height", sz);
        graphic.set("y", sz - tickOffset);
    },
    
    /**
     * Adjusts position for inner ticks.
     *
     * @method offsetNodeForTick
     * @param {Node} cb contentBox of the axis
     * @protected
     */
    offsetNodeForTick: function(cb)
    {
    },

    /**
     * Assigns a height based on the size of the contents.
     *
     * @method setCalculatedSize
     * @protected
     */
    setCalculatedSize: function()
    {
        var host = this,
            graphic = host.get("graphic"),
            styles = host.get("styles"),
            labelMargin = styles.label.margin,
            titleMargin = styles.title.margin,
            totalLabelSize = labelMargin.bottom + host._maxLabelSize,
            totalTitleSize = host.get("title") ? titleMargin.top + titleMargin.bottom + host._titleSize : 0,
            topTickOffset = this.get("topTickOffset"),
            ttl = Math.round(topTickOffset + totalLabelSize + totalTitleSize);
        host.set("height", ttl);
        graphic.set("y", ttl - topTickOffset);
    }
};
Y.TopAxisLayout = TopAxisLayout;

