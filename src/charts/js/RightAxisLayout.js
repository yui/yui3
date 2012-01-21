/**
 * RightAxisLayout contains algorithms for rendering a right axis.
 *
 * @module charts
 * @class RightAxisLayout
 * @constructor
 */
RightAxisLayout = function(){};

RightAxisLayout.prototype = {
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
            left: 4,
            right: 0,
            bottom: 0
        };
    },

    /**
     * Sets the length of the tick on either side of the axis line.
     *
     * @method setTickOffset
     * @protected
     */
    setTickOffsets: function()
    {
        var host = this,
            majorTicks = host.get("styles").majorTicks,
            tickLength = majorTicks.length,
            halfTick = tickLength * 0.5,
            display = majorTicks.display;
        host.set("topTickOffset",  0);
        host.set("bottomTickOffset",  0);
        
        switch(display)
        {
            case "inside" :
                host.set("leftTickOffset", tickLength);
                host.set("rightTickOffset", 0);
            break;
            case "outside" : 
                host.set("leftTickOffset", 0);
                host.set("rightTickOffset", tickLength);
            break;
            case "cross" :
                host.set("rightTickOffset", halfTick);
                host.set("leftTickOffset", halfTick);
            break;
            default:
                host.set("leftTickOffset", 0);
                host.set("rightTickOffset", 0);
            break;
        }
    },

    /**
     * Draws a tick
     *
     * @method drawTick
     * @param {Path} path reference to the path `Path` element in which to draw the tick.
     * @param {Object} pt Point on the axis in which the tick will intersect.
     * @param {Object) tickStyle Hash of properties to apply to the tick.
     * @protected
     */
    drawTick: function(path, pt, tickStyles)
    {
        var host = this,
            style = host.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:padding.left, y:pt.y},
            end = {x:padding.left + tickLength, y:pt.y};
        host.drawLine(path, start, end);
    },
    
    /**
     * Calculates the coordinates for the first point on an axis.
     *
     * @method getLineStart
     * @return {Object}
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
            pt = {x:padding.left, y:padding.top};
        if(display === "inside")
        {
            pt.x += tickLength;
        }
        else if(display === "cross")
        {
            pt.x += tickLength/2;
        }
        return pt;
    },
    
    /**
     * Calculates the point for a label.
     *
     * @method getLabelPoint
     * @param {Object} point Point on the axis in which the tick will intersect.
     * @return {Object} 
     * @protected
     */
    getLabelPoint: function(point)
    {
        return {x:point.x + this.get("rightTickOffset"), y:point.y};
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
            max,
            labelWidth = label.offsetWidth,
            labelHeight = label.offsetHeight;
        this._labelWidths.push(Math.round(labelWidth));
        this._labelHeights.push(Math.round(labelHeight));
        if(rot === 0)
        {
            max = labelWidth;
        }
        else if(absRot === 90)
        {
            max = labelHeight;
        }
        else
        {
            max = (cosRadians * labelWidth) + (sinRadians * labelHeight);
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
            margin = styles.margin,
            props = this._getTextRotationProps(styles),
            rot = props.rot,
            absRot = props.absRot,
            sinRadians = props.sinRadians,
            cosRadians = props.cosRadians,
            x = 0,
            y = this.get("height")/2,
            leftOffset = this._maxLabelSize + margin.left + this.get("rightTickOffset") + this.get("styles").label.margin.left,
            topOffset = 0,
            labelWidth = label.offsetWidth,
            labelHeight = label.offsetHeight;
        if(Y.config.doc.createElementNS)
        {
            if(rot === 0)
            {
                max = labelWidth;
                topOffset -= labelHeight * 0.5;
            }
            else if(absRot === 90)
            {
                max = labelHeight;
                if(rot === 90)
                {
                    topOffset -= labelWidth * 0.5;
                    leftOffset += labelHeight;
                }
                else
                {
                    topOffset += labelWidth * 0.5;
                }
            }
            else
            {
                max = (cosRadians * labelWidth) + (sinRadians * labelHeight);
                if(rot > 0)
                {
                    topOffset -= ((sinRadians * labelWidth) + (cosRadians * labelHeight))/2;
                    leftOffset += Math.min(labelHeight, (sinRadians * labelHeight));
                }
                else
                {
                    topOffset += (sinRadians * labelWidth)/2 - (cosRadians * labelHeight)/2;
                }
            }
            y += topOffset;
            x += leftOffset;
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
                topOffset -= labelHeight * 0.5;
                max = labelWidth;
            }
            else if(rot === 90)
            {
                topOffset -= labelWidth * 0.5;
                max = labelHeight;
            }
            else if(rot === -90)
            {
                topOffset -= labelWidth * 0.5;
                max = labelHeight;
            }
            else
            {
                max = (cosRadians * labelWidth) + (sinRadians * labelHeight);
                topOffset -= ((sinRadians * labelWidth) + (cosRadians * labelHeight))/2;
            }
            y += topOffset;
            x += leftOffset;
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
            tickOffset = host.get("rightTickOffset"),
            labelStyles = styles.label,
            margin = 0,
            leftOffset = pt.x,
            topOffset = pt.y,
            props = this._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            labelWidth = this._labelWidths[i],
            labelHeight = this._labelHeights[i];
        if(labelStyles.margin && labelStyles.margin.left)
        {
            margin = labelStyles.margin.left;
        }
        if(rot === 0)
        {
            topOffset -= labelHeight * 0.5;
        }
        else if(rot === 90)
        {
            leftOffset -= labelWidth * 0.5;
            topOffset -= labelHeight;
            props.transformOrigin = [0.5, 1];
        }
        else if(rot === -90)
        {
            leftOffset -= labelWidth * 0.5;
            props.transformOrigin = [0.5, 0];
        }
        else
        {
            topOffset -= labelHeight * 0.5;
            leftOffset += labelHeight/2 * absRot/90;
            props.transformOrigin = [0, 0.5];
        }
        leftOffset += margin;
        leftOffset += tickOffset;
        props.labelWidth = labelWidth;
        props.labelHeight = labelHeight;
        props.x = Math.round(leftOffset);
        props.y = Math.round(topOffset);
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
            label = host.get("styles").label,
            labelSize = host._maxLabelSize,
            tickOffset = host.get("rightTickOffset"),
            sz = tickOffset + labelSize;
        if(label.margin && label.margin.left)
        {
            sz += label.margin.left;
        }
        sz += this._titleSize;
        host.set("width", sz);
        host.get("contentBox").setStyle("width", sz);
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
        var host = this,
            tickOffset = host.get("leftTickOffset"),
            offset = 0 - tickOffset;
        cb.setStyle("left", offset);
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
            totalTitleSize = host.get("title") ? titleMargin.left + titleMargin.right + host._titleSize : 0,
            ttl = Math.round(host.get("rightTickOffset") + host._maxLabelSize + totalTitleSize + labelStyle.margin.left);
        host.set("width", ttl);
    }
};

Y.RightAxisLayout = RightAxisLayout;
