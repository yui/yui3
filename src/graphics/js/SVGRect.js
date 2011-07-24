/**
 * Draws rectangles
 *
 * @module graphics
 * @class SVGRect
 * @constructor
 */
SVGRect = function()
{
	SVGRect.superclass.constructor.apply(this, arguments);
};
SVGRect.NAME = "svgRect";
Y.extend(SVGRect, Y.SVGShape, {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "rect"
 });
SVGRect.ATTRS = Y.SVGShape.ATTRS;
Y.SVGRect = SVGRect;
