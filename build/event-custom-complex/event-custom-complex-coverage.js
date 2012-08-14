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
_yuitest_coverage["/build/event-custom-complex/event-custom-complex.js"].code=["YUI.add('event-custom-complex', function(Y) {","","","/**"," * Adds event facades, preventable default behavior, and bubbling."," * events."," * @module event-custom"," * @submodule event-custom-complex"," */","","var FACADE,","    FACADE_KEYS,","    EMPTY = {},","    CEProto = Y.CustomEvent.prototype,","    ETProto = Y.EventTarget.prototype, ","","    mixFacadeProps = function(facade, payload) {","        var p;","","        for (p in payload) {","            // I really think the payload.hasOwnProperty check can go also","            // Leaving it in for now, since i wanted one commit, with the same","            // hasOwnProperty criteria as the original","            if (payload.hasOwnProperty(p) && !FACADE.hasOwnProperty(p)) {","                facade[p] = payload[p];","            }","        }","    };","","/**"," * Wraps and protects a custom event for use when emitFacade is set to true."," * Requires the event-custom-complex module"," * @class EventFacade"," * @param e {Event} the custom event"," * @param currentTarget {HTMLElement} the element the listener was attached to"," */","","Y.EventFacade = function(e, currentTarget) {","","    e = e || EMPTY;","","    this._event = e;","","    /**","     * The arguments passed to fire","     * @property details","     * @type Array","     */","    this.details = e.details;","","    /**","     * The event type, this can be overridden by the fire() payload","     * @property type","     * @type string","     */","    this.type = e.type;","","    /**","     * The real event type","     * @property _type","     * @type string","     * @private","     */","    this._type = e.type;","","    //////////////////////////////////////////////////////","","    /**","     * Node reference for the targeted eventtarget","     * @property target","     * @type Node","     */","    this.target = e.target;","","    /**","     * Node reference for the element that the listener was attached to.","     * @property currentTarget","     * @type Node","     */","    this.currentTarget = currentTarget;","","    /**","     * Node reference to the relatedTarget","     * @property relatedTarget","     * @type Node","     */","    this.relatedTarget = e.relatedTarget;","","};","","Y.mix(Y.EventFacade.prototype, {","","    /**","     * Stops the propagation to the next bubble target","     * @method stopPropagation","     */","    stopPropagation: function() {","        this._event.stopPropagation();","        this.stopped = 1;","    },","","    /**","     * Stops the propagation to the next bubble target and","     * prevents any additional listeners from being exectued","     * on the current target.","     * @method stopImmediatePropagation","     */","    stopImmediatePropagation: function() {","        this._event.stopImmediatePropagation();","        this.stopped = 2;","    },","","    /**","     * Prevents the event's default behavior","     * @method preventDefault","     */","    preventDefault: function() {","        this._event.preventDefault();","        this.prevented = 1;","    },","","    /**","     * Stops the event propagation and prevents the default","     * event behavior.","     * @method halt","     * @param immediate {boolean} if true additional listeners","     * on the current target will not be executed","     */","    halt: function(immediate) {","        this._event.halt(immediate);","        this.prevented = 1;","        this.stopped = (immediate) ? 2 : 1;","    }","","});","","CEProto.fireComplex = function(args) {","","    var es, ef, q, queue, ce, ret, events, subs, postponed,","        self = this, host = self.host || self, next, oldbubble;","","    if (self.stack) {","        // queue this event if the current item in the queue bubbles","        if (self.queuable && self.type != self.stack.next.type) {","            self.log('queue ' + self.type);","            self.stack.queue.push([self, args]);","            return true;","        }","    }","","    es = self.stack || {","       // id of the first event in the stack","       id: self.id,","       next: self,","       silent: self.silent,","       stopped: 0,","       prevented: 0,","       bubbling: null,","       type: self.type,","       // defaultFnQueue: new Y.Queue(),","       afterQueue: new Y.Queue(),","       defaultTargetOnly: self.defaultTargetOnly,","       queue: []","    };","","    subs = self.getSubs();","","    self.stopped = (self.type !== es.type) ? 0 : es.stopped;","    self.prevented = (self.type !== es.type) ? 0 : es.prevented;","","    self.target = self.target || host;","","    if (self.stoppedFn) {","        events = new Y.EventTarget({","            fireOnce: true,","            context: host","        });","        ","        self.events = events;","","        events.on('stopped', self.stoppedFn);","    }","","    self.currentTarget = host;","","    self.details = args.slice(); // original arguments in the details","","    // self.log(\"Firing \" + self  + \", \" + \"args: \" + args);","    self.log(\"Firing \" + self.type);","","    self._facade = null; // kill facade to eliminate stale properties","","    ef = self._getFacade(args);","","    if (Y.Lang.isObject(args[0])) {","        args[0] = ef;","    } else {","        args.unshift(ef);","    }","","    if (subs[0]) {","        self._procSubs(subs[0], args, ef);","    }","","    // bubble if this is hosted in an event target and propagation has not been stopped","    if (self.bubbles && host.bubble && !self.stopped) {","","        oldbubble = es.bubbling;","","        es.bubbling = self.type;","","        if (es.type != self.type) {","            es.stopped = 0;","            es.prevented = 0;","        }","","        ret = host.bubble(self, args, null, es);","","        self.stopped = Math.max(self.stopped, es.stopped);","        self.prevented = Math.max(self.prevented, es.prevented);","","        es.bubbling = oldbubble;","    }","","    if (self.prevented) {","        if (self.preventedFn) {","            self.preventedFn.apply(host, args);","        }","    } else if (self.defaultFn &&","              ((!self.defaultTargetOnly && !es.defaultTargetOnly) ||","                host === ef.target)) {","        self.defaultFn.apply(host, args);","    }","","    // broadcast listeners are fired as discreet events on the","    // YUI instance and potentially the YUI global.","    self._broadcast(args);","","    // Queue the after","    if (subs[1] && !self.prevented && self.stopped < 2) {","        if (es.id === self.id || self.type != host._yuievt.bubbling) {","            self._procSubs(subs[1], args, ef);","            while ((next = es.afterQueue.last())) {","                next();","            }","        } else {","            postponed = subs[1];","            if (es.execDefaultCnt) {","                postponed = Y.merge(postponed);","                Y.each(postponed, function(s) {","                    s.postponed = true;","                });","            }","","            es.afterQueue.add(function() {","                self._procSubs(postponed, args, ef);","            });","        }","    }","","    self.target = null;","","    if (es.id === self.id) {","        queue = es.queue;","","        while (queue.length) {","            q = queue.pop();","            ce = q[0];","            // set up stack to allow the next item to be processed","            es.next = ce;","            ce.fire.apply(ce, q[1]);","        }","","        self.stack = null;","    }","","    ret = !(self.stopped);","","    if (self.type != host._yuievt.bubbling) {","        es.stopped = 0;","        es.prevented = 0;","        self.stopped = 0;","        self.prevented = 0;","    }","","    // Kill the cached facade to free up memory.","    // Otherwise we have the facade from the last fire, sitting around forever.","    self._facade = null;","","    return ret;","};","","CEProto._getFacade = function() {","","    var ef = this._facade, o,","    args = this.details;","","    if (!ef) {","        ef = new Y.EventFacade(this, this.currentTarget);","    }","","    // if the first argument is an object literal, apply the","    // properties to the event facade","    o = args && args[0];","","    if (Y.Lang.isObject(o, true)) {","","        // protect the event facade properties","        mixFacadeProps(ef, o);","","        // Allow the event type to be faked","        // http://yuilibrary.com/projects/yui3/ticket/2528376","        ef.type = o.type || ef.type;","    }","","    // update the details field with the arguments","    // ef.type = this.type;","    ef.details = this.details;","","    // use the original target when the event bubbled to this target","    ef.target = this.originalTarget || this.target;","","    ef.currentTarget = this.currentTarget;","    ef.stopped = 0;","    ef.prevented = 0;","","    this._facade = ef;","","    return this._facade;","};","","/**"," * Stop propagation to bubble targets"," * @for CustomEvent"," * @method stopPropagation"," */","CEProto.stopPropagation = function() {","    this.stopped = 1;","    if (this.stack) {","        this.stack.stopped = 1;","    }","    if (this.events) {","        this.events.fire('stopped', this);","    }","};","","/**"," * Stops propagation to bubble targets, and prevents any remaining"," * subscribers on the current target from executing."," * @method stopImmediatePropagation"," */","CEProto.stopImmediatePropagation = function() {","    this.stopped = 2;","    if (this.stack) {","        this.stack.stopped = 2;","    }","    if (this.events) {","        this.events.fire('stopped', this);","    }","};","","/**"," * Prevents the execution of this event's defaultFn"," * @method preventDefault"," */","CEProto.preventDefault = function() {","    if (this.preventable) {","        this.prevented = 1;","        if (this.stack) {","            this.stack.prevented = 1;","        }","    }","};","","/**"," * Stops the event propagation and prevents the default"," * event behavior."," * @method halt"," * @param immediate {boolean} if true additional listeners"," * on the current target will not be executed"," */","CEProto.halt = function(immediate) {","    if (immediate) {","        this.stopImmediatePropagation();","    } else {","        this.stopPropagation();","    }","    this.preventDefault();","};","","/**"," * Registers another EventTarget as a bubble target.  Bubble order"," * is determined by the order registered.  Multiple targets can"," * be specified."," *"," * Events can only bubble if emitFacade is true."," *"," * Included in the event-custom-complex submodule."," *"," * @method addTarget"," * @param o {EventTarget} the target to add"," * @for EventTarget"," */","ETProto.addTarget = function(o) {","    this._yuievt.targets[Y.stamp(o)] = o;","    this._yuievt.hasTargets = true;","};","","/**"," * Returns an array of bubble targets for this object."," * @method getTargets"," * @return EventTarget[]"," */","ETProto.getTargets = function() {","    return Y.Object.values(this._yuievt.targets);","};","","/**"," * Removes a bubble target"," * @method removeTarget"," * @param o {EventTarget} the target to remove"," * @for EventTarget"," */","ETProto.removeTarget = function(o) {","    delete this._yuievt.targets[Y.stamp(o)];","};","","/**"," * Propagate an event.  Requires the event-custom-complex module."," * @method bubble"," * @param evt {CustomEvent} the custom event to propagate"," * @return {boolean} the aggregated return value from Event.Custom.fire"," * @for EventTarget"," */","ETProto.bubble = function(evt, args, target, es) {","","    var targs = this._yuievt.targets, ret = true,","        t, type = evt && evt.type, ce, i, bc, ce2,","        originalTarget = target || (evt && evt.target) || this,","        oldbubble;","","    if (!evt || ((!evt.stopped) && targs)) {","","        for (i in targs) {","            if (targs.hasOwnProperty(i)) {","                t = targs[i];","                ce = t.getEvent(type, true);","                ce2 = t.getSibling(type, ce);","","                if (ce2 && !ce) {","                    ce = t.publish(type);","                }","","                oldbubble = t._yuievt.bubbling;","                t._yuievt.bubbling = type;","","                // if this event was not published on the bubble target,","                // continue propagating the event.","                if (!ce) {","                    if (t._yuievt.hasTargets) {","                        t.bubble(evt, args, originalTarget, es);","                    }","                } else {","","                    ce.sibling = ce2;","","                    // set the original target to that the target payload on the","                    // facade is correct.","                    ce.target = originalTarget;","                    ce.originalTarget = originalTarget;","                    ce.currentTarget = t;","                    bc = ce.broadcast;","                    ce.broadcast = false;","","                    // default publish may not have emitFacade true -- that","                    // shouldn't be what the implementer meant to do","                    ce.emitFacade = true;","","                    ce.stack = es;","","                    ret = ret && ce.fire.apply(ce, args || evt.details || []);","                    ce.broadcast = bc;","                    ce.originalTarget = null;","","                    // stopPropagation() was called","                    if (ce.stopped) {","                        break;","                    }","                }","","                t._yuievt.bubbling = oldbubble;","            }","        }","    }","","    return ret;","};","","FACADE = new Y.EventFacade();","FACADE_KEYS = Y.Object.keys(FACADE);","","","}, '@VERSION@' ,{requires:['event-custom-base']});"];
_yuitest_coverage["/build/event-custom-complex/event-custom-complex.js"].lines = {"1":0,"11":0,"18":0,"20":0,"24":0,"25":0,"38":0,"40":0,"42":0,"49":0,"56":0,"64":0,"73":0,"80":0,"87":0,"91":0,"98":0,"99":0,"109":0,"110":0,"118":0,"119":0,"130":0,"131":0,"132":0,"137":0,"139":0,"142":0,"144":0,"145":0,"146":0,"147":0,"151":0,"166":0,"168":0,"169":0,"171":0,"173":0,"174":0,"179":0,"181":0,"184":0,"186":0,"189":0,"191":0,"193":0,"195":0,"196":0,"198":0,"201":0,"202":0,"206":0,"208":0,"210":0,"212":0,"213":0,"214":0,"217":0,"219":0,"220":0,"222":0,"225":0,"226":0,"227":0,"229":0,"232":0,"237":0,"240":0,"241":0,"242":0,"243":0,"244":0,"247":0,"248":0,"249":0,"250":0,"251":0,"255":0,"256":0,"261":0,"263":0,"264":0,"266":0,"267":0,"268":0,"270":0,"271":0,"274":0,"277":0,"279":0,"280":0,"281":0,"282":0,"283":0,"288":0,"290":0,"293":0,"295":0,"298":0,"299":0,"304":0,"306":0,"309":0,"313":0,"318":0,"321":0,"323":0,"324":0,"325":0,"327":0,"329":0,"337":0,"338":0,"339":0,"340":0,"342":0,"343":0,"352":0,"353":0,"354":0,"355":0,"357":0,"358":0,"366":0,"367":0,"368":0,"369":0,"370":0,"382":0,"383":0,"384":0,"386":0,"388":0,"404":0,"405":0,"406":0,"414":0,"415":0,"424":0,"425":0,"435":0,"437":0,"442":0,"444":0,"445":0,"446":0,"447":0,"448":0,"450":0,"451":0,"454":0,"455":0,"459":0,"460":0,"461":0,"465":0,"469":0,"470":0,"471":0,"472":0,"473":0,"477":0,"479":0,"481":0,"482":0,"483":0,"486":0,"487":0,"491":0,"496":0,"499":0,"500":0};
_yuitest_coverage["/build/event-custom-complex/event-custom-complex.js"].functions = {"mixFacadeProps:17":0,"EventFacade:38":0,"stopPropagation:97":0,"stopImmediatePropagation:108":0,"preventDefault:117":0,"halt:129":0,"(anonymous 2):250":0,"(anonymous 3):255":0,"fireComplex:137":0,"_getFacade:293":0,"stopPropagation:337":0,"stopImmediatePropagation:352":0,"preventDefault:366":0,"halt:382":0,"addTarget:404":0,"getTargets:414":0,"removeTarget:424":0,"bubble:435":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/event-custom-complex/event-custom-complex.js"].coveredLines = 172;
_yuitest_coverage["/build/event-custom-complex/event-custom-complex.js"].coveredFunctions = 19;
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
    ETProto = Y.EventTarget.prototype, 

    mixFacadeProps = function(facade, payload) {
        _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "mixFacadeProps", 17);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 18);
var p;

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 20);
for (p in payload) {
            // I really think the payload.hasOwnProperty check can go also
            // Leaving it in for now, since i wanted one commit, with the same
            // hasOwnProperty criteria as the original
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 24);
if (payload.hasOwnProperty(p) && !FACADE.hasOwnProperty(p)) {
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 25);
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

_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 38);
Y.EventFacade = function(e, currentTarget) {

    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "EventFacade", 38);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 40);
e = e || EMPTY;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 42);
this._event = e;

    /**
     * The arguments passed to fire
     * @property details
     * @type Array
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 49);
this.details = e.details;

    /**
     * The event type, this can be overridden by the fire() payload
     * @property type
     * @type string
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 56);
this.type = e.type;

    /**
     * The real event type
     * @property _type
     * @type string
     * @private
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 64);
this._type = e.type;

    //////////////////////////////////////////////////////

    /**
     * Node reference for the targeted eventtarget
     * @property target
     * @type Node
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 73);
this.target = e.target;

    /**
     * Node reference for the element that the listener was attached to.
     * @property currentTarget
     * @type Node
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 80);
this.currentTarget = currentTarget;

    /**
     * Node reference to the relatedTarget
     * @property relatedTarget
     * @type Node
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 87);
this.relatedTarget = e.relatedTarget;

};

_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 91);
Y.mix(Y.EventFacade.prototype, {

    /**
     * Stops the propagation to the next bubble target
     * @method stopPropagation
     */
    stopPropagation: function() {
        _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "stopPropagation", 97);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 98);
this._event.stopPropagation();
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 99);
this.stopped = 1;
    },

    /**
     * Stops the propagation to the next bubble target and
     * prevents any additional listeners from being exectued
     * on the current target.
     * @method stopImmediatePropagation
     */
    stopImmediatePropagation: function() {
        _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "stopImmediatePropagation", 108);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 109);
this._event.stopImmediatePropagation();
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 110);
this.stopped = 2;
    },

    /**
     * Prevents the event's default behavior
     * @method preventDefault
     */
    preventDefault: function() {
        _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "preventDefault", 117);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 118);
this._event.preventDefault();
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 119);
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
        _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "halt", 129);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 130);
this._event.halt(immediate);
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 131);
this.prevented = 1;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 132);
this.stopped = (immediate) ? 2 : 1;
    }

});

_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 137);
CEProto.fireComplex = function(args) {

    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "fireComplex", 137);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 139);
var es, ef, q, queue, ce, ret, events, subs, postponed,
        self = this, host = self.host || self, next, oldbubble;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 142);
if (self.stack) {
        // queue this event if the current item in the queue bubbles
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 144);
if (self.queuable && self.type != self.stack.next.type) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 145);
self.log('queue ' + self.type);
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 146);
self.stack.queue.push([self, args]);
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 147);
return true;
        }
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 151);
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

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 166);
subs = self.getSubs();

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 168);
self.stopped = (self.type !== es.type) ? 0 : es.stopped;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 169);
self.prevented = (self.type !== es.type) ? 0 : es.prevented;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 171);
self.target = self.target || host;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 173);
if (self.stoppedFn) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 174);
events = new Y.EventTarget({
            fireOnce: true,
            context: host
        });
        
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 179);
self.events = events;

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 181);
events.on('stopped', self.stoppedFn);
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 184);
self.currentTarget = host;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 186);
self.details = args.slice(); // original arguments in the details

    // self.log("Firing " + self  + ", " + "args: " + args);
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 189);
self.log("Firing " + self.type);

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 191);
self._facade = null; // kill facade to eliminate stale properties

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 193);
ef = self._getFacade(args);

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 195);
if (Y.Lang.isObject(args[0])) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 196);
args[0] = ef;
    } else {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 198);
args.unshift(ef);
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 201);
if (subs[0]) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 202);
self._procSubs(subs[0], args, ef);
    }

    // bubble if this is hosted in an event target and propagation has not been stopped
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 206);
if (self.bubbles && host.bubble && !self.stopped) {

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 208);
oldbubble = es.bubbling;

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 210);
es.bubbling = self.type;

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 212);
if (es.type != self.type) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 213);
es.stopped = 0;
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 214);
es.prevented = 0;
        }

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 217);
ret = host.bubble(self, args, null, es);

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 219);
self.stopped = Math.max(self.stopped, es.stopped);
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 220);
self.prevented = Math.max(self.prevented, es.prevented);

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 222);
es.bubbling = oldbubble;
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 225);
if (self.prevented) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 226);
if (self.preventedFn) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 227);
self.preventedFn.apply(host, args);
        }
    } else {_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 229);
if (self.defaultFn &&
              ((!self.defaultTargetOnly && !es.defaultTargetOnly) ||
                host === ef.target)) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 232);
self.defaultFn.apply(host, args);
    }}

    // broadcast listeners are fired as discreet events on the
    // YUI instance and potentially the YUI global.
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 237);
self._broadcast(args);

    // Queue the after
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 240);
if (subs[1] && !self.prevented && self.stopped < 2) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 241);
if (es.id === self.id || self.type != host._yuievt.bubbling) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 242);
self._procSubs(subs[1], args, ef);
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 243);
while ((next = es.afterQueue.last())) {
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 244);
next();
            }
        } else {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 247);
postponed = subs[1];
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 248);
if (es.execDefaultCnt) {
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 249);
postponed = Y.merge(postponed);
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 250);
Y.each(postponed, function(s) {
                    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "(anonymous 2)", 250);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 251);
s.postponed = true;
                });
            }

            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 255);
es.afterQueue.add(function() {
                _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "(anonymous 3)", 255);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 256);
self._procSubs(postponed, args, ef);
            });
        }
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 261);
self.target = null;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 263);
if (es.id === self.id) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 264);
queue = es.queue;

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 266);
while (queue.length) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 267);
q = queue.pop();
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 268);
ce = q[0];
            // set up stack to allow the next item to be processed
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 270);
es.next = ce;
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 271);
ce.fire.apply(ce, q[1]);
        }

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 274);
self.stack = null;
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 277);
ret = !(self.stopped);

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 279);
if (self.type != host._yuievt.bubbling) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 280);
es.stopped = 0;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 281);
es.prevented = 0;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 282);
self.stopped = 0;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 283);
self.prevented = 0;
    }

    // Kill the cached facade to free up memory.
    // Otherwise we have the facade from the last fire, sitting around forever.
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 288);
self._facade = null;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 290);
return ret;
};

_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 293);
CEProto._getFacade = function() {

    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "_getFacade", 293);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 295);
var ef = this._facade, o,
    args = this.details;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 298);
if (!ef) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 299);
ef = new Y.EventFacade(this, this.currentTarget);
    }

    // if the first argument is an object literal, apply the
    // properties to the event facade
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 304);
o = args && args[0];

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 306);
if (Y.Lang.isObject(o, true)) {

        // protect the event facade properties
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 309);
mixFacadeProps(ef, o);

        // Allow the event type to be faked
        // http://yuilibrary.com/projects/yui3/ticket/2528376
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 313);
ef.type = o.type || ef.type;
    }

    // update the details field with the arguments
    // ef.type = this.type;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 318);
ef.details = this.details;

    // use the original target when the event bubbled to this target
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 321);
ef.target = this.originalTarget || this.target;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 323);
ef.currentTarget = this.currentTarget;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 324);
ef.stopped = 0;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 325);
ef.prevented = 0;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 327);
this._facade = ef;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 329);
return this._facade;
};

/**
 * Stop propagation to bubble targets
 * @for CustomEvent
 * @method stopPropagation
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 337);
CEProto.stopPropagation = function() {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "stopPropagation", 337);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 338);
this.stopped = 1;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 339);
if (this.stack) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 340);
this.stack.stopped = 1;
    }
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 342);
if (this.events) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 343);
this.events.fire('stopped', this);
    }
};

/**
 * Stops propagation to bubble targets, and prevents any remaining
 * subscribers on the current target from executing.
 * @method stopImmediatePropagation
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 352);
CEProto.stopImmediatePropagation = function() {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "stopImmediatePropagation", 352);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 353);
this.stopped = 2;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 354);
if (this.stack) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 355);
this.stack.stopped = 2;
    }
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 357);
if (this.events) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 358);
this.events.fire('stopped', this);
    }
};

/**
 * Prevents the execution of this event's defaultFn
 * @method preventDefault
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 366);
CEProto.preventDefault = function() {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "preventDefault", 366);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 367);
if (this.preventable) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 368);
this.prevented = 1;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 369);
if (this.stack) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 370);
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
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 382);
CEProto.halt = function(immediate) {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "halt", 382);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 383);
if (immediate) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 384);
this.stopImmediatePropagation();
    } else {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 386);
this.stopPropagation();
    }
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 388);
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
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 404);
ETProto.addTarget = function(o) {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "addTarget", 404);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 405);
this._yuievt.targets[Y.stamp(o)] = o;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 406);
this._yuievt.hasTargets = true;
};

/**
 * Returns an array of bubble targets for this object.
 * @method getTargets
 * @return EventTarget[]
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 414);
ETProto.getTargets = function() {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "getTargets", 414);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 415);
return Y.Object.values(this._yuievt.targets);
};

/**
 * Removes a bubble target
 * @method removeTarget
 * @param o {EventTarget} the target to remove
 * @for EventTarget
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 424);
ETProto.removeTarget = function(o) {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "removeTarget", 424);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 425);
delete this._yuievt.targets[Y.stamp(o)];
};

/**
 * Propagate an event.  Requires the event-custom-complex module.
 * @method bubble
 * @param evt {CustomEvent} the custom event to propagate
 * @return {boolean} the aggregated return value from Event.Custom.fire
 * @for EventTarget
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 435);
ETProto.bubble = function(evt, args, target, es) {

    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "bubble", 435);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 437);
var targs = this._yuievt.targets, ret = true,
        t, type = evt && evt.type, ce, i, bc, ce2,
        originalTarget = target || (evt && evt.target) || this,
        oldbubble;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 442);
if (!evt || ((!evt.stopped) && targs)) {

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 444);
for (i in targs) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 445);
if (targs.hasOwnProperty(i)) {
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 446);
t = targs[i];
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 447);
ce = t.getEvent(type, true);
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 448);
ce2 = t.getSibling(type, ce);

                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 450);
if (ce2 && !ce) {
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 451);
ce = t.publish(type);
                }

                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 454);
oldbubble = t._yuievt.bubbling;
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 455);
t._yuievt.bubbling = type;

                // if this event was not published on the bubble target,
                // continue propagating the event.
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 459);
if (!ce) {
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 460);
if (t._yuievt.hasTargets) {
                        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 461);
t.bubble(evt, args, originalTarget, es);
                    }
                } else {

                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 465);
ce.sibling = ce2;

                    // set the original target to that the target payload on the
                    // facade is correct.
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 469);
ce.target = originalTarget;
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 470);
ce.originalTarget = originalTarget;
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 471);
ce.currentTarget = t;
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 472);
bc = ce.broadcast;
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 473);
ce.broadcast = false;

                    // default publish may not have emitFacade true -- that
                    // shouldn't be what the implementer meant to do
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 477);
ce.emitFacade = true;

                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 479);
ce.stack = es;

                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 481);
ret = ret && ce.fire.apply(ce, args || evt.details || []);
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 482);
ce.broadcast = bc;
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 483);
ce.originalTarget = null;

                    // stopPropagation() was called
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 486);
if (ce.stopped) {
                        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 487);
break;
                    }
                }

                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 491);
t._yuievt.bubbling = oldbubble;
            }
        }
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 496);
return ret;
};

_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 499);
FACADE = new Y.EventFacade();
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 500);
FACADE_KEYS = Y.Object.keys(FACADE);


}, '@VERSION@' ,{requires:['event-custom-base']});
