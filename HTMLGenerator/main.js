

function test(){
	var para = document.createElement("h1");
	var node = document.createTextNode("GotStuffHere");
	para.appendChild(node);
	var parent = document.getElementById("div1");
	var child = document.getElementById("header1");
	parent.replaceChild(para, child);
}

// x is the how many instances there are
function appendMainEvent(x){
	var i;
	for (i = 0; i < x; i++){
		var holder = i + 1;
		var elementName = "Event" + holder;
		
		// Creating of Main event Div 
		var MainEvent = document.createElement("div");
		MainEvent.setAttribute("id", elementName);

		// Event Title Creation
		var eventTitle = document.createElement("h1");
		eventTitle.setAttribute("id", elementName + "Title");
		var node = document.createTextNode("MainEvent " + holder);
		eventTitle.appendChild(node);
		MainEvent.appendChild(eventTitle);

		// Creation of Form aspect
		var eventForm = document.createElement("form");

		// Event Name Creation
		var eventName = document.createElement("h2");
		eventName.appendChild(document.createTextNode("EventName: "));
		var eventNameInput = document.createElement("input");
		eventNameInput.setAttribute("placeholder", "Book of Moron")
		eventForm.appendChild(eventName);
		eventForm.appendChild(eventNameInput);

		// For now assume its under wordpress but make sure we can render it as a graphic
		var eventGraphic = document.createElement("h2");
		eventGraphic.appendChild(document.createTextNode("EventGraphic: "));
		var eventGraphicInput = document.createElement("input");
		eventGraphicInput.setAttribute("placeholder", "Image Graphic URL");
		eventForm.appendChild(eventGraphic);
		eventForm.appendChild(eventGraphicInput);

		// Event Dates Creation
		var eventDates = document.createElement("h2");
		eventDates.appendChild(document.createTextNode("Dates: "));
		var eventDatesInput = document.createElement("input");
		eventDatesInput.setAttribute("placeholder", "place ,'s between each date if multiple");
		eventForm.appendChild(eventDates);
		eventForm.appendChild(eventDatesInput);

		// Event Description
		var eventDescription = document.createElement("h2");
		eventDescription.appendChild(document.createTextNode("Description: "));
		var eventDescriptionInput = document.createElement("textarea");
		eventDescriptionInput.setAttribute("placeholder", "Description");
		eventForm.appendChild(eventDescription);
		eventForm.appendChild(eventDescriptionInput);	

		// Event Ticket
		var eventTicket = document.createElement("h2");
		eventTicket.appendChild(document.createTextNode("ticketLink: "));
		var eventTicketInput = document.createElement("input");
		eventTicketInput.setAttribute("placeholder", "Ticket link");

		eventForm.appendChild(eventTicket);
		eventForm.appendChild(eventTicketInput);

		MainEvent.appendChild(eventForm);

		// Clear button
		var clearButton = document.createElement("input");
		clearButton.setAttribute("type", "button");
		clearButton.setAttribute("value", "clearButton");
		clearButton.setAttribute("onclick", "clearEvent(); return false;");
		MainEvent.appendChild(clearButton);

		// Appending it to Main EventOutput
		var parent = document.getElementById("MainEventOutput")
		parent.appendChild(MainEvent);
	}
}

// x is how many instance there are
function appendSubBrandEvents(x){
	var i;
	for (i = 0; i < x; i++){
		var holder = i + 1;
		var elementName = "SubBrandEvent" + holder;

		// Creating of Main event Div 
		var SubBrandEvent = document.createElement("div");
		SubBrandEvent.setAttribute("id", elementName);

		// Event Title Creation
		var eventTitle = document.createElement("h1");
		eventTitle.setAttribute("id", elementName + "Title");
		var node = document.createTextNode("SubBrandEvent " + holder);
		eventTitle.appendChild(node);
		SubBrandEvent.appendChild(eventTitle);


		// Creation of Form aspect
		var eventForm = document.createElement("form");

		// Event Name Creation
		var eventName = document.createElement("h2");
		eventName.appendChild(document.createTextNode("EventName: "));
		var eventNameInput = document.createElement("input");
		eventNameInput.setAttribute("placeholder", "Book of Moron")
		eventForm.appendChild(eventName);
		eventForm.appendChild(eventNameInput);

		// Event Dates Creation
		var eventDates = document.createElement("h2");
		eventDates.appendChild(document.createTextNode("Dates: "));
		var eventDatesInput = document.createElement("input");
		eventDatesInput.setAttribute("placeholder", "place ,'s between each date if multiple");
		eventForm.appendChild(eventDates);
		eventForm.appendChild(eventDatesInput);


		// Event Ticket
		var eventTicket = document.createElement("h2");
		eventTicket.appendChild(document.createTextNode("eventLink: "));
		var eventTicketInput = document.createElement("input");
		eventTicketInput.setAttribute("placeholder", "Event link");
		eventForm.appendChild(eventTicket);
		eventForm.appendChild(eventTicketInput);

		SubBrandEvent.appendChild(eventForm);

		// Clear button
		var clearButton = document.createElement("input");
		clearButton.setAttribute("type", "button");
		clearButton.setAttribute("value", "clearButton");
		clearButton.setAttribute("onclick", "clearEvent(); return false;");
		SubBrandEvent.appendChild(clearButton);

		// Appending it to SubBrandOutput
		var parent = document.getElementById("SubBrandOutput")
		parent.appendChild(SubBrandEvent);
	}
}

// clear event need to recognize which id tag to remove
function clearEvent(){

}

function editEvent(){
	
}



function grabItems(){
	// appendMainEvent(2);
	appendSubBrandEvents(1);
}