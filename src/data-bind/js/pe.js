/**
Adds progressive enhancement support for Y.DataBind via static HTML_PARSER for
`bindings`, searching the provided `srcNode` for elements with "data-bind-attr"
attribute.

@module data-bind
@submodule data-bind-html
@since 3.9.0
**/

/**
HTML_PARSER map with logic to extract binding fields from the source node.

@property HTML_PARSER
@type {Object}
@static
**/
Y.DataBind.HTML_PARSER = {
    bindings: function (srcNode) {
        var bindings = {};

        srcNode.all('[data-bind-attr]').each(function (node) {
            var attr   = node.getAttribute('data-bind-attr'),
                config = bindings[attr];

            if (config) {
                if (!config.field.getDOMNodes) {
                    // Node -> NodeList
                    config.field = Y.all(config.field);
                }
                config.field.push(this);
            } else {
                bindings[attr] = { field: this };
            }
        });

        return bindings;
    }
};
