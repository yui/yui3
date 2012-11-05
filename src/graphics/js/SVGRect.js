/**
 * <a href="http://www.w3.org/TR/SVG/">SVG</a> implementation of the <a href="Rect.html">`Rect`</a> class.
 * `SVGRect` is not intended to be used directly. Instead, use the <a href="Rect.html">`Rect`</a> class.
 * If the browser has <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities, the <a href="Rect.html">`Rect`</a>
 * class will point to the `SVGRect` class.
 *
 * @module graphics
 * @class SVGRect
 * @constructor
 */
SVGRect = function()
{
	SVGRect.superclass.constructor.apply(this, arguments);
};
SVGRect.NAME = "rect";
Y.extend(SVGRect, Y.SVGShape, {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @type String
     * @private
     */
    _type: "rect"
 });
SVGRect.ATTRS = Y.SVGShape.ATTRS;
Y.SVGRect = SVGRect;
