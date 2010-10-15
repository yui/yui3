YUI.add('datatable-scroll', function(Y) {

function DatatableScroll() {
    DatatableScroll.superclass.constructor.apply(this, arguments);
}

Y.mix(DatatableScroll, {

    NS: "scroll",

    NAME: "dataTableScroll",

    ATTRS: {

    }
});

Y.extend(DatatableScroll, Y.Plugin.Base, {

    initializer: function(config) {
        
    }
});

Y.namespace('Plugin').DatatableScroll = DatatableScroll;



}, '@VERSION@' ,{requires:['plugin','datatable-base']});
