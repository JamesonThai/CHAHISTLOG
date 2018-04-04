
function test(){
	var para = document.createElement("h1");
	var node = document.createTextNode("GotStuffHere");
	para.appendChild(node);
	var parent = document.getElementById("div1");
	var child = document.getElementById("header1");
	parent.replaceChild(para, child);
}