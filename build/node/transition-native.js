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

var START = 'transition:start',
    END = 'transition:end',
    PROPERTY_END = 'transition:propertyEnd',

    TRANSITION = '-webkit-transition',
    TRANSITION_CAMEL = 'WebkitTransition',
    TRANSITION_PROPERTY = '-webkit-transition-property',
    TRANSITION_DURATION = '-webkit-transition-duration',
    TRANSITION_TIMING_FUNCTION = '-webkit-transition-timing-function',
    TRANSITION_END = 'webkitTransitionEnd',

Transition = function() {
    this.init.apply(this, arguments);
};

Transition._reKeywords = /^(?:node|duration|iterations|easing)$/;

Transition.useNative = false;

if (TRANSITION in Y.config.doc.documentElement.style) {
    Transition.useNative = true;
    Transition.supported = true; // TODO: remove
}

Y.Node.DOM_EVENTS[TRANSITION_END] = 1; 

Transition.NAME = 'transition';

Transition.DEFAULT_EASING = 'ease-in-out';
Transition.DEFAULT_DURATION = 0.5;

Transition.prototype = {
    constructor: Transition,
    init: function(node, config) {
        this._node = node;
        this._config = config;
        node._transition = this; // cache for reuse

        this.initAttrs(config);

        this._duration = ('duration' in config) ?
            config.duration: this.constructor.DEFAULT_DURATION;

        this._easing = config.easing || this.constructor.DEFAULT_EASING;
        this._count = 0; // track number of animated properties
        this._totalDuration = 0;
        this._running = false;
        return this;
    },

    initAttrs: function(config) {
        var attrs = {},
            attr;
        for (attr in config) {
            if (!Transition._reKeywords.test(attr)) {
                attrs[attr] = config[attr];
            }
        }

        if (attrs.transform && !attrs['-webkit-transform']) {
            attrs['-webkit-transform'] = attrs.transform;
            delete attrs.transform;
        }

        this._attrs = attrs;
    },

    /**
     * Starts or an animation.
     * @method run
     * @chainable
     */    
    run: function() {
        var anim = this,
            attrs = anim._attrs,
            attr;

        if (!anim._running) {
            anim._running = true;

            anim._start();
        }
        return anim;
    },

    _start: function() {
        this._runNative();
    },

    _prepDur: function(dur) {
        dur = parseFloat(dur);

        if (dur > this._totalDuration) {
            this._totalDuration = dur;
        }

        return dur + 's';
    },

    _runNative: function(time) {
        var transitions = {}, 
            anim = this,
            style = anim._node._node.style,
            attrs = anim._attrs,
            cssText = '',
            transitionText = TRANSITION_PROPERTY + ': ',
            transition,
            duration = TRANSITION_DURATION + ': ',
            easing = TRANSITION_TIMING_FUNCTION + ': ',
            node = anim._node,
            val,
            dur,
            attr;

        for (attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                transitions[attr] = attrs[attr];
                transition = transitions[attr];
                val = transition;
                anim._count++;

                if (typeof transition.value !== 'undefined') {
                    val = transition.value; 
                }

                if (typeof val === 'function') {
                    val = val.call(node, node);
                }

                dur = (typeof transition.duration !== 'undefined') ? transition.duration :
                        anim._duration;

                duration += anim._prepDur(dur) + ',';
                easing += (transition.easing || anim._easing) + ',';

                transitionText += attr + ',';
                cssText += attr + ': ' + val + '; ';
            }
        }

        transitionText = transitionText.replace(/,$/, ';');
        duration = duration.replace(/,$/, ';');
        easing = easing.replace(/,$/, ';');

        if (!anim._hasEndEvent) {
            node.on(TRANSITION_END, this._onNativeEnd, this);
        }

        if (anim._totalDuration) { // only fire when duration > 0 (per spec)
            anim._node.fire(START, {
                type: START,
                config: anim._config 
            });
        }

        setTimeout(function() { // allow any style init to occur (setStyle, etc)
            style.cssText += transitionText + duration + easing + cssText;
        }, 0);

    },

    _onNativeEnd: function(e) {
        var event = e._event,
            anim = this,
            node = anim._node;

        anim._hasEndEvent = true;

        node.fire(PROPERTY_END, {
            type: PROPERTY_END,
            elapsedTime: event.elapsedTime,
            propertyName: event.propertyName,
            config: anim._config
        });

        anim._count--;
        if (event.elapsedTime >= anim._totalDuration && anim._count <= 0)  {
            node._node.style[TRANSITION_CAMEL] = '';

            node.fire(END, {
                type: END,
                elapsedTime: event.elapsedTime,
                config: anim._config
            });

            anim._running = false;
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
Y.Node.prototype.transition = function(config) {
    var anim = (this._transition) ? this._transition.init(this, config) :
            new Transition(this, config);
    anim.run();
    return this;
};



}, '@VERSION@' ,{requires:['node-base']});
