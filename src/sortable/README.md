Sortable Utility
================

The Sortable Utility allows you to create a sortable list
from a container and a group of children. It also allows
you to join lists together in various ways.


    YUI().use('sortable', function(Y) {
        var sortable = new Y.Sortable({
            container: '#demo',
            nodes: 'li',
            opacity: '.1'
        });
    });

