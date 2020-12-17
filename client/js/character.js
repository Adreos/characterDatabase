//Fade in out code, as jquery is removed
function fadeOut(element) {
    var op = window.getComputedStyle(element).getPropertyValue("opacity");
	if(element.style.ropacity == undefined)
		element.style.ropacity = op;
	else
		op = element.style.ropacity;
	if(element.style.display != 'none')
		element.style.rdisplay = element.style.display;
	element.style.fadeaction = 'out';
     	 var timer = setInterval(function () {
        if (op <= 0 || element.style.fadeaction != 'out'){
            clearInterval(timer);
            element.style.display = 'none';
		if(element.style.fadeaction == 'out')
			element.style.fadeaction = undefined;
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op = Math.max((op - (element.style.ropacity * 0.1)),0);
    }, 50);
}
 function fadeIn(element,text) {
	 if(text === null)
		 text = 'block';
	var op = 0.5, target = 1;
	if(element.style.ropacity == undefined || element.style.ropacity == 0)
		element.style.ropacity = 1;
	else
		target = element.style.ropacity;
	 if(!target)
		 target = 1;
	element.style.opacity = 0;
	if(element.style.rdisplay == undefined || element.style.rdisplay == '')
		 element.style.display = text;
	 else
		element.style.display = element.style.rdisplay;
	element.style.fadeaction = 'in';
     	var timer = setInterval(function () {
        if (op >= target || element.style.fadeaction != 'in'){
            clearInterval(timer);
		if(element.style.fadeaction == 'in')
			element.style.fadeaction = undefined;
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op = Math.min((op + (target * 0.1)),target);
    }, 50);
}

[].slice.call( document.querySelectorAll('#mainMenu a') ).forEach(function ( element ) {
	element.style.width = "200px";
	element.style.height = "200px";
});
document.getElementById("linkback").innerHTML = '<a href="/">Home</a> &mdash; <a href="browsecharacter.html">Browse Characters</a> &mdash; <a href="view-character.html">View Characters</a> &mdash; <a href="writecharacter.html">Write Character</a>';

//START ANGULAR CODE

//THIS IF STATEMENT LOCKS OUT THE ANGULAR CODE UNLESS ANGULAR HAS BEEN INCLUDED
if(typeof angular == "object")
{
//	$("#characterTable").slideDown();

var app = angular.module("browseCharacters",[]);


var characters = [];
var activeCharacter = 0;

//Display Character
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
//Display Table
app.controller("browseCharactersTableCntl", function($scope,$http){
	var characterList, confid;
	$scope.get_character = function() {
		$http({
			method: "get",
			url: libraryURL + "/read-records"
		}).then(function(response) {
			if(response.data.msg === "SUCCESS") {
				$scope.list = response.data.data;
				characterList = response.data.data;
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

	$scope.sort = function(sortBy) {
		var data = characterList, order = new Array(), name = new Array(), tempspot, tempdata, tempname, changed;
		if(sortBy != "ID")
		sortBy = 'character' + sortBy;
		for(var i=0; i<data.length;i++)
		{
			order[i] = data[i][sortBy].toLowerCase();
			name[i] = data[i]['characterName'].toLowerCase();
		}
		do{
			changed = false;
			for(var i=0; i<data.length-1;i++)
			{
				if(
					(lastsorttype != sortBy && (order[i] > order[i+1] || (order[i] == order[i+1] && name[i] > name[i+1]))) ||
					(lastsorttype == sortBy && (order[i] < order[i+1] || (order[i] == order[i+1] && name[i] < name[i+1])))
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
		if(lastsorttype != sortBy)
			lastsorttype = sortBy;
		else
			lastsorttype = '';
	}

	$scope.filterCharacter = function()
	{
		$http({
			method: "get",
			url: libraryURL + "/read-records?gender=" + document.getElementById('characterGender').value + "&class=" + document.getElementById('characterClass').value + "&race=" + document.getElementById('characterRace').value
		}).then(function(response) {
			if(response.data.msg === "SUCCESS") {
				$scope.list = response.data.data;
				characterList = response.data.data;
			}
			else {
				console.log("Data Unknown");
				console.log(response);
			}
		}, function(response) {
			console.log("FAILURE: " + response);
		});
	}

	$scope.updateCharacter = function($event)
	{
		window.location.href = "writecharacter.html?id=" +  $event.currentTarget.getAttribute("charid");
	}
	
	$scope.deleteCharacter = function($event)
	{
		element = $event.currentTarget;
		confid = element.getAttribute("charid");
		document.getElementById('confirmId').innerHTML = element.getAttribute('charname');
		fadeIn(document.getElementById('confirmBox'),'block');
	}
	
	$scope.deleteCancel = function()
	{
		fadeOut(document.getElementById('confirmBox'));
	}
	
	$scope.deleteConfirm = function()
	{
		fadeOut(document.getElementById('confirmBox'));
		$http({
			method: "post",
			url: libraryURL + "/delete-records",
			data: {id : confid}
		}).then(function(response) {
			if(response.data.msg === "SUCCESS") {
				$scope.filterCharacter();
			}
			else {
				console.log("Delete Data Unknown");
				console.log(response);
			}
		}, function(response) {
			console.log("FAILURE: " + response);
		});
	}
});
	app.controller("WriteCharactersCntl", function($scope,$http){
		var  charID = new URLSearchParams(window.location.search).get('id'), method = "post", url = libraryURL + "/write-character", ID = 'char' + new Date().getTime();
		if(charID)
		{
			document.getElementById('characterID').value = charID;
			document.getElementById('topLabel').innerHTML = "Update Character";
			ID = charID;
			$http({
				method: "get",
				url: libraryURL + "/read-records?ID=" + charID
			}).then(function(response) {
				if(response.data.msg === "SUCCESS") {
					$scope.obj = response.data.data[0];
					document.getElementById('characterGender').value = $scope.obj.characterGender;
					document.getElementById('characterRace').value = $scope.obj.characterRace;
					document.getElementById('characterClass').value = $scope.obj.characterClass;
					document.getElementById('Title').innerHTML = "Updating Character &mdash; " + $scope.obj.characterName;
					method = "put";
					url = libraryURL + "/update-character";

					
				}
				else {
					console.log("Data Unknown");
					console.log(response);
				}
			}, function(response) {
				console.log("FAILURE: " + response);
			});
		}
		else
			document.getElementById('characterLevel').value = 1;

		
		$scope.submitCharacter = function() {
			//I used this method instead of {{}} with data-ng-model as that was deleting the prefilled out information in the form.
			var characterName = document.getElementById('characterName').value;
			var characterGender = document.getElementById('characterGender').value;
			var characterRace = document.getElementById('characterRace').value;
			var characterClass = document.getElementById('characterClass').value;
			var characterLevel = document.getElementById('characterLevel').value;
			var characterDescription = document.getElementById('characterDescription').value;
			
			var jsonString = JSON.stringify({'ID': ID,
			'characterName': characterName,
			'characterGender': characterGender,
			'characterRace': characterRace,
			'characterClass': characterClass,
			'characterLevel': characterLevel,
			'characterDescription':characterDescription});


			$http({
				method: method,
				url: url,
				data: {'data' : jsonString}
			}).then(function(response) {
				if(response.data.msg === "SUCCESS") {
					window.location.href = "browsecharacter.html";
				}
				else {
					console.log("Delete Data Unknown");
					console.log(response);
				}
			}, function(response) {
				console.log("FAILURE: " + response);
			});
		}
});
}
/*$('#submitButton').click(function(){
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
});/**/


