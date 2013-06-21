/**
 * Provides functionality for managing labels in a chart.
 *
 * @module charts
 * @submodule charts-labelcache
 */
var DOCUMENT = Y.config.doc;

Y.ChartsLabelCache = function() {};
Y.ChartsLabelCache.prototype = {
    /**
     * Creates a cache of labels that can be re-used when the axis redraws.
     *
     * @method _createLabelCache
     * @private
     */
    _createLabelCache: function()
    {
        if(this._labels)
        {
            while(this._labels.length > 0)
            {
                this._labelCache.push(this._labels.shift());
            }
        }
        else
        {
            this._clearLabelCache();
        }
        this._labels = [];
    },

    /**
     * Removes axis labels from the dom and clears the label cache.
     *
     * @method _clearLabelCache
     * @private
     */
    _clearLabelCache: function()
    {
        if(this._labelCache)
        {
            var len = this._labelCache.length,
                i = 0,
                label;
            for(; i < len; ++i)
            {
                label = this._labelCache[i];
                this._removeChildren(label);
                Y.Event.purgeElement(label, true);
                label.parentNode.removeChild(label);
            }
        }
        this._labelCache = [];
    },

    /**
     * Removes all DOM elements from an HTML element. Used to clear out labels during detruction
     * phase.
     *
     * @method _removeChildren
     * @private
     */
    _removeChildren: function(node)
    {
        if(node.hasChildNodes())
        {
            var child;
            while(node.firstChild)
            {
                child = node.firstChild;
                this._removeChildren(child);
                node.removeChild(child);
            }
        }
    },

    /**
     * Creates and appends a label to the dom.
     *
     * @method _getLabel
     * @param {HTML} parentNode The dom element in which the label will be attached.
     * @param {String} className Class to be added to the label
     * @return HTML
     * @private
     */
    _getLabel: function(parentNode, className)
    {
        var labelCache = this._labelCache,
            label;
        if(labelCache && labelCache.length > 0)
        {
            label = labelCache.shift();
            label.innerHTML = "";
        }
        else
        {
            label = DOCUMENT.createElement("span");
            if(className)
            {
                label.className = Y.Lang.trim([label.className, className].join(' '));
            }
            Y.one(parentNode).append(label);
        }
        if(!DOCUMENT.createElementNS)
        {
            if(label.style.filter)
            {
                label.style.filter = null;
            }
        }
        label.style.display = "block";
        label.style.whiteSpace = "nowrap";
        label.style.position = "absolute";
        return label;
    }
};
