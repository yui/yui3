YUI.add('anim-shape', function(Y) {

var NUM = Number,
COLOR = "color",
STOPS = "stops",
TYPE = "type",
GETUPDATEDSTOPS = function(anim, from, to, elapsed, duration, fn)
{
    var i = 0,
        getUpdatedColorValue = Y.Anim.getUpdatedColorValue,
        toStop,
        fromStop,
        prop,
        len = to.length,
        color,
        opacity,
        offset,
        rotation,
        r,
        fx,
        fy,
        cx,
        cy,
        stops = [],
        stop;
    for(; i < len; i = i + 1)
    {
        toStop = to[i];
        fromStop = from[i];
        stop = {};
        for(prop in toStop)
        {
            if(toStop.hasOwnProperty(prop))
            {
                if(prop == COLOR)
                {
                    stop[prop] = Y.Color.toHex(getUpdatedColorValue(Y.Color.toHex(fromStop[prop]), Y.Color.toHex(toStop[prop]), elapsed, duration, fn));
                }
                else
                {
                    stop[prop] = fn(elapsed, NUM(fromStop[prop]), NUM(toStop[prop]) - NUM(fromStop[prop]), duration);
                }
            }
        }
        stops.push(stop);
    }
    return stops;
},
FILLANDSTROKEBEHAVIOR = {
    set: function(anim, att, from, to, elapsed, duration, fn) {
        var i,
        updated = {},
        getUpdatedColorValue = Y.Anim.getUpdatedColorValue,
        getUpdatedStops = GETUPDATEDSTOPS;
        for(i in to)
        {
            if(to.hasOwnProperty(i) && i != TYPE)
            {
                switch(i)
                {
                    case COLOR :
                        updated[i] = getUpdatedColorValue(from[i], to[i], elapsed, duration, fn);
                    break;
                    case STOPS :
                        updated[i] = getUpdatedStops(anim, from[i], to[i], elapsed, duration, fn);
                    break;
                    default :
                        updated[i] = fn(elapsed, NUM(from[i]), NUM(to[i]) - NUM(from[i]), duration);
                    break;
                }
            }
        }
        anim._node.set(att, updated);
    }
};
Y.Anim.behaviors.fill = FILLANDSTROKEBEHAVIOR;
Y.Anim.behaviors.stroke = FILLANDSTROKEBEHAVIOR; 



}, '@VERSION@' ,{requires:['anim-color','anim-shape-transform']});
