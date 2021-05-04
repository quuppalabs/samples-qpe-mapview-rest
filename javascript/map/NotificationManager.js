/*
Copyright 2021 Quuppa Oy.
Quuppa Positioning Engine APIs are subject to the terms and conditions of Quuppa End User License Agreement (EULA).
Quuppa reserves all rights to amend its products and the EULA from time to time.
At your own cost and risk, you may use, modify, and redistribute, without attribution, this Javascript implementation for 2D and 3D map views.
*/
var Q = Q || {};
Q.NotificationManager = function() {
	$("#notificationBar").hide();
};


Q.NotificationManager.prototype.showNotification = function(msg, howLong) {
	$("#notificationBar").html(msg).show();
	setTimeout(function() {
		$("#notificationBar").fadeOut();
	}, howLong || 2000);
};