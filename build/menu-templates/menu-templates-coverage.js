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
_yuitest_coverage["build/menu-templates/menu-templates.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/menu-templates/menu-templates.js",
    code: []
};
_yuitest_coverage["build/menu-templates/menu-templates.js"].code=["YUI.add('menu-templates', function (Y, NAME) {","","/**","Provides templates for `Menu`.","","@module menu","@submodule menu-templates","**/","","/**","Templates for `Menu`.","","@class Menu.Templates","**/","","var Micro = Y.Template.Micro;","","Y.namespace('Menu').Templates = {","    children: Micro.compile(","        '<ul class=\"<%= data.classNames.children %>\"></ul>'","    ),","","    item: Micro.compile(","        '<% switch (data.item.type) { %>' +","            '<% case \"item\": %>' +","                '<li id=\"<%= data.item.id %>\" class=\"<%= data.classNames.item %>\">' +","                    '<a href=\"<%= data.item.url %>\" class=\"<%= data.classNames.label %>\" data-item-id=\"<%= data.item.id %>\"></a>' +","                '</li>' +","                '<% break; %>' +","","            '<% case \"heading\": %>' +","                '<li class=\"<%= data.classNames.heading %>\">' +","                    '<span class=\"<%= data.classNames.label %>\"></span>' +","                '</li>' +","                '<% break; %>' +","","            '<% case \"separator\": %>' +","                '<li class=\"<%= data.classNames.separator %>\"></li>' +","                '<% break; %>' +","        '<% } %>'","    )","};","","","}, '@VERSION@', {\"requires\": [\"template-micro\"]});"];
_yuitest_coverage["build/menu-templates/menu-templates.js"].lines = {"1":0,"16":0,"18":0};
_yuitest_coverage["build/menu-templates/menu-templates.js"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["build/menu-templates/menu-templates.js"].coveredLines = 3;
_yuitest_coverage["build/menu-templates/menu-templates.js"].coveredFunctions = 1;
_yuitest_coverline("build/menu-templates/menu-templates.js", 1);
YUI.add('menu-templates', function (Y, NAME) {

/**
Provides templates for `Menu`.

@module menu
@submodule menu-templates
**/

/**
Templates for `Menu`.

@class Menu.Templates
**/

_yuitest_coverfunc("build/menu-templates/menu-templates.js", "(anonymous 1)", 1);
_yuitest_coverline("build/menu-templates/menu-templates.js", 16);
var Micro = Y.Template.Micro;

_yuitest_coverline("build/menu-templates/menu-templates.js", 18);
Y.namespace('Menu').Templates = {
    children: Micro.compile(
        '<ul class="<%= data.classNames.children %>"></ul>'
    ),

    item: Micro.compile(
        '<% switch (data.item.type) { %>' +
            '<% case "item": %>' +
                '<li id="<%= data.item.id %>" class="<%= data.classNames.item %>">' +
                    '<a href="<%= data.item.url %>" class="<%= data.classNames.label %>" data-item-id="<%= data.item.id %>"></a>' +
                '</li>' +
                '<% break; %>' +

            '<% case "heading": %>' +
                '<li class="<%= data.classNames.heading %>">' +
                    '<span class="<%= data.classNames.label %>"></span>' +
                '</li>' +
                '<% break; %>' +

            '<% case "separator": %>' +
                '<li class="<%= data.classNames.separator %>"></li>' +
                '<% break; %>' +
        '<% } %>'
    )
};


}, '@VERSION@', {"requires": ["template-micro"]});
