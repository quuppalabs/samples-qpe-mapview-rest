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

Q.BackgroundImageDrawable.prototype.draw = function(ctx, viewport, pass) {
	if(pass != 0)
		return false;
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


