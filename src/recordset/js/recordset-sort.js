var COMPARE = Y.ArraySort.compare;

function RecordsetSort(field, desc, sorter) {
    RecordsetSort.superclass.constructor.apply(this, arguments);
}

Y.mix(RecordsetSort, {
    NS: "sort",

    NAME: "recordsetSort",

    ATTRS: {
		lastSortProperties: {
			value: {
				field:undefined,
				desc:undefined,
				sorter:undefined
			}
		},

        defaultSorter: {
            value: function(recA, recB, field, desc) {
                var sorted = COMPARE(recA.getValue(field), recB.getValue(field), desc);
                if(sorted === 0) {
                    return COMPARE(recA.get("id"), recB.get("id"), desc);
                }
                else {
                    return sorted;
                }
            }
        }
    }
});

Y.extend(RecordsetSort, Y.Plugin.Base, {
    initializer: function(config) {
        this.publish("sort", {defaultFn: Y.bind("_defSortFn", this)});
    },

    destructor: function(config) {
    },

    _defSortFn: function(e) {
		this.set('lastSortProperties', e);
		
		//have to work directly with _items here - changing the recordset.
        this.get("host")._items.sort(function(a, b) {
			return (e.sorter)(a, b, e.field, e.desc);
		});
    },

    sort: function(field, desc, sorter) {
		this.fire("sort", {field:field, desc: desc, sorter: sorter || this.get("defaultSorter")});
    },

	resort: function() {
		var p = this.get('lastSortProperties');
		this.fire("sort", {field:p.field, desc: p.desc, sorter: this.get("defaultSorter")});
	},

	//Flips the recordset around
    reverse: function() {
		// var rs = this.get('host'),
		// 	len = rs.getLength() - 1, //since we are starting from i=0, (len-i) = len at first iteration (rs.getRecord(len) is undefined at first iteration)
		// 	i=0;
		// 
		// for(; i <= len; i++) {
		// 	if (i < (len-i)) {
		// 		
		// 		var left = rs.getRecord(i);
		// 		var right = rs.getRecord(len-i);
		// 		rs.update(left, len-i);
		// 		rs.update(right, i);
		// 	}
		// }
		this.get('host')._items.reverse();
    }
});

Y.namespace("Plugin").RecordsetSort = RecordsetSort;

