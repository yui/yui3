YUI.add('datatable-sort', function(Y) {

//TODO: break out into own component
var //getClassName = Y.ClassNameManager.getClassName,
    COMPARE = Y.ArraySort.compare,

    //DATATABLE = "datatable",
    ASC = "asc",
    DESC = "desc",
    //CLASS_ASC = getClassName(DATATABLE, "asc"),
    //CLASS_DESC = getClassName(DATATABLE, "desc"),
    CLASS_SORTABLE = Y.ClassNameManager.getClassName("datatable", "sortable"),

    //TODO: Don't use hrefs - use tab/arrow/enter
    TEMPLATE_TH_LINK = '<a class="{link_class}" title="{link_title}" href="{link_href}">{value}</a>';


function DataTableSort() {
    DataTableSort.superclass.constructor.apply(this, arguments);
}

Y.mix(DataTableSort, {
    NS: "sort",

    NAME: "dataTableSort",

    ATTRS: {
        trigger: {
            value: "theadCellClick",
            writeOnce: "initOnly"
        },
        
        sortedBy: {
            value: null
        }
    }
});

Y.extend(DataTableSort, Y.Plugin.Base, {
    thLinkTemplate: TEMPLATE_TH_LINK,

    initializer: function(config) {
        var dt = this.get("host");
        dt.get("recordset").plug(Y.Plugin.RecordsetSort, {dt: dt});
        dt.get("recordset").sort.addTarget(dt);
        
        // Wrap link around TH value
        this.doBefore("_createTheadThNode", this._beforeCreateTheadThNode);
        
        // Add class
        this.doBefore("_attachTheadThNode", function(o) {
           o.th.addClass(CLASS_SORTABLE);
        });

        // Attach click handlers
        dt.on(this.get("trigger"), this._onEventSortColumn);

        // Attach UI hooks
        dt.after("recordsetSort:sort", function() {
            dt._uiSetRecordset(dt.get("recordset"));
        });
        dt.after("sortedByChangeEvent", function() {
            alert('ok');
        });

        //TODO
        //dt.after("recordset:mutation", function() {//reset sortedBy});
        
        //TODO
        //add Column sortFn ATTR
        
        // Update UI after the fact (plug-then-render case)
        if(dt.get("rendered")) {
            dt._uiSetColumnset(dt.get("columnset"));
        }
    },

    _beforeCreateTheadThNode: function(o) {
        if(o.column.get("sortable")) {
            o.value = Y.substitute(this.thLinkTemplate, {
                link_class: "foo",
                link_title: "bar",
                link_href: "bat",
                value: o.value
            });
        }
    },

    _onEventSortColumn: function(e) {
        e.halt();
        //TODO: normalize e.currentTarget to TH
        var column = this.get("columnset").get("hash")[e.currentTarget.get("id")],
            field = column.get("field"),
            prevSortedBy = this.get("sortedBy"),
            dir = (prevSortedBy &&
                prevSortedBy.field === field &&
                prevSortedBy.dir === ASC) ? DESC : ASC,
            sorter = column.get("sortFn");
        if(column.get("sortable")) {
            this.get("recordset").sort.sort(field, dir === DESC, sorter);
            this.set("sortedBy", {field: field, dir: dir});
        }
    }
});

Y.namespace("Plugin").DataTableSort = DataTableSort;






}, '@VERSION@' ,{requires:['plugin','datatable-base','recordset-sort'], lang:['en']});
