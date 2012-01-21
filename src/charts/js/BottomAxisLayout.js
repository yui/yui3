/**
 * Contains algorithms for rendering a bottom axis.
 *
 * @module charts
 * @class BottomAxisLayout
 * @Constructor
 */
BottomAxisLayout = function(){};

BottomAxisLayout.prototype = {
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
            top: 4,
            left: 0,
            right: 0,
            bottom: 0
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
                host.set("topTickOffset", tickLength);
                host.set("bottomTickOffset", 0);
            break;
            case "outside" : 
                host.set("topTickOffset", 0);
                host.set("bottomTickOffset", tickLength);
            break;
            case "cross":
                host.set("topTickOffset",  halfTick);
                host.set("bottomTickOffset",  halfTick);
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
        var style = this.get("styles"),
            padding = style.padding,
            majorTicks = style.majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display,
            pt = {x:0, y:padding.top};
        if(display === "inside")
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
     * @param {Object} pt Object containing x and y coordinates
     * @return Object
     * @protected
     */
    getLabelPoint: function(point)
    {
        return {x:point.x, y:point.y + this.get("bottomTickOffset")};
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
            labelWidth = Math.round(label.offsetWidth),
            labelHeight = Math.round(label.offsetHeight),
            max;
        this._labelWidths.push(labelWidth);
        this._labelHeights.push(labelHeight);
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
            y = this._maxLabelSize + this.get("styles").label.margin.top + styles.margin.top + this.get("bottomTickOffset"),
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
                if(rot === -90)
                {
                    topOffset += labelWidth;
                    leftOffset -= labelHeight;
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
                    topOffset += (sinRadians * labelWidth) - (cosRadians * labelHeight)/2;
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
            tickOffset = host.get("bottomTickOffset"),
            labelStyles = styles.label,
            margin = 0,
            props = this._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            leftOffset = Math.round(pt.x),
            topOffset = Math.round(pt.y),
            labelWidth = this._labelWidths[i],
            labelHeight = this._labelHeights[i];
        if(labelStyles.margin && labelStyles.margin.top)
        {
            margin = labelStyles.margin.top;
        }
        if(rot > 0)
        {
            props.transformOrigin = [0, 0.5];
            topOffset -= labelHeight/2 * rot/90;
        }
        else if(rot < 0)
        {
            props.transformOrigin = [1, 0.5];
            leftOffset -= labelWidth;
            topOffset -= labelHeight/2 * absRot/90;
        }
        else
        {
            props.transformOrigin = [0, 0];
            leftOffset -= labelWidth * 0.5;
        }
        topOffset += margin;
        topOffset += tickOffset;
        props.labelWidth = labelWidth;
        props.labelHeight = labelHeight;
        props.x = leftOffset;
        props.y = topOffset;
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
            tickLength = host.get("bottomTickLength"),
            style = host.get("styles"),
            sz = tickLength + labelSize,
            margin = style.label.margin;
        if(margin && margin.top)
        {   
            sz += margin.top;
        }
        sz = Math.round(sz);
        host.set("height", sz);
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
        var host = this;
        host.get("contentBox").setStyle("top", 0 - host.get("topTickOffset"));
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
            styles = host.get("styles"),
            labelStyle = styles.label,
            titleMargin = styles.title.margin,
            totalTitleSize = host.get("title") ? titleMargin.top + titleMargin.bottom + host._titleSize : 0,
            ttl = Math.round(host.get("bottomTickOffset") + host._maxLabelSize + labelStyle.margin.top + totalTitleSize);
        host.set("height", ttl);
    }
};
Y.BottomAxisLayout = BottomAxisLayout;
