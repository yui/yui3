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
_yuitest_coverage["/build/event-custom-complex/event-custom-complex.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/event-custom-complex/event-custom-complex.js",
    code: []
};
_yuitest_coverage["/build/event-custom-complex/event-custom-complex.js"].code=["YUI.add('event-custom-complex', function(Y) {","","","/**"," * Adds event facades, preventable default behavior, and bubbling."," * events."," * @module event-custom"," * @submodule event-custom-complex"," */","","var FACADE,","    FACADE_KEYS,","    EMPTY = {},","    CEProto = Y.CustomEvent.prototype,","    ETProto = Y.EventTarget.prototype;","","/**"," * Wraps and protects a custom event for use when emitFacade is set to true."," * Requires the event-custom-complex module"," * @class EventFacade"," * @param e {Event} the custom event"," * @param currentTarget {HTMLElement} the element the listener was attached to"," */","","Y.EventFacade = function(e, currentTarget) {","","    e = e || EMPTY;","","    this._event = e;","","    /**","     * The arguments passed to fire","     * @property details","     * @type Array","     */","    this.details = e.details;","","    /**","     * The event type, this can be overridden by the fire() payload","     * @property type","     * @type string","     */","    this.type = e.type;","","    /**","     * The real event type","     * @property _type","     * @type string","     * @private","     */","    this._type = e.type;","","    //////////////////////////////////////////////////////","","    /**","     * Node reference for the targeted eventtarget","     * @property target","     * @type Node","     */","    this.target = e.target;","","    /**","     * Node reference for the element that the listener was attached to.","     * @property currentTarget","     * @type Node","     */","    this.currentTarget = currentTarget;","","    /**","     * Node reference to the relatedTarget","     * @property relatedTarget","     * @type Node","     */","    this.relatedTarget = e.relatedTarget;","","};","","Y.extend(Y.EventFacade, Object, {","","    /**","     * Stops the propagation to the next bubble target","     * @method stopPropagation","     */","    stopPropagation: function() {","        this._event.stopPropagation();","        this.stopped = 1;","    },","","    /**","     * Stops the propagation to the next bubble target and","     * prevents any additional listeners from being exectued","     * on the current target.","     * @method stopImmediatePropagation","     */","    stopImmediatePropagation: function() {","        this._event.stopImmediatePropagation();","        this.stopped = 2;","    },","","    /**","     * Prevents the event's default behavior","     * @method preventDefault","     */","    preventDefault: function() {","        this._event.preventDefault();","        this.prevented = 1;","    },","","    /**","     * Stops the event propagation and prevents the default","     * event behavior.","     * @method halt","     * @param immediate {boolean} if true additional listeners","     * on the current target will not be executed","     */","    halt: function(immediate) {","        this._event.halt(immediate);","        this.prevented = 1;","        this.stopped = (immediate) ? 2 : 1;","    }","","});","","CEProto.fireComplex = function(args) {","","    var es, ef, q, queue, ce, ret, events, subs, postponed,","        self = this, host = self.host || self, next, oldbubble;","","    if (self.stack) {","        // queue this event if the current item in the queue bubbles","        if (self.queuable && self.type != self.stack.next.type) {","            self.log('queue ' + self.type);","            self.stack.queue.push([self, args]);","            return true;","        }","    }","","    es = self.stack || {","       // id of the first event in the stack","       id: self.id,","       next: self,","       silent: self.silent,","       stopped: 0,","       prevented: 0,","       bubbling: null,","       type: self.type,","       // defaultFnQueue: new Y.Queue(),","       afterQueue: new Y.Queue(),","       defaultTargetOnly: self.defaultTargetOnly,","       queue: []","    };","","    subs = self.getSubs();","","    self.stopped = (self.type !== es.type) ? 0 : es.stopped;","    self.prevented = (self.type !== es.type) ? 0 : es.prevented;","","    self.target = self.target || host;","","    events = new Y.EventTarget({","        fireOnce: true,","        context: host","    });","","    self.events = events;","","    if (self.stoppedFn) {","        events.on('stopped', self.stoppedFn);","    }","","    self.currentTarget = host;","","    self.details = args.slice(); // original arguments in the details","","    // self.log(\"Firing \" + self  + \", \" + \"args: \" + args);","    self.log(\"Firing \" + self.type);","","    self._facade = null; // kill facade to eliminate stale properties","","    ef = self._getFacade(args);","","    if (Y.Lang.isObject(args[0])) {","        args[0] = ef;","    } else {","        args.unshift(ef);","    }","","    // if (subCount) {","    if (subs[0]) {","        // self._procSubs(Y.merge(self.subscribers), args, ef);","        self._procSubs(subs[0], args, ef);","    }","","    // bubble if this is hosted in an event target and propagation has not been stopped","    if (self.bubbles && host.bubble && !self.stopped) {","","        oldbubble = es.bubbling;","","        // self.bubbling = true;","        es.bubbling = self.type;","","        // if (host !== ef.target || es.type != self.type) {","        if (es.type != self.type) {","            es.stopped = 0;","            es.prevented = 0;","        }","","        ret = host.bubble(self, args, null, es);","","        self.stopped = Math.max(self.stopped, es.stopped);","        self.prevented = Math.max(self.prevented, es.prevented);","","        // self.bubbling = false;","        es.bubbling = oldbubble;","","    }","","    if (self.prevented) {","        if (self.preventedFn) {","            self.preventedFn.apply(host, args);","        }","    } else if (self.defaultFn &&","              ((!self.defaultTargetOnly && !es.defaultTargetOnly) ||","                host === ef.target)) {","        self.defaultFn.apply(host, args);","    }","","    // broadcast listeners are fired as discreet events on the","    // YUI instance and potentially the YUI global.","    self._broadcast(args);","","    // Queue the after","    if (subs[1] && !self.prevented && self.stopped < 2) {","        if (es.id === self.id || self.type != host._yuievt.bubbling) {","            self._procSubs(subs[1], args, ef);","            while ((next = es.afterQueue.last())) {","                next();","            }","        } else {","            postponed = subs[1];","            if (es.execDefaultCnt) {","                postponed = Y.merge(postponed);","                Y.each(postponed, function(s) {","                    s.postponed = true;","                });","            }","","            es.afterQueue.add(function() {","                self._procSubs(postponed, args, ef);","            });","        }","    }","","    self.target = null;","","    if (es.id === self.id) {","        queue = es.queue;","","        while (queue.length) {","            q = queue.pop();","            ce = q[0];","            // set up stack to allow the next item to be processed","            es.next = ce;","            ce.fire.apply(ce, q[1]);","        }","","        self.stack = null;","    }","","    ret = !(self.stopped);","","    if (self.type != host._yuievt.bubbling) {","        es.stopped = 0;","        es.prevented = 0;","        self.stopped = 0;","        self.prevented = 0;","    }","","    return ret;","};","","CEProto._getFacade = function() {","","    var ef = this._facade, o, o2,","    args = this.details;","","    if (!ef) {","        ef = new Y.EventFacade(this, this.currentTarget);","    }","","    // if the first argument is an object literal, apply the","    // properties to the event facade","    o = args && args[0];","","    if (Y.Lang.isObject(o, true)) {","","        o2 = {};","","        // protect the event facade properties","        Y.mix(o2, ef, true, FACADE_KEYS);","","        // mix the data","        Y.mix(ef, o, true);","","        // restore ef","        Y.mix(ef, o2, true, FACADE_KEYS);","","        // Allow the event type to be faked","        // http://yuilibrary.com/projects/yui3/ticket/2528376","        ef.type = o.type || ef.type;","    }","","    // update the details field with the arguments","    // ef.type = this.type;","    ef.details = this.details;","","    // use the original target when the event bubbled to this target","    ef.target = this.originalTarget || this.target;","","    ef.currentTarget = this.currentTarget;","    ef.stopped = 0;","    ef.prevented = 0;","","    this._facade = ef;","","    return this._facade;","};","","/**"," * Stop propagation to bubble targets"," * @for CustomEvent"," * @method stopPropagation"," */","CEProto.stopPropagation = function() {","    this.stopped = 1;","    if (this.stack) {","        this.stack.stopped = 1;","    }","    this.events.fire('stopped', this);","};","","/**"," * Stops propagation to bubble targets, and prevents any remaining"," * subscribers on the current target from executing."," * @method stopImmediatePropagation"," */","CEProto.stopImmediatePropagation = function() {","    this.stopped = 2;","    if (this.stack) {","        this.stack.stopped = 2;","    }","    this.events.fire('stopped', this);","};","","/**"," * Prevents the execution of this event's defaultFn"," * @method preventDefault"," */","CEProto.preventDefault = function() {","    if (this.preventable) {","        this.prevented = 1;","        if (this.stack) {","            this.stack.prevented = 1;","        }","    }","};","","/**"," * Stops the event propagation and prevents the default"," * event behavior."," * @method halt"," * @param immediate {boolean} if true additional listeners"," * on the current target will not be executed"," */","CEProto.halt = function(immediate) {","    if (immediate) {","        this.stopImmediatePropagation();","    } else {","        this.stopPropagation();","    }","    this.preventDefault();","};","","/**"," * Registers another EventTarget as a bubble target.  Bubble order"," * is determined by the order registered.  Multiple targets can"," * be specified."," *"," * Events can only bubble if emitFacade is true."," *"," * Included in the event-custom-complex submodule."," *"," * @method addTarget"," * @param o {EventTarget} the target to add"," * @for EventTarget"," */","ETProto.addTarget = function(o) {","    this._yuievt.targets[Y.stamp(o)] = o;","    this._yuievt.hasTargets = true;","};","","/**"," * Returns an array of bubble targets for this object."," * @method getTargets"," * @return EventTarget[]"," */","ETProto.getTargets = function() {","    return Y.Object.values(this._yuievt.targets);","};","","/**"," * Removes a bubble target"," * @method removeTarget"," * @param o {EventTarget} the target to remove"," * @for EventTarget"," */","ETProto.removeTarget = function(o) {","    delete this._yuievt.targets[Y.stamp(o)];","};","","/**"," * Propagate an event.  Requires the event-custom-complex module."," * @method bubble"," * @param evt {CustomEvent} the custom event to propagate"," * @return {boolean} the aggregated return value from Event.Custom.fire"," * @for EventTarget"," */","ETProto.bubble = function(evt, args, target, es) {","","    var targs = this._yuievt.targets, ret = true,","        t, type = evt && evt.type, ce, i, bc, ce2,","        originalTarget = target || (evt && evt.target) || this,","        oldbubble;","","    if (!evt || ((!evt.stopped) && targs)) {","","        for (i in targs) {","            if (targs.hasOwnProperty(i)) {","                t = targs[i];","                ce = t.getEvent(type, true);","                ce2 = t.getSibling(type, ce);","","                if (ce2 && !ce) {","                    ce = t.publish(type);","                }","","                oldbubble = t._yuievt.bubbling;","                t._yuievt.bubbling = type;","","                // if this event was not published on the bubble target,","                // continue propagating the event.","                if (!ce) {","                    if (t._yuievt.hasTargets) {","                        t.bubble(evt, args, originalTarget, es);","                    }","                } else {","","                    ce.sibling = ce2;","","                    // set the original target to that the target payload on the","                    // facade is correct.","                    ce.target = originalTarget;","                    ce.originalTarget = originalTarget;","                    ce.currentTarget = t;","                    bc = ce.broadcast;","                    ce.broadcast = false;","","                    // default publish may not have emitFacade true -- that","                    // shouldn't be what the implementer meant to do","                    ce.emitFacade = true;","","                    ce.stack = es;","","                    ret = ret && ce.fire.apply(ce, args || evt.details || []);","                    ce.broadcast = bc;","                    ce.originalTarget = null;","","","                    // stopPropagation() was called","                    if (ce.stopped) {","                        break;","                    }","                }","","                t._yuievt.bubbling = oldbubble;","            }","        }","    }","","    return ret;","};","","FACADE = new Y.EventFacade();","FACADE_KEYS = Y.Object.keys(FACADE);","","","","}, '@VERSION@' ,{requires:['event-custom-base']});"];
_yuitest_coverage["/build/event-custom-complex/event-custom-complex.js"].lines = {"1":0,"11":0,"25":0,"27":0,"29":0,"36":0,"43":0,"51":0,"60":0,"67":0,"74":0,"78":0,"85":0,"86":0,"96":0,"97":0,"105":0,"106":0,"117":0,"118":0,"119":0,"124":0,"126":0,"129":0,"131":0,"132":0,"133":0,"134":0,"138":0,"153":0,"155":0,"156":0,"158":0,"160":0,"165":0,"167":0,"168":0,"171":0,"173":0,"176":0,"178":0,"180":0,"182":0,"183":0,"185":0,"189":0,"191":0,"195":0,"197":0,"200":0,"203":0,"204":0,"205":0,"208":0,"210":0,"211":0,"214":0,"218":0,"219":0,"220":0,"222":0,"225":0,"230":0,"233":0,"234":0,"235":0,"236":0,"237":0,"240":0,"241":0,"242":0,"243":0,"244":0,"248":0,"249":0,"254":0,"256":0,"257":0,"259":0,"260":0,"261":0,"263":0,"264":0,"267":0,"270":0,"272":0,"273":0,"274":0,"275":0,"276":0,"279":0,"282":0,"284":0,"287":0,"288":0,"293":0,"295":0,"297":0,"300":0,"303":0,"306":0,"310":0,"315":0,"318":0,"320":0,"321":0,"322":0,"324":0,"326":0,"334":0,"335":0,"336":0,"337":0,"339":0,"347":0,"348":0,"349":0,"350":0,"352":0,"359":0,"360":0,"361":0,"362":0,"363":0,"375":0,"376":0,"377":0,"379":0,"381":0,"397":0,"398":0,"399":0,"407":0,"408":0,"417":0,"418":0,"428":0,"430":0,"435":0,"437":0,"438":0,"439":0,"440":0,"441":0,"443":0,"444":0,"447":0,"448":0,"452":0,"453":0,"454":0,"458":0,"462":0,"463":0,"464":0,"465":0,"466":0,"470":0,"472":0,"474":0,"475":0,"476":0,"480":0,"481":0,"485":0,"490":0,"493":0,"494":0};
_yuitest_coverage["/build/event-custom-complex/event-custom-complex.js"].functions = {"EventFacade:25":0,"stopPropagation:84":0,"stopImmediatePropagation:95":0,"preventDefault:104":0,"halt:116":0,"(anonymous 2):243":0,"(anonymous 3):248":0,"fireComplex:124":0,"_getFacade:282":0,"stopPropagation:334":0,"stopImmediatePropagation:347":0,"preventDefault:359":0,"halt:375":0,"addTarget:397":0,"getTargets:407":0,"removeTarget:417":0,"bubble:428":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/event-custom-complex/event-custom-complex.js"].coveredLines = 168;
_yuitest_coverage["/build/event-custom-complex/event-custom-complex.js"].coveredFunctions = 18;
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 1);
YUI.add('event-custom-complex', function(Y) {


/**
 * Adds event facades, preventable default behavior, and bubbling.
 * events.
 * @module event-custom
 * @submodule event-custom-complex
 */

_yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 11);
var FACADE,
    FACADE_KEYS,
    EMPTY = {},
    CEProto = Y.CustomEvent.prototype,
    ETProto = Y.EventTarget.prototype;

/**
 * Wraps and protects a custom event for use when emitFacade is set to true.
 * Requires the event-custom-complex module
 * @class EventFacade
 * @param e {Event} the custom event
 * @param currentTarget {HTMLElement} the element the listener was attached to
 */

_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 25);
Y.EventFacade = function(e, currentTarget) {

    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "EventFacade", 25);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 27);
e = e || EMPTY;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 29);
this._event = e;

    /**
     * The arguments passed to fire
     * @property details
     * @type Array
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 36);
this.details = e.details;

    /**
     * The event type, this can be overridden by the fire() payload
     * @property type
     * @type string
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 43);
this.type = e.type;

    /**
     * The real event type
     * @property _type
     * @type string
     * @private
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 51);
this._type = e.type;

    //////////////////////////////////////////////////////

    /**
     * Node reference for the targeted eventtarget
     * @property target
     * @type Node
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 60);
this.target = e.target;

    /**
     * Node reference for the element that the listener was attached to.
     * @property currentTarget
     * @type Node
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 67);
this.currentTarget = currentTarget;

    /**
     * Node reference to the relatedTarget
     * @property relatedTarget
     * @type Node
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 74);
this.relatedTarget = e.relatedTarget;

};

_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 78);
Y.extend(Y.EventFacade, Object, {

    /**
     * Stops the propagation to the next bubble target
     * @method stopPropagation
     */
    stopPropagation: function() {
        _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "stopPropagation", 84);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 85);
this._event.stopPropagation();
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 86);
this.stopped = 1;
    },

    /**
     * Stops the propagation to the next bubble target and
     * prevents any additional listeners from being exectued
     * on the current target.
     * @method stopImmediatePropagation
     */
    stopImmediatePropagation: function() {
        _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "stopImmediatePropagation", 95);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 96);
this._event.stopImmediatePropagation();
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 97);
this.stopped = 2;
    },

    /**
     * Prevents the event's default behavior
     * @method preventDefault
     */
    preventDefault: function() {
        _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "preventDefault", 104);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 105);
this._event.preventDefault();
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 106);
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
        _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "halt", 116);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 117);
this._event.halt(immediate);
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 118);
this.prevented = 1;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 119);
this.stopped = (immediate) ? 2 : 1;
    }

});

_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 124);
CEProto.fireComplex = function(args) {

    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "fireComplex", 124);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 126);
var es, ef, q, queue, ce, ret, events, subs, postponed,
        self = this, host = self.host || self, next, oldbubble;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 129);
if (self.stack) {
        // queue this event if the current item in the queue bubbles
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 131);
if (self.queuable && self.type != self.stack.next.type) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 132);
self.log('queue ' + self.type);
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 133);
self.stack.queue.push([self, args]);
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 134);
return true;
        }
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 138);
es = self.stack || {
       // id of the first event in the stack
       id: self.id,
       next: self,
       silent: self.silent,
       stopped: 0,
       prevented: 0,
       bubbling: null,
       type: self.type,
       // defaultFnQueue: new Y.Queue(),
       afterQueue: new Y.Queue(),
       defaultTargetOnly: self.defaultTargetOnly,
       queue: []
    };

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 153);
subs = self.getSubs();

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 155);
self.stopped = (self.type !== es.type) ? 0 : es.stopped;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 156);
self.prevented = (self.type !== es.type) ? 0 : es.prevented;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 158);
self.target = self.target || host;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 160);
events = new Y.EventTarget({
        fireOnce: true,
        context: host
    });

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 165);
self.events = events;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 167);
if (self.stoppedFn) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 168);
events.on('stopped', self.stoppedFn);
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 171);
self.currentTarget = host;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 173);
self.details = args.slice(); // original arguments in the details

    // self.log("Firing " + self  + ", " + "args: " + args);
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 176);
self.log("Firing " + self.type);

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 178);
self._facade = null; // kill facade to eliminate stale properties

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 180);
ef = self._getFacade(args);

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 182);
if (Y.Lang.isObject(args[0])) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 183);
args[0] = ef;
    } else {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 185);
args.unshift(ef);
    }

    // if (subCount) {
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 189);
if (subs[0]) {
        // self._procSubs(Y.merge(self.subscribers), args, ef);
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 191);
self._procSubs(subs[0], args, ef);
    }

    // bubble if this is hosted in an event target and propagation has not been stopped
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 195);
if (self.bubbles && host.bubble && !self.stopped) {

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 197);
oldbubble = es.bubbling;

        // self.bubbling = true;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 200);
es.bubbling = self.type;

        // if (host !== ef.target || es.type != self.type) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 203);
if (es.type != self.type) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 204);
es.stopped = 0;
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 205);
es.prevented = 0;
        }

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 208);
ret = host.bubble(self, args, null, es);

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 210);
self.stopped = Math.max(self.stopped, es.stopped);
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 211);
self.prevented = Math.max(self.prevented, es.prevented);

        // self.bubbling = false;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 214);
es.bubbling = oldbubble;

    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 218);
if (self.prevented) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 219);
if (self.preventedFn) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 220);
self.preventedFn.apply(host, args);
        }
    } else {_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 222);
if (self.defaultFn &&
              ((!self.defaultTargetOnly && !es.defaultTargetOnly) ||
                host === ef.target)) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 225);
self.defaultFn.apply(host, args);
    }}

    // broadcast listeners are fired as discreet events on the
    // YUI instance and potentially the YUI global.
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 230);
self._broadcast(args);

    // Queue the after
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 233);
if (subs[1] && !self.prevented && self.stopped < 2) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 234);
if (es.id === self.id || self.type != host._yuievt.bubbling) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 235);
self._procSubs(subs[1], args, ef);
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 236);
while ((next = es.afterQueue.last())) {
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 237);
next();
            }
        } else {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 240);
postponed = subs[1];
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 241);
if (es.execDefaultCnt) {
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 242);
postponed = Y.merge(postponed);
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 243);
Y.each(postponed, function(s) {
                    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "(anonymous 2)", 243);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 244);
s.postponed = true;
                });
            }

            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 248);
es.afterQueue.add(function() {
                _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "(anonymous 3)", 248);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 249);
self._procSubs(postponed, args, ef);
            });
        }
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 254);
self.target = null;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 256);
if (es.id === self.id) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 257);
queue = es.queue;

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 259);
while (queue.length) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 260);
q = queue.pop();
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 261);
ce = q[0];
            // set up stack to allow the next item to be processed
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 263);
es.next = ce;
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 264);
ce.fire.apply(ce, q[1]);
        }

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 267);
self.stack = null;
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 270);
ret = !(self.stopped);

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 272);
if (self.type != host._yuievt.bubbling) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 273);
es.stopped = 0;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 274);
es.prevented = 0;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 275);
self.stopped = 0;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 276);
self.prevented = 0;
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 279);
return ret;
};

_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 282);
CEProto._getFacade = function() {

    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "_getFacade", 282);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 284);
var ef = this._facade, o, o2,
    args = this.details;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 287);
if (!ef) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 288);
ef = new Y.EventFacade(this, this.currentTarget);
    }

    // if the first argument is an object literal, apply the
    // properties to the event facade
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 293);
o = args && args[0];

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 295);
if (Y.Lang.isObject(o, true)) {

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 297);
o2 = {};

        // protect the event facade properties
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 300);
Y.mix(o2, ef, true, FACADE_KEYS);

        // mix the data
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 303);
Y.mix(ef, o, true);

        // restore ef
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 306);
Y.mix(ef, o2, true, FACADE_KEYS);

        // Allow the event type to be faked
        // http://yuilibrary.com/projects/yui3/ticket/2528376
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 310);
ef.type = o.type || ef.type;
    }

    // update the details field with the arguments
    // ef.type = this.type;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 315);
ef.details = this.details;

    // use the original target when the event bubbled to this target
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 318);
ef.target = this.originalTarget || this.target;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 320);
ef.currentTarget = this.currentTarget;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 321);
ef.stopped = 0;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 322);
ef.prevented = 0;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 324);
this._facade = ef;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 326);
return this._facade;
};

/**
 * Stop propagation to bubble targets
 * @for CustomEvent
 * @method stopPropagation
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 334);
CEProto.stopPropagation = function() {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "stopPropagation", 334);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 335);
this.stopped = 1;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 336);
if (this.stack) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 337);
this.stack.stopped = 1;
    }
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 339);
this.events.fire('stopped', this);
};

/**
 * Stops propagation to bubble targets, and prevents any remaining
 * subscribers on the current target from executing.
 * @method stopImmediatePropagation
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 347);
CEProto.stopImmediatePropagation = function() {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "stopImmediatePropagation", 347);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 348);
this.stopped = 2;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 349);
if (this.stack) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 350);
this.stack.stopped = 2;
    }
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 352);
this.events.fire('stopped', this);
};

/**
 * Prevents the execution of this event's defaultFn
 * @method preventDefault
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 359);
CEProto.preventDefault = function() {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "preventDefault", 359);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 360);
if (this.preventable) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 361);
this.prevented = 1;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 362);
if (this.stack) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 363);
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
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 375);
CEProto.halt = function(immediate) {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "halt", 375);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 376);
if (immediate) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 377);
this.stopImmediatePropagation();
    } else {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 379);
this.stopPropagation();
    }
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 381);
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
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 397);
ETProto.addTarget = function(o) {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "addTarget", 397);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 398);
this._yuievt.targets[Y.stamp(o)] = o;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 399);
this._yuievt.hasTargets = true;
};

/**
 * Returns an array of bubble targets for this object.
 * @method getTargets
 * @return EventTarget[]
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 407);
ETProto.getTargets = function() {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "getTargets", 407);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 408);
return Y.Object.values(this._yuievt.targets);
};

/**
 * Removes a bubble target
 * @method removeTarget
 * @param o {EventTarget} the target to remove
 * @for EventTarget
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 417);
ETProto.removeTarget = function(o) {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "removeTarget", 417);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 418);
delete this._yuievt.targets[Y.stamp(o)];
};

/**
 * Propagate an event.  Requires the event-custom-complex module.
 * @method bubble
 * @param evt {CustomEvent} the custom event to propagate
 * @return {boolean} the aggregated return value from Event.Custom.fire
 * @for EventTarget
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 428);
ETProto.bubble = function(evt, args, target, es) {

    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "bubble", 428);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 430);
var targs = this._yuievt.targets, ret = true,
        t, type = evt && evt.type, ce, i, bc, ce2,
        originalTarget = target || (evt && evt.target) || this,
        oldbubble;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 435);
if (!evt || ((!evt.stopped) && targs)) {

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 437);
for (i in targs) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 438);
if (targs.hasOwnProperty(i)) {
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 439);
t = targs[i];
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 440);
ce = t.getEvent(type, true);
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 441);
ce2 = t.getSibling(type, ce);

                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 443);
if (ce2 && !ce) {
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 444);
ce = t.publish(type);
                }

                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 447);
oldbubble = t._yuievt.bubbling;
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 448);
t._yuievt.bubbling = type;

                // if this event was not published on the bubble target,
                // continue propagating the event.
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 452);
if (!ce) {
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 453);
if (t._yuievt.hasTargets) {
                        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 454);
t.bubble(evt, args, originalTarget, es);
                    }
                } else {

                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 458);
ce.sibling = ce2;

                    // set the original target to that the target payload on the
                    // facade is correct.
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 462);
ce.target = originalTarget;
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 463);
ce.originalTarget = originalTarget;
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 464);
ce.currentTarget = t;
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 465);
bc = ce.broadcast;
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 466);
ce.broadcast = false;

                    // default publish may not have emitFacade true -- that
                    // shouldn't be what the implementer meant to do
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 470);
ce.emitFacade = true;

                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 472);
ce.stack = es;

                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 474);
ret = ret && ce.fire.apply(ce, args || evt.details || []);
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 475);
ce.broadcast = bc;
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 476);
ce.originalTarget = null;


                    // stopPropagation() was called
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 480);
if (ce.stopped) {
                        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 481);
break;
                    }
                }

                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 485);
t._yuievt.bubbling = oldbubble;
            }
        }
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 490);
return ret;
};

_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 493);
FACADE = new Y.EventFacade();
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 494);
FACADE_KEYS = Y.Object.keys(FACADE);



}, '@VERSION@' ,{requires:['event-custom-base']});
