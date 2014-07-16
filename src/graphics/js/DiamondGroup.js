/**
 * Abstract class for creating groups of diamonds with the same styles and dimensions.
 *
 * @class GroupDiamond
 * @constructor
 * @submodule graphics-group
 */
 DiamondGroup = function()
 {
    DiamondGroup.superclass.constructor.apply(this, arguments);
 };

 DiamondGroup.NAME = "diamondGroup";

 Y.extend(DiamondGroup, Y.ShapeGroup, {
    /**
     * Updates the diamond.
     *
     * @method _draw
     * @private
     */
    drawShape: function(cfg)
    {
        this.drawDiamond(cfg.x, cfg.y, cfg.width, cfg.height);
    }
 });

DiamondGroup.ATTRS = Y.ShapeGroup.ATTRS;
Y.DiamondGroup = DiamondGroup;
