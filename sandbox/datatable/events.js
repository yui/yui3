YUI.add('datatable-events', function (Y) {

var isString = Y.Lang.isString;

Y.Plugin.DataTableEvents = Y.Base.create('dataTableEvents', Y.Plugin.Base, [], {

    initializer: function () {
        // Or possibly this.afterHostMethod('bindUI', this._initEvents);
        this.get('host').after('render', this._initEvents, this);
    },

    _initEvents: function () {
        var events  = this.get('events'),
            tags    = this.get('tags'), // filters?
            tag_map = {},
            filter  = [],
            i, tag;

        for (i = tags.length - 1; i >= 0; --i) {
            tag = tags[i];
            if (isString(tag)) {
                tag = { tag: tag, name: tag }
            }
            tag_map[tag.tag] = tag;
            filter.push(tag.tag);
        }

        this._tag_map = tag_map;
        this._handle = this.get('host')._tableNode
            .delegate(events, this._handleEvent, filter.join(','), this);
    },

    // TODO: how to broadcast column events?
    _handleEvent: function (e) {
        if (/^mouse(?:over|out|enter|leave)$/.test(e.type)) {
            this._handleHoverEvent(e);
        } else {
            this._notify(e);
        }
    },

    _handleHoverEvent: function (e) {
        
    },

    _notify: function (e, tag_map) {
        var node    = e.currentTarget,
            table   = this.get('host'),
            thead   = table._theadNode,
            type    = e.type.charAt(0).toUpperCase() + e.type.slice(1),
            tag     = node.get('tagName').toLowerCase(),
            inThead = node.getData('inThead'),
            tag_map = this._tag_map;

        if (!inThead && inThead !== false) {
            inThead = (node !== thead && thead.contains(node));

            node.setData('inThead', inThead);
        }

        if (tag_map[tag]) {
            tag = tag_map[tag].name;
        }

        if (thead) {
            tag = 'thead' + tag.charAt(0).toUpperCase() + tag.slice(1);
        }

        // cellClick, theadCellClick, tableKeydown etc
        Y.log("Emitting" + tag + type);
        this.fire(tag + type, e); // or fire(.., { event: e })? or new EventFacade?
    },

    destructor: function () {
        if (this._handle) {
            this._handle.detach();
        }
    }
}, {
    NS: 'events',

    ATTRS: {
        events: {
            value: ['keydown', 'keyup', 'mousedown', 'mouseup', 'click' ]
        },

        tags: {
            value: [
                'table', 'thead', 'tbody',
                { tag: 'tr', name: 'row' },
                { tag: 'th', name: 'cell' },
                { tag: 'td', name: 'cell' }
            ]
        }
    }
});

}, '@VERSION@', { requires: [ 'base-build', 'plugin', 'event-mouseenter' ] });
