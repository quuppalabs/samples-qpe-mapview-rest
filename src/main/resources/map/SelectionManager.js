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