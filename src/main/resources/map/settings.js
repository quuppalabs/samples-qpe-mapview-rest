// Copyright 2022 Quuppa Oy
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//    http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var Q = Q || {};

if(typeof Q.buildApiUrl !== 'function'){
	// relPath is the relative path from html file where call is made
	Q.buildApiUrl = function (relPath, apiPath) {
		return relPath + apiPath;
	};
}

Q.settings = function() {
	var that = {};

	that.useSmoothing = true;
	//that.smoothing = 0.8;
	that.centerOnSelected = false;
	that.showRawDataInTree = false;
	that.renderInactiveAreaAsGrey = true;
	that.renderZones = true;
	that.renderTrackingAreaBorders = true;
	that.tagPositionAccuracyEnabled = true;
	that.renderOnlyTagsWithLocationTypePosition = false;
	that.renderTagsWithLocationTypeProximity = false;
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
	f2.add(that, "renderTagsWithLocationTypeProximity").name("Render also tags with locationType \"proximity\"?");
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
