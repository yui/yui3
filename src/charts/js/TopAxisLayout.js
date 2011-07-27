/**
 * Contains algorithms for rendering a top axis.
 *
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
     * @param {Object} pt hash containing x and y coordinates
     * @param {Object} tickStyles hash of properties used to draw the tick
     * @protected
     */
    drawTick: function(pt, tickStyles)
    {
        var host = this,
            style = host.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:pt.x, y:padding.top},
            end = {x:pt.x, y:tickLength + padding.top};
        host.drawLine(start, end, tickStyles);
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
            m11 = props.m11,
            m12 = props.m12,
            m21 = props.m21,
            m22 = props.m22,
            max;
        if(!DOCUMENT.createElementNS)
        {
            label.style.filter = 'progid:DXImageTransform.Microsoft.Matrix(M11=' + m11 + ' M12=' + m12 + ' M21=' + m21 + ' M22=' + m22 + ' sizingMethod="auto expand")';
            host.set("maxLabelSize", Math.max(host.get("maxLabelSize"), label.offsetHeight));
        }
        else
        {
            label.style.msTransform = "rotate(0deg)";
            if(rot === 0)
            {
                max = label.offsetHeight;
            }
            else if(absRot === 90)
            {
                max = label.offsetWidth;
            }
            else
            {
                max = (sinRadians * label.offsetWidth) + (cosRadians * label.offsetHeight); 
            }
            host.set("maxLabelSize",  Math.max(host.get("maxLabelSize"), max));
        }
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
            label.style.left = Math.round(x) + "px";
            label.style.top = Math.round(y) + "px";
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
    positionLabel: function(label, pt)
    {
        var host = this,
            tickOffset = host.get("topTickOffset"),
            style = host.get("styles").label,
            titleStyles = host.get("styles").title,
            totalTitleSize = this.get("title") ? this._titleSize + titleStyles.margin.top + titleStyles.margin.bottom : 0,
            margin = 0,
            leftOffset = pt.x,
            topOffset = pt.y + totalTitleSize,
            props = this._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            sinRadians = props.sinRadians,
            cosRadians = props.cosRadians,
            maxLabelSize = host.get("maxLabelSize"),
            labelWidth = Math.round(label.offsetWidth),
            labelHeight = Math.round(label.offsetHeight);
        if(style.margin && style.margin.bottom)
        {
            margin = style.margin.bottom;
        }
        if(!DOCUMENT.createElementNS)
        {
            label.style.filter = null;
            labelWidth = Math.round(label.offsetWidth);
            labelHeight = Math.round(label.offsetHeight);
            if(rot === 0)
            {
                leftOffset -= labelWidth * 0.5;
            }
            else if(absRot === 90)
            {
                leftOffset -= labelHeight * 0.5;
            }
            else if(rot > 0)
            {
                leftOffset -= (cosRadians * labelWidth) + Math.min((sinRadians * labelHeight), (rot/180 * labelHeight));
                topOffset -= (sinRadians * labelWidth) + (cosRadians * (labelHeight));
                topOffset += maxLabelSize;
            }
            else
            {
                leftOffset -= sinRadians * (labelHeight * 0.5);
                topOffset -= (sinRadians * labelWidth) + (cosRadians * (labelHeight));
                topOffset += maxLabelSize;
            }
            topOffset -= tickOffset;
            label.style.left = Math.round(leftOffset);
            label.style.top = Math.round(topOffset);
            this._rotate(label, props);
            return;
        }
        label.style.msTransform = "rotate(0deg)";
        labelWidth = Math.round(label.offsetWidth);
        labelHeight = Math.round(label.offsetHeight);
        if(rot === 0)
        {
            leftOffset -= labelWidth * 0.5;
            topOffset -= labelHeight;
        }
        else if(rot === 90)
        {
            leftOffset += labelHeight * 0.5;
            topOffset -= labelWidth;
        }
        else if(rot === -90)
        {
            leftOffset -= labelHeight * 0.5;
            topOffset -= 0;
        }
        else if(rot < 0)
        {
            leftOffset -= (sinRadians * (labelHeight * 0.6));
            topOffset -= (cosRadians * labelHeight);
        }
        else
        {
            leftOffset -= (cosRadians * labelWidth) - (sinRadians * (labelHeight * 0.6));
            topOffset -= (sinRadians * labelWidth) + (cosRadians * labelHeight);
        }
        topOffset -= tickOffset;
        props.x = Math.round(leftOffset);
        props.y = Math.round(host.get("maxLabelSize") + topOffset);
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
            labelSize = host.get("maxLabelSize"),
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
            styles = host.get("styles"),
            labelMargin = styles.label.margin,
            titleMargin = styles.title.margin,
            totalLabelSize = labelMargin.top + labelMargin.bottom + host.get("maxLabelSize"),
            totalTitleSize = host.get("title") ? titleMargin.top + titleMargin.bottom + host._titleSize : 0,
            ttl = Math.round(host.get("topTickOffset") + totalLabelSize + totalTitleSize);
        host.set("height", ttl);
    }
};
Y.TopAxisLayout = TopAxisLayout;

