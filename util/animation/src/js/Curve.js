
    /**
     * Usage:
     * <pre>
     *  var anim = new Y.Anim({
     *      node: '#foo',
     *
     *      to: {
     *          curve: [ [0, 100], [500, 200], [800, 300] ]
     *       }
     *  });
     *   
     *  anim.run(); 
     * </pre>
     *
     */

Y.Anim.CUSTOM_ATTRIBUTES.curve = {
    set: function(node, att, from, to, elapsed, duration, fn) {
        var t = fn(elapsed, 0, 100, duration) / 100;
        node.setXY(Y.Anim.getBezier(to, t));
    },

    get: function(node, att) {
        return node.getXY();
    },

    reverse: function(val) {
        var to = [],
            from  = val.from;
       for (var i = 0, len = val.to.length; i < len; ++i) {
            to.unshift(val.to[i]); 
        } 

        val.from = val.to.pop();
        val.to = to;
console.log(val);
        return val;
    }
};

/**
 * Get the current position of the animated element based on t.
 * Each point is an array of "x" and "y" values (0 = x, 1 = y)
 * At least 2 points are required (start and end).
 * First point is start. Last point is end.
 * Additional control points are optional.     
 * @method getBezier
 * @static
 * @param {Array} points An array containing Bezier points
 * @param {Number} t A number between 0 and 1 which is the basis for determining current position
 * @return {Array} An array containing int x and y member data
 */
Y.Anim.getBezier = function(points, t) {  
    var n = points.length;
    var tmp = [];

    for (var i = 0; i < n; ++i){
        tmp[i] = [points[i][0], points[i][1]]; // save input
    }
    
    for (var j = 1; j < n; ++j) {
        for (i = 0; i < n - j; ++i) {
            tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
            tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
        }
    }

    return [ tmp[0][0], tmp[0][1] ]; 

};
