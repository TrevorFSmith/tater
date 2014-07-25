/*
	This file assumes that tater.js has loaded all of the requisite JS and CSS for Backbone, Bootstrap, Laconic, etc.
*/
console.log("App.js")
var app = {};
app.views = {};

app.views.PageView = Backbone.View.extend({
	className: 'page-view',
	initialize: function(){
		var container = $.el.div({'class':'container-fluid'});
		this.$el.append(container);
		var row = container.append($.el.div({'class':'row'}));
		var col = row.append($.el.div({'class':'col-xs-12'}));
		col.append($.el.h1('Tater'));
	}
})