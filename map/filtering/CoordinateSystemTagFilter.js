// Copyright 2020 Quuppa Oy - Quuppa Positioning Engine APIs are subject to the terms and conditions of Quuppa End User License Agreement (EULA). Quuppa reserves all rights to amend its products and the EULA from time to time. At your own cost and risk, you may use, modify and redistribute without attribution the Javascript implementation for 2D and 3D map views and the source code for the map views found in the /map folder and its subfolders (within the .war package) of Quuppa Positioning Engine when you create your own applications.
var Q = Q || {};
Q.CoordinateSystemTagFilter = function(dm) {
	Q.TagFilter.call(this, dm);
	this.__coorSysID = "";
};

Q.CoordinateSystemTagFilter.prototype = Object.create( Q.TagFilter.prototype );


Q.CoordinateSystemTagFilter.prototype.setCoordSystem = function(w) {
	this.__coorSysID = w;
	this.__doFiltering();
};

Q.CoordinateSystemTagFilter.prototype.__filter = function(tag) {
	if(this.__coorSysID === undefined || this.__coorSysID.length === 0)
		return true;
	if(tag.data !== undefined && tag.data.locationCoordSysId !== undefined)
		if(tag.data.locationCoordSysId === this.__coorSysID)
			return true;
		else return false;
	return false;
};
