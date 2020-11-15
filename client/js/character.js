var defaultHead;
$('#submitButton').click(function(){
	var characterName = $('#characterName').val();
	var characterGender = $('#characterGender').val();
	var characterRace = $('#characterRace').val();
	var characterClass = $('#characterClass').val();
	var characterLevel = $('#characterLevel').val();
	var characterDescription = $('#characterDescription').val();

	var d = new Date();
	var ID = 'char' + d.getTime();
		var jsonString = JSON.stringify({'ID': ID,
			'characterName': characterName,
			'characterGender': characterGender,
			'characterRace': characterRace,
			'characterClass': characterClass,
			'characterLevel': characterLevel,
			'characterDescription':characterDescription});
	$.ajax({
		url: "http://localhost:5000/write-character",
		type: "post",
		data: {'data' : jsonString},
		success: function(response) {
			window.location.href = "browsecharacter.html";
		},
		error: function(err) {
			alert(err);
		}
	});
});

function getData(){
	$.ajax({
		url: "http://localhost:5000/read-records",
		type: "get",
		success: function(response) {
			var data = jQuery.parseJSON(response);
			createCharacterTable(data);
		}
	});
}

function createCharacterTable(charData) {
	var tableHTML = defaultHead;
	for(var i=0; i<charData.length;i++)
	{
		var description = charData[i].characterDescription, olddesc;
		do{
			olddesc = description;
			description = description.replace("\n","<br>");
		}while(description != olddesc);
		tableHTML += "<tr>";
		tableHTML += "<td>" + charData[i].ID + "</td>";
		tableHTML += "<td>" + charData[i].characterName + "</td>";
		tableHTML += "<td>" + charData[i].characterGender + "</td>";
		tableHTML += "<td>" + charData[i].characterRace + "</td>";
		tableHTML += "<td>" + charData[i].characterClass + "</td>";
		tableHTML += "<td>" + charData[i].characterLevel + "</td>";
		tableHTML += "<td>" + description + "</td>";
		tableHTML += "</tr>";
	}
	$("#displayTable").html(tableHTML);
}
if($("#displayTable").length)
{
	defaultHead = $("#displayTable").html();
	getData();
}