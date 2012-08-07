YUI.add('mygroup-util-1.4', function(Y) {
	Y.namespace('mygroup');
	var strings = Y.Intl.get('mygroup-util-1.4');
	Y.mygroup.test = function() {
		return strings.test;
	}
	
}, '1.4.0', {"requires": [ "intl"], "lang": ['it', 'en']});
