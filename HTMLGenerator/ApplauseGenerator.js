function createApplause(mainEventCount){
	// window.alert("Still Under Construction");
	$(document).ready(function(){
		ApplauseGeneration()
	});
}	

function ApplauseGeneration(){
	var allInputs = $( ":input" );
	// var formChildren = $( "form > *" );
	// $( "#messages" ).text( "Found " + allInputs.length + " inputs and the form has " +
	//   formChildren.length + " children." );
	 
	// $( "form" ).submit(function( event ) {
	//   event.preventDefault();
	// });
	console.log(allInputs);
	// After every add another Event just terminate between Events
	// Terminate between main event and subEvents just use the count for mainEvent
	var i;

	for (i = 0; i < allInputs.length; i++){
		console.log(allInputs[i].value);
		if (i == 0){

		}
		else if (i == 1){

		}
	}
	// console.log("formChildren: " + formChildren);
}

// Has 5 contents
function mainEventCreation(){

}

// Issues need to worry about categorization of subbrands
// Has 4 contents
function subEventCreation(){

}