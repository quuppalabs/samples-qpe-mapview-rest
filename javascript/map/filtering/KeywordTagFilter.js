/*
Copyright 2021 Quuppa Oy.
Quuppa Positioning Engine APIs are subject to the terms and conditions of Quuppa End User License Agreement (EULA).
Quuppa reserves all rights to amend its products and the EULA from time to time.
At your own cost and risk, you may use, modify, and redistribute, without attribution, this Javascript implementation for 2D and 3D map views.
*/
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
