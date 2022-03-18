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
Q.KeywordTagFilter = function(dm) {
	Q.TagFilter.call(this, dm);
	this.__keyword = "";
};

Q.KeywordTagFilter.prototype = Object.create( Q.TagFilter.prototype );


Q.KeywordTagFilter.prototype.setKeyword = function(w) {
	this.__keyword = w;
	this.__doFiltering();
};

Q.KeywordTagFilter.prototype.__filter = function(tag) {
	if(this.__keyword === undefined || this.__keyword.length === 0)
		return true;
	return tag.id.indexOf(this.__keyword) > -1 
		|| (tag.data.tagName !== null && tag.data.tagName.indexOf(this.__keyword) > -1);
};
