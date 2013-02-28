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
_yuitest_coverage["build/tabview/tabview.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/tabview/tabview.js",
    code: []
};
_yuitest_coverage["build/tabview/tabview.js"].code=["YUI.add('tabview', function (Y, NAME) {","","/**"," * The TabView module"," *"," * @module tabview"," */","","var DOT = '.',","","    /**","     * Provides a tabbed widget interface","     * @param config {Object} Object literal specifying tabview configuration properties.","     *","     * @class TabView","     * @constructor","     * @extends Widget","     * @uses WidgetParent","     */","    TabView = Y.Base.create('tabView', Y.Widget, [Y.WidgetParent], {","    LIST_TEMPLATE: '<ul></ul>',","    PANEL_TEMPLATE: '<div></div>',","","    _afterChildAdded: function() {","        this.get('contentBox').focusManager.refresh();","    },","","    _defListNodeValueFn: function() {","        var node = Y.Node.create(this.LIST_TEMPLATE);","","        node.addClass(Y.TabviewBase._classNames.tabviewList);","","        return node;","    },","","    _defPanelNodeValueFn: function() {","        var node = Y.Node.create(this.PANEL_TEMPLATE);","","        node.addClass(Y.TabviewBase._classNames.tabviewPanel);","","        return node;","    },","","    _afterChildRemoved: function(e) { // update the selected tab when removed","        var i = e.index,","            selection = this.get('selection');","","        if (!selection) { // select previous item if selection removed","            selection = this.item(i - 1) || this.item(0);","            if (selection) {","                selection.set('selected', 1);","            }","        }","","        this.get('contentBox').focusManager.refresh();","    },","","    _initAria: function() {","        var contentBox = this.get('contentBox'),","            tablist = contentBox.one(Y.TabviewBase._queries.tabviewList);","","        if (tablist) {","            tablist.setAttrs({","                //'aria-labelledby':","                role: 'tablist'","            });","        }","    },","","    bindUI: function() {","        //  Use the Node Focus Manager to add keyboard support:","        //  Pressing the left and right arrow keys will move focus","        //  among each of the tabs.","","        this.get('contentBox').plug(Y.Plugin.NodeFocusManager, {","                        descendants: DOT + Y.TabviewBase._classNames.tabLabel,","                        keys: { next: 'down:39', // Right arrow","                                previous: 'down:37' },  // Left arrow","                        circular: true","                    });","","        this.after('render', this._setDefSelection);","        this.after('addChild', this._afterChildAdded);","        this.after('removeChild', this._afterChildRemoved);","    },","","    renderUI: function() {","        var contentBox = this.get('contentBox');","        this._renderListBox(contentBox);","        this._renderPanelBox(contentBox);","        this._childrenContainer = this.get('listNode');","        this._renderTabs(contentBox);","    },","","    _setDefSelection: function() {","        //  If no tab is selected, select the first tab.","        var selection = this.get('selection') || this.item(0);","","        this.some(function(tab) {","            if (tab.get('selected')) {","                selection = tab;","                return true;","            }","        });","        if (selection) {","            // TODO: why both needed? (via widgetParent/Child)?","            this.set('selection', selection);","            selection.set('selected', 1);","        }","    },","","    _renderListBox: function(contentBox) {","        var node = this.get('listNode');","        if (!node.inDoc()) {","            contentBox.append(node);","        }","    },","","    _renderPanelBox: function(contentBox) {","        var node = this.get('panelNode');","        if (!node.inDoc()) {","            contentBox.append(node);","        }","    },","","    _renderTabs: function(contentBox) {","        var _classNames = Y.TabviewBase._classNames,","            _queries = Y.TabviewBase._queries,","            tabs = contentBox.all(_queries.tab),","            panelNode = this.get('panelNode'),","            panels = (panelNode) ? this.get('panelNode').get('children') : null,","            tabview = this;","","        if (tabs) { // add classNames and fill in Tab fields from markup when possible","            tabs.addClass(_classNames.tab);","            contentBox.all(_queries.tabLabel).addClass(_classNames.tabLabel);","            contentBox.all(_queries.tabPanel).addClass(_classNames.tabPanel);","","            tabs.each(function(node, i) {","                var panelNode = (panels) ? panels.item(i) : null;","                tabview.add({","                    boundingBox: node,","                    contentBox: node.one(DOT + _classNames.tabLabel),","                    panelNode: panelNode","                });","            });","        }","    }","}, {","    ATTRS: {","        defaultChildType: {","            value: 'Tab'","        },","","        listNode: {","            setter: function(node) {","                node = Y.one(node);","                if (node) {","                    node.addClass(Y.TabviewBase._classNames.tabviewList);","                }","                return node;","            },","","            valueFn: '_defListNodeValueFn'","        },","","        panelNode: {","            setter: function(node) {","                node = Y.one(node);","                if (node) {","                    node.addClass(Y.TabviewBase._classNames.tabviewPanel);","                }","                return node;","            },","","            valueFn: '_defPanelNodeValueFn'","        },","","        tabIndex: {","            value: null","            //validator: '_validTabIndex'","        }","    },","","    HTML_PARSER: {","        listNode: function(srcNode) {","            return srcNode.one(Y.TabviewBase._queries.tabviewList);","        },","        panelNode: function(srcNode) {","            return srcNode.one(Y.TabviewBase._queries.tabviewPanel);","        }","    }","});","","Y.TabView = TabView;","/**"," * Provides Tab instances for use with TabView"," * @param config {Object} Object literal specifying tabview configuration properties."," *"," * @class Tab"," * @constructor"," * @extends Widget"," * @uses WidgetChild"," */","Y.Tab = Y.Base.create('tab', Y.Widget, [Y.WidgetChild], {","    BOUNDING_TEMPLATE: '<li></li>',","    CONTENT_TEMPLATE: '<a></a>',","    PANEL_TEMPLATE: '<div></div>',","","    _uiSetSelectedPanel: function(selected) {","        this.get('panelNode').toggleClass(Y.TabviewBase._classNames.selectedPanel, selected);","    },","","    _afterTabSelectedChange: function(event) {","       this._uiSetSelectedPanel(event.newVal);","    },","","    _afterParentChange: function(e) {","        if (!e.newVal) {","            this._remove();","        } else {","            this._add();","        }","    },","","    _initAria: function() {","        var anchor = this.get('contentBox'),","            id = anchor.get('id'),","            panel = this.get('panelNode');","","        if (!id) {","            id = Y.guid();","            anchor.set('id', id);","        }","        //  Apply the ARIA roles, states and properties to each tab","        anchor.set('role', 'tab');","        anchor.get('parentNode').set('role', 'presentation');","","        //  Apply the ARIA roles, states and properties to each panel","        panel.setAttrs({","            role: 'tabpanel',","            'aria-labelledby': id","        });","    },","","    syncUI: function() {","        var _classNames = Y.TabviewBase._classNames;","","        this.get('boundingBox').addClass(_classNames.tab);","        this.get('contentBox').addClass(_classNames.tabLabel);","        this.set('label', this.get('label'));","        this.set('content', this.get('content'));","        this._uiSetSelectedPanel(this.get('selected'));","    },","","    bindUI: function() {","       this.after('selectedChange', this._afterTabSelectedChange);","       this.after('parentChange', this._afterParentChange);","    },","","    renderUI: function() {","        this._renderPanel();","        this._initAria();","    },","","    _renderPanel: function() {","        this.get('parent').get('panelNode')","            .appendChild(this.get('panelNode'));","    },","","    _add: function() {","        var parent = this.get('parent').get('contentBox'),","            list = parent.get('listNode'),","            panel = parent.get('panelNode');","","        if (list) {","            list.appendChild(this.get('boundingBox'));","        }","","        if (panel) {","            panel.appendChild(this.get('panelNode'));","        }","    },","","    _remove: function() {","        this.get('boundingBox').remove();","        this.get('panelNode').remove();","    },","","    _onActivate: function(e) {","         if (e.target === this) {","             //  Prevent the browser from navigating to the URL specified by the","             //  anchor's href attribute.","             e.domEvent.preventDefault();","             e.target.set('selected', 1);","         }","    },","","    initializer: function() {","       this.publish(this.get('triggerEvent'), {","           defaultFn: this._onActivate","       });","    },","","    _defLabelGetter: function() {","        return this.get('contentBox').getHTML();","    },","","    _defLabelSetter: function(label) {","        var labelNode = this.get('contentBox');","        if (labelNode.getHTML() !== label) { // Avoid rewriting existing label.","            labelNode.setHTML(label);","        }","        return label;","    },","","    _defContentSetter: function(content) {","        var panel = this.get('panelNode');","        if (panel.getHTML() !== content) { // Avoid rewriting existing content.","            panel.setHTML(content);","        }","        return content;","    },","","    _defContentGetter: function() {","        return this.get('panelNode').getHTML();","    },","","    // find panel by ID mapping from label href","    _defPanelNodeValueFn: function() {","        var _classNames = Y.TabviewBase._classNames,","            href = this.get('contentBox').get('href') || '',","            parent = this.get('parent'),","            hashIndex = href.indexOf('#'),","            panel;","","        href = href.substr(hashIndex);","","        if (href.charAt(0) === '#') { // in-page nav, find by ID","            panel = Y.one(href);","            if (panel) {","                panel.addClass(_classNames.tabPanel);","            }","        }","","        // use the one found by id, or else try matching indices","        if (!panel && parent) {","            panel = parent.get('panelNode')","                    .get('children').item(this.get('index'));","        }","","        if (!panel) { // create if none found","            panel = Y.Node.create(this.PANEL_TEMPLATE);","            panel.addClass(_classNames.tabPanel);","        }","        return panel;","    }","}, {","    ATTRS: {","        /**","         * @attribute triggerEvent","         * @default \"click\"","         * @type String","         */","        triggerEvent: {","            value: 'click'","        },","","        /**","         * @attribute label","         * @type HTML","         */","        label: {","            setter: '_defLabelSetter',","            getter: '_defLabelGetter'","        },","","        /**","         * @attribute content","         * @type HTML","         */","        content: {","            setter: '_defContentSetter',","            getter: '_defContentGetter'","        },","","        /**","         * @attribute panelNode","         * @type Y.Node","         */","        panelNode: {","            setter: function(node) {","                node = Y.one(node);","                if (node) {","                    node.addClass(Y.TabviewBase._classNames.tabPanel);","                }","                return node;","            },","            valueFn: '_defPanelNodeValueFn'","        },","","        tabIndex: {","            value: null,","            validator: '_validTabIndex'","        }","","    },","","    HTML_PARSER: {","        selected: function() {","            var ret = (this.get('boundingBox').hasClass(Y.TabviewBase._classNames.selectedTab)) ?","                        1 : 0;","            return ret;","        }","    }","","});","","","}, '@VERSION@', {","    \"requires\": [","        \"widget\",","        \"widget-parent\",","        \"widget-child\",","        \"tabview-base\",","        \"node-pluginhost\",","        \"node-focusmanager\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/tabview/tabview.js"].lines = {"1":0,"9":0,"25":0,"29":0,"31":0,"33":0,"37":0,"39":0,"41":0,"45":0,"48":0,"49":0,"50":0,"51":0,"55":0,"59":0,"62":0,"63":0,"75":0,"82":0,"83":0,"84":0,"88":0,"89":0,"90":0,"91":0,"92":0,"97":0,"99":0,"100":0,"101":0,"102":0,"105":0,"107":0,"108":0,"113":0,"114":0,"115":0,"120":0,"121":0,"122":0,"127":0,"134":0,"135":0,"136":0,"137":0,"139":0,"140":0,"141":0,"157":0,"158":0,"159":0,"161":0,"169":0,"170":0,"171":0,"173":0,"187":0,"190":0,"195":0,"205":0,"211":0,"215":0,"219":0,"220":0,"222":0,"227":0,"231":0,"232":0,"233":0,"236":0,"237":0,"240":0,"247":0,"249":0,"250":0,"251":0,"252":0,"253":0,"257":0,"258":0,"262":0,"263":0,"267":0,"272":0,"276":0,"277":0,"280":0,"281":0,"286":0,"287":0,"291":0,"294":0,"295":0,"300":0,"306":0,"310":0,"311":0,"312":0,"314":0,"318":0,"319":0,"320":0,"322":0,"326":0,"331":0,"337":0,"339":0,"340":0,"341":0,"342":0,"347":0,"348":0,"352":0,"353":0,"354":0,"356":0,"393":0,"394":0,"395":0,"397":0,"411":0,"413":0};
_yuitest_coverage["build/tabview/tabview.js"].functions = {"_afterChildAdded:24":0,"_defListNodeValueFn:28":0,"_defPanelNodeValueFn:36":0,"_afterChildRemoved:44":0,"_initAria:58":0,"bindUI:70":0,"renderUI:87":0,"(anonymous 2):99":0,"_setDefSelection:95":0,"_renderListBox:112":0,"_renderPanelBox:119":0,"(anonymous 3):139":0,"_renderTabs:126":0,"setter:156":0,"setter:168":0,"listNode:186":0,"panelNode:189":0,"_uiSetSelectedPanel:210":0,"_afterTabSelectedChange:214":0,"_afterParentChange:218":0,"_initAria:226":0,"syncUI:246":0,"bindUI:256":0,"renderUI:261":0,"_renderPanel:266":0,"_add:271":0,"_remove:285":0,"_onActivate:290":0,"initializer:299":0,"_defLabelGetter:305":0,"_defLabelSetter:309":0,"_defContentSetter:317":0,"_defContentGetter:325":0,"_defPanelNodeValueFn:330":0,"setter:392":0,"selected:410":0,"(anonymous 1):1":0};
_yuitest_coverage["build/tabview/tabview.js"].coveredLines = 123;
_yuitest_coverage["build/tabview/tabview.js"].coveredFunctions = 37;
_yuitest_coverline("build/tabview/tabview.js", 1);
YUI.add('tabview', function (Y, NAME) {

/**
 * The TabView module
 *
 * @module tabview
 */

_yuitest_coverfunc("build/tabview/tabview.js", "(anonymous 1)", 1);
_yuitest_coverline("build/tabview/tabview.js", 9);
var DOT = '.',

    /**
     * Provides a tabbed widget interface
     * @param config {Object} Object literal specifying tabview configuration properties.
     *
     * @class TabView
     * @constructor
     * @extends Widget
     * @uses WidgetParent
     */
    TabView = Y.Base.create('tabView', Y.Widget, [Y.WidgetParent], {
    LIST_TEMPLATE: '<ul></ul>',
    PANEL_TEMPLATE: '<div></div>',

    _afterChildAdded: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_afterChildAdded", 24);
_yuitest_coverline("build/tabview/tabview.js", 25);
this.get('contentBox').focusManager.refresh();
    },

    _defListNodeValueFn: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defListNodeValueFn", 28);
_yuitest_coverline("build/tabview/tabview.js", 29);
var node = Y.Node.create(this.LIST_TEMPLATE);

        _yuitest_coverline("build/tabview/tabview.js", 31);
node.addClass(Y.TabviewBase._classNames.tabviewList);

        _yuitest_coverline("build/tabview/tabview.js", 33);
return node;
    },

    _defPanelNodeValueFn: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defPanelNodeValueFn", 36);
_yuitest_coverline("build/tabview/tabview.js", 37);
var node = Y.Node.create(this.PANEL_TEMPLATE);

        _yuitest_coverline("build/tabview/tabview.js", 39);
node.addClass(Y.TabviewBase._classNames.tabviewPanel);

        _yuitest_coverline("build/tabview/tabview.js", 41);
return node;
    },

    _afterChildRemoved: function(e) { // update the selected tab when removed
        _yuitest_coverfunc("build/tabview/tabview.js", "_afterChildRemoved", 44);
_yuitest_coverline("build/tabview/tabview.js", 45);
var i = e.index,
            selection = this.get('selection');

        _yuitest_coverline("build/tabview/tabview.js", 48);
if (!selection) { // select previous item if selection removed
            _yuitest_coverline("build/tabview/tabview.js", 49);
selection = this.item(i - 1) || this.item(0);
            _yuitest_coverline("build/tabview/tabview.js", 50);
if (selection) {
                _yuitest_coverline("build/tabview/tabview.js", 51);
selection.set('selected', 1);
            }
        }

        _yuitest_coverline("build/tabview/tabview.js", 55);
this.get('contentBox').focusManager.refresh();
    },

    _initAria: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_initAria", 58);
_yuitest_coverline("build/tabview/tabview.js", 59);
var contentBox = this.get('contentBox'),
            tablist = contentBox.one(Y.TabviewBase._queries.tabviewList);

        _yuitest_coverline("build/tabview/tabview.js", 62);
if (tablist) {
            _yuitest_coverline("build/tabview/tabview.js", 63);
tablist.setAttrs({
                //'aria-labelledby':
                role: 'tablist'
            });
        }
    },

    bindUI: function() {
        //  Use the Node Focus Manager to add keyboard support:
        //  Pressing the left and right arrow keys will move focus
        //  among each of the tabs.

        _yuitest_coverfunc("build/tabview/tabview.js", "bindUI", 70);
_yuitest_coverline("build/tabview/tabview.js", 75);
this.get('contentBox').plug(Y.Plugin.NodeFocusManager, {
                        descendants: DOT + Y.TabviewBase._classNames.tabLabel,
                        keys: { next: 'down:39', // Right arrow
                                previous: 'down:37' },  // Left arrow
                        circular: true
                    });

        _yuitest_coverline("build/tabview/tabview.js", 82);
this.after('render', this._setDefSelection);
        _yuitest_coverline("build/tabview/tabview.js", 83);
this.after('addChild', this._afterChildAdded);
        _yuitest_coverline("build/tabview/tabview.js", 84);
this.after('removeChild', this._afterChildRemoved);
    },

    renderUI: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "renderUI", 87);
_yuitest_coverline("build/tabview/tabview.js", 88);
var contentBox = this.get('contentBox');
        _yuitest_coverline("build/tabview/tabview.js", 89);
this._renderListBox(contentBox);
        _yuitest_coverline("build/tabview/tabview.js", 90);
this._renderPanelBox(contentBox);
        _yuitest_coverline("build/tabview/tabview.js", 91);
this._childrenContainer = this.get('listNode');
        _yuitest_coverline("build/tabview/tabview.js", 92);
this._renderTabs(contentBox);
    },

    _setDefSelection: function() {
        //  If no tab is selected, select the first tab.
        _yuitest_coverfunc("build/tabview/tabview.js", "_setDefSelection", 95);
_yuitest_coverline("build/tabview/tabview.js", 97);
var selection = this.get('selection') || this.item(0);

        _yuitest_coverline("build/tabview/tabview.js", 99);
this.some(function(tab) {
            _yuitest_coverfunc("build/tabview/tabview.js", "(anonymous 2)", 99);
_yuitest_coverline("build/tabview/tabview.js", 100);
if (tab.get('selected')) {
                _yuitest_coverline("build/tabview/tabview.js", 101);
selection = tab;
                _yuitest_coverline("build/tabview/tabview.js", 102);
return true;
            }
        });
        _yuitest_coverline("build/tabview/tabview.js", 105);
if (selection) {
            // TODO: why both needed? (via widgetParent/Child)?
            _yuitest_coverline("build/tabview/tabview.js", 107);
this.set('selection', selection);
            _yuitest_coverline("build/tabview/tabview.js", 108);
selection.set('selected', 1);
        }
    },

    _renderListBox: function(contentBox) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_renderListBox", 112);
_yuitest_coverline("build/tabview/tabview.js", 113);
var node = this.get('listNode');
        _yuitest_coverline("build/tabview/tabview.js", 114);
if (!node.inDoc()) {
            _yuitest_coverline("build/tabview/tabview.js", 115);
contentBox.append(node);
        }
    },

    _renderPanelBox: function(contentBox) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_renderPanelBox", 119);
_yuitest_coverline("build/tabview/tabview.js", 120);
var node = this.get('panelNode');
        _yuitest_coverline("build/tabview/tabview.js", 121);
if (!node.inDoc()) {
            _yuitest_coverline("build/tabview/tabview.js", 122);
contentBox.append(node);
        }
    },

    _renderTabs: function(contentBox) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_renderTabs", 126);
_yuitest_coverline("build/tabview/tabview.js", 127);
var _classNames = Y.TabviewBase._classNames,
            _queries = Y.TabviewBase._queries,
            tabs = contentBox.all(_queries.tab),
            panelNode = this.get('panelNode'),
            panels = (panelNode) ? this.get('panelNode').get('children') : null,
            tabview = this;

        _yuitest_coverline("build/tabview/tabview.js", 134);
if (tabs) { // add classNames and fill in Tab fields from markup when possible
            _yuitest_coverline("build/tabview/tabview.js", 135);
tabs.addClass(_classNames.tab);
            _yuitest_coverline("build/tabview/tabview.js", 136);
contentBox.all(_queries.tabLabel).addClass(_classNames.tabLabel);
            _yuitest_coverline("build/tabview/tabview.js", 137);
contentBox.all(_queries.tabPanel).addClass(_classNames.tabPanel);

            _yuitest_coverline("build/tabview/tabview.js", 139);
tabs.each(function(node, i) {
                _yuitest_coverfunc("build/tabview/tabview.js", "(anonymous 3)", 139);
_yuitest_coverline("build/tabview/tabview.js", 140);
var panelNode = (panels) ? panels.item(i) : null;
                _yuitest_coverline("build/tabview/tabview.js", 141);
tabview.add({
                    boundingBox: node,
                    contentBox: node.one(DOT + _classNames.tabLabel),
                    panelNode: panelNode
                });
            });
        }
    }
}, {
    ATTRS: {
        defaultChildType: {
            value: 'Tab'
        },

        listNode: {
            setter: function(node) {
                _yuitest_coverfunc("build/tabview/tabview.js", "setter", 156);
_yuitest_coverline("build/tabview/tabview.js", 157);
node = Y.one(node);
                _yuitest_coverline("build/tabview/tabview.js", 158);
if (node) {
                    _yuitest_coverline("build/tabview/tabview.js", 159);
node.addClass(Y.TabviewBase._classNames.tabviewList);
                }
                _yuitest_coverline("build/tabview/tabview.js", 161);
return node;
            },

            valueFn: '_defListNodeValueFn'
        },

        panelNode: {
            setter: function(node) {
                _yuitest_coverfunc("build/tabview/tabview.js", "setter", 168);
_yuitest_coverline("build/tabview/tabview.js", 169);
node = Y.one(node);
                _yuitest_coverline("build/tabview/tabview.js", 170);
if (node) {
                    _yuitest_coverline("build/tabview/tabview.js", 171);
node.addClass(Y.TabviewBase._classNames.tabviewPanel);
                }
                _yuitest_coverline("build/tabview/tabview.js", 173);
return node;
            },

            valueFn: '_defPanelNodeValueFn'
        },

        tabIndex: {
            value: null
            //validator: '_validTabIndex'
        }
    },

    HTML_PARSER: {
        listNode: function(srcNode) {
            _yuitest_coverfunc("build/tabview/tabview.js", "listNode", 186);
_yuitest_coverline("build/tabview/tabview.js", 187);
return srcNode.one(Y.TabviewBase._queries.tabviewList);
        },
        panelNode: function(srcNode) {
            _yuitest_coverfunc("build/tabview/tabview.js", "panelNode", 189);
_yuitest_coverline("build/tabview/tabview.js", 190);
return srcNode.one(Y.TabviewBase._queries.tabviewPanel);
        }
    }
});

_yuitest_coverline("build/tabview/tabview.js", 195);
Y.TabView = TabView;
/**
 * Provides Tab instances for use with TabView
 * @param config {Object} Object literal specifying tabview configuration properties.
 *
 * @class Tab
 * @constructor
 * @extends Widget
 * @uses WidgetChild
 */
_yuitest_coverline("build/tabview/tabview.js", 205);
Y.Tab = Y.Base.create('tab', Y.Widget, [Y.WidgetChild], {
    BOUNDING_TEMPLATE: '<li></li>',
    CONTENT_TEMPLATE: '<a></a>',
    PANEL_TEMPLATE: '<div></div>',

    _uiSetSelectedPanel: function(selected) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_uiSetSelectedPanel", 210);
_yuitest_coverline("build/tabview/tabview.js", 211);
this.get('panelNode').toggleClass(Y.TabviewBase._classNames.selectedPanel, selected);
    },

    _afterTabSelectedChange: function(event) {
       _yuitest_coverfunc("build/tabview/tabview.js", "_afterTabSelectedChange", 214);
_yuitest_coverline("build/tabview/tabview.js", 215);
this._uiSetSelectedPanel(event.newVal);
    },

    _afterParentChange: function(e) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_afterParentChange", 218);
_yuitest_coverline("build/tabview/tabview.js", 219);
if (!e.newVal) {
            _yuitest_coverline("build/tabview/tabview.js", 220);
this._remove();
        } else {
            _yuitest_coverline("build/tabview/tabview.js", 222);
this._add();
        }
    },

    _initAria: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_initAria", 226);
_yuitest_coverline("build/tabview/tabview.js", 227);
var anchor = this.get('contentBox'),
            id = anchor.get('id'),
            panel = this.get('panelNode');

        _yuitest_coverline("build/tabview/tabview.js", 231);
if (!id) {
            _yuitest_coverline("build/tabview/tabview.js", 232);
id = Y.guid();
            _yuitest_coverline("build/tabview/tabview.js", 233);
anchor.set('id', id);
        }
        //  Apply the ARIA roles, states and properties to each tab
        _yuitest_coverline("build/tabview/tabview.js", 236);
anchor.set('role', 'tab');
        _yuitest_coverline("build/tabview/tabview.js", 237);
anchor.get('parentNode').set('role', 'presentation');

        //  Apply the ARIA roles, states and properties to each panel
        _yuitest_coverline("build/tabview/tabview.js", 240);
panel.setAttrs({
            role: 'tabpanel',
            'aria-labelledby': id
        });
    },

    syncUI: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "syncUI", 246);
_yuitest_coverline("build/tabview/tabview.js", 247);
var _classNames = Y.TabviewBase._classNames;

        _yuitest_coverline("build/tabview/tabview.js", 249);
this.get('boundingBox').addClass(_classNames.tab);
        _yuitest_coverline("build/tabview/tabview.js", 250);
this.get('contentBox').addClass(_classNames.tabLabel);
        _yuitest_coverline("build/tabview/tabview.js", 251);
this.set('label', this.get('label'));
        _yuitest_coverline("build/tabview/tabview.js", 252);
this.set('content', this.get('content'));
        _yuitest_coverline("build/tabview/tabview.js", 253);
this._uiSetSelectedPanel(this.get('selected'));
    },

    bindUI: function() {
       _yuitest_coverfunc("build/tabview/tabview.js", "bindUI", 256);
_yuitest_coverline("build/tabview/tabview.js", 257);
this.after('selectedChange', this._afterTabSelectedChange);
       _yuitest_coverline("build/tabview/tabview.js", 258);
this.after('parentChange', this._afterParentChange);
    },

    renderUI: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "renderUI", 261);
_yuitest_coverline("build/tabview/tabview.js", 262);
this._renderPanel();
        _yuitest_coverline("build/tabview/tabview.js", 263);
this._initAria();
    },

    _renderPanel: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_renderPanel", 266);
_yuitest_coverline("build/tabview/tabview.js", 267);
this.get('parent').get('panelNode')
            .appendChild(this.get('panelNode'));
    },

    _add: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_add", 271);
_yuitest_coverline("build/tabview/tabview.js", 272);
var parent = this.get('parent').get('contentBox'),
            list = parent.get('listNode'),
            panel = parent.get('panelNode');

        _yuitest_coverline("build/tabview/tabview.js", 276);
if (list) {
            _yuitest_coverline("build/tabview/tabview.js", 277);
list.appendChild(this.get('boundingBox'));
        }

        _yuitest_coverline("build/tabview/tabview.js", 280);
if (panel) {
            _yuitest_coverline("build/tabview/tabview.js", 281);
panel.appendChild(this.get('panelNode'));
        }
    },

    _remove: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_remove", 285);
_yuitest_coverline("build/tabview/tabview.js", 286);
this.get('boundingBox').remove();
        _yuitest_coverline("build/tabview/tabview.js", 287);
this.get('panelNode').remove();
    },

    _onActivate: function(e) {
         _yuitest_coverfunc("build/tabview/tabview.js", "_onActivate", 290);
_yuitest_coverline("build/tabview/tabview.js", 291);
if (e.target === this) {
             //  Prevent the browser from navigating to the URL specified by the
             //  anchor's href attribute.
             _yuitest_coverline("build/tabview/tabview.js", 294);
e.domEvent.preventDefault();
             _yuitest_coverline("build/tabview/tabview.js", 295);
e.target.set('selected', 1);
         }
    },

    initializer: function() {
       _yuitest_coverfunc("build/tabview/tabview.js", "initializer", 299);
_yuitest_coverline("build/tabview/tabview.js", 300);
this.publish(this.get('triggerEvent'), {
           defaultFn: this._onActivate
       });
    },

    _defLabelGetter: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defLabelGetter", 305);
_yuitest_coverline("build/tabview/tabview.js", 306);
return this.get('contentBox').getHTML();
    },

    _defLabelSetter: function(label) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defLabelSetter", 309);
_yuitest_coverline("build/tabview/tabview.js", 310);
var labelNode = this.get('contentBox');
        _yuitest_coverline("build/tabview/tabview.js", 311);
if (labelNode.getHTML() !== label) { // Avoid rewriting existing label.
            _yuitest_coverline("build/tabview/tabview.js", 312);
labelNode.setHTML(label);
        }
        _yuitest_coverline("build/tabview/tabview.js", 314);
return label;
    },

    _defContentSetter: function(content) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defContentSetter", 317);
_yuitest_coverline("build/tabview/tabview.js", 318);
var panel = this.get('panelNode');
        _yuitest_coverline("build/tabview/tabview.js", 319);
if (panel.getHTML() !== content) { // Avoid rewriting existing content.
            _yuitest_coverline("build/tabview/tabview.js", 320);
panel.setHTML(content);
        }
        _yuitest_coverline("build/tabview/tabview.js", 322);
return content;
    },

    _defContentGetter: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defContentGetter", 325);
_yuitest_coverline("build/tabview/tabview.js", 326);
return this.get('panelNode').getHTML();
    },

    // find panel by ID mapping from label href
    _defPanelNodeValueFn: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defPanelNodeValueFn", 330);
_yuitest_coverline("build/tabview/tabview.js", 331);
var _classNames = Y.TabviewBase._classNames,
            href = this.get('contentBox').get('href') || '',
            parent = this.get('parent'),
            hashIndex = href.indexOf('#'),
            panel;

        _yuitest_coverline("build/tabview/tabview.js", 337);
href = href.substr(hashIndex);

        _yuitest_coverline("build/tabview/tabview.js", 339);
if (href.charAt(0) === '#') { // in-page nav, find by ID
            _yuitest_coverline("build/tabview/tabview.js", 340);
panel = Y.one(href);
            _yuitest_coverline("build/tabview/tabview.js", 341);
if (panel) {
                _yuitest_coverline("build/tabview/tabview.js", 342);
panel.addClass(_classNames.tabPanel);
            }
        }

        // use the one found by id, or else try matching indices
        _yuitest_coverline("build/tabview/tabview.js", 347);
if (!panel && parent) {
            _yuitest_coverline("build/tabview/tabview.js", 348);
panel = parent.get('panelNode')
                    .get('children').item(this.get('index'));
        }

        _yuitest_coverline("build/tabview/tabview.js", 352);
if (!panel) { // create if none found
            _yuitest_coverline("build/tabview/tabview.js", 353);
panel = Y.Node.create(this.PANEL_TEMPLATE);
            _yuitest_coverline("build/tabview/tabview.js", 354);
panel.addClass(_classNames.tabPanel);
        }
        _yuitest_coverline("build/tabview/tabview.js", 356);
return panel;
    }
}, {
    ATTRS: {
        /**
         * @attribute triggerEvent
         * @default "click"
         * @type String
         */
        triggerEvent: {
            value: 'click'
        },

        /**
         * @attribute label
         * @type HTML
         */
        label: {
            setter: '_defLabelSetter',
            getter: '_defLabelGetter'
        },

        /**
         * @attribute content
         * @type HTML
         */
        content: {
            setter: '_defContentSetter',
            getter: '_defContentGetter'
        },

        /**
         * @attribute panelNode
         * @type Y.Node
         */
        panelNode: {
            setter: function(node) {
                _yuitest_coverfunc("build/tabview/tabview.js", "setter", 392);
_yuitest_coverline("build/tabview/tabview.js", 393);
node = Y.one(node);
                _yuitest_coverline("build/tabview/tabview.js", 394);
if (node) {
                    _yuitest_coverline("build/tabview/tabview.js", 395);
node.addClass(Y.TabviewBase._classNames.tabPanel);
                }
                _yuitest_coverline("build/tabview/tabview.js", 397);
return node;
            },
            valueFn: '_defPanelNodeValueFn'
        },

        tabIndex: {
            value: null,
            validator: '_validTabIndex'
        }

    },

    HTML_PARSER: {
        selected: function() {
            _yuitest_coverfunc("build/tabview/tabview.js", "selected", 410);
_yuitest_coverline("build/tabview/tabview.js", 411);
var ret = (this.get('boundingBox').hasClass(Y.TabviewBase._classNames.selectedTab)) ?
                        1 : 0;
            _yuitest_coverline("build/tabview/tabview.js", 413);
return ret;
        }
    }

});


}, '@VERSION@', {
    "requires": [
        "widget",
        "widget-parent",
        "widget-child",
        "tabview-base",
        "node-pluginhost",
        "node-focusmanager"
    ],
    "skinnable": true
});
