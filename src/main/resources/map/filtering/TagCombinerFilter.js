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
Q.TagCombinerFilter = function(dm) {
	Q.TagFilter.call(this, dm);
	this.__fingerprintMapping = {};
};

Q.TagCombinerFilter.prototype = Object.create( Q.TagFilter.prototype );

Q.TagCombinerFilter.prototype.__getFingerprint = function(tag) {
	var c = tag.getPosition();
	if(c === undefined)
		return undefined;
	return c.type + c.x + c.y;
}

Q.TagCombinerFilter.prototype.__filter = function(tag) {
	var fp = this.__getFingerprint(tag);
	
	if(tag.__partOfCombination !== undefined && tag.__partOfCombination.fingerprint !== fp) {
		// remove the tag from previous combination as the fingerprint has changed
		var index = tag.__partOfCombination.tags.indexOf(tag);
		if (index > -1) {
			tag.__partOfCombination.tags.splice(index, 1);
		}
		tag.__partOfCombination = undefined;
	}
	
	if(fp === undefined)
		return false;  // no fingerprint --> cannot be shown on map --> does not pass the filter.

	var mapping = this.__fingerprintMapping[fp];	
	if( ! mapping) {
		mapping = {};
		mapping.fingerprint = fp;
		mapping.tags = [];
		this.__fingerprintMapping[fp] = mapping;		
	}
	
	if(tag.__partOfCombination === undefined || tag.__partOfCombination.fingerprint !== fp) {
		// the tag is not yet part of it...
		mapping.tags.push(tag);
		tag.__partOfCombination = mapping;
	}
	if(mapping.tags.indexOf(tag) === 0)
		return true;  // pass the ones at index 0 always so that they can be the "representatives" for all combined tags.
	return false;  // this is not the index 0 tag so do not pass through the filter...  
}

// override so that we can remove also from mappings...
Q.TagCombinerFilter.prototype.__doRemove = function(tag) {
	if(tag.__partOfCombination !== undefined) {
		// remove the tag from previous combination
		var index = tag.__partOfCombination.tags.indexOf(tag);
		if (index > -1) {
			tag.__partOfCombination.tags.splice(index, 1);
		}
		tag.__partOfCombination = undefined;
	}
	
	for (var i = 0; i < this.__filteredTags.length; i++) {
		if (this.__filteredTags[i].id === tag.id) {
			this.__filteredTags.splice(i, 1);
			return true;
		}
	}
	return false;
};


Q.TagFilter.prototype.onTagUpdateFinished = function() {
	for (const property in this.__fingerprintMapping) {
		var str = `${property}: `;
		for (const t of this.__fingerprintMapping[property].tags)
			str += t.id + " ";

	}
	// just a passthrough
	for (var l = 0; l < this.__listeners.length; l++) {
		if (this.__listeners[l].onTagUpdateFinished != undefined)
			this.__listeners[l].onTagUpdateFinished();
	}
};


