if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-custom-complex/event-custom-complex.js",
    code: []
};
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"].code=["YUI.add('event-custom-complex', function (Y, NAME) {","","","/**"," * Adds event facades, preventable default behavior, and bubbling."," * events."," * @module event-custom"," * @submodule event-custom-complex"," */","","var FACADE,","    FACADE_KEYS,","    YObject = Y.Object,","    key,","    EMPTY = {},","    CEProto = Y.CustomEvent.prototype,","    ETProto = Y.EventTarget.prototype,","","    mixFacadeProps = function(facade, payload) {","        var p;","","        for (p in payload) {","            if (!(FACADE_KEYS.hasOwnProperty(p))) {","                facade[p] = payload[p];","            }","        }","    };","","/**"," * Wraps and protects a custom event for use when emitFacade is set to true."," * Requires the event-custom-complex module"," * @class EventFacade"," * @param e {Event} the custom event"," * @param currentTarget {HTMLElement} the element the listener was attached to"," */","","Y.EventFacade = function(e, currentTarget) {","","    if (!e) {","        e = EMPTY;","    }","","    this._event = e;","","    /**","     * The arguments passed to fire","     * @property details","     * @type Array","     */","    this.details = e.details;","","    /**","     * The event type, this can be overridden by the fire() payload","     * @property type","     * @type string","     */","    this.type = e.type;","","    /**","     * The real event type","     * @property _type","     * @type string","     * @private","     */","    this._type = e.type;","","    //////////////////////////////////////////////////////","","    /**","     * Node reference for the targeted eventtarget","     * @property target","     * @type Node","     */","    this.target = e.target;","","    /**","     * Node reference for the element that the listener was attached to.","     * @property currentTarget","     * @type Node","     */","    this.currentTarget = currentTarget;","","    /**","     * Node reference to the relatedTarget","     * @property relatedTarget","     * @type Node","     */","    this.relatedTarget = e.relatedTarget;","","};","","Y.mix(Y.EventFacade.prototype, {","","    /**","     * Stops the propagation to the next bubble target","     * @method stopPropagation","     */","    stopPropagation: function() {","        this._event.stopPropagation();","        this.stopped = 1;","    },","","    /**","     * Stops the propagation to the next bubble target and","     * prevents any additional listeners from being exectued","     * on the current target.","     * @method stopImmediatePropagation","     */","    stopImmediatePropagation: function() {","        this._event.stopImmediatePropagation();","        this.stopped = 2;","    },","","    /**","     * Prevents the event's default behavior","     * @method preventDefault","     */","    preventDefault: function() {","        this._event.preventDefault();","        this.prevented = 1;","    },","","    /**","     * Stops the event propagation and prevents the default","     * event behavior.","     * @method halt","     * @param immediate {boolean} if true additional listeners","     * on the current target will not be executed","     */","    halt: function(immediate) {","        this._event.halt(immediate);","        this.prevented = 1;","        this.stopped = (immediate) ? 2 : 1;","    }","","});","","CEProto.fireComplex = function(args) {","","    var es,","        ef,","        q,","        queue,","        ce,","        ret = true,","        events,","        subs,","        ons,","        afters,","        afterQueue,","        postponed,","        prevented,","        preventedFn,","        defaultFn,","        self = this,","        host = self.host || self,","        next,","        oldbubble,","        stack,","        yuievt = host._yuievt,","        hasPotentialSubscribers;","","    stack = self.stack;","","    if (stack) {","","        // queue this event if the current item in the queue bubbles","        if (self.queuable && self.type !== stack.next.type) {","","            if (!stack.queue) {","                stack.queue = [];","            }","            stack.queue.push([self, args]);","","            return true;","        }","    }","","    hasPotentialSubscribers = self.hasSubs() || yuievt.hasTargets || self.broadcast;","","    self.target = self.target || host;","    self.currentTarget = host;","","    self.details = args.concat();","","    if (hasPotentialSubscribers) {","","        es = stack || {","","           id: self.id, // id of the first event in the stack","           next: self,","           silent: self.silent,","           stopped: 0,","           prevented: 0,","           bubbling: null,","           type: self.type,","           // defaultFnQueue: new Y.Queue(),","           defaultTargetOnly: self.defaultTargetOnly","","        };","","        subs = self.getSubs();","        ons = subs[0];","        afters = subs[1];","","        self.stopped = (self.type !== es.type) ? 0 : es.stopped;","        self.prevented = (self.type !== es.type) ? 0 : es.prevented;","","        if (self.stoppedFn) {","            // PERF TODO: Can we replace with callback, like preventedFn. Look into history","            events = new Y.EventTarget({","                fireOnce: true,","                context: host","            });","            self.events = events;","            events.on('stopped', self.stoppedFn);","        }","","","        self._facade = null; // kill facade to eliminate stale properties","","        ef = self._getFacade(args);","","        if (ons) {","            self._procSubs(ons, args, ef);","        }","","        // bubble if this is hosted in an event target and propagation has not been stopped","        if (self.bubbles && host.bubble && !self.stopped) {","            oldbubble = es.bubbling;","","            es.bubbling = self.type;","","            if (es.type !== self.type) {","                es.stopped = 0;","                es.prevented = 0;","            }","","            ret = host.bubble(self, args, null, es);","","            self.stopped = Math.max(self.stopped, es.stopped);","            self.prevented = Math.max(self.prevented, es.prevented);","","            es.bubbling = oldbubble;","        }","","        prevented = self.prevented;","","        if (prevented) {","            preventedFn = self.preventedFn;","            if (preventedFn) {","                preventedFn.apply(host, args);","            }","        } else {","            defaultFn = self.defaultFn;","","            if (defaultFn && ((!self.defaultTargetOnly && !es.defaultTargetOnly) || host === ef.target)) {","                defaultFn.apply(host, args);","            }","        }","","        // broadcast listeners are fired as discreet events on the","        // YUI instance and potentially the YUI global.","        if (self.broadcast) {","            self._broadcast(args);","        }","","        if (afters && !self.prevented && self.stopped < 2) {","","            // Queue the after","            afterQueue = es.afterQueue;","","            if (es.id === self.id || self.type !== yuievt.bubbling) {","","                self._procSubs(afters, args, ef);","","                if (afterQueue) {","                    while ((next = afterQueue.last())) {","                        next();","                    }","                }","            } else {","                postponed = afters;","","                if (es.execDefaultCnt) {","                    postponed = Y.merge(postponed);","","                    Y.each(postponed, function(s) {","                        s.postponed = true;","                    });","                }","","                if (!afterQueue) {","                    es.afterQueue = new Y.Queue();","                }","","                es.afterQueue.add(function() {","                    self._procSubs(postponed, args, ef);","                });","            }","","        }","","        self.target = null;","","        if (es.id === self.id) {","","            queue = es.queue;","","            if (queue) {","                while (queue.length) {","                    q = queue.pop();","                    ce = q[0];","                    // set up stack to allow the next item to be processed","                    es.next = ce;","                    ce._fire(q[1]);","                }","            }","","            self.stack = null;","        }","","        ret = !(self.stopped);","","        if (self.type !== yuievt.bubbling) {","            es.stopped = 0;","            es.prevented = 0;","            self.stopped = 0;","            self.prevented = 0;","        }","","        // Kill the cached facade to free up memory.","        // Otherwise we have the facade from the last fire, sitting around forever.","        self._facade = null;","","        return ret;","","    } else {","        defaultFn = self.defaultFn;","","        if(defaultFn) {","            ef = self._getFacade(args);","","            if ((!self.defaultTargetOnly) || (host === ef.target)) {","                defaultFn.apply(host, args);","            }","        }","","        return ret;","    }","","};","","CEProto._getFacade = function(fireArgs) {","","    var userArgs = this.details,","        firstArg = userArgs && userArgs[0],","        firstArgIsObj = (typeof firstArg === \"object\"),","        ef = this._facade;","","    if (!ef) {","        ef = new Y.EventFacade(this, this.currentTarget);","    }","","    if (firstArgIsObj) {","        // protect the event facade properties","        mixFacadeProps(ef, firstArg);","","        // Allow the event type to be faked http://yuilibrary.com/projects/yui3/ticket/2528376","        if (firstArg.type) {","            ef.type = firstArg.type;","        }","","        if (fireArgs) {","            fireArgs[0] = ef;","        }","    } else {","        if (fireArgs) {","            fireArgs.unshift(ef);","        }","    }","","    // update the details field with the arguments","    ef.details = this.details;","","    // use the original target when the event bubbled to this target","    ef.target = this.originalTarget || this.target;","","    ef.currentTarget = this.currentTarget;","    ef.stopped = 0;","    ef.prevented = 0;","","    this._facade = ef;","","    return this._facade;","};","","/**"," * Stop propagation to bubble targets"," * @for CustomEvent"," * @method stopPropagation"," */","CEProto.stopPropagation = function() {","    this.stopped = 1;","    if (this.stack) {","        this.stack.stopped = 1;","    }","    if (this.events) {","        this.events.fire('stopped', this);","    }","};","","/**"," * Stops propagation to bubble targets, and prevents any remaining"," * subscribers on the current target from executing."," * @method stopImmediatePropagation"," */","CEProto.stopImmediatePropagation = function() {","    this.stopped = 2;","    if (this.stack) {","        this.stack.stopped = 2;","    }","    if (this.events) {","        this.events.fire('stopped', this);","    }","};","","/**"," * Prevents the execution of this event's defaultFn"," * @method preventDefault"," */","CEProto.preventDefault = function() {","    if (this.preventable) {","        this.prevented = 1;","        if (this.stack) {","            this.stack.prevented = 1;","        }","    }","};","","/**"," * Stops the event propagation and prevents the default"," * event behavior."," * @method halt"," * @param immediate {boolean} if true additional listeners"," * on the current target will not be executed"," */","CEProto.halt = function(immediate) {","    if (immediate) {","        this.stopImmediatePropagation();","    } else {","        this.stopPropagation();","    }","    this.preventDefault();","};","","/**"," * Registers another EventTarget as a bubble target.  Bubble order"," * is determined by the order registered.  Multiple targets can"," * be specified."," *"," * Events can only bubble if emitFacade is true."," *"," * Included in the event-custom-complex submodule."," *"," * @method addTarget"," * @param o {EventTarget} the target to add"," * @for EventTarget"," */","ETProto.addTarget = function(o) {","    var etState = this._yuievt;","","    if (!etState.targets) {","        etState.targets = {};","    }","","    etState.targets[Y.stamp(o)] = o;","    etState.hasTargets = true;","};","","/**"," * Returns an array of bubble targets for this object."," * @method getTargets"," * @return EventTarget[]"," */","ETProto.getTargets = function() {","    return YObject.values(this._yuievt.targets);","};","","/**"," * Removes a bubble target"," * @method removeTarget"," * @param o {EventTarget} the target to remove"," * @for EventTarget"," */","ETProto.removeTarget = function(o) {","    var targets = this._yuievt.targets;","","    delete targets[Y.stamp(o, true)];","","    if (YObject.size(targets) === 0) {","        this._yuievt.hasTargets = false;","    }","};","","/**"," * Propagate an event.  Requires the event-custom-complex module."," * @method bubble"," * @param evt {CustomEvent} the custom event to propagate"," * @return {boolean} the aggregated return value from Event.Custom.fire"," * @for EventTarget"," */","ETProto.bubble = function(evt, args, target, es) {","","    var targs = this._yuievt.targets,","        ret = true,","        t,","        ce,","        i,","        bc,","        ce2,","        type = evt && evt.type,","        originalTarget = target || (evt && evt.target) || this,","        oldbubble;","","    if (!evt || ((!evt.stopped) && targs)) {","","        for (i in targs) {","            if (targs.hasOwnProperty(i)) {","","                t = targs[i];","","                ce = t._yuievt.events[type];","","                if (t._hasSiblings) {","                    ce2 = t.getSibling(type, ce);","                }","","                if (ce2 && !ce) {","                    ce = t.publish(type);","                }","","                oldbubble = t._yuievt.bubbling;","                t._yuievt.bubbling = type;","","                // if this event was not published on the bubble target,","                // continue propagating the event.","                if (!ce) {","                    if (t._yuievt.hasTargets) {","                        t.bubble(evt, args, originalTarget, es);","                    }","                } else {","","                    if (ce2) {","                        ce.sibling = ce2;","                    }","","                    // set the original target to that the target payload on the facade is correct.","                    ce.target = originalTarget;","                    ce.originalTarget = originalTarget;","                    ce.currentTarget = t;","                    bc = ce.broadcast;","                    ce.broadcast = false;","","                    // default publish may not have emitFacade true -- that","                    // shouldn't be what the implementer meant to do","                    ce.emitFacade = true;","","                    ce.stack = es;","","                    // TODO: See what's getting in the way of changing this to use","                    // the more performant ce._fire(args || evt.details || []).","","                    // Something in Widget Parent/Child tests is not happy if we","                    // change it - maybe evt.details related?","                    ret = ret && ce.fire.apply(ce, args || evt.details || []);","","                    ce.broadcast = bc;","                    ce.originalTarget = null;","","                    // stopPropagation() was called","                    if (ce.stopped) {","                        break;","                    }","                }","","                t._yuievt.bubbling = oldbubble;","            }","        }","    }","","    return ret;","};","","FACADE = new Y.EventFacade();","FACADE_KEYS = {};","","// Flatten whitelist","for (key in FACADE) {","    FACADE_KEYS[key] = true;","}","","","}, '@VERSION@', {\"requires\": [\"event-custom-base\"]});"];
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"].lines = {"1":0,"11":0,"20":0,"22":0,"23":0,"24":0,"37":0,"39":0,"40":0,"43":0,"50":0,"57":0,"65":0,"74":0,"81":0,"88":0,"92":0,"99":0,"100":0,"110":0,"111":0,"119":0,"120":0,"131":0,"132":0,"133":0,"138":0,"140":0,"163":0,"165":0,"168":0,"170":0,"171":0,"173":0,"175":0,"179":0,"181":0,"182":0,"184":0,"186":0,"188":0,"202":0,"203":0,"204":0,"206":0,"207":0,"209":0,"211":0,"215":0,"216":0,"220":0,"222":0,"224":0,"225":0,"229":0,"230":0,"232":0,"234":0,"235":0,"236":0,"239":0,"241":0,"242":0,"244":0,"247":0,"249":0,"250":0,"251":0,"252":0,"255":0,"257":0,"258":0,"264":0,"265":0,"268":0,"271":0,"273":0,"275":0,"277":0,"278":0,"279":0,"283":0,"285":0,"286":0,"288":0,"289":0,"293":0,"294":0,"297":0,"298":0,"304":0,"306":0,"308":0,"310":0,"311":0,"312":0,"313":0,"315":0,"316":0,"320":0,"323":0,"325":0,"326":0,"327":0,"328":0,"329":0,"334":0,"336":0,"339":0,"341":0,"342":0,"344":0,"345":0,"349":0,"354":0,"356":0,"361":0,"362":0,"365":0,"367":0,"370":0,"371":0,"374":0,"375":0,"378":0,"379":0,"384":0,"387":0,"389":0,"390":0,"391":0,"393":0,"395":0,"403":0,"404":0,"405":0,"406":0,"408":0,"409":0,"418":0,"419":0,"420":0,"421":0,"423":0,"424":0,"432":0,"433":0,"434":0,"435":0,"436":0,"448":0,"449":0,"450":0,"452":0,"454":0,"470":0,"471":0,"473":0,"474":0,"477":0,"478":0,"486":0,"487":0,"496":0,"497":0,"499":0,"501":0,"502":0,"513":0,"515":0,"526":0,"528":0,"529":0,"531":0,"533":0,"535":0,"536":0,"539":0,"540":0,"543":0,"544":0,"548":0,"549":0,"550":0,"554":0,"555":0,"559":0,"560":0,"561":0,"562":0,"563":0,"567":0,"569":0,"576":0,"578":0,"579":0,"582":0,"583":0,"587":0,"592":0,"595":0,"596":0,"599":0,"600":0};
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"].functions = {"mixFacadeProps:19":0,"EventFacade:37":0,"stopPropagation:98":0,"stopImmediatePropagation:109":0,"preventDefault:118":0,"halt:130":0,"(anonymous 2):288":0,"(anonymous 3):297":0,"fireComplex:138":0,"_getFacade:354":0,"stopPropagation:403":0,"stopImmediatePropagation:418":0,"preventDefault:432":0,"halt:448":0,"addTarget:470":0,"getTargets:486":0,"removeTarget:496":0,"bubble:513":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"].coveredLines = 204;
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"].coveredFunctions = 19;
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 1);
YUI.add('event-custom-complex', function (Y, NAME) {


/**
 * Adds event facades, preventable default behavior, and bubbling.
 * events.
 * @module event-custom
 * @submodule event-custom-complex
 */

_yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 11);
var FACADE,
    FACADE_KEYS,
    YObject = Y.Object,
    key,
    EMPTY = {},
    CEProto = Y.CustomEvent.prototype,
    ETProto = Y.EventTarget.prototype,

    mixFacadeProps = function(facade, payload) {
        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "mixFacadeProps", 19);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 20);
var p;

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 22);
for (p in payload) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 23);
if (!(FACADE_KEYS.hasOwnProperty(p))) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 24);
facade[p] = payload[p];
            }
        }
    };

/**
 * Wraps and protects a custom event for use when emitFacade is set to true.
 * Requires the event-custom-complex module
 * @class EventFacade
 * @param e {Event} the custom event
 * @param currentTarget {HTMLElement} the element the listener was attached to
 */

_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 37);
Y.EventFacade = function(e, currentTarget) {

    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "EventFacade", 37);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 39);
if (!e) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 40);
e = EMPTY;
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 43);
this._event = e;

    /**
     * The arguments passed to fire
     * @property details
     * @type Array
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 50);
this.details = e.details;

    /**
     * The event type, this can be overridden by the fire() payload
     * @property type
     * @type string
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 57);
this.type = e.type;

    /**
     * The real event type
     * @property _type
     * @type string
     * @private
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 65);
this._type = e.type;

    //////////////////////////////////////////////////////

    /**
     * Node reference for the targeted eventtarget
     * @property target
     * @type Node
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 74);
this.target = e.target;

    /**
     * Node reference for the element that the listener was attached to.
     * @property currentTarget
     * @type Node
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 81);
this.currentTarget = currentTarget;

    /**
     * Node reference to the relatedTarget
     * @property relatedTarget
     * @type Node
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 88);
this.relatedTarget = e.relatedTarget;

};

_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 92);
Y.mix(Y.EventFacade.prototype, {

    /**
     * Stops the propagation to the next bubble target
     * @method stopPropagation
     */
    stopPropagation: function() {
        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "stopPropagation", 98);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 99);
this._event.stopPropagation();
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 100);
this.stopped = 1;
    },

    /**
     * Stops the propagation to the next bubble target and
     * prevents any additional listeners from being exectued
     * on the current target.
     * @method stopImmediatePropagation
     */
    stopImmediatePropagation: function() {
        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "stopImmediatePropagation", 109);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 110);
this._event.stopImmediatePropagation();
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 111);
this.stopped = 2;
    },

    /**
     * Prevents the event's default behavior
     * @method preventDefault
     */
    preventDefault: function() {
        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "preventDefault", 118);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 119);
this._event.preventDefault();
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 120);
this.prevented = 1;
    },

    /**
     * Stops the event propagation and prevents the default
     * event behavior.
     * @method halt
     * @param immediate {boolean} if true additional listeners
     * on the current target will not be executed
     */
    halt: function(immediate) {
        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "halt", 130);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 131);
this._event.halt(immediate);
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 132);
this.prevented = 1;
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 133);
this.stopped = (immediate) ? 2 : 1;
    }

});

_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 138);
CEProto.fireComplex = function(args) {

    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "fireComplex", 138);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 140);
var es,
        ef,
        q,
        queue,
        ce,
        ret = true,
        events,
        subs,
        ons,
        afters,
        afterQueue,
        postponed,
        prevented,
        preventedFn,
        defaultFn,
        self = this,
        host = self.host || self,
        next,
        oldbubble,
        stack,
        yuievt = host._yuievt,
        hasPotentialSubscribers;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 163);
stack = self.stack;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 165);
if (stack) {

        // queue this event if the current item in the queue bubbles
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 168);
if (self.queuable && self.type !== stack.next.type) {

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 170);
if (!stack.queue) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 171);
stack.queue = [];
            }
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 173);
stack.queue.push([self, args]);

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 175);
return true;
        }
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 179);
hasPotentialSubscribers = self.hasSubs() || yuievt.hasTargets || self.broadcast;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 181);
self.target = self.target || host;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 182);
self.currentTarget = host;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 184);
self.details = args.concat();

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 186);
if (hasPotentialSubscribers) {

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 188);
es = stack || {

           id: self.id, // id of the first event in the stack
           next: self,
           silent: self.silent,
           stopped: 0,
           prevented: 0,
           bubbling: null,
           type: self.type,
           // defaultFnQueue: new Y.Queue(),
           defaultTargetOnly: self.defaultTargetOnly

        };

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 202);
subs = self.getSubs();
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 203);
ons = subs[0];
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 204);
afters = subs[1];

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 206);
self.stopped = (self.type !== es.type) ? 0 : es.stopped;
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 207);
self.prevented = (self.type !== es.type) ? 0 : es.prevented;

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 209);
if (self.stoppedFn) {
            // PERF TODO: Can we replace with callback, like preventedFn. Look into history
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 211);
events = new Y.EventTarget({
                fireOnce: true,
                context: host
            });
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 215);
self.events = events;
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 216);
events.on('stopped', self.stoppedFn);
        }


        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 220);
self._facade = null; // kill facade to eliminate stale properties

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 222);
ef = self._getFacade(args);

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 224);
if (ons) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 225);
self._procSubs(ons, args, ef);
        }

        // bubble if this is hosted in an event target and propagation has not been stopped
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 229);
if (self.bubbles && host.bubble && !self.stopped) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 230);
oldbubble = es.bubbling;

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 232);
es.bubbling = self.type;

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 234);
if (es.type !== self.type) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 235);
es.stopped = 0;
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 236);
es.prevented = 0;
            }

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 239);
ret = host.bubble(self, args, null, es);

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 241);
self.stopped = Math.max(self.stopped, es.stopped);
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 242);
self.prevented = Math.max(self.prevented, es.prevented);

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 244);
es.bubbling = oldbubble;
        }

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 247);
prevented = self.prevented;

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 249);
if (prevented) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 250);
preventedFn = self.preventedFn;
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 251);
if (preventedFn) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 252);
preventedFn.apply(host, args);
            }
        } else {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 255);
defaultFn = self.defaultFn;

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 257);
if (defaultFn && ((!self.defaultTargetOnly && !es.defaultTargetOnly) || host === ef.target)) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 258);
defaultFn.apply(host, args);
            }
        }

        // broadcast listeners are fired as discreet events on the
        // YUI instance and potentially the YUI global.
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 264);
if (self.broadcast) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 265);
self._broadcast(args);
        }

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 268);
if (afters && !self.prevented && self.stopped < 2) {

            // Queue the after
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 271);
afterQueue = es.afterQueue;

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 273);
if (es.id === self.id || self.type !== yuievt.bubbling) {

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 275);
self._procSubs(afters, args, ef);

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 277);
if (afterQueue) {
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 278);
while ((next = afterQueue.last())) {
                        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 279);
next();
                    }
                }
            } else {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 283);
postponed = afters;

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 285);
if (es.execDefaultCnt) {
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 286);
postponed = Y.merge(postponed);

                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 288);
Y.each(postponed, function(s) {
                        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "(anonymous 2)", 288);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 289);
s.postponed = true;
                    });
                }

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 293);
if (!afterQueue) {
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 294);
es.afterQueue = new Y.Queue();
                }

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 297);
es.afterQueue.add(function() {
                    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "(anonymous 3)", 297);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 298);
self._procSubs(postponed, args, ef);
                });
            }

        }

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 304);
self.target = null;

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 306);
if (es.id === self.id) {

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 308);
queue = es.queue;

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 310);
if (queue) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 311);
while (queue.length) {
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 312);
q = queue.pop();
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 313);
ce = q[0];
                    // set up stack to allow the next item to be processed
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 315);
es.next = ce;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 316);
ce._fire(q[1]);
                }
            }

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 320);
self.stack = null;
        }

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 323);
ret = !(self.stopped);

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 325);
if (self.type !== yuievt.bubbling) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 326);
es.stopped = 0;
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 327);
es.prevented = 0;
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 328);
self.stopped = 0;
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 329);
self.prevented = 0;
        }

        // Kill the cached facade to free up memory.
        // Otherwise we have the facade from the last fire, sitting around forever.
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 334);
self._facade = null;

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 336);
return ret;

    } else {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 339);
defaultFn = self.defaultFn;

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 341);
if(defaultFn) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 342);
ef = self._getFacade(args);

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 344);
if ((!self.defaultTargetOnly) || (host === ef.target)) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 345);
defaultFn.apply(host, args);
            }
        }

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 349);
return ret;
    }

};

_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 354);
CEProto._getFacade = function(fireArgs) {

    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "_getFacade", 354);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 356);
var userArgs = this.details,
        firstArg = userArgs && userArgs[0],
        firstArgIsObj = (typeof firstArg === "object"),
        ef = this._facade;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 361);
if (!ef) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 362);
ef = new Y.EventFacade(this, this.currentTarget);
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 365);
if (firstArgIsObj) {
        // protect the event facade properties
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 367);
mixFacadeProps(ef, firstArg);

        // Allow the event type to be faked http://yuilibrary.com/projects/yui3/ticket/2528376
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 370);
if (firstArg.type) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 371);
ef.type = firstArg.type;
        }

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 374);
if (fireArgs) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 375);
fireArgs[0] = ef;
        }
    } else {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 378);
if (fireArgs) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 379);
fireArgs.unshift(ef);
        }
    }

    // update the details field with the arguments
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 384);
ef.details = this.details;

    // use the original target when the event bubbled to this target
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 387);
ef.target = this.originalTarget || this.target;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 389);
ef.currentTarget = this.currentTarget;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 390);
ef.stopped = 0;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 391);
ef.prevented = 0;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 393);
this._facade = ef;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 395);
return this._facade;
};

/**
 * Stop propagation to bubble targets
 * @for CustomEvent
 * @method stopPropagation
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 403);
CEProto.stopPropagation = function() {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "stopPropagation", 403);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 404);
this.stopped = 1;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 405);
if (this.stack) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 406);
this.stack.stopped = 1;
    }
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 408);
if (this.events) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 409);
this.events.fire('stopped', this);
    }
};

/**
 * Stops propagation to bubble targets, and prevents any remaining
 * subscribers on the current target from executing.
 * @method stopImmediatePropagation
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 418);
CEProto.stopImmediatePropagation = function() {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "stopImmediatePropagation", 418);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 419);
this.stopped = 2;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 420);
if (this.stack) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 421);
this.stack.stopped = 2;
    }
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 423);
if (this.events) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 424);
this.events.fire('stopped', this);
    }
};

/**
 * Prevents the execution of this event's defaultFn
 * @method preventDefault
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 432);
CEProto.preventDefault = function() {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "preventDefault", 432);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 433);
if (this.preventable) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 434);
this.prevented = 1;
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 435);
if (this.stack) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 436);
this.stack.prevented = 1;
        }
    }
};

/**
 * Stops the event propagation and prevents the default
 * event behavior.
 * @method halt
 * @param immediate {boolean} if true additional listeners
 * on the current target will not be executed
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 448);
CEProto.halt = function(immediate) {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "halt", 448);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 449);
if (immediate) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 450);
this.stopImmediatePropagation();
    } else {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 452);
this.stopPropagation();
    }
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 454);
this.preventDefault();
};

/**
 * Registers another EventTarget as a bubble target.  Bubble order
 * is determined by the order registered.  Multiple targets can
 * be specified.
 *
 * Events can only bubble if emitFacade is true.
 *
 * Included in the event-custom-complex submodule.
 *
 * @method addTarget
 * @param o {EventTarget} the target to add
 * @for EventTarget
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 470);
ETProto.addTarget = function(o) {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "addTarget", 470);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 471);
var etState = this._yuievt;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 473);
if (!etState.targets) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 474);
etState.targets = {};
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 477);
etState.targets[Y.stamp(o)] = o;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 478);
etState.hasTargets = true;
};

/**
 * Returns an array of bubble targets for this object.
 * @method getTargets
 * @return EventTarget[]
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 486);
ETProto.getTargets = function() {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "getTargets", 486);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 487);
return YObject.values(this._yuievt.targets);
};

/**
 * Removes a bubble target
 * @method removeTarget
 * @param o {EventTarget} the target to remove
 * @for EventTarget
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 496);
ETProto.removeTarget = function(o) {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "removeTarget", 496);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 497);
var targets = this._yuievt.targets;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 499);
delete targets[Y.stamp(o, true)];

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 501);
if (YObject.size(targets) === 0) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 502);
this._yuievt.hasTargets = false;
    }
};

/**
 * Propagate an event.  Requires the event-custom-complex module.
 * @method bubble
 * @param evt {CustomEvent} the custom event to propagate
 * @return {boolean} the aggregated return value from Event.Custom.fire
 * @for EventTarget
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 513);
ETProto.bubble = function(evt, args, target, es) {

    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "bubble", 513);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 515);
var targs = this._yuievt.targets,
        ret = true,
        t,
        ce,
        i,
        bc,
        ce2,
        type = evt && evt.type,
        originalTarget = target || (evt && evt.target) || this,
        oldbubble;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 526);
if (!evt || ((!evt.stopped) && targs)) {

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 528);
for (i in targs) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 529);
if (targs.hasOwnProperty(i)) {

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 531);
t = targs[i];

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 533);
ce = t._yuievt.events[type];

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 535);
if (t._hasSiblings) {
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 536);
ce2 = t.getSibling(type, ce);
                }

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 539);
if (ce2 && !ce) {
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 540);
ce = t.publish(type);
                }

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 543);
oldbubble = t._yuievt.bubbling;
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 544);
t._yuievt.bubbling = type;

                // if this event was not published on the bubble target,
                // continue propagating the event.
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 548);
if (!ce) {
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 549);
if (t._yuievt.hasTargets) {
                        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 550);
t.bubble(evt, args, originalTarget, es);
                    }
                } else {

                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 554);
if (ce2) {
                        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 555);
ce.sibling = ce2;
                    }

                    // set the original target to that the target payload on the facade is correct.
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 559);
ce.target = originalTarget;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 560);
ce.originalTarget = originalTarget;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 561);
ce.currentTarget = t;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 562);
bc = ce.broadcast;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 563);
ce.broadcast = false;

                    // default publish may not have emitFacade true -- that
                    // shouldn't be what the implementer meant to do
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 567);
ce.emitFacade = true;

                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 569);
ce.stack = es;

                    // TODO: See what's getting in the way of changing this to use
                    // the more performant ce._fire(args || evt.details || []).

                    // Something in Widget Parent/Child tests is not happy if we
                    // change it - maybe evt.details related?
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 576);
ret = ret && ce.fire.apply(ce, args || evt.details || []);

                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 578);
ce.broadcast = bc;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 579);
ce.originalTarget = null;

                    // stopPropagation() was called
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 582);
if (ce.stopped) {
                        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 583);
break;
                    }
                }

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 587);
t._yuievt.bubbling = oldbubble;
            }
        }
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 592);
return ret;
};

_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 595);
FACADE = new Y.EventFacade();
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 596);
FACADE_KEYS = {};

// Flatten whitelist
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 599);
for (key in FACADE) {
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 600);
FACADE_KEYS[key] = true;
}


}, '@VERSION@', {"requires": ["event-custom-base"]});
