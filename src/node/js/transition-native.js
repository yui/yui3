/**
* The Native Transition Utility provides an API wrapper for CSS transitions.
* @module node
*/

/**
* Provides the base TransitionNative class.
*
* @module node
* @submodule transition-native
*/

/**
 * A class for constructing transition instances.
 * @class TransitionNative
 * @for TransitionNative
 * @constructor
 * @extends Base
 */

var START = 'transitionstart',
    END = 'transitionend',

    TRANSITION = '-webkit-transition',
    TRANSITION_CAMEL = 'WebkitTransitionNative',
    TRANSITION_PROPERTY = '-webkit-transition-property',
    TRANSITION_DURATION = '-webkit-transition-duration',
    TRANSITION_TIMING_FUNCTION = '-webkit-transition-timing-function',
    TRANSITION_END = 'webkitTransitionNativeEnd',


    _running = {},

TransitionNative = function() {
    this.init.apply(this, arguments);
};

TransitionNative.supported = false;
TransitionNative.useNative = true;

if (TRANSITION in Y.config.doc.documentElement.style) {
    TransitionNative.supported = true;
}

Y.Node.DOM_EVENTS[TRANSITION_END] = 1; 

TransitionNative.NAME = 'transition';

TransitionNative.DEFAULT_EASING = 'ease-in-out';

TransitionNative.prototype = {
    constructor: TransitionNative,
    init: function(node, config) {
        this._node = node;
        this._config = config;
        this._duration = config.duration || '0.5';
        this._easing = config.easing || this.constructor.DEFAULT_EASING;
    },

    /**
     * Starts or resumes an animation.
     * @method run
     * @chainable
     */    
    run: function() {
        if (!this._running) {
            this._initAttrs();
            this._running = true;
            this._node.fire(START);
            this._start();
        }
        return this;
    },

    _start: function() {
        this._runAttrs();
    },

    _prepDur: function(dur) {
        dur = parseFloat(dur);

        if (dur > this._totalDuration) {
            this._totalDuration = dur;
        }

        return dur + 's';
    },

    _runAttrs: function(time) {
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


        for (attr in config) {
            if (!/^(?:node|duration|iterations|easing)$/.test(attr)) {
                transitions[attr] = config[attr];
                transition = transitions[attr];
                duration += this._prepDur(transition.duration || config.duration || 0.5) + ',';
                easing += (transition.easing || config.easing || 'ease-in-out') + ',';

                transitionText += attr + ',';
                cssText += attr + ': ' + ((transition.value !== undefined) ? transition.value : transition) + '; ';
            }
        }

        transitionText = transitionText.replace(/,$/, ';');
        duration = duration.replace(/,$/, ';');
        easing = easing.replace(/,$/, ';');

    Y.log(transitionText + duration + easing + cssText);

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

    _initAttrs: function() {
        var config = this._config;
        this._totalDuration = 0;
        if (config.transform && !config['-webkit-transform']) {
            config['-webkit-transform'] = config.transform;
            delete config.transform;
        }
    },

    destroy: function() {
        this.detachAll();
        this._node = null;
    }
};

Y.TransitionNative = TransitionNative;

Y.Node.prototype.transition = function(config) {
    var anim = new TransitionNative(this, config);
    anim.run();
    return this;
};

