
/**
  * This Google Script requires the following triggers: onFormSubmit() - From Spreadsheet -> on Submit
  * What this Google Script does is populate the spreadsheet from a given form that is linked to this, from there it will send the information over and make a ticket object. That ticket is then used to populate both the master and corresponding sheet in addition to generating email to the client stating that their request has been taking and that someone would be assigned to it soon. 
  * IMPORTANT: make sure there's only one person with the trigger since it would do it more than once based on the number of     
    triggers
  * Additionally, email, templates and ID's need to be filled out for your own drive and that all of these files including this form and the TicketSpread need to be in the same google drive folder. 
  * Look at the readme or email me if you have any suggestions or questions. 

*/
var marketingEmail = "Insert Email Here";
var directorEmail = "Insert Director Email Here";

var BLANK_TEMPLATE_ID = "This is the blank document on google drive";
var TICKET_SPREADSHEET_ID = "This is the ticket spreadsheet id on the google drive";

// Ticket Folder ID'S
var WEB_TICKETS_FOLDER_ID ="Web Folder";
var DIGITAL_DATABASE_TICKETS_FOLDER_ID = "DD Folder"; 
var EDITORIAL_TICKETS_FOLDER_ID = "EDFolder";
var GRAPHIC_DESIGN_TICKETS_FOLDER_ID = "GraphicD Folder";
var MEDIA_TICKETS_FOLDER_ID = "MediaFolder";

// MasterSheet Information
var MasterSheetID = TICKET_SPREADSHEET_ID;
var MasterSheetLink = "https://docs.google.com/spreadsheets/d/" + MasterSheetID + "/edit?usp=sharing";
var MasterSheet = SpreadsheetApp.openById(TICKET_SPREADSHEET_ID).getSheetByName('Master Sheet');

// Web Information
// WSheetID is the id for the sheet from the URL of the spreadsheet
var WSheetID = "WebsHEETid";
var WSheetLink = "https://docs.google.com/spreadsheets/d/" + MasterSheetID + "/edit#gid=" + WSheetID;
var WSheet = SpreadsheetApp.openById(TICKET_SPREADSHEET_ID).getSheetByName('Web');

// Editor & Content Information
// EdSheetID is the id for the sheet from the URL of the spreadsheet
var EdSheetID = "ed";
var EdSheetLink = "https://docs.google.com/spreadsheets/d/" + MasterSheetID + "/edit#gid=" + EdSheetID;
var EdSheet = SpreadsheetApp.openById(TICKET_SPREADSHEET_ID).getSheetByName('Editor and Content');

// Graphic Design Information
// GSheetID is the id for the sheet from the URL of the spreadsheet
var GSheetID = "gs";
var GSheetLink = "https://docs.google.com/spreadsheets/d/" + MasterSheetID + "/edit#gid=" + GSheetID;
var GSheet = SpreadsheetApp.openById(TICKET_SPREADSHEET_ID).getSheetByName('Graphic Design');

// Media Information
// MedSheetID is the id for the sheet from the URL of the spreadsheet
var MedSheetID = "ms";
var MedSheetLink = "https://docs.google.com/spreadsheets/d/" + MasterSheetID + "/edit#gid=" + MedSheetID;
var MedSheet = SpreadsheetApp.openById(TICKET_SPREADSHEET_ID).getSheetByName('Media');
                                      
// Digital and Database Information
// DDSheetID is the id for the sheet from the URL of the spreadsheet
var DDSheetID = "DD";
var DDSheetLink = "https://docs.google.com/spreadsheets/d/" + MasterSheetID + "/edit#gid=" + DDSheetID;
var DDSheet = SpreadsheetApp.openById(TICKET_SPREADSHEET_ID).getSheetByName('Digital and Database');

// Global Ticket Name
var ticketName = "";

function  doGet(e) { 
  return HtmlService.createTemplateFromFile('index').evaluate(); 
}


/**
*  Runs upon form submission. 
*  Duplicates a blank Google Document into the corresponding folder (Web, Graphic Design, Media, Editorial, Marketing Projects) 
*  depending on the "Project Marketing Focus" and populates the ticket information onto the Google Document.
*  Parameter(s) - Event Object e 
*  
*/
function onFormSubmit(e) {
  // Populate form submission information to ticketObj{}
  var ticketObj = formResponseToObject(e);
  // Populates ticket spreadsheet with ticketObj information
  populateSpreadsheet(ticketObj);
  // Notifys client and marketingEmail that the ticket has been recieved
  sendEmailNotification(ticketObj);
}

/*
* Helper method for onFormSubmit(e). 1) Populates a Javascript Object with the information from Event Object e (form response) with 
* the form response questions as the object properties and the form response answers as the object property values. 2) Creates
* a Google Document with the populated Javascript Object information 3) Adds the Google Doc shareablelink to Javascript Object values.
* Parameter(s) - Event Object e 
* Return: Object ticketObj - Javascript Object with form response form information and Google Doc shareable link
*/
function formResponseToObject(e){
  var ticketObj = {};
  var itemResponses = e.response.getItemResponses(); 
  
  ticketObj["Email Address"] = e.response.getRespondentEmail();
  for(var i = 0; i < itemResponses.length; i++){
    var question = itemResponses[i].getItem().getTitle();
    var response = itemResponses[i].getResponse();
    if(question.indexOf("Files to attach") > -1){
      response = addOpenByIDGooglePrefix(response);
    }
    ticketObj[question] = response;
  }
  
  var ticketDocId = createTicketDocument(ticketObj);
  ticketObj["Ticket Shortlink"] = ticketDocId;
  Logger.log(ticketObj["Name of Requester"]);
  return ticketObj;
}

/*
* Helper method for formResponseToObject(e). Creates Google Document with Ticket Object recieved from formResponseToObject(e).
* Parameter(s): Object ticketObj - Javascript Object with form response form information and Google Doc shareable link
* Return: String ticketLink - URL to Google Document with ticket information
*/
function createTicketDocument(ticketObj){
  var ticketDoc;
  var ticketNumber = SpreadsheetApp.openById(TICKET_SPREADSHEET_ID).getSheetByName("Master Sheet").getLastRow(); 
  Logger.log(ticketNumber);
  switch(ticketObj["Project Marketing Focus"]){
    case "Web":
      ticketDoc = createDuplicateDocument(BLANK_TEMPLATE_ID, WEB_TICKETS_FOLDER_ID, "Ticket #" + ticketNumber + " (Web)");
      break;
    case "Graphic Design":
      ticketDoc = createDuplicateDocument(BLANK_TEMPLATE_ID, GRAPHIC_DESIGN_TICKETS_FOLDER_ID, "Ticket #" + ticketNumber + " (Graphic Design)");
      break;
    case "Media (Photo/Video)":
     ticketDoc = createDuplicateDocument(BLANK_TEMPLATE_ID, MEDIA_TICKETS_FOLDER_ID, "Ticket #" + ticketNumber + " (Media)");
      break;
    case "Editorial and Content Development":
     ticketDoc = createDuplicateDocument(BLANK_TEMPLATE_ID, EDITORIAL_TICKETS_FOLDER_ID, "Ticket #" + ticketNumber + " (Editorial)");
      break;
    case "Digital and Database Marketing Projects":
      ticketDoc = createDuplicateDocument(BLANK_TEMPLATE_ID, DIGITAL_DATABASE_TICKETS_FOLDER_ID, "Ticket #" + ticketNumber + "( Marketing Projects)");
      break;
  }
  
  var table = ticketDoc.getBody().appendTable();
  for(var question in ticketObj){
    var tr = table.appendTableRow();
    if(question.indexOf("Files to attach") > -1){
      var td1 = tr.appendTableCell(question);
      var td2 = tr.appendTableCell();
      var idsArr = ticketObj[question].split(",");
      for(var i = 0; i < idsArr.length; i++){
        td2.appendListItem(idsArr[i]).setLinkUrl(idsArr[i]);
      }
    } else {
      var td1 = tr.appendTableCell(question);
      var td2 = tr.appendTableCell(ticketObj[question]);
    }
  }
  return "https://drive.google.com/open?id=" + ticketDoc.getId();
}

/*
* Helper function for onFormSubmit(e). Populates Ticket Spreadsheet with information from Ticket Object recieved from formResponseToObject(e).
* In addition to the Master Sheet population, it also populates the category sheet.
* Parameter(s) - Javascript Object with form response form information and Google Doc shareable link
*/
function populateSpreadsheet(ticketObj){
  var lastRow = MasterSheet.getLastRow() + 1;
  // Category is needed for fliter check
  var category = "";
  
  // Master Population
  for(var i = 1; i <= 8; i++){
    switch(i){
      case 1:
        var emailAdressCell = MasterSheet.getRange(lastRow, i);
        emailAdressCell.setValue(ticketObj["Email Address"]);
        break;
      case 2:
        var requestorNameCell = MasterSheet.getRange(lastRow, i);
        requestorNameCell.setValue(ticketObj["Name of Requester"]);
        break;
      case 3:
        var phoneNumberCell = MasterSheet.getRange(lastRow, i);
        phoneNumberCell.setValue(ticketObj["Phone Number"]);
        break;
      case 4:
        var projectDeadlineCell = MasterSheet.getRange(lastRow, i);
        projectDeadlineCell.setValue(ticketObj["Project Deadline"]);
        break;
      case 5:
        var projectFocusCell = MasterSheet.getRange(lastRow, i);
        projectFocusCell.setValue(ticketObj["Project Marketing Focus"]);
        category = projectFocusCell.getValue(); 
        break;
      case 6:
        var projectDescriptionCell = MasterSheet.getRange(lastRow, i);
        projectDescriptionCell.setValue(ticketObj["Project Description"]);
        break;
      case 7:
        var ticketShortlinkCell = MasterSheet.getRange(lastRow, i);
        var ticketShortlink = ticketObj["Ticket Shortlink"];
        var displayName = "View Ticket #" + (lastRow -1 ); 
        ticketName = displayName;
        ticketShortlinkCell.setFormula("=HYPERLINK(\"" + ticketShortlink + "\";\"" + displayName + "\")");
        break;
      case 8:
        var statusCell = MasterSheet.getRange(lastRow, i);
        statusCell.setValue("New");
        break;
    }
  }
  
  // Category Population
  var location;
  switch(category){
    case "Web":
      location = WSheet;
      break;
    case "Editorial and Content Development":
      location = EdSheet;
      break;
    case "Graphic Design":
      location = GSheet;
      break;
    case "Media (Photo/Video)":
      location = MedSheet;
      break;
    case "Digital and Database Marketing Projects":
      location = DDSheet;
      break;
  }
  
  // Logging information of applied category URL
  Logger.log("Location = specified sheet 1st check: " + location.getFormUrl() ); 
  
  // populating corresonding sheet
  var lastRowCategory = location.getLastRow() + 1; 
  for(var i = 1; i <= 8; i++){
    
    switch(i){
      case 1:
        var emailAdressCell = location.getRange(lastRowCategory, i);
        emailAdressCell.setValue(ticketObj["Email Address"]);
        break;
      case 2:
        var requestorNameCell = location.getRange(lastRowCategory, i);
        requestorNameCell.setValue(ticketObj["Name of Requester"]);
        break;
      case 3:
        var phoneNumberCell = location.getRange(lastRowCategory, i);
        phoneNumberCell.setValue(ticketObj["Phone Number"]);
        break;
      case 4:
        var projectDeadlineCell = location.getRange(lastRowCategory, i);
        projectDeadlineCell.setValue(ticketObj["Project Deadline"]);
        break;
      case 5:
        var projectFocusCell = location.getRange(lastRowCategory, i);
        projectFocusCell.setValue(ticketObj["Project Marketing Focus"]);
        break;
      case 6:
        var projectDescriptionCell = location.getRange(lastRowCategory, i);
        projectDescriptionCell.setValue(ticketObj["Project Description"]);
        break;
      case 7:
        var ticketShortlinkCell = location.getRange(lastRowCategory, i);
        var ticketShortlink = ticketObj["Ticket Shortlink"];
        var displayName = "View Ticket #" + (lastRow -1 ); // Properly display index it's in
        ticketName = displayName;
        ticketShortlinkCell.setFormula("=HYPERLINK(\"" + ticketShortlink + "\";\"" + displayName + "\")");
        break;
      case 8:
        var statusCell = location.getRange(lastRowCategory, i);
        statusCell.setValue("New");
        break;
    }
  }
}
/*
* Helper method for onFormSubmit(e). Sends email notification to client and marketingEmail that the ticket has been recieved
* Parameter(s) - Event Object e
*/
function sendEmailNotification(ticketObj){
  var lastRow = MasterSheet.getLastRow() -1 ;
  
  // Sends confirmation email to client
  var clientName = ticketObj["Name of Requester"];
  var clientEmail = ticketObj["Email Address"];
  MailApp.sendEmail(clientEmail,
                    "Help Desk New Ticket #" + (lastRow),
                    clientName + ",\n\n" +
                    "Thank you for your submission.\n" +
                    "Your ticket has been recorded. This is your confirmation email.\n\n" +
                    "Your ticket will be assigned to one of our team members and you will be contacted soon via your SJSU email regarding updates.\n\n" +
                      "Here is your Ticket Link: " + ticketObj["Ticket Shortlink"] + "\n\n" + 
                    "-H&A Marketing Team",
                    {name:"H&A Help Desk", replyTo: marketingEmail});
  
  // Finds email target
  var id = "";
  var body = "A new ticket has been submitted through the Help Desk Ticketing System.\n\nYou can view this at " + MasterSheetLink + "\n\n"; 
  var projectFocus = ticketObj["Project Marketing Focus"];
  if(projectFocus == "Web"){
    id += "Website";
  }else if(projectFocus == "Graphic Design"){
    id += "Graphic";
  }else if(projectFocus == "Media (Photo/Video)"){
    id += "Photo+Video";
  }else if(projectFocus == "Editorial and Content Development"){
    id += "Editing";
  }else if(projectFocus == "Digital and Database Marketing Projects"){
    MailApp.sendEmail(directorEmail, 
                      "Help Desk New Ticket #" + lastRow,
                      body + "\n\n" + "-H&A Marketing Team",
                      {name:"H&A Help Desk"});
  }
  
  // Sends confirmation email to H&A Marketing Team shared inbox
  MailApp.sendEmail("ha-marketing" + "+" + id + "@sjsu.edu",
                    "Help Desk New Ticket #" + (lastRow),
                    body + "\n\n" + "-H&A Marketing Team",
                    {name:"H&A Help Desk"});       
  
}

/*
*  Helper function for onFormSubmit(e). Takes IDs from "Files to attatch" question and adds the open by ID url prefix to each one.
*  Parameter(s): Array sourceIds - IDs to files on Google Drive
*  Return: String of all IDs with Google's open by ID url prefix concatenated
*/
function addOpenByIDGooglePrefix(sourceIds){
  // Adds Google Open By ID Prefix to each ID
  for(var i = 0; i < sourceIds.length; i++){
    sourceIds[i] = "https://drive.google.com/open?id=" + sourceIds[i];
  }
  return sourceIds.join();
}

/**
 * Duplicates a Google Apps doc
 * Parameter(s): sourceId - ID of document to be duplicated ID
 *               targetFolder - ID of folder where the document is going to be placed
 *               name - Name of newly copied document
 * @return a new document with a given name from the orignal
 */
function createDuplicateDocument(sourceId, targetFolder, name) {
    var source = DriveApp.getFileById(sourceId);
    var targetFolder = DriveApp.getFolderById(targetFolder);
    var newFile = source.makeCopy(name, targetFolder);
    return DocumentApp.openById(newFile.getId());
}