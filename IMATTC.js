// ==UserScript==
// @name         IMATTC
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  A usability overhaul for the Ingress Mission Authoring Tool
// @author       You
// @match        https://mission-author-dot-betaspike.appspot.com/
// @grant        none
// ==/UserScript==

$(function () {
    'use strict';
    // Your code here...
    TimeConversionConstants.MINUTE_GRANULARITY_MINUTES = 1;
    TimeConversionConstants.HOUR_GRANULARITY_MINUTES = 15;
    TimeConversionConstants.DAY_GRANULARITY_HOURS = 12;

    var newCssRules = "<style>"
	newCssRules += ".missions-list .mission 					{border: 5px solid black; margin: 0; position: relative; height: 250px; padding: 5px; display: block;}";
	newCssRules += ".mission-list-item-published 				{background-image: none; background: #21696b;}";
	newCssRules += ".mission-list-item-draft 					{background-image: none; background: #4c3b1f;}";
	newCssRules += ".mission-list-item-draft_of_published_mission {background-image: none; background: #21696b;}";
	newCssRules += ".mission-list-item-submitted				{background-image: none; background: #4c3b1f;}";
	newCssRules += ".mission-list-item-disabled 				{background-image: none; background: #6b6b6b;}";
	newCssRules += ".mission-list-item-submitted_and_published	{background-image: none; background: #21696b;}";
	newCssRules += "</style>";
    $("head").append( newCssRules );

});

function init(){
    var w = window;
    	let tryNumber = 15;

	const initWatcher = setInterval(() => {
		if (tryNumber === 0) {
            clearInterval(initWatcher);
			alert("fuck");
		}
		if (w.angular && $(".missions-list").length > 0) {
			let err = false;
			try {
				initAngular();
			}
			catch (error) {
                clearInterval(initWatcher);
				err = error;
				console.log(error);
			}
			if (!err) {
				try {
                    clearInterval(initWatcher);
					whenItsLoaded();
				} catch (error) {
					console.log(error);
				}
			}
		}
		tryNumber--;
	}, 1000);

    function initAngular() {
		const el = w.document.querySelector("*[ng-app]");
		w.$app = w.angular.element(el);
		w.$injector = w.$app.injector();
		w.$rootScope = w.$app.scope();
        w.$filter = w.$app.injector().get('$filter');
        w.$compile = w.$app.injector().get('$compile');

		w.$scope = element => w.angular.element(element).scope();
	}

    function whenItsLoaded(){
			$(".missions-list").empty()
            $(".missions-list").addClass("row");
//
            var missionsElement = $('div.list');
            var missionScope = w.$scope(missionsElement);
            missionScope.missions = w.$filter("orderBy")(missionScope.missions, 'definition.name');

    	    w.$injector.invoke(function($compile) {
				for (var i = 0; i < missionScope.missions.length; i++){
					// Pass our fragment content to $compile,
				   // and call the function that $compile returns with the scope.
				   var mission = missionScope.missions[i];
				   var missionState = mission.missionListState.toLowerCase();
				   var newMissionPanel = "<div class='mission col-sm-6 col-md-3 mission-list-item-" + missionState + "'>";
				   newMissionPanel += "<img class='mission-image' src='" + mission.definition.logo_url + "'>";
				   newMissionPanel += "<span class='name mission-title-" + missionState + "'>" + mission.definition.name + "</span><br />";
				   newMissionPanel += "<i class='name mission-title-" + missionState + " glyphicon glyphicon-";
				   switch (missionState){
					    case "draft":
						newMissionPanel += "wrench' title='Unpublished draft mission'";
						break;
						case "draft_of_published_mission":
						newMissionPanel += "wrench' title='Published mission with unpublished edits'";
						break;
						case "published":
						newMissionPanel += "ok' title='Published mission'";
						break;
						case "submitted":
						newMissionPanel += "send' title='Unpublished mission under review'";
						break;
						case "submiteed_and_published":
						newMissionPanel += "send' title='Published mission, changes under review'";
						break;
					   }
				   newMissionPanel += "></i>";
				   newMissionPanel += "<span class='name mission-time-" + missionState + "'>"+missionScope.getInfoTime(mission)+"</span>";
				   newMissionPanel += "<div class='dropdown'><button class='button action-button dropdown-toggle' type='button' id='dropdownMenu1' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>Action <span class='caret'></span></button>";
				   newMissionPanel += "<ul class='dropdown-menu' aria-labelledby='dropdownMenu1'>"
				   newMissionPanel += "<li><a role='button' ng-click='button1Clicked(missions["+i+"])'>" + missionScope.getButton1Title(mission) + "</a></li>";
				   newMissionPanel += "<li><a role='button' ng-click='button2Clicked(missions["+i+"])'>" + missionScope.getButton2Title(mission) + "</a></li>";
				   newMissionPanel += "</ul></div>"
				   newMissionPanel += "<table class='table table-bordered'><tr>";
				   newMissionPanel += "<td>";
				   switch (mission.definition.mission_type) {
					case "SEQUENTIAL":
						newMissionPanel += "Sequential";
						break;
					case "HIDDEN_SEQUENTIAL":
						newMissionPanel += "Sequential: Hidden";
						break;
					case "NON_SEQUENTIAL":
						newMissionPanel += "Any Order";
						break;
					}
				   mission.definition.mission_type 
				   newMissionPanel += "</td>";
				   if (mission.stats){
					   newMissionPanel += "<td>" + missionScope.getMissionTimeString(mission) + "</td>";
					   newMissionPanel += "<td>" + missionScope.getMissionRatingString(mission) + "</td>";
					   newMissionPanel += "<td>" + mission.stats.num_completed + "</td>";					   
					}
				   newMissionPanel += "</tr></table>";
				   newMissionPanel += "</div>";
				   var compiledContent = $compile(newMissionPanel)(missionScope);
		
				   // Put the output of the compilation in to the page using jQuery
				   $('.missions-list').append(compiledContent);								   
				}

   });
    }
}

setTimeout(() => {
	init();
}, 500);
