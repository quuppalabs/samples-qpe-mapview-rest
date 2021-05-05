/*
Copyright 2021 Quuppa Oy.
Quuppa Positioning Engine APIs are subject to the terms and conditions of Quuppa End User License Agreement (EULA).
Quuppa reserves all rights to amend its products and the EULA from time to time.
At your own cost and risk, you may use, modify, and redistribute, without attribution, this Javascript implementation for 2D and 3D map views.
*/
 var Q = Q || {};
Q.settings = function() {
	var that = {};

	// relPath is the relative path from html file where call is made,
	// to the folder where settings.js is.
	// that.buildApiUrl = function (relPath, apiPath) {
	//	return relPath + apiPath;
	// };
	// for serving under qpe-next /ext path, and v0 api in /api/qpe/
	that.buildApiUrl = function (relPath, apiPath) {
	 	return '/api/qpe/' + apiPath;
	};

	that.useSmoothing = true;
	//that.smoothing = 0.8;
	that.centerOnSelected = false;
	that.showRawDataInTree = false;
	that.renderInactiveAreaAsGrey = true;
	that.renderZones = true;
	that.renderTrackingAreaBorders = true;
	that.tagPositionAccuracyEnabled = true;
	that.renderOnlyTagsWithLocationTypePosition = false;
	that.gridVisible = true;
	that.gridColor = "#ff0000";
	that.backgroundColor = "#898484";
	that.gridAlpha = 0.5;

	var gui = new dat.GUI();
	gui.width = 600;
	gui.closed = true;
	that.gui = gui;

	var f2 = gui.addFolder('Map rendering');
	f2.add(that, "tagPositionAccuracyEnabled").name("Render tag position accuracy halo (2D)");
	f2.add(that, "renderOnlyTagsWithLocationTypePosition").name("Render only tags with locationType \"position\"?");
	f2.add(that, "gridVisible").name("Grid visible?");
	f2.addColor(that, "gridColor").name("Grid color");
	f2.add(that, "gridAlpha", 0.0, 1.0).name("Grid alpha");
	f2.addColor(that, "backgroundColor").name("Background color");
	f2.add(that, "renderInactiveAreaAsGrey").name("Render inactive area as grey (2D)");
	f2.add(that, "renderZones").name("Render Zones (2D)");
	f2.add(that, "renderTrackingAreaBorders").name("Render tracking area borders (2D)");

	gui.add(that, "centerOnSelected").name("Center on tag when selected").listen();
	gui.add(that, "showRawDataInTree").name("Show ALL data fields in tree");

	return that;
}();
