// Copyright 2020 Quuppa Oy - Quuppa Positioning Engine APIs are subject to the terms and conditions of Quuppa End User License Agreement (EULA). Quuppa reserves all rights to amend its products and the EULA from time to time. At your own cost and risk, you may use, modify and redistribute without attribution the Javascript implementation for 2D and 3D map views and the source code for the map views found in the /map folder and its subfolders (within the .war package) of Quuppa Positioning Engine when you create your own applications.
var Q = Q || {};
Q.GridDrawable = function () {
	this.zIndex = 100;  // by default, grid is on top of everything
};

Q.GridDrawable.prototype.draw = function (ctx, viewport) {
	if(!Q.settings.gridVisible)
		return;
	
	var drawLine = function(p1, p2, ctx) {
		ctx.moveTo(p1[0], p1[1]);
		ctx.lineTo(p2[0], p2[1]);
	};
	
	var center = viewport.transformToPixels([0, 0]);
	var c = Q.settings.gridColor;
	ctx.strokeStyle = c;
	if(Q.settings.gridAlpha < 1.0)
		ctx.globalAlpha = Q.settings.gridAlpha;
	ctx.lineWidth = 0.6;
	ctx.beginPath();
	
	// vertical center line
	drawLine(viewport.transformToPixels([0, -100]), viewport.transformToPixels([0, -100]), ctx);
	// horizontal center line
	drawLine(viewport.transformToPixels([-100, 0]), viewport.transformToPixels([-100, 0]), ctx);
	
	// draw 10m crossing lines
	ctx.lineWidth = 0.3;
	ctx.strokeStyle = Q.settings.gridColor;
	ctx.fillStyle = Q.settings.gridColor;
	for(var i = -100; i <= 100; i+=10) {
		drawLine(viewport.transformToPixels([i, -100]), viewport.transformToPixels([i, 100]), ctx);
		drawLine(viewport.transformToPixels([-100, i]), viewport.transformToPixels([100, i]), ctx);
	}
	
	// 1 meter tabs
	if (viewport.scale > 10) {
		for(var i = -100; i <= 100; i++) {
			drawLine(viewport.transformToPixels([i, -100]), viewport.transformToPixels([i, 100]), ctx);
			drawLine(viewport.transformToPixels([-100, i]), viewport.transformToPixels([100, i]), ctx);
		}
	}
	ctx.stroke();
	
	ctx.globalAlpha = 1.0;
};
