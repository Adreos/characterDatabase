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
		url: libraryURL + "/write-character",
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
		url: libraryURL + "/read-records",
		type: "get",
		success: function(response) {
			var data = jQuery.parseJSON(response);
			createCharacterTable(data);
		}
	});
}
var lastsorttype = '';
function sort(type){
	$.ajax({
		url: libraryURL + "/read-records",
		type: "get",
		success: function(response) {
			var data = jQuery.parseJSON(response), order = new Array(), name = new Array(), tempspot, tempdata, tempname, changed;
			if(type != "ID")
				type = 'character' + type;
			for(var i=0; i<data.length;i++)
			{
				console.log(type);
				order[i] = data[i][type].toLowerCase();
				name[i] = data[i]['characterName'].toLowerCase();
			}
			do{
				changed = false;
				for(var i=0; i<data.length-1;i++)
				{
					if(
						(lastsorttype != type && (order[i] > order[i+1] || (order[i] == order[i+1] && name[i] > name[i+1]))) ||
						(lastsorttype == type && (order[i] < order[i+1] || (order[i] == order[i+1] && name[i] < name[i+1])))
					)
					{
						changed = true;
						tempspot = order[i];
						tempdata = data[i];
						tempname = name[i];
						order[i] = order[i+1];
						data[i] = data[i+1];
						name[i] = name[i+1];
						order[i+1] = tempspot;
						data[i+1] = tempdata;
						name[i+1] = tempname;
					}
				}
			}while(changed == true);
			if(lastsorttype != type)
				lastsorttype = type;
			else
				lastsorttype = '';
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
		tableHTML += "<td class=\"edit\"><a onClick=\"confDelete('" + charData[i].ID + "','" + charData[i].characterName + "')\">Delete</a></td>";
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
if($("#mainMenu").length)
{
	$('#mainMenu a').css('height',$('#mainMenu a').width() + 'px');
}
//DELETE CODE
var confid = '';
function confDelete(id,name)
{
	confid = id;
	$('#confirmBox p:last-of-type').html(id + '<br>' + name);
	$('#confirmBox').fadeIn();
}
$('#cancelButton').click(function(){
	$('#confirmBox').fadeOut();
});
$('#confirmButton').click(function(){
	$('#confirmBox input').slideUp();
	$('#confirmBox p:first-of-type').text("Processing");
	$('#confirmBox p:not(:first-of-type)').slideUp();
	$.ajax({
		url: libraryURL + "/delete-records",
		type: "post",
		data: {id : confid},
		success: function(response) {
			var data = jQuery.parseJSON(response);
			createCharacterTable(data);
			$('#confirmBox').fadeOut();
			$('#confirmBox input').slideDown();
			$('#confirmBox p:not(:first-of-type)').slideDown();
			$('#confirmBox p:first-of-type').text("Are  you really sure you want to delete");
		}
	});
});
$('#linkback').html('<a href="/">Home</a> &mdash; <a href="browsecharacter.html">Browse Characters</a> &mdash; <a href="view-character.html">View Characters</a> &mdash; <a href="writecharacter.html">Write Character</a>');

//START ANGULAR CODE
//THIS IF STATEMENT LOCKS OUT THE ANGULAR CODE UNLESS ANGULAR HAS BEEN INCLUDED
if(typeof angular == "object")
{
	$("#characterTable").slideDown();

var app = angular.module("browseCharacters",[]);


var characters = [];
var activeCharacter = 0;

app.controller("browseCharactersCntl", function($scope,$http){
	$scope.obj = [];

	$scope.get_character = function() {
		$http({
			method: "get",
			url: libraryURL + "/read-characters"
		}).then(function(response) {
			if(response.data.msg === "SUCCESS") {
				characters = response.data.data;
				$scope.obj = characters[activeCharacter];
				$scope.spot = activeCharacter+1;
			}
			else {
				console.log("Data Unknown");
				console.log(response);
			}
		}, function(response) {
			console.log("FAILURE: " + response);
		});
	};

	$scope.get_character();

	$scope.changeCharacter = function(direction) {
		activeCharacter += direction;
		if(activeCharacter < 0)
			activeCharacter = characters.length-1;
		if(activeCharacter >= characters.length)
			activeCharacter = 0;
		$scope.obj = characters[activeCharacter];
		$scope.spot = activeCharacter+1;
	}
/*	$scope.showHide = function() {
		$scope.hidePrev = (activeSpell === 0) ? true : false;
		$scope.hideNext = (activeSpell === spells.length-1) ? true : false;
	}*/
});
}
