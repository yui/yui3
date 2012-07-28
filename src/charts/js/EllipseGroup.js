/**
 * Abstract class for creating groups of diamonds with the same styles and dimensions.
 *
 * @module charts
 * @submodule charts-base
 * @class EllipseGroup
 * @constructor
 */
 EllipseGroup = function(cfg)
 {
    EllipseGroup.superclass.constructor.apply(this, arguments);
 };
    
 EllipseGroup.NAME = "diamondGroup";

 Y.extend(EllipseGroup, Y.ShapeGroup, {    
    /**
     * Updates the diamond.
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
