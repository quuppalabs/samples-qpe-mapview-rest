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
Q.TagDataRetriever = function(updateInterval) {
	//this.__tagMap = {};
	this.__tagList = [];
	this.__query = window.location.search.substring(1);
	this.__listeners = [];
	this.__lastNotificationShownTS = 0;
	this.__coordSysID = undefined;
	this.updateInterval = updateInterval;
	
	var that = this;

	parseTagData = function(data, textStatus, jqXHR) {
		this.__lastNotificationShownTS = 0;
		var serverTime = data.responseTS;
		data = data.tags;
		var addedTags = [];
		var updatedTags = [];
		
		for(var i = 0; i < that.__tagList.length; i++) 
			that.__tagList[i].__toBeRemovedFlag = true;  // raise the flag so that we know which previous tag do not exist anymore and should be removed.
	
		for(var i = 0; i < data.length; i++) {
			var tag = data[i];
			//var localTag = that.__tagMap[tag.tagId];
			var localTag = that.getTag(tag.tagId);
			var isAdd = true;
			if (localTag === undefined) {
				localTag  = {};
				localTag.id = tag.tagId;

				localTag.getPosition = function () {
					var now = this.serverTime;
					var posAge = Number.MAX_VALUE;
					if(this.data && this.data.locationTS) {
						posAge = now-this.data.locationTS;
						if (this.data.location !== undefined && this.data.location !== null)
							return { 
								x: this.data.location[0],
								y: this.data.location[1],
								z: this.data.location[2],
								type: this.data.locationType,
								age: posAge,
								coordSystem: this.data.locationCoordSysId,
								coordSystemName: this.data.locationCoordSysName};
					}						
					return undefined;
				};
				
				// create observer pattern for tag
				localTag.__observers = [];
				localTag.subscribe = function(fn) {
					localTag.__observers.push(fn);
				};
				localTag.unsubscribe = function(fn) {
					var i = localTag.__observers.indexOf(fn);
					if(i > -1) {
						localTag.__observers.splice(i, 1);
					}
				};
				localTag.fire = function(prop) {
			        this.__observers.forEach(function(item) {
			            item.call(localTag, prop);
			        });
			    }
				localTag.__visible = true;
				localTag.__autoFollow = false;
				
				//that.__tagMap[tag.tagId] = localTag;
				that.__tagList.push(localTag);
				addedTags.push(localTag);
			} else {
				isAdd = false;
				updatedTags.push(localTag);
			}
			localTag.data = tag;
			localTag.serverTime = serverTime;
			localTag.__toBeRemovedFlag = false;
		}
		
		// collect all tags-to-be-removed
		var removedTags = [];
		for(var i = 0; i < that.__tagList.length; i++) {
			var t = that.__tagList[i];
			if(t.__toBeRemovedFlag === true) {
				removedTags.push(t);
			}
		}
		// do remove
		for(var i = 0; i < removedTags.length; i++) {
			var index = that.__tagList.indexOf(removedTags[i]);
			if (index > -1) {
				that.__tagList.splice(index, 1);
			}
			//delete that.__tagMap[t.id];
		}
		
				
		// notify listeners
		for (var l = 0; l < that.__listeners.length; l++) {
			var listener = that.__listeners[l];
			if (addedTags.length > 0 && listener.onTagsAdd != undefined)
				listener.onTagsAdd(addedTags);
			if (updatedTags.length > 0 && listener.onTagsUpdate != undefined)
				listener.onTagsUpdate(updatedTags);
			if (removedTags.length > 0 && listener.onTagsRemove != undefined)
				listener.onTagsRemove(removedTags);
			if (listener.onTagUpdateFinished != undefined)
				listener.onTagUpdateFinished();
		}
	};
	
	printTagStats = function(data) {
		data = data.tags;
		var tagsWithPositionCount = 0;
		var tagsWithProximityCount = 0;
		var tagsWithPresenseCount = 0;
		
		for(var i = 0; i < data.length; i++) {
			var t = data[i];
			if(t.locationType === "position") {
				tagsWithPositionCount++;
			} else if(t.locationType === "proximity") {
				tagsWithProximityCount++;
			} else if(t.locationType === "presence") {
				tagsWithPresenseCount++;
			}
		}
		console.log("tagsWithPositionCount=" + tagsWithPositionCount + ", tagsWithProximityCount=" + tagsWithProximityCount + ", tagsWithPresenseCount=" + tagsWithPresenseCount + " / " + data.length);
	}

	// kick out the first request
	setTimeout(this.__pollTagInfo, updateInterval, this);
};


Q.TagDataRetriever.prototype.reset = function() {
	for (var l = 0; l < this.__listeners.length; l++) {
		if (this.__listeners[l].onTagsRemove != undefined)
			this.__listeners[l].onTagsRemove(__tagList);
	}
	//this.__tagMap = {};
	this.__tagList = [];
};

Q.TagDataRetriever.prototype.sort = function() {
	this.__tagList.sort(function(a, b) {
		var idA = (a.data && a.data.tagName) || a.id;
		var idB = (b.data && b.data.tagName) || b.id;
		return idA.localeCompare(idB);
	});
	
	for (var l = 0; l < this.__listeners.length; l++) {
		if (this.__listeners[l].onTagsRemove != undefined)
			this.__listeners[l].onTagsRemove(this.__tagList);
		if (this.__listeners[l].onTagsAdd != undefined)
			this.__listeners[l].onTagsAdd(this.__tagList);
	}
};

Q.TagDataRetriever.prototype.addListener = function(l) {
	this.__listeners.push(l);
};

Q.TagDataRetriever.prototype.getTag = function(id) {
	//return this.__tagMap[id];
	for(var i = 0; i < this.__tagList.length; i++) {
		if(this.__tagList[i].id === id)
			return this.__tagList[i];
	}
};

Q.TagDataRetriever.prototype.getTags = function() {
	return this.__tagList;
};

Q.TagDataRetriever.prototype.setCoordinateSystemRequestFilter = function(coordSysID) {
	this.__coordSysID = coordSysID;
};


Q.TagDataRetriever.prototype.__pollTagInfo = function(o) {
	var q = o.__query;
	var filter = o.__coordSysID ? "coordSys="+o.__coordSysID + "&" : "";
	var that = this;
	// do poll for tag data
	jQuery.ajax({
		url : Q.buildApiUrl(Q.apiPathPrefix, "getTagData?format=defaultLocationAndInfo&" + filter),
		headers: Q.apiToken == undefined ? {} : {"Authorization": "Bearer " + Q.apiToken},		
		dataType : 'json',
		async : true,
		success : function(data, textStatus, jqXHR) {
			parseTagData(data, textStatus, jqXHR);
			//printTagStats(data);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log('error', 'loading tag info failed, ' + textStatus);
			if(new Date().getTime() - o.__lastNotificationShownTS > 10000) {
				Q.notificationManager.showNotification("Error while retrieving tag data. [" + textStatus + "]", 4000);
				o.__lastNotificationShownTS = new Date().getTime();
			}
		},
		complete: function(data) {
			setTimeout(o.__pollTagInfo, o.updateInterval, o);
		}
	});
};
