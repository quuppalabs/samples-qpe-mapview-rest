// Copyright 2020 Quuppa Oy - Quuppa Positioning Engine APIs are subject to the terms and conditions of Quuppa End User License Agreement (EULA). Quuppa reserves all rights to amend its products and the EULA from time to time. At your own cost and risk, you may use, modify and redistribute without attribution the Javascript implementation for 2D and 3D map views and the source code for the map views found in the /map folder and its subfolders (within the .war package) of Quuppa Positioning Engine when you create your own applications.
var Q = Q || {};
Q.SelectionManager = function() {
	this.__selected = [];
	this.__listeners = [];
};

Q.SelectionManager.prototype.isSelected = function(obj) {
	return this.__selected.indexOf(obj) > -1 ? true : false;
};

Q.SelectionManager.prototype.addToSelection = function(obj) {
	this.__selected.push(obj);
	for(var i = 0; i < this.__listeners.length; i++) {
		var l = this.__listeners[i];
		if(l.onSelectionAdd !== undefined)
			l.onSelectionAdd(obj);
	};
};

Q.SelectionManager.prototype.removeFromSelection = function(obj) {
	var index = this.__selected.indexOf(obj);
	if (index > -1) {
		this.__selected.splice(index, 1);
		for(var i = 0; i < this.__listeners.length; i++) {
			var l = this.__listeners[i];
			if(l.onSelectionRemove !== undefined)
				l.onSelectionRemove(obj);
		};
	};
};


Q.SelectionManager.prototype.addListener = function(l) {
	this.__listeners.push(l);
};

Q.SelectionManager.prototype.removeListener = function(l) {
	var i = this.__listeners.indexOf(l);
	if(i > -1) {
		this.__listeners.splice(i, 1);		
	}
};