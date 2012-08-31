var Micro = Y.Template.Micro;

Y.namespace('TreeView').Templates = {
    children: Micro.compile(
        '<ul class="<%= data.classNames.children %>"></ul>'
    ),

    node: Micro.compile(
        '<li id="<%= data.node.id %>" class="<%= data.classNames.node %>">' +
            '<div class="<%= data.classNames.row %>" data-node-id="<%= data.node.id %>">' +
                '<span class="<%= data.classNames.indicator %>"><s></s></span>' +
                '<span class="<%= data.classNames.label %>"></span>' +
            '</div>' +
        '</li>'
    )
};
