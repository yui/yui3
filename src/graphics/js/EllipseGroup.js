/**
 * Abstract class for creating groups of ellipses with the same styles and dimensions.
 *
 * @class EllipseGroup
 * @constructor
 * @submodule graphics-group
 */
 EllipseGroup = function()
 {
    EllipseGroup.superclass.constructor.apply(this, arguments);
 };

 EllipseGroup.NAME = "ellipseGroup";

 Y.extend(EllipseGroup, Y.ShapeGroup, {
    /**
     * Updates the ellipse.
     *
     * @method _draw
     * @private
     */
    drawShape: function(cfg)
    {
        this.drawEllipse(cfg.x, cfg.y, cfg.width, cfg.height);
    }
 });

EllipseGroup.ATTRS = Y.ShapeGroup.ATTRS;
Y.EllipseGroup = EllipseGroup;
