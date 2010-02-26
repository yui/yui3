YUI.add("mymod", function(Y) {
    Y.MyMod = {
        formatDate : function() {
            return Y.DataType.Date.format(new Date(), {format:"%e %b"});
        }
    };
}, "3.0" ,{requires:["datatype-date"]});