YUI.add('recordset-basic-tests', function(Y){

	var suite = new Y.Test.Suite('recordset-basic Examples Test'),
		isTrue = Y.Assert.isTrue,
		isNotNull = Y.Assert.isNotNull,
		areSame = Y.Assert.areSame,
		areNotSame = Y.Assert.areNotSame;

	suite.add(new Y.Test.Case({

		name: 'Basic Recordset example tests',

		'should have a table and four buttons': function() {
			var table = Y.one('#demo table'),
				buttons = Y.all('.example input[type=button]');

			isNotNull(table, 'There is no table.');
			areSame(4, buttons.size(), 'There are not 4 buttons.');
		},

		'should add new row to bottom': function() {
			var table = Y.one('#demo table tbody'),
				btn = Y.one('#addButton'),
				rowCount = table.all('tr').size(),
				row = table.one('tr:last-child'),
				state = row.one('td').getContent();

			isNotNull(btn, 'There is no add button.');

			btn.simulate('click');

			this.wait(function() {
				areSame(rowCount + 1, table.all('tr').size(), 'Row was not added.');
				areNotSame(row, table.one('tr:last-child'), 'Row was not added to the bottom.');
				areNotSame(state, table.one('tr:last-child').one('td').getContent(), 'Same state in bottom row.');
			}, 200);
		},

		'should remove row from top': function() {
			var table = Y.one('#demo table tbody'),
				btn = Y.one('#removeButton'),
				rowCount = table.all('tr').size(),
				row = table.one('tr'),
				state = row.one('td').getContent();

			isNotNull(btn, 'There is no remove button.');

			btn.simulate('click');

			this.wait(function() {
				areSame(rowCount - 1, table.all('tr').size(), 'Row was not removed.');
				areNotSame(row, table.one('tr'), 'Row was not removed from the top.');
				areNotSame(state, table.one('tr').one('td').getContent(), 'Same state in bottom row.');
			}, 200);
		},

		'should update second to last row': function() {
			var table = Y.one('#demo table tbody'),
				btn = Y.one('#updateButton'),
				rowCount = table.all('tr').size(),
				row = table.all('tr').item(rowCount - 2),
				state = row.one('td').getContent();

			isNotNull(btn, 'There is no update button.');

			btn.simulate('click');

			this.wait(function() {
				areNotSame(row, table.all('tr').item(rowCount - 2), 'Row was not updated.');
				areNotSame(state, table.one('tr:last-child').one('td').getContent(), 'Same state in row.');
			}, 200);
		},

		'should empty table and add three rows': function() {
			var table = Y.one('#demo table tbody'),
				btn = Y.one('#emptyButton'),
				addBtn = Y.one('#addButton');

			btn.simulate('click');

			isTrue(table.all('tr').size() === 0, 'Table is not empty.');

			addBtn.simulate('click');
			addBtn.simulate('click');
			addBtn.simulate('click');

			this.wait(function() {
				areSame(3, table.all('tr').size(), 'Three rows were not added.');
			}, 200);
		}

	}));

	Y.Test.Runner.add(suite);

}, '', {requires: ['recordset', 'test', 'node-event-simulate']});