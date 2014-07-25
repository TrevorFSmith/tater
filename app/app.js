/*
	This file assumes that tater.js has loaded all of the requisite JS and CSS for Backbone, Bootstrap, Laconic, etc.
*/
var app = {};
app.views = {};

app.applyBaseCSS = function(){
	var context = $.s.context({
		'purple':'#F0F',
		'greenish':'#4F4',
		'testWidth':'90%'
	});
	context.append('This is a comment', { 'testHeight':250 });

	var bodySelector = context.append($.s.select('body', {
		'background-color':'@purple',
	}));

	var pageViewSelector = bodySelector.append($.s.select('.page-view', {
		'background-color':'@greenish',
		'border':'solid 1px #999',
		'width':'@{testWidth}',
		'height':'@{testHeight}px'
	}));

	pageViewSelector.append($.s.select('.sub-sub-view', {
		'display':'inline-block'
	}));

	context.apply();		
}

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