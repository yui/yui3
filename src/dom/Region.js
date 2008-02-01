(function() {

    var M = function(Y) {

        /**
         * A region is a representation of an object on a grid.  It is defined
         * by the top, right, bottom, left extents, so is rectangular by default.  If 
         * other shapes are required, this class could be extended to support it.
         * @class Region
         * @param {Int} t the top extent
         * @param {Int} r the right extent
         * @param {Int} b the bottom extent
         * @param {Int} l the left extent
         * @constructor
         */
        Y.Region = function(t, r, b, l) {

            /**
             * The region's top extent
             * @property top
             * @type Int
             */
            this.top = t;
            
            /**
             * The region's top extent as index, for symmetry with set/getXY
             * @property 1
             * @type Int
             */
            this[1] = t;

            /**
             * The region's right extent
             * @property right
             * @type int
             */
            this.right = r;

            /**
             * The region's bottom extent
             * @property bottom
             * @type Int
             */
            this.bottom = b;

            /**
             * The region's left extent
             * @property left
             * @type Int
             */
            this.left = l;
            
            /**
             * The region's left extent as index, for symmetry with set/getXY
             * @property 0
             * @type Int
             */
            this[0] = l;
        };

        /**
         * Returns true if this region contains the region passed in
         * @method contains
         * @param  {Region}  region The region to evaluate
         * @return {Boolean}        True if the region is contained with this region, 
         *                          else false
         */
        Y.Region.prototype.contains = function(region) {
            return ( region.left   >= this.left   && 
                     region.right  <= this.right  && 
                     region.top    >= this.top    && 
                     region.bottom <= this.bottom    );

            // this.logger.debug("does " + this + " contain " + region + " ... " + ret);
        };

        /**
         * Returns the area of the region
         * @method getArea
         * @return {Int} the region's area
         */
        Y.Region.prototype.getArea = function() {
            return ( (this.bottom - this.top) * (this.right - this.left) );
        };

        /**
         * Returns the region where the passed in region overlaps with this one
         * @method intersect
         * @param  {Region} region The region that intersects
         * @return {Region}        The overlap region, or null if there is no overlap
         */
        Y.Region.prototype.intersect = function(region) {
            var t = Math.max( this.top,    region.top    );
            var r = Math.min( this.right,  region.right  );
            var b = Math.min( this.bottom, region.bottom );
            var l = Math.max( this.left,   region.left   );
            
            if (b >= t && r >= l) {
                return new Y.Region(t, r, b, l);
            } else {
                return null;
            }
        };

        /**
         * Returns the region representing the smallest region that can contain both
         * the passed in region and this region.
         * @method union
         * @param  {Region} region The region that to create the union with
         * @return {Region}        The union region
         */
        Y.Region.prototype.union = function(region) {
            var t = Math.min( this.top,    region.top    );
            var r = Math.max( this.right,  region.right  );
            var b = Math.max( this.bottom, region.bottom );
            var l = Math.min( this.left,   region.left   );

            return new Y.Region(t, r, b, l);
        };

        /**
         * toString
         * @method toString
         * @return string the region properties
         */
        Y.Region.prototype.toString = function() {
            return ( "Region {"    +
                     "top: "       + this.top    + 
                     ", right: "   + this.right  + 
                     ", bottom: "  + this.bottom + 
                     ", left: "    + this.left   + 
                     "}" );
        };

        /**
         * Returns a region that is occupied by the DOM element
         * @method getRegion
         * @param  {HTMLElement} el The element
         * @return {Region}         The region that the element occupies
         * @static
         */
        Y.Region.getRegion = function(el) {
            var p = Y.Dom.getXY(el);

            var t = p[1];
            var r = p[0] + el.offsetWidth;
            var b = p[1] + el.offsetHeight;
            var l = p[0];

            return new Y.Region(t, r, b, l);
        };

        /////////////////////////////////////////////////////////////////////////////


        /**
         * A point is a region that is special in that it represents a single point on 
         * the grid.
         * @namespace YAHOO.util
         * @class Point
         * @param {Int} x The X position of the point
         * @param {Int} y The Y position of the point
         * @constructor
         * @extends Y.Region
         */
        Y.Point = function(x, y) {
           if (YAHOO.lang.isArray(x)) { // accept input from Dom.getXY, Event.getXY, etc.
              y = x[1]; // dont blow away x yet
              x = x[0];
           }
           
            /**
             * The X position of the point, which is also the right, left and index zero (for Dom.getXY symmetry)
             * @property x
             * @type Int
             */

            this.x = this.right = this.left = this[0] = x;
             
            /**
             * The Y position of the point, which is also the top, bottom and index one (for Dom.getXY symmetry)
             * @property y
             * @type Int
             */
            this.y = this.top = this.bottom = this[1] = y;
        };

        Y.extend(Y.Point, Y.Region);

    };

    YUI.add("region", M, "3.0.0");

})();
