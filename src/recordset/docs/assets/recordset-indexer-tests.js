YUI.add('recordset-indexer-tests', function(Y){

	var suite = new Y.Test.Suite('recordset-indexer Examples Test'),
		isTrue = Y.Assert.isTrue,
		isNull = Y.Assert.isNull,
		isNotNull = Y.Assert.isNotNull,
		areSame = Y.Assert.areSame,
		areNotSame = Y.Assert.areNotSame;

	suite.add(new Y.Test.Case({
		name: 'testing recordset filter plugin',

		'should have a table and 2 buttons': function() {
			var table = Y.one('#demo table'),
				buttons = Y.all('#buttonControl input[type=button]');

			isNotNull(table, 'Table doesn\'t exist.');
			areSame(2, buttons.size(), 'There are not two buttons');
		},

		'should create new table with two columns and same row count': function() {
			var table = Y.one('#demo table'),
				rowCount = table.all('tbody tr').size(),
				hashBtn = Y.one('#createTableState'),
				viewBtn = Y.one('#viewTable'),
				htContainer = Y.one('#htContainer');

			isNotNull(table, 'Table doesn\'t exist.');
			isNotNull(hashBtn, 'Hash Button does not exist.');
			isNotNull(viewBtn, 'View Button does not exist.');
			isNull(htContainer.one('table'), 'HTContainer is not empty.');

			hashBtn.simulate('click');
			viewBtn.simulate('click');

			this.wait(function() {
				isNotNull(htContainer.one('table'), 'Table was not created.');

				var htTable = htContainer.one('table');

				areSame(rowCount, htTable.all('tbody tr').size(), 'Rows do not match.');
			}, 200);


		}


	}));

	Y.Test.Runner.add(suite);

}, '', {requires: ['recordset', 'test', 'node-event-simulate']});