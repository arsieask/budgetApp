var budgetController = (function () {

	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(cur){
			sum = sum + cur.value;

		});
		data.totals[type] = sum;
	};

	var data = {
		allItems:{
			exp: [],
			inc: [],
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	};

	return{
		addItem: function(type, des, val) {
			var newItem, ID;

			//Creating new ID
			if(data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}


			//Creating new item 'inc' or 'exp'
			if(type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			} 

			//Pushing it into data structure and returning it
			data.allItems[type].push(newItem);
			return newItem;

		},

		deleteItem: function(type, id) {
			var ids, index;

			var ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			index = ids.indexOf(id);

			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}

		},



		calculateBudget: function() {

			//calculate total income
			calculateTotal('inc');
			calculateTotal('exp');

			//calcultare the budget: income - expences
			data.budget = data.totals.inc - data.totals.exp;

			//calculate the percentage of income spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}

		},

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
		},

		testing: function() {
			console.log(data);
		}
	};

})();




var UIController = (function() {

	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container:'.container'
	}

	return{
		getInput: function() {
			return{
				type: document.querySelector(DOMstrings.inputType).value, // Will be either income(inc) or expence(exp)
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},

		addListItem: function(obj, type){
			var html, newHtml, element;

			//Create HTML string with placeholder
			if(type === 'inc') {
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
		

			//replace the placholder with actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			//Insert HTML adjacent
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		clearFeilds: function() {
			var fields, feildsArr;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

			feildsArr = Array.prototype.slice.call(fields);

			feildsArr.forEach(function(current, index, array) {
				current.value = "";
			});

			feildsArr[0].focus();
		},

		displayBudget: function(obj) {

			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

			if(obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';

			}

		},


		getDOMstrings: function() {
			return DOMstrings;
		}
	}

})();


var controller = (function(budgetCtrl, UICtrl) {

	var setupEventListeners = function() {
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(event) {

	 		if (event.keyCode === 13 || event.which === 13) {
	 		console.log('Enter was pressed')
			}

	 	});

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

	};

	var updateBudget = function() {

 		//Calculate the budget
 		budgetCtrl.calculateBudget();

 		//Return the budget
 		var budget = budgetCtrl.getBudget();

 		//Display the budget on the UI
 		UICtrl.displayBudget(budget);

	};

	var ctrlAddItem = function(){
		var input, newItem;

		//Get the input data
		input = UICtrl.getInput();

		if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

			//Add item to the budget controller
			var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
		
			//Adding item to the UI
			UICtrl.addListItem(newItem,input.type);

			//Clear the fields
			UICtrl.clearFeilds();

			//Calulate and update budget
			updateBudget();

		}
	};

	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID) {

			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);


			//delete item from the structure
			budgetCtrl.deleteItem(type, ID);

			//delete item from the UI


			//Update and show the new budget


		}

	};


	return{
		init: function() {
			console.log('App has started');
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	};

})(budgetController, UIController);

controller.init(); 



