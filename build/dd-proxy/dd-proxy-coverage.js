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
_yuitest_coverage["dd-proxy"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "dd-proxy",
    code: []
};
_yuitest_coverage["dd-proxy"].code=["YUI.add('dd-proxy', function (Y, NAME) {","","","    /**","     * Plugin for dd-drag for creating a proxy drag node, instead of dragging the original node.","     * @module dd","     * @submodule dd-proxy","     */","    /**","     * Plugin for dd-drag for creating a proxy drag node, instead of dragging the original node.","     * @class DDProxy","     * @extends Base","     * @constructor","     * @namespace Plugin     ","     */","    var DDM = Y.DD.DDM,","        NODE = 'node',","        DRAG_NODE = 'dragNode',","        HOST = 'host',","        TRUE = true, proto,","        P = function(config) {","            P.superclass.constructor.apply(this, arguments);","        };","    ","    P.NAME = 'DDProxy';","    /**","    * @property NS","    * @default con","    * @readonly","    * @protected","    * @static","    * @description The Proxy instance will be placed on the Drag instance under the proxy namespace.","    * @type {String}","    */","    P.NS = 'proxy';","","    P.ATTRS = {","        host: {","        },","        /**","        * @attribute moveOnEnd","        * @description Move the original node at the end of the drag. Default: true","        * @type Boolean","        */","        moveOnEnd: {","            value: TRUE","        },","        /**","        * @attribute hideOnEnd","        * @description Hide the drag node at the end of the drag. Default: true","        * @type Boolean","        */","        hideOnEnd: {","            value: TRUE","        },","        /**","        * @attribute resizeFrame","        * @description Make the Proxy node assume the size of the original node. Default: true","        * @type Boolean","        */","        resizeFrame: {","            value: TRUE","        },","        /**","        * @attribute positionProxy","        * @description Make the Proxy node appear in the same place as the original node. Default: true","        * @type Boolean","        */","        positionProxy: {","            value: TRUE","        },","        /**","        * @attribute borderStyle","        * @description The default border style for the border of the proxy. Default: 1px solid #808080","        * @type Boolean","        */","        borderStyle: {","            value: '1px solid #808080'","        },","        /**","        * @attribute cloneNode","        * @description Should the node be cloned into the proxy for you. Default: false","        * @type Boolean","        */","        cloneNode: {","            value: false","        }","    };","","    proto = {","        /**","        * @private","        * @property _hands","        * @description Holds the event handles for setting the proxy","        */","        _hands: null,","        /**","        * @private","        * @method _init","        * @description Handler for the proxy config attribute","        */","        _init: function() {","            if (!DDM._proxy) {","                DDM._createFrame();","                Y.on('domready', Y.bind(this._init, this));","                return;","            }","            if (!this._hands) {","                this._hands = [];","            }","            var h, h1, host = this.get(HOST), dnode = host.get(DRAG_NODE);","            if (dnode.compareTo(host.get(NODE))) {","                if (DDM._proxy) {","                    host.set(DRAG_NODE, DDM._proxy);","                }","            }","            Y.each(this._hands, function(v) {","                v.detach();","            });","            h = DDM.on('ddm:start', Y.bind(function() {","                if (DDM.activeDrag === host) {","                    DDM._setFrame(host);","                }","            }, this));","            h1 = DDM.on('ddm:end', Y.bind(function() {","                if (host.get('dragging')) {","                    if (this.get('moveOnEnd')) {","                        host.get(NODE).setXY(host.lastXY);","                    }","                    if (this.get('hideOnEnd')) {","                        host.get(DRAG_NODE).setStyle('display', 'none');","                    }","                    if (this.get('cloneNode')) {","                        host.get(DRAG_NODE).remove();","                        host.set(DRAG_NODE, DDM._proxy);","                    }","                }","            }, this));","            this._hands = [h, h1];","        },","        initializer: function() {","            this._init();","        },","        destructor: function() {","            var host = this.get(HOST);","            Y.each(this._hands, function(v) {","                v.detach();","            });","            host.set(DRAG_NODE, host.get(NODE));","        },","        clone: function() {","            var host = this.get(HOST),","                n = host.get(NODE),","                c = n.cloneNode(true);","","            delete c._yuid;","            c.setAttribute('id', Y.guid());","            c.setStyle('position', 'absolute');","            n.get('parentNode').appendChild(c);","            host.set(DRAG_NODE, c);","            return c;","        }","    };","    ","    Y.namespace('Plugin');","    Y.extend(P, Y.Base, proto);","    Y.Plugin.DDProxy = P;","","    //Add a couple of methods to the DDM","    Y.mix(DDM, {","        /**","        * @private","        * @for DDM","        * @namespace DD","        * @method _createFrame","        * @description Create the proxy element if it doesn't already exist and set the DD.DDM._proxy value","        */","        _createFrame: function() {","            if (!DDM._proxy) {","                DDM._proxy = TRUE;","","                var p = Y.Node.create('<div></div>'),","                b = Y.one('body');","","                p.setStyles({","                    position: 'absolute',","                    display: 'none',","                    zIndex: '999',","                    top: '-999px',","                    left: '-999px'","                });","","                b.prepend(p);","                p.set('id', Y.guid());","                p.addClass(DDM.CSS_PREFIX + '-proxy');","                DDM._proxy = p;","            }","        },","        /**","        * @private","        * @for DDM","        * @namespace DD","        * @method _setFrame","        * @description If resizeProxy is set to true (default) it will resize the proxy element to match the size of the Drag Element.","        * If positionProxy is set to true (default) it will position the proxy element in the same location as the Drag Element.","        */","        _setFrame: function(drag) {","            var n = drag.get(NODE), d = drag.get(DRAG_NODE), ah, cur = 'auto';","            ","            ah = DDM.activeDrag.get('activeHandle');","            if (ah) {","                cur = ah.getStyle('cursor');","            }","            if (cur == 'auto') {","                cur = DDM.get('dragCursor');","            }","","            d.setStyles({","                visibility: 'hidden',","                display: 'block',","                cursor: cur,","                border: drag.proxy.get('borderStyle')","            });","","            if (drag.proxy.get('cloneNode')) {","                d = drag.proxy.clone();","            }","","            if (drag.proxy.get('resizeFrame')) {","                d.setStyles({","                    height: n.get('offsetHeight') + 'px',","                    width: n.get('offsetWidth') + 'px'","                });","            }","","            if (drag.proxy.get('positionProxy')) {","                d.setXY(drag.nodeXY);","            }","            d.setStyle('visibility', 'visible');","        }","    });","","    //Create the frame when DOM is ready","    //Y.on('domready', Y.bind(DDM._createFrame, DDM));","","","","","}, '@VERSION@', {\"requires\": [\"dd-drag\"]});"];
_yuitest_coverage["dd-proxy"].lines = {"1":0,"16":0,"22":0,"25":0,"35":0,"37":0,"90":0,"103":0,"104":0,"105":0,"106":0,"108":0,"109":0,"111":0,"112":0,"113":0,"114":0,"117":0,"118":0,"120":0,"121":0,"122":0,"125":0,"126":0,"127":0,"128":0,"130":0,"131":0,"133":0,"134":0,"135":0,"139":0,"142":0,"145":0,"146":0,"147":0,"149":0,"152":0,"156":0,"157":0,"158":0,"159":0,"160":0,"161":0,"165":0,"166":0,"167":0,"170":0,"179":0,"180":0,"182":0,"185":0,"193":0,"194":0,"195":0,"196":0,"208":0,"210":0,"211":0,"212":0,"214":0,"215":0,"218":0,"225":0,"226":0,"229":0,"230":0,"236":0,"237":0,"239":0};
_yuitest_coverage["dd-proxy"].functions = {"P:21":0,"(anonymous 2):117":0,"(anonymous 3):120":0,"(anonymous 4):125":0,"_init:102":0,"initializer:141":0,"(anonymous 5):146":0,"destructor:144":0,"clone:151":0,"_createFrame:178":0,"_setFrame:207":0,"(anonymous 1):1":0};
_yuitest_coverage["dd-proxy"].coveredLines = 70;
_yuitest_coverage["dd-proxy"].coveredFunctions = 12;
_yuitest_coverline("dd-proxy", 1);
YUI.add('dd-proxy', function (Y, NAME) {


    /**
     * Plugin for dd-drag for creating a proxy drag node, instead of dragging the original node.
     * @module dd
     * @submodule dd-proxy
     */
    /**
     * Plugin for dd-drag for creating a proxy drag node, instead of dragging the original node.
     * @class DDProxy
     * @extends Base
     * @constructor
     * @namespace Plugin     
     */
    _yuitest_coverfunc("dd-proxy", "(anonymous 1)", 1);
_yuitest_coverline("dd-proxy", 16);
var DDM = Y.DD.DDM,
        NODE = 'node',
        DRAG_NODE = 'dragNode',
        HOST = 'host',
        TRUE = true, proto,
        P = function(config) {
            _yuitest_coverfunc("dd-proxy", "P", 21);
_yuitest_coverline("dd-proxy", 22);
P.superclass.constructor.apply(this, arguments);
        };
    
    _yuitest_coverline("dd-proxy", 25);
P.NAME = 'DDProxy';
    /**
    * @property NS
    * @default con
    * @readonly
    * @protected
    * @static
    * @description The Proxy instance will be placed on the Drag instance under the proxy namespace.
    * @type {String}
    */
    _yuitest_coverline("dd-proxy", 35);
P.NS = 'proxy';

    _yuitest_coverline("dd-proxy", 37);
P.ATTRS = {
        host: {
        },
        /**
        * @attribute moveOnEnd
        * @description Move the original node at the end of the drag. Default: true
        * @type Boolean
        */
        moveOnEnd: {
            value: TRUE
        },
        /**
        * @attribute hideOnEnd
        * @description Hide the drag node at the end of the drag. Default: true
        * @type Boolean
        */
        hideOnEnd: {
            value: TRUE
        },
        /**
        * @attribute resizeFrame
        * @description Make the Proxy node assume the size of the original node. Default: true
        * @type Boolean
        */
        resizeFrame: {
            value: TRUE
        },
        /**
        * @attribute positionProxy
        * @description Make the Proxy node appear in the same place as the original node. Default: true
        * @type Boolean
        */
        positionProxy: {
            value: TRUE
        },
        /**
        * @attribute borderStyle
        * @description The default border style for the border of the proxy. Default: 1px solid #808080
        * @type Boolean
        */
        borderStyle: {
            value: '1px solid #808080'
        },
        /**
        * @attribute cloneNode
        * @description Should the node be cloned into the proxy for you. Default: false
        * @type Boolean
        */
        cloneNode: {
            value: false
        }
    };

    _yuitest_coverline("dd-proxy", 90);
proto = {
        /**
        * @private
        * @property _hands
        * @description Holds the event handles for setting the proxy
        */
        _hands: null,
        /**
        * @private
        * @method _init
        * @description Handler for the proxy config attribute
        */
        _init: function() {
            _yuitest_coverfunc("dd-proxy", "_init", 102);
_yuitest_coverline("dd-proxy", 103);
if (!DDM._proxy) {
                _yuitest_coverline("dd-proxy", 104);
DDM._createFrame();
                _yuitest_coverline("dd-proxy", 105);
Y.on('domready', Y.bind(this._init, this));
                _yuitest_coverline("dd-proxy", 106);
return;
            }
            _yuitest_coverline("dd-proxy", 108);
if (!this._hands) {
                _yuitest_coverline("dd-proxy", 109);
this._hands = [];
            }
            _yuitest_coverline("dd-proxy", 111);
var h, h1, host = this.get(HOST), dnode = host.get(DRAG_NODE);
            _yuitest_coverline("dd-proxy", 112);
if (dnode.compareTo(host.get(NODE))) {
                _yuitest_coverline("dd-proxy", 113);
if (DDM._proxy) {
                    _yuitest_coverline("dd-proxy", 114);
host.set(DRAG_NODE, DDM._proxy);
                }
            }
            _yuitest_coverline("dd-proxy", 117);
Y.each(this._hands, function(v) {
                _yuitest_coverfunc("dd-proxy", "(anonymous 2)", 117);
_yuitest_coverline("dd-proxy", 118);
v.detach();
            });
            _yuitest_coverline("dd-proxy", 120);
h = DDM.on('ddm:start', Y.bind(function() {
                _yuitest_coverfunc("dd-proxy", "(anonymous 3)", 120);
_yuitest_coverline("dd-proxy", 121);
if (DDM.activeDrag === host) {
                    _yuitest_coverline("dd-proxy", 122);
DDM._setFrame(host);
                }
            }, this));
            _yuitest_coverline("dd-proxy", 125);
h1 = DDM.on('ddm:end', Y.bind(function() {
                _yuitest_coverfunc("dd-proxy", "(anonymous 4)", 125);
_yuitest_coverline("dd-proxy", 126);
if (host.get('dragging')) {
                    _yuitest_coverline("dd-proxy", 127);
if (this.get('moveOnEnd')) {
                        _yuitest_coverline("dd-proxy", 128);
host.get(NODE).setXY(host.lastXY);
                    }
                    _yuitest_coverline("dd-proxy", 130);
if (this.get('hideOnEnd')) {
                        _yuitest_coverline("dd-proxy", 131);
host.get(DRAG_NODE).setStyle('display', 'none');
                    }
                    _yuitest_coverline("dd-proxy", 133);
if (this.get('cloneNode')) {
                        _yuitest_coverline("dd-proxy", 134);
host.get(DRAG_NODE).remove();
                        _yuitest_coverline("dd-proxy", 135);
host.set(DRAG_NODE, DDM._proxy);
                    }
                }
            }, this));
            _yuitest_coverline("dd-proxy", 139);
this._hands = [h, h1];
        },
        initializer: function() {
            _yuitest_coverfunc("dd-proxy", "initializer", 141);
_yuitest_coverline("dd-proxy", 142);
this._init();
        },
        destructor: function() {
            _yuitest_coverfunc("dd-proxy", "destructor", 144);
_yuitest_coverline("dd-proxy", 145);
var host = this.get(HOST);
            _yuitest_coverline("dd-proxy", 146);
Y.each(this._hands, function(v) {
                _yuitest_coverfunc("dd-proxy", "(anonymous 5)", 146);
_yuitest_coverline("dd-proxy", 147);
v.detach();
            });
            _yuitest_coverline("dd-proxy", 149);
host.set(DRAG_NODE, host.get(NODE));
        },
        clone: function() {
            _yuitest_coverfunc("dd-proxy", "clone", 151);
_yuitest_coverline("dd-proxy", 152);
var host = this.get(HOST),
                n = host.get(NODE),
                c = n.cloneNode(true);

            _yuitest_coverline("dd-proxy", 156);
delete c._yuid;
            _yuitest_coverline("dd-proxy", 157);
c.setAttribute('id', Y.guid());
            _yuitest_coverline("dd-proxy", 158);
c.setStyle('position', 'absolute');
            _yuitest_coverline("dd-proxy", 159);
n.get('parentNode').appendChild(c);
            _yuitest_coverline("dd-proxy", 160);
host.set(DRAG_NODE, c);
            _yuitest_coverline("dd-proxy", 161);
return c;
        }
    };
    
    _yuitest_coverline("dd-proxy", 165);
Y.namespace('Plugin');
    _yuitest_coverline("dd-proxy", 166);
Y.extend(P, Y.Base, proto);
    _yuitest_coverline("dd-proxy", 167);
Y.Plugin.DDProxy = P;

    //Add a couple of methods to the DDM
    _yuitest_coverline("dd-proxy", 170);
Y.mix(DDM, {
        /**
        * @private
        * @for DDM
        * @namespace DD
        * @method _createFrame
        * @description Create the proxy element if it doesn't already exist and set the DD.DDM._proxy value
        */
        _createFrame: function() {
            _yuitest_coverfunc("dd-proxy", "_createFrame", 178);
_yuitest_coverline("dd-proxy", 179);
if (!DDM._proxy) {
                _yuitest_coverline("dd-proxy", 180);
DDM._proxy = TRUE;

                _yuitest_coverline("dd-proxy", 182);
var p = Y.Node.create('<div></div>'),
                b = Y.one('body');

                _yuitest_coverline("dd-proxy", 185);
p.setStyles({
                    position: 'absolute',
                    display: 'none',
                    zIndex: '999',
                    top: '-999px',
                    left: '-999px'
                });

                _yuitest_coverline("dd-proxy", 193);
b.prepend(p);
                _yuitest_coverline("dd-proxy", 194);
p.set('id', Y.guid());
                _yuitest_coverline("dd-proxy", 195);
p.addClass(DDM.CSS_PREFIX + '-proxy');
                _yuitest_coverline("dd-proxy", 196);
DDM._proxy = p;
            }
        },
        /**
        * @private
        * @for DDM
        * @namespace DD
        * @method _setFrame
        * @description If resizeProxy is set to true (default) it will resize the proxy element to match the size of the Drag Element.
        * If positionProxy is set to true (default) it will position the proxy element in the same location as the Drag Element.
        */
        _setFrame: function(drag) {
            _yuitest_coverfunc("dd-proxy", "_setFrame", 207);
_yuitest_coverline("dd-proxy", 208);
var n = drag.get(NODE), d = drag.get(DRAG_NODE), ah, cur = 'auto';
            
            _yuitest_coverline("dd-proxy", 210);
ah = DDM.activeDrag.get('activeHandle');
            _yuitest_coverline("dd-proxy", 211);
if (ah) {
                _yuitest_coverline("dd-proxy", 212);
cur = ah.getStyle('cursor');
            }
            _yuitest_coverline("dd-proxy", 214);
if (cur == 'auto') {
                _yuitest_coverline("dd-proxy", 215);
cur = DDM.get('dragCursor');
            }

            _yuitest_coverline("dd-proxy", 218);
d.setStyles({
                visibility: 'hidden',
                display: 'block',
                cursor: cur,
                border: drag.proxy.get('borderStyle')
            });

            _yuitest_coverline("dd-proxy", 225);
if (drag.proxy.get('cloneNode')) {
                _yuitest_coverline("dd-proxy", 226);
d = drag.proxy.clone();
            }

            _yuitest_coverline("dd-proxy", 229);
if (drag.proxy.get('resizeFrame')) {
                _yuitest_coverline("dd-proxy", 230);
d.setStyles({
                    height: n.get('offsetHeight') + 'px',
                    width: n.get('offsetWidth') + 'px'
                });
            }

            _yuitest_coverline("dd-proxy", 236);
if (drag.proxy.get('positionProxy')) {
                _yuitest_coverline("dd-proxy", 237);
d.setXY(drag.nodeXY);
            }
            _yuitest_coverline("dd-proxy", 239);
d.setStyle('visibility', 'visible');
        }
    });

    //Create the frame when DOM is ready
    //Y.on('domready', Y.bind(DDM._createFrame, DDM));




}, '@VERSION@', {"requires": ["dd-drag"]});
