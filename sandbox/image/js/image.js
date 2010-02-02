// This is functionality extracted from 3.0.0 Slider that supported arbitrary
// img tags and dynamic sizing.  This has been replaced in 3.1+ by skinning and
// a CSS requirement for custom UIs.

// This needs to use readyState for IE.



    /**
     * Used to determine if there is a current or pending request for the
     * thumbImage resource.
     *
     * @method _isImageLoading
     * @param img {Node} <code>img</code> Node
     * @return Boolean
     * @protected
     */
    _isImageLoading : function (img) {
        return img && !img.get(COMPLETE);
    },

    /**
     * Used to determine if the image resource loaded successfully or there was
     * an error.
     *
     * NOTES:
     * <ul>
     *    <li>img load error fired xbrowser for image resources not yet resolved</li>
     *    <li>img.complete reports false in IE for images not yet loaded as well as images that failed to load</li>
     *    <li>img.complete true && img.naturalWidth == 0 in FF and Safari indicate image failed to load</li>
     *    <li>img.complete && img.width == 0 in Opera indicates image failed to load</li>
     * </ul>
     *
     * @method _isImageLoaded
     * @param img {Node} <code>img</code> Node
     * @return Boolean
     * @protected
     */
    _isImageLoaded : function (img) {
        if (img) {
            var w = img.get('naturalWidth');
            return img.get(COMPLETE) && (!isNumber(w) ? img.get(WIDTH) : w);
        }

        return true;
    }

