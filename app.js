var budgetController = (function (){


})();


var UIController = (function() {


})();


var controller = (function(budgetCtrl, UICtrl) {

	var ctrlAddItem = function(){console.log('hey')};


	document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

	 document.addEventListener('keypress', function(event){

	 	if (event.keyCode === 13){
	 		console.log('Enter was pressed')
	 	}

	 });



})(budgetController, UIController);



