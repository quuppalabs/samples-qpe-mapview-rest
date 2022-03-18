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
