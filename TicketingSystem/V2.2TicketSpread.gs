/**
  * This Google Script requires the following triggers: onEdit() - From Spreadsheet -> on Edit, onOpen() - onOpen -> onChange/onOpen you can choose which one :D
  * Using Google Scripting Language, this script aims to provide greater management and team execution efficiency by filtering 
    information into their respective categories. Although every ticket is seen in the master sheet, there are 5 other individual sheets that filters data into those respective sheet. EX: web sheet will only see Web ticket requests. 
  * Additionally, the script allows for bidirectional functionality where if you edit a task assignment/status in the one of the 
    category sheets, it will also edit in the master sheet too and vice versa.  
  * Red Markers: after changing a task assignment to assigned, it will fill in the person box red until someone inputs their 
    name into it. 
  * Emails: Upon assignment, it will email the client an email saying employee x has taken on the task, employee's x email and a 
    reciept of their ticket. It will also email Employee x the ticket reciept, a statement saying that they've taken on the task and a link to this spreadsheet. Upon completion, it will send an email to both the client and employee that the task has been finished and they can respond to each other in that same email. 
  * IMPORTANT: make sure there's only one person with the trigger since it would do it more than once based on the number of     
    triggers
  * Additionally, email, templates and ID's need to be filled out for your own drive and that all of these files including this form and the TicketSpread need to be in the same google drive folder. 
  * Look at the readme or just email me if you have any questions or suggestions. 

*/

var colorWhite = "#FFFFFF"; 
var colorGrey = "#CCCCCC";
var colorRed = "#F00";
var sheet= SpreadsheetApp.getActiveSheet();
var marketingEmail = "Dump Email";
var directorEmail = "Director Email";
var statusColumnIndex = getColIndexByName("Status", sheet); // Column index for "Status"
var personColumnIndex = getColIndexByName("Assigned", sheet); // Column Index for "Assigned Person"

var sheetID = "Main Ticket Sheet";

var TICKET_SPREADSHEET_ID = "Main Ticket Sheet";
var sheetLink = "https://docs.google.com/spreadsheets/d/" + sheetID + "/edit?usp=sharing";

// MasterSheet Information
var MasterSheetID = TICKET_SPREADSHEET_ID;
var MasterSheetLink = "https://docs.google.com/spreadsheets/d/" + MasterSheetID + "/edit?usp=sharing";
var MasterSheet = SpreadsheetApp.openById(TICKET_SPREADSHEET_ID).getSheetByName('Master Sheet');
//var MasterSheet = SpreadsheetApp.openById(TICKET_SPREADSHEET_ID).getActiveSheet();

// Web Information
// WSheetID is the id for the sheet from the URL of the spreadsheet
var WSheetID = "Web";
var WSheetLink = "https://docs.google.com/spreadsheets/d/" + MasterSheetID + "/edit#gid=" + WSheetID;
var WSheet = SpreadsheetApp.openById(TICKET_SPREADSHEET_ID).getSheetByName('Web');

// Editor & Content Informationgb
// EdSheetID is the id for the sheet from the URL of the spreadsheet
var EdSheetID = "Ed";
var EdSheetLink = "https://docs.google.com/spreadsheets/d/" + MasterSheetID + "/edit#gid=" + EdSheetID;
var EdSheet = SpreadsheetApp.openById(TICKET_SPREADSHEET_ID).getSheetByName('Editor and Content');

// Graphic Design Information
// GSheetID is the id for the sheet from the URL of the spreadsheet
var GSheetID = "Graphic";
var GSheetLink = "https://docs.google.com/spreadsheets/d/" + MasterSheetID + "/edit#gid=" + GSheetID;
var GSheet = SpreadsheetApp.openById(TICKET_SPREADSHEET_ID).getSheetByName('Graphic Design');

// Media Information
// MedSheetID is the id for the sheet from the URL of the spreadsheet
var MedSheetID = "Media";
var MedSheetLink = "https://docs.google.com/spreadsheets/d/" + MasterSheetID + "/edit#gid=" + MedSheetID;
var MedSheet = SpreadsheetApp.openById(TICKET_SPREADSHEET_ID).getSheetByName('Media');
                                      
// Digital and Database Information
// DDSheetID is the id for the sheet from the URL of the spreadsheet
var DDSheetID = "DD";
var DDSheetLink = "https://docs.google.com/spreadsheets/d/" + MasterSheetID + "/edit#gid=" + DDSheetID;
var DDSheet = SpreadsheetApp.openById(TICKET_SPREADSHEET_ID).getSheetByName('Digital and Database');

/*
* @Override
* Runs once it's been opened/ Changed to every hour
* Parameter(s) - Event Object e is the spreadsheet being opened given that they have permission to edit
*/
function onOpen(e){
  var TODAY = new Date();
  var daysSinceColumn = getColIndexByName("Days Till", sheet);
  var dateColumn = getColIndexByName("Project Deadline", sheet);
  var focusColumn = getColIndexByName("Project Marketing Focus", sheet);
  var ticketColumn = getColIndexByName("Ticket Shortlink", sheet);
  for (var i = 1; i < sheet.getLastRow() + 1; i++){ // need the + 1 to get include the last row
    if (sheet.getRange(i, statusColumnIndex).getValue() == "Assigned" || sheet.getRange(i, statusColumnIndex).getValue() == "New"){
     
      var comparedDate = sheet.getRange(i,dateColumn).getValue();
      var difference = Math.floor((comparedDate - TODAY)/(1000 * 60 * 60 * 24)) + 1;
   
      var tixChecker = sheet.getRange(i, ticketColumn).getValue();
      var otherShet = getOtherSheet(sheet.getRange(i, focusColumn).getValue());
      var assignedVal; 
      
      if (difference < 0) {
        assignedVal = "Past Deadline!";
        sheet.getRange(i, daysSinceColumn).setValue(assignedVal);
      }
      else if (difference == 0) {
        assignedVal = "DEADLINE TODAY!";
        sheet.getRange(i, daysSinceColumn).setValue(assignedVal);
      }
      else {
        assignedVal = difference.toString();
        sheet.getRange(i, daysSinceColumn).setValue(assignedVal); 
      }
      Logger.log("tixChecker if : " + tixChecker);
      Logger.log("assignedVal if : " + assignedVal);
      setTixInformation(tixChecker, otherShet, assignedVal, daysSinceColumn);
    }
    else if (sheet.getRange(i, statusColumnIndex).getValue() == "Resolved") {
      Logger.log("tixChecker else if : " + tixChecker);
      Logger.log("assignedVal else if: " + assignedVal);
      var tixChecker = sheet.getRange(i, ticketColumn).getValue();
      var otherShet = getOtherSheet(sheet.getRange(i, focusColumn).getValue());
      sheet.getRange(i,daysSinceColumn).clearContent();
      setTixInformation(tixChecker, otherShet, " ", daysSinceColumn); 
    }
    else Logger.log("Didn't get Anything!");
  }
}

/*
* Determines what type of corresponding sheet to use
*/
function getOtherSheet(otherShet){
      switch(otherShet){
      case "Web":
        return WSheet; 
        break;
      case "Graphic Design":
        return GSheet;
        break;
      case "Media (Photo/Video)":
        return MedSheet;
        break;
      case "Editorial and Content Development":
        return EdSheet;
        break;
      case "Digital and Database Marketing Projects":
        return DDSheet; 
        break;
      default:
        return GSheet;
        Logger.log("Didn't get anything!, or you just didn't make the right sheet :P");
        break;
    }
}
/*
* @Override
*  Runs when an edit is made to a cell
*  Parameter(s) - Event Object e is the cell that was edited
*/
function onEdit(e) {
   // If edit was made to Status and is now Assigned => Turn the "Assigned" cell to the right of it red until it is filled
  changeAssignedCellBackground(e);
  // If edit was made to Status as Assigned or In Progress => Give assigned employee/client notification email
  assignedEmailStatusUpdate(e); 
  // If edit was made to Status and Resolved => Darken that row 
  darkenResolvedTickets(e);
  // If edit was made to Status and anything but Resolved => Whiten that row 
  resetStatusColor(e);
}

/*
* Helper method for onEdit(e). When ticket status is changed to "Assigned", the assigned cell to the right will be changed to Red.
* Parameter(s) - Event Object e is the cell that was edited
* 8 is status column, 9 is Assigned Column
*/
function changeAssignedCellBackground(e){
  // If the edited cell was in the status column
  Logger.log("e.range.getColumn(): " + e.range.getColumn()); // Problem with this
  Logger.log("StatusColumn Index: " + statusColumnIndex);
  Logger.log("personColumn Index: " + personColumnIndex);
  Logger.log("e.range.getValue() " + e.range.getValue());
  
  if(e.range.getColumn() == statusColumnIndex && e.range.getValue() == "Assigned"){
      sheet.getRange(e.range.getRow(), getColIndexByName("Assigned", sheet)).setBackground(colorRed); // Turns "Assigned" cell to the right 
      updateCorrespondingSheet(e, "Assigned", 8);
  }
  else if (e.range.getColumn() == statusColumnIndex){
    // Just dynamically check for the others
    Logger.log("Updating Status");
    Logger.log(e.range.getValue());
    updateCorrespondingSheet(e,e.range.getValue(),8 );
  }
  // If it lands in the person column, then we're updating person!
  else if (e.range.getColumn() == personColumnIndex){
    Logger.log("Updating person");
    sheet.getRange(e.range.getRow(),1,1, getColIndexByName("Assigned", sheet)).setBackground(colorWhite);
    updateCorrespondingSheet(e,e.range.getValue(), 9);
  }
  else{
    Logger.log("Something broken in change assigned Cell Background");}
  
  
}
/*
* Helper method for changeAssignedCellBackground(e).
* Will find active spreadsheet and update to the other spreadsheet accordingly
* Param(e) - Event Object e which is the cell that was edited
* Param(assignedValue) - The value that's going to be inputed into the cell, this value is from the active sheet that was changed
* Param(colNum) - The column number in which the assigned value belongs (changes between status and person index)
*/
function updateCorrespondingSheet(e, assignedValue, colNum){
  var name = sheet.getName(); 
  // doing master sheet -> corresponding sheet
  if (name.equals("Master Sheet")){
    Logger.log("Master Sheet Recieved!");
    
    // Finding Category within Master Sheet to match
    var nameRow = e.range.getRow();
    var range = sheet.getRange(nameRow, getColIndexByName("Project Marketing Focus", sheet));
    var intersection = range.getValue();

    // Ticket Information from Master to check 
    var tixRange = sheet.getRange(nameRow, getColIndexByName("Ticket Shortlink", sheet));    
    var tixChecker = tixRange.getValues();
    
    switch(intersection){
      case "Web":
        Logger.log("WEB Sheet Recieved!");
    
        if (colNum == statusColumnIndex || colNum == personColumnIndex) setTixInformation(tixChecker, WSheet, assignedValue, colNum);
        else Logger.log("Problem with Assignment");
        break;
      case "Graphic Design":
        Logger.log("Graphic Sheet Recieved!");
        
        if (colNum == statusColumnIndex || colNum == personColumnIndex) setTixInformation(tixChecker, GSheet, assignedValue, colNum);
        else Logger.log("Problem with Assignment");
        break;
      case "Media (Photo/Video)":
        Logger.log("Media Sheet Recieved!");
 
        if (colNum == statusColumnIndex || colNum == personColumnIndex) setTixInformation(tixChecker, MedSheet, assignedValue, colNum);
        else Logger.log("Problem with Assignment");
        break;
      case "Editorial and Content Development":
        Logger.log("Ed Sheet Recieved!");
   
        if (colNum == statusColumnIndex || colNum == personColumnIndex) setTixInformation(tixChecker, EdSheet, assignedValue, colNum);
        else Logger.log("Problem with Assignment");
        break;
      case "Digital and Database Marketing Projects":
        Logger.log("Db Sheet Recieved!");
  
        if (colNum == statusColumnIndex || colNum == personColumnIndex) setTixInformation(tixChecker, DDSheet, assignedValue, colNum);
        else Logger.log("Problem with Assignment");      
        break;
      default:
        Logger.log("Didn't get anything!, or you just didn't make the right sheet :P");
        break;
    }
  }
  else{
    // Finding Category within Master Sheet to match
    Logger.log("Not doing Master");
    var nameRow = e.range.getRow();
    var range = sheet.getRange(nameRow, getColIndexByName("Project Marketing Focus", sheet));
    var intersection = range.getValue();

    // Ticket Information from Master to check 
    var tixRange = sheet.getRange(nameRow, getColIndexByName("Ticket Shortlink", sheet));    
    var tixChecker = tixRange.getValues();
    
    if (colNum == statusColumnIndex || colNum == personColumnIndex) setTixInformation(tixChecker, MasterSheet, assignedValue, colNum);
    else Logger.log("Problem with Assignment");
   
  }
        
}

/*
* Helper method for getTixInformation.
* Sets the the status field, NOTE: Has not been implemented to do from Sheet -> Master
* Column Number for Status is 8, Assigned to number is 9
* Param(tixChecker): This is the ticket information that is common between both tables, 
* Param(SheetNum): The sheet number in which we add from the master 
* Param(assignedVal): Can represent Assigned, New, or Done in STATUS, OR represent a Person
* Param(colNum): The column of the assignedValue
*/
function setTixInformation(tixChecker, SheetNum, assignedVal, colNum){
  // Number of Rows in corresponding SHEET
  var data = SheetNum.getDataRange().getValues();
  var ticketColumn = getColIndexByName("Ticket Shortlink", sheet);
  // For debug purposes
  //Logger.log("Getting Matches to: " + tixChecker );
  //Logger.log("Other Sheet: " + SheetNum.getName());
  //Logger.log("assignedVal: " + assignedVal);
  //Logger.log("colNum: " + colNum);
  
  for (var i = 1; i < data.length; i++){
    if (data[i][ticketColumn-1] == (tixChecker)){ 
      Logger.log("Assigned Value: " + assignedVal);
      SheetNum.getRange(i+1, colNum).setValue(assignedVal); 
      Logger.log("SheetNum: " + SheetNum);
      
      // Below is just setting the colors for the different assigned values
      if(assignedVal.equals("Resolved")) {
        SheetNum.getRange(i+1,1,1, colNum + 2).setBackground(colorGrey);
      }
      else if (assignedVal.equals("New")) SheetNum.getRange(i+1, 1,1,colNum +2).setBackground(colorWhite);
      else if (assignedVal.equals("Assigned")) {
        SheetNum.getRange(i+1, 1,1,colNum+1).setBackground(colorWhite);     
        SheetNum.getRange(i+1,colNum+1).setBackground(colorRed);
      }else SheetNum.getRange(i+1,colNum).setBackground(colorWhite);
      
      return;
    }
  }
}

/*
* Helper method for onEdit(e). When ticket becomes assigned to an employee,this function will send email notifications to the client and the employee
* Parameter(e) - Event Object e is the cell that was edited
*/
function assignedEmailStatusUpdate(e) {   
  var assignedColumnIndex = getColIndexByName("Assigned", sheet); // Column index for "Assigned"
  // If edited cell was in "Assigned" column
  if(e.range.getColumn() == assignedColumnIndex) {    
    var employeeDataSheet = SpreadsheetApp.openById(sheetID).getSheetByName("Employee Data"); // Employee Data Sheet
    
    // used to get information in sheet of selected row 
    var row = sheet.getActiveRange().getRowIndex();
    var client = sheet.getRange(row, getColIndexByName("Name of Requestor", sheet)).getValue();
    var clientEmail = sheet.getRange(row, getColIndexByName("Email Address", sheet)).getValue(); 
    var assignedEmployee = sheet.getRange(row, getColIndexByName("Assigned", sheet)).getValue();
    var assignedEmail = getEmployeeEmail(assignedEmployee);
    var projectFocus = sheet.getRange(row, getColIndexByName("Project Marketing Focus", sheet)).getValue();
    var ticketLink = sheet.getRange(row, getColIndexByName("Ticket Shortlink", sheet));
    
    Logger.log("Sheet Name: " + sheet.getName());
    Logger.log("TicketLink: " + ticketLink.getValue());
    
    var statusColumnIndex = getColIndexByName("Status", sheet); // Column index for "Status"
    var issue = sheet.getRange(row, getColIndexByName("Project Description", sheet)).getValue();  
   
    // removing the View from TicketName
    var ticketName = ticketLink.getValue();
    ticketName = ticketName.substring(4,ticketName.length)
    
    sheet.getRange(row, assignedColumnIndex).setBackground("#FFFFFF");
    
    
    // This part gets the information from the ticket and in parses out the unnecessary information
    // Inefficient method and needs to be improved - J
    var arrayHolder = ticketLink.getFormula().split(",");
    var replacement = arrayHolder[0].toString().replace('=HYPERLINK("', "").slice(0,-1);

    // Notify employee that he/she has been assigned to a ticket
    MailApp.sendEmail(assignedEmail,
                      "HA Marketing Help Desk" + ticketName,
                      "You have been assigned to a ticket via the H&A Help Desk ticketing system\n"+
                      "Client: " + client + " (" + clientEmail + ")\n"+
                      "Issue Description: " + issue + "\n"+
                      "Ticket Request Information: " + replacement + "\n" + 
                      "You can view this at: " + sheetLink +"\n"+
                      "Replying to this email will go to: " + client + "\n\n" +
                      "-H&A Marketing Team",
                      {name:"H&A Help Desk", replyTo: clientEmail});  

    Logger.log("Able to send assigned email");
    // Notify client that ticket has been assigned to an employee
    MailApp.sendEmail(clientEmail,
                      "HA Marketing Help Desk" + ticketName,
                      client + ",\n\n" +
                      "The status of your ticket is currently: Assigned\n"+ 
                      "You are assigned to: " + assignedEmployee +", "+assignedEmail +"\n"+
                      "Issue Description: " + issue +"\n"+
                      "Ticket Request Information: " + replacement+ "\n" + 
                      "Replying to this email will go to: " + assignedEmail+"\n\n"+
                      "-H&A Marketing Team",
                      {name:"H&A Help Desk", replyTo: assignedEmail});

    Logger.log("Able to send Client email");
     var response = SpreadsheetApp.getUi().alert(
        'Notification',
         assignedEmployee + ' has recieved a confirmation email that he/she has been assigned to this ticket and ' + 
         client + ' has been notified that their ticket has been assigned and will be resolved shortly',
         SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
    Logger.log("Able to send Response");
    
  } 
}

/*
* Helper function for onEdit(e). When ticket status is changed to "Resolved", this functioin will turn the ticket row on the spreadsheet Grey.
* Parameter(s) - Event Object e is the cell that was edited
*/
function darkenResolvedTickets(e) {
  var statusColumnIndex = getColIndexByName("Status", sheet); // Column index for "Status"
  // If the edit was in the "Status" column and value is "Resolved"
  if(e.range.getColumn() == statusColumnIndex && e.range.getValue() == "Resolved"){
       var row = sheet.getActiveRange().getRowIndex();
       var assignedEmployee = sheet.getRange(row, getColIndexByName("Assigned", sheet)).getValue();
       var assignedEmail = getEmployeeEmail(assignedEmployee);
       var client = sheet.getRange(row, getColIndexByName("Name of Requestor", sheet)).getValue();
       var clientEmail = sheet.getRange(row, getColIndexByName("Email Address", sheet)).getValue(); 
       var projectFocus = sheet.getRange(row, getColIndexByName("Project Marketing Focus", sheet)).getValue();
       var issue = sheet.getRange(row, getColIndexByName("Project Description", sheet)).getValue();  
       var ticketLink = sheet.getRange(row, getColIndexByName("Ticket Shortlink", sheet));
       sheet.getRange(e.range.getRow(), 1,1,sheet.getLastColumn()).setBackground(colorGrey); // Changes ticket (now resolved) row to Grey
       
       // This part gets the information from the ticket and in parses out the unnecessary information
       // Inefficient method and needs to be improved - Jam
       var arrayHolder = ticketLink.getFormula().split(",");
       var replacement = arrayHolder[0].toString().replace('=HYPERLINK("', "").slice(0,-1);

        // removing the View from TicketName
       var ticketName = ticketLink.getValue();
       ticketName = ticketName.substring(4,ticketName.length)
       // Sends email to client
        MailApp.sendEmail(clientEmail,
                         "HA Marketing Help Desk" + ticketName,
                          client +",\n\n" +
                         "Your ticket has now been resolved!\n" +
                         "Issue Description: " + issue + "\n" +
                         "Ticket Request Information: " + replacement+ "\n" + 
                         "Replying to this email will go to: " + assignedEmployee + "\n\n" +
                         "-H&A Marketing Team",
                         {name: "H&A Help Desk", replyTo: assignedEmail});
      // sends email to employee   
        MailApp.sendEmail(assignedEmail,
                      "HA Marketing Help Desk" + ticketName,
                      "You resolved a ticket via the H&A Help Desk ticketing system\n"+
                      "Client: " + client + " (" + clientEmail + ")\n"+
                      "Issue Description: " + issue + "\n"+
                      "Ticket Request Information: " + replacement + "\n" + 
                      "You can view this at: " + sheetLink +"\n"+
                      "Replying to this email will go to: " + client + "\n\n" +
                      "-H&A Marketing Team",
                      {name:"H&A Help Desk", replyTo: clientEmail});  

  } // End if "Status" column
} /// End darkenResolvedTickets()

// Set ticket's rows that are anything but "Resolved" to White #FFFFFF
/*
* Helper function for onEdit(e). When ticket status is changed to "New", this functioin will turn the ticket row on the spreadsheet White.
* Parameter(s) - Event Object e is the cell that was edited
*/
function resetStatusColor(e) {
   // If the edited cell was in the status column
  if(e.range.getColumn() == statusColumnIndex){
    // If New then turn that column white 
      if(e.range.getValue() == "New"){
        sheet.getRange(e.range.getRow(), 1,1,sheet.getLastColumn()).setBackground(colorWhite); // Changes ticket row to White
    } 
  }
}

/*
*  Returns an employee email from "Employee Data" sheet
*  Parameter(s): String employee, name of employee on Employee Data sheet
*  Return: String email of employee
*/
function getEmployeeEmail(employee){
  var employeeNameIndex = 1;
  var employeeEmailIndex = 2;
  var employeeData = SpreadsheetApp.openById(sheetID).getSheetByName("Employee Data"); // Employee Data Sheet
   for(var i=2; i <= employeeData.getLastRow(); i++){
    // Search for employee name down the name column
    if( employeeData.getRange(i,employeeNameIndex).getValue() == employee){
      // Once the name is found, capture the employee email in the email column
       return employeeData.getRange(i,employeeEmailIndex).getValue();
    }
  }
  // -1 returned if employee name is not found
  return -1;
}

/*
*  Gets the index of specified column index by the name of the column
*  Parameter(s): String colname, name of the column
*  Return: int index, index of the column
*/
function getColIndexByName(colName, sheet) {
  var numColumns = sheet.getLastColumn();
  // Get header row
  var row = sheet.getRange(1, 1, 1, numColumns).getValues();
  // Index through the header row
  for (i in row[0]) {
    var name = row[0][i];
    // Transverse down the row to each column
    if (name == colName) {
      // If the coloumn we are searching for matches the index
      return parseInt(i) + 1;
      // Return the index of that row offset
    }
  }
  return -1;
}