YUI.add('transition-native', function(Y) {

/**
* The Native Transition Utility provides an API wrapper for CSS transitions.
* It is also the base module for the timer-based transition module.
* @module node
*/

/**
* Provides the base Transition class.
*
* @module node
* @submodule transition-native
*/

/**
 * A class for constructing transition instances.
 * @class Transition
 * @for Transition
 * @constructor
 * @extends Base
 */

var TRANSITION = '-webkit-transition',
    TRANSITION_CAMEL = 'WebkitTransition',
    TRANSITION_PROPERTY = '-webkit-transition-property',
    TRANSITION_DURATION = '-webkit-transition-duration',
    TRANSITION_TIMING_FUNCTION = '-webkit-transition-timing-function',
    TRANSITION_DELAY = '-webkit-transition-delay',
    TRANSITION_END = 'webkitTransitionEnd',

Transition = function() {
    this.init.apply(this, arguments);
};

Transition._reKeywords = /^(?:node|duration|iterations|easing|delay)$/;

Transition.useNative = false;

if (TRANSITION in Y.config.doc.documentElement.style) {
    Transition.useNative = true;
    Transition.supported = true; // TODO: remove
}

Y.Node.DOM_EVENTS[TRANSITION_END] = 1; 

Transition.NAME = 'transition';

Transition.DEFAULT_EASING = 'ease-in-out';
Transition.DEFAULT_DURATION = 0.5;
Transition.DEFAULT_DELAY = 0;

Transition._nodeAttrs = {};

Transition._count = 0;

Transition.prototype = {
    constructor: Transition,
    init: function(node, config) {
        var anim = this;
        if (!anim._running) {
            anim._node = node;
            anim._config = config;
            node._transition = anim; // cache for reuse

            anim._duration = ('duration' in config) ?
                config.duration: anim.constructor.DEFAULT_DURATION;

            anim._delay = ('delay' in config) ?
                config.delay: anim.constructor.DEFAULT_DELAY;

            anim._easing = config.easing || anim.constructor.DEFAULT_EASING;
            anim._count = 0; // track number of animated properties
            anim._running = false;

            anim.initAttrs(config);

        }

        return anim;
    },

    initAttrs: function(config) {
        var anim = this,
            node = anim._node,
            uid = Y.stamp(node),
            attrs = Transition._nodeAttrs[uid],
            duration,
            delay,
            easing,
            val,
            transition,
            attr;

        if (!attrs) {
            attrs = Transition._nodeAttrs[uid] = {};
        }

        if (config.transform && !config['-webkit-transform']) {
            config['-webkit-transform'] = config.transform;
            delete config.transform; // TODO: copy
        }

        for (attr in config) {
            if (config.hasOwnProperty(attr) && !Transition._reKeywords.test(attr)) {
                val = transition = config[attr];

                if (attrs[attr] && attrs[attr].transition) {
                    attrs[attr].transition._count--; // remapping attr to this transition
                } else {
                    Transition._count += 1;
                }

                if (typeof transition.value !== 'undefined') {
                    val = transition.value; 
                }

                if (typeof val === 'function') {
                    val = val.call(node, node);
                }

                duration = (typeof transition.duration !== 'undefined') ? transition.duration :
                        anim._duration;

                delay = (typeof transition.delay !== 'undefined') ? transition.delay :
                        anim._delay;

                if (!duration) { // make async and fire events
                    duration = 0.00001;
                }

                easing = transition.easing || anim._easing;
                anim._count++; // track number of bound properties

                attrs[attr] = {
                    value: val,
                    duration: duration,
                    delay: delay,
                    easing: easing,
                    transition: anim
                };
            }

        }
    },

    /**
     * Starts or an animation.
     * @method run
     * @chainable
     */    
    run: function(callback) {
        var anim = this;

        if (!anim._running) {
            anim._running = true;

            anim._node.fire('transition:start', {
                type: 'transition:start',
                config: anim._config
            });

            anim._start();
            anim._callback = callback;
        }

        return anim;
    },

    _start: function() {
        this._runNative();
    },

    _prepDur: function(dur) {
        dur = parseFloat(dur);

        return dur + 's';
    },

    _runNative: function(time) {
        var anim = this,
            node = anim._node,
            uid = Y.stamp(node),
            domNode = node._node,
            style = domNode.style,
            computed = getComputedStyle(domNode),
            attrs = Transition._nodeAttrs[uid],
            cssText = '',
            cssTransition = computed[TRANSITION_PROPERTY],

            transitionText = TRANSITION_PROPERTY + ': ',
            duration = TRANSITION_DURATION + ': ',
            easing = TRANSITION_TIMING_FUNCTION + ': ',
            delay = TRANSITION_DELAY + ': ',
            attr,
            name;

        // preserve existing transitions
        if (cssTransition !== 'all') {
            transitionText += cssTransition + ',';
            duration += computed[TRANSITION_DURATION] + ',';
            easing += computed[TRANSITION_TIMING_FUNCTION] + ',';
            delay += computed[TRANSITION_DELAY] + ',';

        }

        // run transitions mapped to this instance
        for (name in attrs) {
            attr = attrs[name];
            if (attrs.hasOwnProperty(name) && attr.transition === anim) {
                duration += anim._prepDur(attr.duration) + ',';
                delay += anim._prepDur(attr.delay) + ',';
                easing += (attr.easing) + ',';

                transitionText += name + ',';
                cssText += name + ': ' + attr.value + '; ';
            }
        }

        transitionText = transitionText.replace(/,$/, ';');
        duration = duration.replace(/,$/, ';');
        easing = easing.replace(/,$/, ';');
        delay = delay.replace(/,$/, ';');

        // only one native end event per node
        if (!node._hasTransitionEnd) {
            node.on(TRANSITION_END, anim._onNativeEnd);
            node._hasTransitionEnd = true;

        }

        style.cssText += transitionText + duration + easing + delay + cssText;

    },

    _end: function(elapsed) {
        var anim = this,
            node = anim._node,
            callback = anim._callback,
            data = {
                type: 'transition:end',
                config: anim._config,
                elapsedTime: elapsed 
            };

        anim._running = false;
        if (callback) {
            anim._callback = null;
            setTimeout(function() { // IE: allow previous update to finish
                callback.call(node, data);
            }, 1);
        }

        node.fire('transition:end', data);
    },

    _endNative: function() {
        var node = this._node;
        if (Transition._count <= 0) {
            node._node.style[TRANSITION_CAMEL] = '';
        }
    },

    _onNativeEnd: function(e) {
        var node = this,
            uid = Y.stamp(node),
            event = e._event,
            name = event.propertyName,
            elapsed = event.elapsedTime,
            attrs = Transition._nodeAttrs[uid],
            attr = attrs[name],
            anim = (attr) ? attr.transition :null,
            callback;

        if (anim) {
            callback = anim._callback;
            anim._count--;
            delete attrs[name];
            Transition._count--;
            node.fire('transition:propertyEnd', {
                type: 'propertyEnd',
                propertyName: name,
                elapsedTime: elapsed
            });

            if (anim._count <= 0)  {
                
                anim._endNative();
                anim._end(elapsed);
            }
        }
    },

    destroy: function() {
        this.detachAll();
        this._node = null;
    }
};

Y.Transition = Transition;
Y.TransitionNative = Transition; // TODO: remove

/** 
    Animate one or more css properties to a given value.
    <pre>example usage:
        Y.one('#demo').transition({
            duration: 1, // seconds
            easing: 'ease-out',
            height: '10px',
            width: '10px',
            opacity: { // per property duration and/or easing
                value: 0,
                duration: 2,
                easing: 'ease-in'
            }
        });
    </pre>
    @for node
    @method transition
    @param {Object} An object containing one or more style properties, a duration and an easing.
    @chainable
*/
Y.Node.prototype.transition = function(config, callback) {
    var anim = this._transition;
    
    if (anim && !anim._running) {
        anim.init(this, config);
    } else {
        anim = new Transition(this, config);
    }

    anim.run(callback);
    return this;
};



}, '@VERSION@' ,{requires:['node-base']});
