const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const d = new Date();

function test(){
	var para = document.createElement("h1");
	var node = document.createTextNode("Lets Get Started");
	para.appendChild(node);
	var parent = document.getElementById("div1");
	var child = document.getElementById("header1");
	parent.replaceChild(para, child);
}

// x is the how many instances there are
function appendMainEvent(x){
	var i;
	var parent = document.getElementById("MainEventOutput");
	var newLine = document.createElement("br");
	for (i = 0; i < x; i++){
		var holder = i + 1;
		var elementName = "Event" + holder;
		
		// Creating of Main event Div 
		var MainEvent = document.createElement("div");
		MainEvent.setAttribute("id", elementName);

		// Event ID
		var eventID = elementName;

		// Event Title Creation
		var eventTitle = document.createElement("h1");
		eventTitle.setAttribute("id", eventID+ "Title");
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
		eventDatesInput.setAttribute("type", "date");
		// eventDatesInput.setAttribute("placeholder", "place ,'s between each date if multiple");
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
		eventForm.appendChild(newLine);
		MainEvent.appendChild(eventForm);

		// Clear button
		var clearButton = document.createElement("input");
		clearButton.setAttribute("type", "button");
		clearButton.setAttribute("id", eventID);
		clearButton.setAttribute("value", "clearButton");
		clearButton.setAttribute("onclick", "clearEvent(this.id); return false;");
		MainEvent.appendChild(clearButton);
		MainEvent.appendChild(newLine);

		// Appending it to Main EventOutput
		parent.appendChild(MainEvent);
	}
	var addNewEvent = document.createElement("input");
	addNewEvent.setAttribute("type", "button");
	addNewEvent.setAttribute("value", "add Another Event");
	addNewEvent.setAttribute("onclick", "createMainEvent(); return false;");
	parent.appendChild(addNewEvent);
}

// x is how many instance there are
function appendSubBrandEvents(x){
	var i;
	var parent = document.getElementById("SubBrandOutput");
	var newLine = document.createElement("br");
	for (i = 0; i < x; i++){
		var holder = i + 1;
		var elementName = "SubBrandEvent" + holder;

		// Creating of Main event Div 
		var SubBrandEvent = document.createElement("div");
		SubBrandEvent.setAttribute("id", elementName);

		// EventID
		var eventID = elementName;
		// Event Title Creation
		var eventTitle = document.createElement("h1");
		eventTitle.setAttribute("id", eventID + "Title");
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

		// Event Category Creation
		var eventCategory = document.createElement("h2");
		eventCategory.appendChild(document.createTextNode("Category: "));
		var eventCategoryInput = document.createElement("select");
		eventCategoryInput.setAttribute("name", "Categories");

		var option1 = document.createElement("option");
		option1.setAttribute('value', "SJSU@Hammer");
		option1.setAttribute('label', "SJSU@Hammer");
		var option2 = document.createElement("option");
		option2.setAttribute('value', "Hammer Speaks");
		option2.setAttribute('label', "Hammer Speaks");
		var option3 = document.createElement("option");
		option3.setAttribute('value', "Music w/o Borders");
		option3.setAttribute('label', "Music w/o Borders");
		var option4 = document.createElement("option");
		option4.setAttribute('value', "Holidays@Hammer");
		option4.setAttribute('label', "Holidays@Hammer");
		var option5 = document.createElement("option");
		option5.setAttribute('value', "Art-Tech");
		option5.setAttribute('label', "Art-Tech");
		var option6 = document.createElement("option");
		option6.setAttribute('value', "Also@Hammer");
		option6.setAttribute('label', "Also@Hammer");
		var option7 = document.createElement("option");
		option7.setAttribute('value', "Lights&Action");
		option7.setAttribute('label', "Lights&Action");

		eventCategoryInput.appendChild(option1);
		eventCategoryInput.appendChild(option2);
		eventCategoryInput.appendChild(option3);
		eventCategoryInput.appendChild(option4);
		eventCategoryInput.appendChild(option5);
		eventCategoryInput.appendChild(option6);
		eventCategoryInput.appendChild(option7);

		eventForm.appendChild(eventCategory);
		eventForm.appendChild(eventCategoryInput);

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
		SubBrandEvent.appendChild(newLine); // Need to look into this not properly working

		// Clear button
		var clearButton = document.createElement("input");
		clearButton.setAttribute("type", "button");
		clearButton.setAttribute("id", eventID);
		clearButton.setAttribute("value", "clearButton");
		clearButton.setAttribute("onclick", "clearEvent(this.id)");
		SubBrandEvent.appendChild(clearButton);
		SubBrandEvent.appendChild(newLine);
		SubBrandEvent.appendChild(newLine);
		// Appending it to SubBrandOutput
		parent.appendChild(SubBrandEvent);
	}
	var addNewSubEvent = document.createElement("input");
	addNewSubEvent.setAttribute("type", "button");
	addNewSubEvent.setAttribute("value", "add Another Event");
	addNewSubEvent.setAttribute("onclick", "createSubEvent(); return false;");
	parent.appendChild(addNewSubEvent);
}

// clear event need to recognize which id tag to remove
function clearEvent(event){
	// window.alert("Clearing Main Event Button does not currently work, try again later");
	if (even)
	var eventID = event;
	var child = document.getElementById(eventID);
	child.parentNode.removeChild(child);
}

function createMainEvent( event){
	window.alert("Making New Event Button does not currently work try again later");
}
function createSubEvent(){
	window.alert("Making New sub Event Button does not currently work try again later");
}

// Enable users to edit a specific event
function editEvent(){
	
}

// Convert Date 
function conversionOfDate(date){
	// window.alert(Object.prototype.toString.call(date));
	var temp = new Date(date);
	var convertedDate = monthNames[temp.getMonth()];
	return convertedDate
}

// Grab the Information for Main Events and Sub Brand events
function grabItems(){
	var MainEventsCount = document.getElementById('numEvents').value;
	var SubEventsCount = document.getElementById('numSub').value;
	var NewsletterDate = conversionOfDate(document.getElementById('newsletterDate').value);
	// localStorage.setItem('NewsletterDate', JSON.stringify(NewsletterDate));
	
	var parent = document.getElementById("HeaderInformation");
	var node = document.createElement("h1");
	node.appendChild(document.createTextNode(NewsletterDate));
	parent.appendChild(node);

	if (MainEventsCount != 0 && SubEventsCount != 0){
		appendMainEvent(MainEventsCount);
		appendSubBrandEvents(SubEventsCount);
		clearOldFields();

		// Starting Go to Create the Applause Generator.js
		var parent = document.getElementById("SubmitItems");
		var child = document.createElement("input");
		child.setAttribute("type", "button");
		child.setAttribute("value", "Make Applause");
		child.setAttribute("onclick", 'createApplause(); return false;');
		parent.appendChild(child);
	}
	else{
		window.alert("You have an empty or 0 value for SubBrand Events or Events");
	}
}

function clearOldFields(){
	var parent = document.getElementById("mainBody");
	parent.removeChild(document.getElementById("Starting"));
}


function renderInformation(){

}

module.exports = class ApplauseGen {
	constructor(width){
		this.width = width;
	}
	area(){
		return this.width ** 2;
	}
}





