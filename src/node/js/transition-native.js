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

var START = 'transitionstart',
    END = 'transitionend',

    TRANSITION = '-webkit-transition',
    TRANSITION_CAMEL = 'WebkitTransition',
    TRANSITION_PROPERTY = '-webkit-transition-property',
    TRANSITION_DURATION = '-webkit-transition-duration',
    TRANSITION_TIMING_FUNCTION = '-webkit-transition-timing-function',
    TRANSITION_END = 'webkitTransitionEnd',

Transition = function() {
    this.init.apply(this, arguments);
};

Transition.re_keywords = /^(?:node|duration|iterations|easing)$/;

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
        this._duration = ('duration' in config) ?
            config.duration: this.constructor.DEFAULT_DURATION;
        this._easing = config.easing || this.constructor.DEFAULT_EASING;
    },

    /**
     * Starts or an animation.
     * @method run
     * @chainable
     */    
    run: function() {
        if (!this._running) {
            this._running = true;
            this._node.fire(START);
            this._start();
        }
        return this;
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
            style = this._node._node.style,
            config = this._config,
            cssText = '',
            transitionText = TRANSITION_PROPERTY + ': ',
            transition,
            duration = TRANSITION_DURATION + ': ',
            easing = TRANSITION_TIMING_FUNCTION + ': ',
            dur,
            attr;

        this._totalDuration = 0;
        if (config.transform && !config['-webkit-transform']) {
            config['-webkit-transform'] = config.transform;
            delete config.transform;
        }

        for (attr in config) {
            if (!/^(?:node|duration|iterations|easing)$/.test(attr)) {
                transitions[attr] = config[attr];
                transition = transitions[attr];
                dur = (typeof transition.duration !== 'undefined') ? transition.duration :
                        this._duration;

                duration += this._prepDur(dur) + ',';
                easing += (transition.easing || this._easing) + ',';

                transitionText += attr + ',';
                cssText += attr + ': ' + ((typeof transition.value !== 'undefined') ?
                        transition.value : transition) + '; ';
            }
        }

        transitionText = transitionText.replace(/,$/, ';');
        duration = duration.replace(/,$/, ';');
        easing = easing.replace(/,$/, ';');

        this._node.on(TRANSITION_END, function(e) {
            var event = e._event;

            if (event.elapsedTime >= anim._totalDuration)  {
                style[TRANSITION_CAMEL] = '';
                anim._running = false;
            }

            this.fire(END, {
                elapsedTime: event.elapsedTime, propertyName: event.propertyName});
        });

        setTimeout(function() { // allow any style init to occur (setStyle, etc)
            style.cssText += transitionText + duration + easing + cssText;
        }, 0);

    },

    destroy: function() {
        this.detachAll();
        this._node = null;
    }
};

Y.Transition = Transition;
Y.TransitionNative = Transition; // TODO: remove

Y.Node.prototype.transition = function(config) {
    var anim = new Transition(this, config);
    anim.run();
    return this;
};

