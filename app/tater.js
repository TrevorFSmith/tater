var tater = {};

tater.resourceURLs = [
	{'type':'script', 'url':'static/jquery-1.10.2.js'},
	{'type':'script', 'url':'static/bootstrap-3.1/javascripts/bootstrap.min.js'},
	{'type':'script', 'url':'static/laconic.js'},
	{'type':'css', 'url':'compiled/tater.css'}
];

tater.documentReady = function(){
	var container = $.el.div({'class':'container-fluid'});
	$('body').append(container);
	var row = container.append($.el.div({'class':'row'}));
	var col = row.append($.el.div({'class':'col-xs-12'}));
	col.append($.el.h1('Tater'));
}

tater.setupOnloadCallback = function(element, callback){
	if(typeof callback == 'undefined') return;
	if (element.readyState) { //IE
		element.onreadystatechange = function () {
			if (element.readyState == "loaded" || element.readyState == "complete") {
				element.onreadystatechange = null;
				callback();
			}
		};
	} else { //Others
		element.onload = function () {
			callback();
		};
	}
}

tater.injectCSS = function(url, callback){
	/*
		Injects a CSS link into the head element, calling callback when it is loaded
	*/
	var link = document.createElement('link');
	link.rel = 'stylesheet';
	tater.setupOnloadCallback(link, callback);
	link.href = url;
	document.getElementsByTagName('head')[0].appendChild(link);
}

tater.injectScript = function(url, callback){
	/*
		Injects a JS into the head element, calling callback when it is loaded
	*/
	var script = document.createElement("script")
	script.type = "text/javascript";
	tater.setupOnloadCallback(script, callback);
	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}

tater.resourceURLsIndex = 0;
tater.injectNextResource = function(){
	/*
		Calls tater.injectScript on the resourceURLsIndex script in tater.resourceURLs
		Passes itself as the callback.
		When all scripts are loaded, calls tater.documentReady
	*/
	if(tater.resourceURLsIndex < tater.resourceURLs.length){
		var resource = tater.resourceURLs[tater.resourceURLsIndex];
		if(resource.type == 'script'){
			tater.injectScript(resource.url, tater.injectNextResource);
		} else if(resource.type == 'css'){
			tater.injectCSS(resource.url, tater.injectNextResource);
		} else {
			console.error('Unknown resource type', resource);
		}
		tater.resourceURLsIndex += 1;
	} else {
		tater.documentReady();
	}
}

tater.injectNextResource();

