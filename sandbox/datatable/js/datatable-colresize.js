var GETCLASSNAME = Y.ClassNameManager.getClassName,

    DATATABLE = "datatable",

    //CLASS_RESIZEABLE = GETCLASSNAME(DATATABLE, "resizeable"),
    CLASS_LINER = GETCLASSNAME(DATATABLE, "liner"),
    TEMPLATE_LINER = '<div class="'+CLASS_LINER+'">{value}</div>';

function DataTableColResize() {
    DataTableColResize.superclass.constructor.apply(this, arguments);
}

Y.mix(DataTableColResize, {

    NS: "colresize",

    NAME: "dataTableColResize",

    ATTRS: {

    }
});

Y.extend(DataTableColResize, Y.Plugin.Base, {
    thLinerTemplate: TEMPLATE_LINER,

    tdLinerTemplate: TEMPLATE_LINER,

    initializer: function(config) {
        this.get("host").thTemplate = Y.substitute(this.get("host").thTemplate, {value: this.thLinerTemplate});
        this.get("host").tdTemplate = Y.substitute(this.get("host").tdTemplate, {value: this.tdLinerTemplate});


        //TODO Set Column width...
        /*if(oColumn.width) {
            // Validate minWidth
            var nWidth = (oColumn.minWidth && (oColumn.width < oColumn.minWidth)) ?
                    oColumn.minWidth : oColumn.width;
            // ...for fallback cases
            if(DT._bDynStylesFallback) {
                elTh.firstChild.style.overflow = 'hidden';
                elTh.firstChild.style.width = nWidth + 'px';
            }
            // ...for non fallback cases
            else {
                this._setColumnWidthDynStyles(oColumn, nWidth + 'px', 'hidden');
            }
        }*/
    }
});

Y.namespace('Plugin').DataTableColResize = DataTableColResize;