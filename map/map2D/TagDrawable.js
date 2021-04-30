// Copyright 2020 Quuppa Oy - Quuppa Positioning Engine APIs are subject to the terms and conditions of Quuppa End User License Agreement (EULA). Quuppa reserves all rights to amend its products and the EULA from time to time. At your own cost and risk, you may use, modify and redistribute without attribution the Javascript implementation for 2D and 3D map views and the source code for the map views found in the /map folder and its subfolders (within the .war package) of Quuppa Positioning Engine when you create your own applications.
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


Q.TagDrawable.prototype.draw = function (ctx, viewport) {
	if(this.tag.__visible !== undefined && !this.tag.__visible)
		return false;
	var pos = this.tag.getPosition();
	if(pos === undefined)
		return false;
	if(pos.type === "presence")  // cannot render tags with "presense" at all as the location coordinates are null.
		return false;
	if(pos.type !== "position" && Q.settings.renderOnlyTagsWithLocationTypePosition)
		return false;

	var pxPos = viewport.transformToPixels([pos.x, pos.y]);
	ctx.save();
		
	// render halo first (if enabled)
	if(Q.settings.tagPositionAccuracyEnabled) {
		var size = viewport.scale * this.tag.data.locationRadius;  		// figure out how much in px the 'meters' corresponds to.
		ctx.save();
		ctx.globalAlpha = 0.3;
		ctx.beginPath();
		ctx.arc(pxPos[0], pxPos[1], size, 0, Math.PI*2, false);
		ctx.fillStyle = this.tag.data.color;
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}

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

	if(this.isSelected) {
		ctx.fillStyle = "white";
		ctx.shadowColor = "black";
		ctx.shadowOffsetX = 1;
		ctx.shadowOffsetY = 1;
		ctx.shadowBlur = 1;
		ctx.font = '12pt Calibri';
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
	ctx.restore();
	return true;
};
