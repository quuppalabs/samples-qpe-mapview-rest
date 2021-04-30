// Copyright 2020 Quuppa Oy - Quuppa Positioning Engine APIs are subject to the terms and conditions of Quuppa End User License Agreement (EULA). Quuppa reserves all rights to amend its products and the EULA from time to time. At your own cost and risk, you may use, modify and redistribute without attribution the Javascript implementation for 2D and 3D map views and the source code for the map views found in the /map folder and its subfolders (within the .war package) of Quuppa Positioning Engine when you create your own applications.
var Q = Q || {};
Q.BackgroundImageDrawable = function (img, origoX, origoY, metersPerPixelX, metersPerPixelY, rotation, alpha, visible) {
	this.image = img;
	this.origoX = origoX;
	this.origoY = origoY;
	this.metersPerPixelX = metersPerPixelX;
	this.metersPerPixelY = metersPerPixelY;
	this.rotation = rotation;
	this.alpha = alpha;
	this.isVisible = visible;
};

Q.BackgroundImageDrawable.prototype.draw = function(ctx, viewport) {
    ctx.save();
    
    if(!this.isVisible)
    	return;
    
    // viewport transform (m -> screenPx)
    ctx.translate(viewport.w/2, viewport.h/2);
    ctx.scale(viewport.scale, -viewport.scale);
    ctx.rotate(Math.PI / 180.0 * -viewport.rotation);
    ctx.translate(-viewport.centerM[0], -viewport.centerM[1]);
    
    // image px -> m transform
    ctx.rotate(Math.PI / 180.0 * this.rotation);


    ctx.scale(this.metersPerPixelX, -this.metersPerPixelY);
    ctx.translate(- this.origoX, - this.origoY);
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(this.image, 0,0);
    ctx.globalAlpha = 1.0;
    ctx.restore();
};

