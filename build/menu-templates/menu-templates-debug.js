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

var Micro = Y.Template.Micro;

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
