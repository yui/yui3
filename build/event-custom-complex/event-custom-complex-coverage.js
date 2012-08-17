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
_yuitest_coverage["/build/event-custom-complex/event-custom-complex.js"].code=["YUI.add('event-custom-complex', function(Y) {","","","/**"," * Adds event facades, preventable default behavior, and bubbling."," * events."," * @module event-custom"," * @submodule event-custom-complex"," */","","var FACADE,","    FACADE_KEYS,","    key,","    EMPTY = {},","    CEProto = Y.CustomEvent.prototype,","    ETProto = Y.EventTarget.prototype, ","","    mixFacadeProps = function(facade, payload) {","        var p;","","        for (p in payload) {","            if (!(FACADE_KEYS.hasOwnProperty(p))) {","                facade[p] = payload[p];","            }","        }","    };","","/**"," * Wraps and protects a custom event for use when emitFacade is set to true."," * Requires the event-custom-complex module"," * @class EventFacade"," * @param e {Event} the custom event"," * @param currentTarget {HTMLElement} the element the listener was attached to"," */","","Y.EventFacade = function(e, currentTarget) {","","    e = e || EMPTY;","","    this._event = e;","","    /**","     * The arguments passed to fire","     * @property details","     * @type Array","     */","    this.details = e.details;","","    /**","     * The event type, this can be overridden by the fire() payload","     * @property type","     * @type string","     */","    this.type = e.type;","","    /**","     * The real event type","     * @property _type","     * @type string","     * @private","     */","    this._type = e.type;","","    //////////////////////////////////////////////////////","","    /**","     * Node reference for the targeted eventtarget","     * @property target","     * @type Node","     */","    this.target = e.target;","","    /**","     * Node reference for the element that the listener was attached to.","     * @property currentTarget","     * @type Node","     */","    this.currentTarget = currentTarget;","","    /**","     * Node reference to the relatedTarget","     * @property relatedTarget","     * @type Node","     */","    this.relatedTarget = e.relatedTarget;","","};","","Y.mix(Y.EventFacade.prototype, {","","    /**","     * Stops the propagation to the next bubble target","     * @method stopPropagation","     */","    stopPropagation: function() {","        this._event.stopPropagation();","        this.stopped = 1;","    },","","    /**","     * Stops the propagation to the next bubble target and","     * prevents any additional listeners from being exectued","     * on the current target.","     * @method stopImmediatePropagation","     */","    stopImmediatePropagation: function() {","        this._event.stopImmediatePropagation();","        this.stopped = 2;","    },","","    /**","     * Prevents the event's default behavior","     * @method preventDefault","     */","    preventDefault: function() {","        this._event.preventDefault();","        this.prevented = 1;","    },","","    /**","     * Stops the event propagation and prevents the default","     * event behavior.","     * @method halt","     * @param immediate {boolean} if true additional listeners","     * on the current target will not be executed","     */","    halt: function(immediate) {","        this._event.halt(immediate);","        this.prevented = 1;","        this.stopped = (immediate) ? 2 : 1;","    }","","});","","CEProto.fireComplex = function(args) {","","    var es, ef, q, queue, ce, ret, events, subs, postponed,","        self = this, host = self.host || self, next, oldbubble;","","    if (self.stack) {","        // queue this event if the current item in the queue bubbles","        if (self.queuable && self.type != self.stack.next.type) {","            self.log('queue ' + self.type);","            self.stack.queue.push([self, args]);","            return true;","        }","    }","","    es = self.stack || {","       // id of the first event in the stack","       id: self.id,","       next: self,","       silent: self.silent,","       stopped: 0,","       prevented: 0,","       bubbling: null,","       type: self.type,","       // defaultFnQueue: new Y.Queue(),","       afterQueue: new Y.Queue(),","       defaultTargetOnly: self.defaultTargetOnly,","       queue: []","    };","","    subs = self.getSubs();","","    self.stopped = (self.type !== es.type) ? 0 : es.stopped;","    self.prevented = (self.type !== es.type) ? 0 : es.prevented;","","    self.target = self.target || host;","","    if (self.stoppedFn) {","        events = new Y.EventTarget({","            fireOnce: true,","            context: host","        });","        ","        self.events = events;","","        events.on('stopped', self.stoppedFn);","    }","","    self.currentTarget = host;","","    self.details = args.slice(); // original arguments in the details","","    // self.log(\"Firing \" + self  + \", \" + \"args: \" + args);","    self.log(\"Firing \" + self.type);","","    self._facade = null; // kill facade to eliminate stale properties","","    ef = self._getFacade(args);","","    if (Y.Lang.isObject(args[0])) {","        args[0] = ef;","    } else {","        args.unshift(ef);","    }","","    if (subs[0]) {","        self._procSubs(subs[0], args, ef);","    }","","    // bubble if this is hosted in an event target and propagation has not been stopped","    if (self.bubbles && host.bubble && !self.stopped) {","","        oldbubble = es.bubbling;","","        es.bubbling = self.type;","","        if (es.type != self.type) {","            es.stopped = 0;","            es.prevented = 0;","        }","","        ret = host.bubble(self, args, null, es);","","        self.stopped = Math.max(self.stopped, es.stopped);","        self.prevented = Math.max(self.prevented, es.prevented);","","        es.bubbling = oldbubble;","    }","","    if (self.prevented) {","        if (self.preventedFn) {","            self.preventedFn.apply(host, args);","        }","    } else if (self.defaultFn &&","              ((!self.defaultTargetOnly && !es.defaultTargetOnly) ||","                host === ef.target)) {","        self.defaultFn.apply(host, args);","    }","","    // broadcast listeners are fired as discreet events on the","    // YUI instance and potentially the YUI global.","    self._broadcast(args);","","    // Queue the after","    if (subs[1] && !self.prevented && self.stopped < 2) {","        if (es.id === self.id || self.type != host._yuievt.bubbling) {","            self._procSubs(subs[1], args, ef);","            while ((next = es.afterQueue.last())) {","                next();","            }","        } else {","            postponed = subs[1];","            if (es.execDefaultCnt) {","                postponed = Y.merge(postponed);","                Y.each(postponed, function(s) {","                    s.postponed = true;","                });","            }","","            es.afterQueue.add(function() {","                self._procSubs(postponed, args, ef);","            });","        }","    }","","    self.target = null;","","    if (es.id === self.id) {","        queue = es.queue;","","        while (queue.length) {","            q = queue.pop();","            ce = q[0];","            // set up stack to allow the next item to be processed","            es.next = ce;","            ce.fire.apply(ce, q[1]);","        }","","        self.stack = null;","    }","","    ret = !(self.stopped);","","    if (self.type != host._yuievt.bubbling) {","        es.stopped = 0;","        es.prevented = 0;","        self.stopped = 0;","        self.prevented = 0;","    }","","    // Kill the cached facade to free up memory.","    // Otherwise we have the facade from the last fire, sitting around forever.","    self._facade = null;","","    return ret;","};","","CEProto._getFacade = function() {","","    var ef = this._facade, o,","    args = this.details;","","    if (!ef) {","        ef = new Y.EventFacade(this, this.currentTarget);","    }","","    // if the first argument is an object literal, apply the","    // properties to the event facade","    o = args && args[0];","","    if (Y.Lang.isObject(o, true)) {","","        // protect the event facade properties","        mixFacadeProps(ef, o);","","        // Allow the event type to be faked","        // http://yuilibrary.com/projects/yui3/ticket/2528376","        ef.type = o.type || ef.type;","    }","","    // update the details field with the arguments","    // ef.type = this.type;","    ef.details = this.details;","","    // use the original target when the event bubbled to this target","    ef.target = this.originalTarget || this.target;","","    ef.currentTarget = this.currentTarget;","    ef.stopped = 0;","    ef.prevented = 0;","","    this._facade = ef;","","    return this._facade;","};","","/**"," * Stop propagation to bubble targets"," * @for CustomEvent"," * @method stopPropagation"," */","CEProto.stopPropagation = function() {","    this.stopped = 1;","    if (this.stack) {","        this.stack.stopped = 1;","    }","    if (this.events) {","        this.events.fire('stopped', this);","    }","};","","/**"," * Stops propagation to bubble targets, and prevents any remaining"," * subscribers on the current target from executing."," * @method stopImmediatePropagation"," */","CEProto.stopImmediatePropagation = function() {","    this.stopped = 2;","    if (this.stack) {","        this.stack.stopped = 2;","    }","    if (this.events) {","        this.events.fire('stopped', this);","    }","};","","/**"," * Prevents the execution of this event's defaultFn"," * @method preventDefault"," */","CEProto.preventDefault = function() {","    if (this.preventable) {","        this.prevented = 1;","        if (this.stack) {","            this.stack.prevented = 1;","        }","    }","};","","/**"," * Stops the event propagation and prevents the default"," * event behavior."," * @method halt"," * @param immediate {boolean} if true additional listeners"," * on the current target will not be executed"," */","CEProto.halt = function(immediate) {","    if (immediate) {","        this.stopImmediatePropagation();","    } else {","        this.stopPropagation();","    }","    this.preventDefault();","};","","/**"," * Registers another EventTarget as a bubble target.  Bubble order"," * is determined by the order registered.  Multiple targets can"," * be specified."," *"," * Events can only bubble if emitFacade is true."," *"," * Included in the event-custom-complex submodule."," *"," * @method addTarget"," * @param o {EventTarget} the target to add"," * @for EventTarget"," */","ETProto.addTarget = function(o) {","    this._yuievt.targets[Y.stamp(o)] = o;","    this._yuievt.hasTargets = true;","};","","/**"," * Returns an array of bubble targets for this object."," * @method getTargets"," * @return EventTarget[]"," */","ETProto.getTargets = function() {","    return Y.Object.values(this._yuievt.targets);","};","","/**"," * Removes a bubble target"," * @method removeTarget"," * @param o {EventTarget} the target to remove"," * @for EventTarget"," */","ETProto.removeTarget = function(o) {","    delete this._yuievt.targets[Y.stamp(o)];","};","","/**"," * Propagate an event.  Requires the event-custom-complex module."," * @method bubble"," * @param evt {CustomEvent} the custom event to propagate"," * @return {boolean} the aggregated return value from Event.Custom.fire"," * @for EventTarget"," */","ETProto.bubble = function(evt, args, target, es) {","","    var targs = this._yuievt.targets, ret = true,","        t, type = evt && evt.type, ce, i, bc, ce2,","        originalTarget = target || (evt && evt.target) || this,","        oldbubble;","","    if (!evt || ((!evt.stopped) && targs)) {","","        for (i in targs) {","            if (targs.hasOwnProperty(i)) {","                t = targs[i];","                ce = t.getEvent(type, true);","                ce2 = t.getSibling(type, ce);","","                if (ce2 && !ce) {","                    ce = t.publish(type);","                }","","                oldbubble = t._yuievt.bubbling;","                t._yuievt.bubbling = type;","","                // if this event was not published on the bubble target,","                // continue propagating the event.","                if (!ce) {","                    if (t._yuievt.hasTargets) {","                        t.bubble(evt, args, originalTarget, es);","                    }","                } else {","","                    ce.sibling = ce2;","","                    // set the original target to that the target payload on the","                    // facade is correct.","                    ce.target = originalTarget;","                    ce.originalTarget = originalTarget;","                    ce.currentTarget = t;","                    bc = ce.broadcast;","                    ce.broadcast = false;","","                    // default publish may not have emitFacade true -- that","                    // shouldn't be what the implementer meant to do","                    ce.emitFacade = true;","","                    ce.stack = es;","","                    ret = ret && ce.fire.apply(ce, args || evt.details || []);","                    ce.broadcast = bc;","                    ce.originalTarget = null;","","                    // stopPropagation() was called","                    if (ce.stopped) {","                        break;","                    }","                }","","                t._yuievt.bubbling = oldbubble;","            }","        }","    }","","    return ret;","};","","FACADE = new Y.EventFacade();","FACADE_KEYS = {};","","// Flatten whitelist","for (key in FACADE) {","    FACADE_KEYS[key] = true;","}","","","}, '@VERSION@' ,{requires:['event-custom-base']});"];
_yuitest_coverage["/build/event-custom-complex/event-custom-complex.js"].lines = {"1":0,"11":0,"19":0,"21":0,"22":0,"23":0,"36":0,"38":0,"40":0,"47":0,"54":0,"62":0,"71":0,"78":0,"85":0,"89":0,"96":0,"97":0,"107":0,"108":0,"116":0,"117":0,"128":0,"129":0,"130":0,"135":0,"137":0,"140":0,"142":0,"143":0,"144":0,"145":0,"149":0,"164":0,"166":0,"167":0,"169":0,"171":0,"172":0,"177":0,"179":0,"182":0,"184":0,"187":0,"189":0,"191":0,"193":0,"194":0,"196":0,"199":0,"200":0,"204":0,"206":0,"208":0,"210":0,"211":0,"212":0,"215":0,"217":0,"218":0,"220":0,"223":0,"224":0,"225":0,"227":0,"230":0,"235":0,"238":0,"239":0,"240":0,"241":0,"242":0,"245":0,"246":0,"247":0,"248":0,"249":0,"253":0,"254":0,"259":0,"261":0,"262":0,"264":0,"265":0,"266":0,"268":0,"269":0,"272":0,"275":0,"277":0,"278":0,"279":0,"280":0,"281":0,"286":0,"288":0,"291":0,"293":0,"296":0,"297":0,"302":0,"304":0,"307":0,"311":0,"316":0,"319":0,"321":0,"322":0,"323":0,"325":0,"327":0,"335":0,"336":0,"337":0,"338":0,"340":0,"341":0,"350":0,"351":0,"352":0,"353":0,"355":0,"356":0,"364":0,"365":0,"366":0,"367":0,"368":0,"380":0,"381":0,"382":0,"384":0,"386":0,"402":0,"403":0,"404":0,"412":0,"413":0,"422":0,"423":0,"433":0,"435":0,"440":0,"442":0,"443":0,"444":0,"445":0,"446":0,"448":0,"449":0,"452":0,"453":0,"457":0,"458":0,"459":0,"463":0,"467":0,"468":0,"469":0,"470":0,"471":0,"475":0,"477":0,"479":0,"480":0,"481":0,"484":0,"485":0,"489":0,"494":0,"497":0,"498":0,"501":0,"502":0};
_yuitest_coverage["/build/event-custom-complex/event-custom-complex.js"].functions = {"mixFacadeProps:18":0,"EventFacade:36":0,"stopPropagation:95":0,"stopImmediatePropagation:106":0,"preventDefault:115":0,"halt:127":0,"(anonymous 2):248":0,"(anonymous 3):253":0,"fireComplex:135":0,"_getFacade:291":0,"stopPropagation:335":0,"stopImmediatePropagation:350":0,"preventDefault:364":0,"halt:380":0,"addTarget:402":0,"getTargets:412":0,"removeTarget:422":0,"bubble:433":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/event-custom-complex/event-custom-complex.js"].coveredLines = 174;
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
    key,
    EMPTY = {},
    CEProto = Y.CustomEvent.prototype,
    ETProto = Y.EventTarget.prototype, 

    mixFacadeProps = function(facade, payload) {
        _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "mixFacadeProps", 18);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 19);
var p;

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 21);
for (p in payload) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 22);
if (!(FACADE_KEYS.hasOwnProperty(p))) {
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 23);
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

_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 36);
Y.EventFacade = function(e, currentTarget) {

    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "EventFacade", 36);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 38);
e = e || EMPTY;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 40);
this._event = e;

    /**
     * The arguments passed to fire
     * @property details
     * @type Array
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 47);
this.details = e.details;

    /**
     * The event type, this can be overridden by the fire() payload
     * @property type
     * @type string
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 54);
this.type = e.type;

    /**
     * The real event type
     * @property _type
     * @type string
     * @private
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 62);
this._type = e.type;

    //////////////////////////////////////////////////////

    /**
     * Node reference for the targeted eventtarget
     * @property target
     * @type Node
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 71);
this.target = e.target;

    /**
     * Node reference for the element that the listener was attached to.
     * @property currentTarget
     * @type Node
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 78);
this.currentTarget = currentTarget;

    /**
     * Node reference to the relatedTarget
     * @property relatedTarget
     * @type Node
     */
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 85);
this.relatedTarget = e.relatedTarget;

};

_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 89);
Y.mix(Y.EventFacade.prototype, {

    /**
     * Stops the propagation to the next bubble target
     * @method stopPropagation
     */
    stopPropagation: function() {
        _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "stopPropagation", 95);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 96);
this._event.stopPropagation();
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 97);
this.stopped = 1;
    },

    /**
     * Stops the propagation to the next bubble target and
     * prevents any additional listeners from being exectued
     * on the current target.
     * @method stopImmediatePropagation
     */
    stopImmediatePropagation: function() {
        _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "stopImmediatePropagation", 106);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 107);
this._event.stopImmediatePropagation();
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 108);
this.stopped = 2;
    },

    /**
     * Prevents the event's default behavior
     * @method preventDefault
     */
    preventDefault: function() {
        _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "preventDefault", 115);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 116);
this._event.preventDefault();
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 117);
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
        _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "halt", 127);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 128);
this._event.halt(immediate);
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 129);
this.prevented = 1;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 130);
this.stopped = (immediate) ? 2 : 1;
    }

});

_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 135);
CEProto.fireComplex = function(args) {

    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "fireComplex", 135);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 137);
var es, ef, q, queue, ce, ret, events, subs, postponed,
        self = this, host = self.host || self, next, oldbubble;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 140);
if (self.stack) {
        // queue this event if the current item in the queue bubbles
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 142);
if (self.queuable && self.type != self.stack.next.type) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 143);
self.log('queue ' + self.type);
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 144);
self.stack.queue.push([self, args]);
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 145);
return true;
        }
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 149);
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

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 164);
subs = self.getSubs();

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 166);
self.stopped = (self.type !== es.type) ? 0 : es.stopped;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 167);
self.prevented = (self.type !== es.type) ? 0 : es.prevented;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 169);
self.target = self.target || host;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 171);
if (self.stoppedFn) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 172);
events = new Y.EventTarget({
            fireOnce: true,
            context: host
        });
        
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 177);
self.events = events;

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 179);
events.on('stopped', self.stoppedFn);
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 182);
self.currentTarget = host;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 184);
self.details = args.slice(); // original arguments in the details

    // self.log("Firing " + self  + ", " + "args: " + args);
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 187);
self.log("Firing " + self.type);

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 189);
self._facade = null; // kill facade to eliminate stale properties

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 191);
ef = self._getFacade(args);

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 193);
if (Y.Lang.isObject(args[0])) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 194);
args[0] = ef;
    } else {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 196);
args.unshift(ef);
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 199);
if (subs[0]) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 200);
self._procSubs(subs[0], args, ef);
    }

    // bubble if this is hosted in an event target and propagation has not been stopped
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 204);
if (self.bubbles && host.bubble && !self.stopped) {

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 206);
oldbubble = es.bubbling;

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 208);
es.bubbling = self.type;

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 210);
if (es.type != self.type) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 211);
es.stopped = 0;
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 212);
es.prevented = 0;
        }

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 215);
ret = host.bubble(self, args, null, es);

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 217);
self.stopped = Math.max(self.stopped, es.stopped);
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 218);
self.prevented = Math.max(self.prevented, es.prevented);

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 220);
es.bubbling = oldbubble;
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 223);
if (self.prevented) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 224);
if (self.preventedFn) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 225);
self.preventedFn.apply(host, args);
        }
    } else {_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 227);
if (self.defaultFn &&
              ((!self.defaultTargetOnly && !es.defaultTargetOnly) ||
                host === ef.target)) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 230);
self.defaultFn.apply(host, args);
    }}

    // broadcast listeners are fired as discreet events on the
    // YUI instance and potentially the YUI global.
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 235);
self._broadcast(args);

    // Queue the after
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 238);
if (subs[1] && !self.prevented && self.stopped < 2) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 239);
if (es.id === self.id || self.type != host._yuievt.bubbling) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 240);
self._procSubs(subs[1], args, ef);
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 241);
while ((next = es.afterQueue.last())) {
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 242);
next();
            }
        } else {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 245);
postponed = subs[1];
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 246);
if (es.execDefaultCnt) {
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 247);
postponed = Y.merge(postponed);
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 248);
Y.each(postponed, function(s) {
                    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "(anonymous 2)", 248);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 249);
s.postponed = true;
                });
            }

            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 253);
es.afterQueue.add(function() {
                _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "(anonymous 3)", 253);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 254);
self._procSubs(postponed, args, ef);
            });
        }
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 259);
self.target = null;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 261);
if (es.id === self.id) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 262);
queue = es.queue;

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 264);
while (queue.length) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 265);
q = queue.pop();
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 266);
ce = q[0];
            // set up stack to allow the next item to be processed
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 268);
es.next = ce;
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 269);
ce.fire.apply(ce, q[1]);
        }

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 272);
self.stack = null;
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 275);
ret = !(self.stopped);

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 277);
if (self.type != host._yuievt.bubbling) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 278);
es.stopped = 0;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 279);
es.prevented = 0;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 280);
self.stopped = 0;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 281);
self.prevented = 0;
    }

    // Kill the cached facade to free up memory.
    // Otherwise we have the facade from the last fire, sitting around forever.
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 286);
self._facade = null;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 288);
return ret;
};

_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 291);
CEProto._getFacade = function() {

    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "_getFacade", 291);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 293);
var ef = this._facade, o,
    args = this.details;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 296);
if (!ef) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 297);
ef = new Y.EventFacade(this, this.currentTarget);
    }

    // if the first argument is an object literal, apply the
    // properties to the event facade
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 302);
o = args && args[0];

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 304);
if (Y.Lang.isObject(o, true)) {

        // protect the event facade properties
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 307);
mixFacadeProps(ef, o);

        // Allow the event type to be faked
        // http://yuilibrary.com/projects/yui3/ticket/2528376
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 311);
ef.type = o.type || ef.type;
    }

    // update the details field with the arguments
    // ef.type = this.type;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 316);
ef.details = this.details;

    // use the original target when the event bubbled to this target
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 319);
ef.target = this.originalTarget || this.target;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 321);
ef.currentTarget = this.currentTarget;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 322);
ef.stopped = 0;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 323);
ef.prevented = 0;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 325);
this._facade = ef;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 327);
return this._facade;
};

/**
 * Stop propagation to bubble targets
 * @for CustomEvent
 * @method stopPropagation
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 335);
CEProto.stopPropagation = function() {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "stopPropagation", 335);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 336);
this.stopped = 1;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 337);
if (this.stack) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 338);
this.stack.stopped = 1;
    }
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 340);
if (this.events) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 341);
this.events.fire('stopped', this);
    }
};

/**
 * Stops propagation to bubble targets, and prevents any remaining
 * subscribers on the current target from executing.
 * @method stopImmediatePropagation
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 350);
CEProto.stopImmediatePropagation = function() {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "stopImmediatePropagation", 350);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 351);
this.stopped = 2;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 352);
if (this.stack) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 353);
this.stack.stopped = 2;
    }
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 355);
if (this.events) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 356);
this.events.fire('stopped', this);
    }
};

/**
 * Prevents the execution of this event's defaultFn
 * @method preventDefault
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 364);
CEProto.preventDefault = function() {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "preventDefault", 364);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 365);
if (this.preventable) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 366);
this.prevented = 1;
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 367);
if (this.stack) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 368);
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
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 380);
CEProto.halt = function(immediate) {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "halt", 380);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 381);
if (immediate) {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 382);
this.stopImmediatePropagation();
    } else {
        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 384);
this.stopPropagation();
    }
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 386);
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
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 402);
ETProto.addTarget = function(o) {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "addTarget", 402);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 403);
this._yuievt.targets[Y.stamp(o)] = o;
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 404);
this._yuievt.hasTargets = true;
};

/**
 * Returns an array of bubble targets for this object.
 * @method getTargets
 * @return EventTarget[]
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 412);
ETProto.getTargets = function() {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "getTargets", 412);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 413);
return Y.Object.values(this._yuievt.targets);
};

/**
 * Removes a bubble target
 * @method removeTarget
 * @param o {EventTarget} the target to remove
 * @for EventTarget
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 422);
ETProto.removeTarget = function(o) {
    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "removeTarget", 422);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 423);
delete this._yuievt.targets[Y.stamp(o)];
};

/**
 * Propagate an event.  Requires the event-custom-complex module.
 * @method bubble
 * @param evt {CustomEvent} the custom event to propagate
 * @return {boolean} the aggregated return value from Event.Custom.fire
 * @for EventTarget
 */
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 433);
ETProto.bubble = function(evt, args, target, es) {

    _yuitest_coverfunc("/build/event-custom-complex/event-custom-complex.js", "bubble", 433);
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 435);
var targs = this._yuievt.targets, ret = true,
        t, type = evt && evt.type, ce, i, bc, ce2,
        originalTarget = target || (evt && evt.target) || this,
        oldbubble;

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 440);
if (!evt || ((!evt.stopped) && targs)) {

        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 442);
for (i in targs) {
            _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 443);
if (targs.hasOwnProperty(i)) {
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 444);
t = targs[i];
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 445);
ce = t.getEvent(type, true);
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 446);
ce2 = t.getSibling(type, ce);

                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 448);
if (ce2 && !ce) {
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 449);
ce = t.publish(type);
                }

                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 452);
oldbubble = t._yuievt.bubbling;
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 453);
t._yuievt.bubbling = type;

                // if this event was not published on the bubble target,
                // continue propagating the event.
                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 457);
if (!ce) {
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 458);
if (t._yuievt.hasTargets) {
                        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 459);
t.bubble(evt, args, originalTarget, es);
                    }
                } else {

                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 463);
ce.sibling = ce2;

                    // set the original target to that the target payload on the
                    // facade is correct.
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 467);
ce.target = originalTarget;
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 468);
ce.originalTarget = originalTarget;
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 469);
ce.currentTarget = t;
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 470);
bc = ce.broadcast;
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 471);
ce.broadcast = false;

                    // default publish may not have emitFacade true -- that
                    // shouldn't be what the implementer meant to do
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 475);
ce.emitFacade = true;

                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 477);
ce.stack = es;

                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 479);
ret = ret && ce.fire.apply(ce, args || evt.details || []);
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 480);
ce.broadcast = bc;
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 481);
ce.originalTarget = null;

                    // stopPropagation() was called
                    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 484);
if (ce.stopped) {
                        _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 485);
break;
                    }
                }

                _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 489);
t._yuievt.bubbling = oldbubble;
            }
        }
    }

    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 494);
return ret;
};

_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 497);
FACADE = new Y.EventFacade();
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 498);
FACADE_KEYS = {};

// Flatten whitelist
_yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 501);
for (key in FACADE) {
    _yuitest_coverline("/build/event-custom-complex/event-custom-complex.js", 502);
FACADE_KEYS[key] = true;
}


}, '@VERSION@' ,{requires:['event-custom-base']});
