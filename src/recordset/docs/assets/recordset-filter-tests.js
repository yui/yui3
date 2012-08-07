YUI.add('recordset-filter-tests', function(Y){

	var suite = new Y.Test.Suite('recordset-sort Examples Test'),
		isTrue = Y.Assert.isTrue,
		isNotNull = Y.Assert.isNotNull,
		areSame = Y.Assert.areSame,
		areNotSame = Y.Assert.areNotSame;

	suite.add(new Y.Test.Case({
		name: 'testing recordset filter plugin',

		'should have a table and 3 buttons': function() {
			var table = Y.one('#demo table'),
				buttons = Y.all('#buttonControl input[type=button]');

			isNotNull(table, 'Table doesn\'t exist.');
			areSame(3, buttons.size(), 'There are not three buttons');
		},

		'should only show california': function() {
			var table = Y.one('#demo table tbody'),
				btn = Y.one('#keyValButton');

			btn.simulate('click');

			this.wait(function() {

				areSame(1, table.all('tr').size(), 'More than one row.');

				areSame('CALIFORNIA', table.one('tr td').getContent(), 'california is not the row left.');

			}, 200);
		},

		'should only show rows with m-p states': function() {
			var table = Y.one('#demo table tbody'),
				btn = Y.one('#functionButton');

			btn.simulate('click');

			this.wait(function() {
				isNotNull(table.one('tr'), 'Table is empty');

				table.all('tr').each(function(row){
					var state = row.one('td').getContent(),
						firstLetter = state.substring(0,1).toLowerCase();

					isTrue('mnop'.indexOf(firstLetter) >= 0, 'State `' + state + '` is not allowed.');
				
				});
			}, 200);


		},

		'should display 22 rows': function() {
			var table = Y.one('#demo table tbody'),
				btn = Y.one('#resetButton');

			btn.simulate('click');

			this.wait(function() {
				areSame(22, table.all('tr').size(), 'There are not 22 rows.');
			}, 200);
		}


	}));

	Y.Test.Runner.add(suite);

}, '', {requires: ['recordset', 'test', 'node-event-simulate']});