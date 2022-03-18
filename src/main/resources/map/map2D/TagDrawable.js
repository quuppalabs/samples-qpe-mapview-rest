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
Q.TagDrawable = function (tag, img) {
	this.tag = tag;
    this.zIndex = 10;  // by default, tags are a bit elevated
    this.name = undefined;
    this.isSelected = false;
    this.hitAreaSize = 15;
    this.image = img;
};


Q.TagDrawable.prototype.hitTest = function (x, y, viewport) {
	if(this.tag.__visible !== undefined && !this.tag.__visible)
		return false;
	var pos = this.tag.getPosition();
	if(pos === undefined)
		return false;
	if(pos.type === "presence")
		return false;

	//console.log("HitTest @" + x +":"+y);
	var pxPos = viewport.transformToPixels([pos.x, pos.y]);
	if(x < pxPos[0]-this.hitAreaSize || x > pxPos[0]+this.hitAreaSize || y < pxPos[1]-this.hitAreaSize || y > pxPos[1]+this.hitAreaSize)
		return false;
	return true;
};

Q.TagDrawable.prototype.getHighlightLabel = function () {
	if(this.tag.__partOfCombination && this.tag.__partOfCombination.tags.length > 1)
		return 	this.tag.__partOfCombination.tags.length + " overlappping tags";
	else return this.name;	
}


Q.TagDrawable.prototype.draw = function (ctx, viewport, pass) {
	if(this.tag.__visible !== undefined && !this.tag.__visible)
		return false;
	var pos = this.tag.getPosition();
	if(pos === undefined)
		return false;
	if(pos.type === "presence")  // cannot render tags with "presense" at all as the location coordinates are null.
		return false;
	if(pos.type !== "position" && Q.settings.renderOnlyTagsWithLocationTypePosition)
		return false;
	if(pos.type === "proximity" && !Q.settings.renderTagsWithLocationTypeProximity)
		return false;

	var renderCombinedDot = this.tag.__partOfCombination && this.tag.__partOfCombination.tags.length > 1;

	var pxPos = viewport.transformToPixels([pos.x, pos.y]);
	ctx.save();
		
	// render halo on first pass (if enabled)
	if(pass == 0 && Q.settings.tagPositionAccuracyEnabled && this.tag.data.locationRadius > 0) {
		var size = viewport.scale * (renderCombinedDot ? 20 : this.tag.data.locationRadius);  		// figure out how much in px the 'meters' corresponds to.
		if(size < 0)
			console.log("WTF " + size);
		ctx.save();
		ctx.globalAlpha = 0.3;
		ctx.beginPath();
		ctx.arc(pxPos[0], pxPos[1], size, 0, Math.PI*2);
		ctx.fillStyle = (renderCombinedDot ? "#958bff" : this.tag.data.color);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}

	if(pass == 1) {
		if(renderCombinedDot) {
			// this object represents multiple tags at same location, so render differently from single tag.
			var size = 6 + viewport.scale / 3.0;	
			ctx.beginPath();
			//ctx.rect(pxPos[0]-size/2, pxPos[1]-size/2, size, size);
			ctx.arc(pxPos[0], pxPos[1], size, 0, Math.PI*2);
			ctx.fillStyle = "#958bff";
			ctx.fill();
			ctx.closePath();

			ctx.fillStyle = "white";
			ctx.font = '12pt Calibri';
			var txt = this.tag.__partOfCombination.tags.length + "";
			ctx.fillText(txt, pxPos[0]-4, pxPos[1]+5);
			
		} else {
			// render image or dot
			if(this.image !== undefined) {
				ctx.drawImage(this.image, pxPos[0] - this.image.width/2, pxPos[1] - this.image.height/2);
			} else {
				var size = 3 + viewport.scale / 3.0;	
				ctx.beginPath();
				ctx.arc(pxPos[0], pxPos[1], size, 0, Math.PI*2, false);
				ctx.fillStyle = this.tag.data.color;
				ctx.fill();
				if(this.tag.__autoFollow)
					ctx.strokeStyle = "#00ff00";
				else
					ctx.strokeStyle = "#ffffff";
				ctx.lineWidth = 1;
				ctx.stroke();
				ctx.closePath();
			}	
			
			// draw button pushed visualization (or simple black dot in middle if not pushed)
			ctx.beginPath();
			ctx.fillStyle = "#000000";
			if(this.tag.data.button1State === 'pushed') {
				ctx.arc(pxPos[0], pxPos[1], 5, 0, Math.PI*2, false);
			} else {
				ctx.arc(pxPos[0], pxPos[1], 1, 0, Math.PI*2, false);
			}
			ctx.fill();
			ctx.closePath();
		}		
	}
	
	if(pass == 2 && this.isSelected) {
		ctx.fillStyle = "white";
		ctx.shadowColor = "black";
		ctx.shadowOffsetX = 1;
		ctx.shadowOffsetY = 1;
		ctx.shadowBlur = 1;
		ctx.font = '12pt Calibri';

		if(renderCombinedDot) {
			var txt = "";
			for (var i = 0; i < this.tag.__partOfCombination.tags.length; i++)
				ctx.fillText(this.tag.__partOfCombination.tags[i].id, pxPos[0]+12, pxPos[1]+5+i*15);
						
		} else {
			var txt = this.tag.data.tagName || this.tag.id || "Error, no name nor ID!";
			if(this.tag.data.heartRate && this.tag.data.heartRate !== null) {
				txt += " (HR:" + this.tag.data.heartRate + ")"; 
			}
			ctx.fillText(txt, pxPos[0]+2, pxPos[1]+5);
			var locationText = "(" + pos.type + ", ~" + this.tag.data.locationRadius + "m";
			if(pos.age > 1000)
				locationText += ", " + Q.createAgoString(pos.age) + " ago";
			locationText += ")";
	
			if(locationText != undefined) {
				ctx.font = '8pt Calibri';
				ctx.fillText(locationText, pxPos[0]+2, pxPos[1]+17);
			}
		}
	}
	ctx.restore();
	return true;
};
