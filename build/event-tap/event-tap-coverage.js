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
_yuitest_coverage["build/event-tap/event-tap.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-tap/event-tap.js",
    code: []
};
_yuitest_coverage["build/event-tap/event-tap.js"].code=["YUI.add('event-tap', function (Y, NAME) {","","/*","   Copyright (c) 2012, Yahoo! Inc. All rights reserved.","","   Redistribution and use of this software in source and binary forms, ","   with or without modification, are permitted provided that the following ","   conditions are met:","","   Redistributions of source code must retain the above","   copyright notice, this list of conditions and the","   following disclaimer.","","   Redistributions in binary form must reproduce the above","   copyright notice, this list of conditions and the","   following disclaimer in the documentation and/or other","   materials provided with the distribution.","","   Neither the name of Yahoo! Inc. nor the names of its","   contributors may be used to endorse or promote products","   derived from this software without specific prior","   written permission of Yahoo! Inc.","","   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS ","   IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED ","   TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A ","   PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT ","   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, ","   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT ","   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, ","   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY ","   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT ","   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE ","   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.","*/","","/**"," * Provides 'tap' functionality for touchscreen devices.  'tap' is like a touchscreen 'click', "," * only it requires much less finger-down time."," * 'tap' enables high-usability mobile applications, and more.  Code by Yahoo Engineering."," * @module event"," * @submodule event-tap"," */","","/**","    * The tap module provides a gesture events, \"tap\", which normalizes user interactions","    * across touch and mouse or pointer based input devices.  This can be used by application developers","    * to build input device agnostic components which behave the same in response to either touch or mouse based","    * interaction.","    *","    */","var SUPPORTS_TOUCHES = (\"createTouch\" in document),","    EVENTS = {","        START: SUPPORTS_TOUCHES ? 'touchstart' : 'mousedown',","        MOVE: SUPPORTS_TOUCHES ? 'touchmove' : 'mousemove',","        END: SUPPORTS_TOUCHES ? 'touchend' : 'mouseup',","        CANCEL: SUPPORTS_TOUCHES ? 'touchcancel' : 'mousecancel',","        TAP: 'tap'","    },","    HANDLES = {","        ON: {","            START: 'Y_TAP_ON_START_HANDLE',","            MOVE: 'Y_TAP_ON_MOVE_HANDLE',","            END: 'Y_TAP_ON_END_HANDLE',","            CANCEL: 'Y_TAP_ON_CANCEL_HANDLE'","        },","        DELEGATE: {","            START: 'Y_TAP_DELEGATE_START_HANDLE',","            MOVE: 'Y_TAP_DELEGATE_MOVE_HANDLE',","            END: 'Y_TAP_DELEGATE_END_HANDLE',","            CANCEL: 'Y_TAP_DELEGATE_CANCEL_HANDLE'","        }","    };","","function detachHelper(subscription, handles, subset, context) {","","    handles = subset ? handles : [ handles.START, handles.MOVE, handles.END, handles.CANCEL ];","","    Y.each(handles, function (name) {","        var handle = subscription[name];","        if (handle) {","            handle.detach();","            subscription[name] = null;","        }","    });","","}","","","/**","    * Sets up a \"tap\" event, that is fired on touch devices in response to a tap event (finger down, finder up).","    * This event can be used instead of listening for click events which have a 500ms delay on most touch devices.","    * This event can also be listened for using node.delegate().","    *","    * @event tap","    * @param type {string} \"tap\"","    * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event.","    *","    * @return {EventHandle} the detach handle","    */","Y.Event.define(EVENTS.TAP, {","","    on: function (node, subscription, notifier) {","        subscription[HANDLES.ON.START] = node.on(EVENTS.START, this.touchStart, this, node, subscription, notifier);","    },","","    detach: function (node, subscription, notifier) {","        detachHelper(subscription, HANDLES.ON);","    },","","    delegate: function (node, subscription, notifier, filter) {","        subscription[HANDLES.DELEGATE.START] = node.delegate(EVENTS.START, function (e) {","            this.touchStart(e, node, subscription, notifier, true);","        }, filter, this);","    },","","    detachDelegate: function (node, subscription, notifier) {","        detachHelper(subscription, HANDLES.DELEGATE);","    },","","    touchStart: function (event, node, subscription, notifier, delegate) {","        var curr_handles = delegate ? HANDLES.DELEGATE : HANDLES.ON,","            context = {","                cancelled: false","            };","","        // no right clicks","        if (event.button && event.button === 3) {","            return;","        }","        context.node = delegate ? event.currentTarget : node;","","        //There is a double check in here to support event simulation tests","        if (SUPPORTS_TOUCHES && event.touches) {","          context.startXY = [ event.touches[0].pageX, event.touches[0].pageY ];","        }","        else {","          context.startXY = [ event.pageX, event.pageY ];","        }","        // for now just support a 1 finger count (later enhance via config)","        if (event.touches && event.touches.length !== 1) {","            return;","        }","","","","        // something is off with the move that it attaches it but never triggers the handler","        subscription[curr_handles.MOVE] = node.once(EVENTS.MOVE, this.touchMove, this, node, subscription, notifier, delegate, context);","        subscription[curr_handles.END] = node.once(EVENTS.END, this.touchEnd, this, node, subscription, notifier, delegate, context);","        subscription[curr_handles.CANCEL] = node.once(EVENTS.CANCEL, this.touchMove, this, node, subscription, notifier, delegate, context);","    },","","    touchMove: function (event, node, subscription, notifier, delegate, context) {","        var handles = delegate ? HANDLES.DELEGATE : HANDLES.ON;","","        detachHelper(subscription, [ handles.MOVE, handles.END, handles.CANCEL ], true, context);","        context.cancelled = true;","","    },","","    touchEnd: function (event, node, subscription, notifier, delegate, context) {","        var startXY = context.startXY,","            endXY,","            clientXY,","            handles = delegate ? HANDLES.DELEGATE : HANDLES.ON;","","        //There is a double check in here to support event simulation tests","        if (SUPPORTS_TOUCHES && event.changedTouches) {","          endXY = [ event.changedTouches[0].pageX, event.changedTouches[0].pageY ];","          clientXY = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];","        }","        else {","          endXY = [ event.pageX, event.pageY ];","          clientXY = [event.clientX, event.clientY];","        }","","        detachHelper(subscription, [ handles.MOVE, handles.END, handles.CANCEL ], true, context);","","        // make sure mouse didn't move","        if (Math.abs(endXY[0] - startXY[0]) === 0 && Math.abs(endXY[1] - startXY[1]) === 0) {","","            event.type = EVENTS.TAP;","            event.pageX = endXY[0];","            event.pageY = endXY[1];","            event.clientX = clientXY[0];","            event.clientY = clientXY[1];","            event.currentTarget = context.node;","","            notifier.fire(event);","        }","    }","});","","","}, '@VERSION@', {\"requires\": [\"node-base\", \"event-base\", \"event-touch\"]});"];
_yuitest_coverage["build/event-tap/event-tap.js"].lines = {"1":0,"52":0,"75":0,"77":0,"79":0,"80":0,"81":0,"82":0,"83":0,"101":0,"104":0,"108":0,"112":0,"113":0,"118":0,"122":0,"128":0,"129":0,"131":0,"134":0,"135":0,"138":0,"141":0,"142":0,"148":0,"149":0,"150":0,"154":0,"156":0,"157":0,"162":0,"168":0,"169":0,"170":0,"173":0,"174":0,"177":0,"180":0,"182":0,"183":0,"184":0,"185":0,"186":0,"187":0,"189":0};
_yuitest_coverage["build/event-tap/event-tap.js"].functions = {"(anonymous 2):79":0,"detachHelper:75":0,"on:103":0,"detach:107":0,"(anonymous 3):112":0,"delegate:111":0,"detachDelegate:117":0,"touchStart:121":0,"touchMove:153":0,"touchEnd:161":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-tap/event-tap.js"].coveredLines = 45;
_yuitest_coverage["build/event-tap/event-tap.js"].coveredFunctions = 11;
_yuitest_coverline("build/event-tap/event-tap.js", 1);
YUI.add('event-tap', function (Y, NAME) {

/*
   Copyright (c) 2012, Yahoo! Inc. All rights reserved.

   Redistribution and use of this software in source and binary forms, 
   with or without modification, are permitted provided that the following 
   conditions are met:

   Redistributions of source code must retain the above
   copyright notice, this list of conditions and the
   following disclaimer.

   Redistributions in binary form must reproduce the above
   copyright notice, this list of conditions and the
   following disclaimer in the documentation and/or other
   materials provided with the distribution.

   Neither the name of Yahoo! Inc. nor the names of its
   contributors may be used to endorse or promote products
   derived from this software without specific prior
   written permission of Yahoo! Inc.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS 
   IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED 
   TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A 
   PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT 
   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT 
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY 
   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * Provides 'tap' functionality for touchscreen devices.  'tap' is like a touchscreen 'click', 
 * only it requires much less finger-down time.
 * 'tap' enables high-usability mobile applications, and more.  Code by Yahoo Engineering.
 * @module event
 * @submodule event-tap
 */

/**
    * The tap module provides a gesture events, "tap", which normalizes user interactions
    * across touch and mouse or pointer based input devices.  This can be used by application developers
    * to build input device agnostic components which behave the same in response to either touch or mouse based
    * interaction.
    *
    */
_yuitest_coverfunc("build/event-tap/event-tap.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-tap/event-tap.js", 52);
var SUPPORTS_TOUCHES = ("createTouch" in document),
    EVENTS = {
        START: SUPPORTS_TOUCHES ? 'touchstart' : 'mousedown',
        MOVE: SUPPORTS_TOUCHES ? 'touchmove' : 'mousemove',
        END: SUPPORTS_TOUCHES ? 'touchend' : 'mouseup',
        CANCEL: SUPPORTS_TOUCHES ? 'touchcancel' : 'mousecancel',
        TAP: 'tap'
    },
    HANDLES = {
        ON: {
            START: 'Y_TAP_ON_START_HANDLE',
            MOVE: 'Y_TAP_ON_MOVE_HANDLE',
            END: 'Y_TAP_ON_END_HANDLE',
            CANCEL: 'Y_TAP_ON_CANCEL_HANDLE'
        },
        DELEGATE: {
            START: 'Y_TAP_DELEGATE_START_HANDLE',
            MOVE: 'Y_TAP_DELEGATE_MOVE_HANDLE',
            END: 'Y_TAP_DELEGATE_END_HANDLE',
            CANCEL: 'Y_TAP_DELEGATE_CANCEL_HANDLE'
        }
    };

_yuitest_coverline("build/event-tap/event-tap.js", 75);
function detachHelper(subscription, handles, subset, context) {

    _yuitest_coverfunc("build/event-tap/event-tap.js", "detachHelper", 75);
_yuitest_coverline("build/event-tap/event-tap.js", 77);
handles = subset ? handles : [ handles.START, handles.MOVE, handles.END, handles.CANCEL ];

    _yuitest_coverline("build/event-tap/event-tap.js", 79);
Y.each(handles, function (name) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "(anonymous 2)", 79);
_yuitest_coverline("build/event-tap/event-tap.js", 80);
var handle = subscription[name];
        _yuitest_coverline("build/event-tap/event-tap.js", 81);
if (handle) {
            _yuitest_coverline("build/event-tap/event-tap.js", 82);
handle.detach();
            _yuitest_coverline("build/event-tap/event-tap.js", 83);
subscription[name] = null;
        }
    });

}


/**
    * Sets up a "tap" event, that is fired on touch devices in response to a tap event (finger down, finder up).
    * This event can be used instead of listening for click events which have a 500ms delay on most touch devices.
    * This event can also be listened for using node.delegate().
    *
    * @event tap
    * @param type {string} "tap"
    * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event.
    *
    * @return {EventHandle} the detach handle
    */
_yuitest_coverline("build/event-tap/event-tap.js", 101);
Y.Event.define(EVENTS.TAP, {

    on: function (node, subscription, notifier) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "on", 103);
_yuitest_coverline("build/event-tap/event-tap.js", 104);
subscription[HANDLES.ON.START] = node.on(EVENTS.START, this.touchStart, this, node, subscription, notifier);
    },

    detach: function (node, subscription, notifier) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "detach", 107);
_yuitest_coverline("build/event-tap/event-tap.js", 108);
detachHelper(subscription, HANDLES.ON);
    },

    delegate: function (node, subscription, notifier, filter) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "delegate", 111);
_yuitest_coverline("build/event-tap/event-tap.js", 112);
subscription[HANDLES.DELEGATE.START] = node.delegate(EVENTS.START, function (e) {
            _yuitest_coverfunc("build/event-tap/event-tap.js", "(anonymous 3)", 112);
_yuitest_coverline("build/event-tap/event-tap.js", 113);
this.touchStart(e, node, subscription, notifier, true);
        }, filter, this);
    },

    detachDelegate: function (node, subscription, notifier) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "detachDelegate", 117);
_yuitest_coverline("build/event-tap/event-tap.js", 118);
detachHelper(subscription, HANDLES.DELEGATE);
    },

    touchStart: function (event, node, subscription, notifier, delegate) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "touchStart", 121);
_yuitest_coverline("build/event-tap/event-tap.js", 122);
var curr_handles = delegate ? HANDLES.DELEGATE : HANDLES.ON,
            context = {
                cancelled: false
            };

        // no right clicks
        _yuitest_coverline("build/event-tap/event-tap.js", 128);
if (event.button && event.button === 3) {
            _yuitest_coverline("build/event-tap/event-tap.js", 129);
return;
        }
        _yuitest_coverline("build/event-tap/event-tap.js", 131);
context.node = delegate ? event.currentTarget : node;

        //There is a double check in here to support event simulation tests
        _yuitest_coverline("build/event-tap/event-tap.js", 134);
if (SUPPORTS_TOUCHES && event.touches) {
          _yuitest_coverline("build/event-tap/event-tap.js", 135);
context.startXY = [ event.touches[0].pageX, event.touches[0].pageY ];
        }
        else {
          _yuitest_coverline("build/event-tap/event-tap.js", 138);
context.startXY = [ event.pageX, event.pageY ];
        }
        // for now just support a 1 finger count (later enhance via config)
        _yuitest_coverline("build/event-tap/event-tap.js", 141);
if (event.touches && event.touches.length !== 1) {
            _yuitest_coverline("build/event-tap/event-tap.js", 142);
return;
        }



        // something is off with the move that it attaches it but never triggers the handler
        _yuitest_coverline("build/event-tap/event-tap.js", 148);
subscription[curr_handles.MOVE] = node.once(EVENTS.MOVE, this.touchMove, this, node, subscription, notifier, delegate, context);
        _yuitest_coverline("build/event-tap/event-tap.js", 149);
subscription[curr_handles.END] = node.once(EVENTS.END, this.touchEnd, this, node, subscription, notifier, delegate, context);
        _yuitest_coverline("build/event-tap/event-tap.js", 150);
subscription[curr_handles.CANCEL] = node.once(EVENTS.CANCEL, this.touchMove, this, node, subscription, notifier, delegate, context);
    },

    touchMove: function (event, node, subscription, notifier, delegate, context) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "touchMove", 153);
_yuitest_coverline("build/event-tap/event-tap.js", 154);
var handles = delegate ? HANDLES.DELEGATE : HANDLES.ON;

        _yuitest_coverline("build/event-tap/event-tap.js", 156);
detachHelper(subscription, [ handles.MOVE, handles.END, handles.CANCEL ], true, context);
        _yuitest_coverline("build/event-tap/event-tap.js", 157);
context.cancelled = true;

    },

    touchEnd: function (event, node, subscription, notifier, delegate, context) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "touchEnd", 161);
_yuitest_coverline("build/event-tap/event-tap.js", 162);
var startXY = context.startXY,
            endXY,
            clientXY,
            handles = delegate ? HANDLES.DELEGATE : HANDLES.ON;

        //There is a double check in here to support event simulation tests
        _yuitest_coverline("build/event-tap/event-tap.js", 168);
if (SUPPORTS_TOUCHES && event.changedTouches) {
          _yuitest_coverline("build/event-tap/event-tap.js", 169);
endXY = [ event.changedTouches[0].pageX, event.changedTouches[0].pageY ];
          _yuitest_coverline("build/event-tap/event-tap.js", 170);
clientXY = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
        }
        else {
          _yuitest_coverline("build/event-tap/event-tap.js", 173);
endXY = [ event.pageX, event.pageY ];
          _yuitest_coverline("build/event-tap/event-tap.js", 174);
clientXY = [event.clientX, event.clientY];
        }

        _yuitest_coverline("build/event-tap/event-tap.js", 177);
detachHelper(subscription, [ handles.MOVE, handles.END, handles.CANCEL ], true, context);

        // make sure mouse didn't move
        _yuitest_coverline("build/event-tap/event-tap.js", 180);
if (Math.abs(endXY[0] - startXY[0]) === 0 && Math.abs(endXY[1] - startXY[1]) === 0) {

            _yuitest_coverline("build/event-tap/event-tap.js", 182);
event.type = EVENTS.TAP;
            _yuitest_coverline("build/event-tap/event-tap.js", 183);
event.pageX = endXY[0];
            _yuitest_coverline("build/event-tap/event-tap.js", 184);
event.pageY = endXY[1];
            _yuitest_coverline("build/event-tap/event-tap.js", 185);
event.clientX = clientXY[0];
            _yuitest_coverline("build/event-tap/event-tap.js", 186);
event.clientY = clientXY[1];
            _yuitest_coverline("build/event-tap/event-tap.js", 187);
event.currentTarget = context.node;

            _yuitest_coverline("build/event-tap/event-tap.js", 189);
notifier.fire(event);
        }
    }
});


}, '@VERSION@', {"requires": ["node-base", "event-base", "event-touch"]});
