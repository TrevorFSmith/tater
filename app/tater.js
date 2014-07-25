var tater = {};
tater.boot = {};

tater.boot.resourceURLs = [
	{'type':'script', 'url':'static/jquery-1.10.2.js'},
	{'type':'script', 'url':'static/bootstrap-3.1/javascripts/bootstrap.min.js'},
	{'type':'script', 'url':'static/laconic.js'},
	{'type':'css', 'url':'compiled/tater.css'}
];

tater.boot.documentReady = function(){
	var container = $.el.div({'class':'container-fluid'});
	$('body').append(container);
	var row = container.append($.el.div({'class':'row'}));
	var col = row.append($.el.div({'class':'col-xs-12'}));
	col.append($.el.h1('Tater'));
}

tater.boot.setupOnloadCallback = function(element, callback){
	/*
		Calls callback when element (usually a script or css link) is loaded
	*/
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

tater.boot.injectCSS = function(url, callback){
	/*
		Injects a CSS link into the head element, calling callback when it is loaded
	*/
	var link = document.createElement('link');
	link.rel = 'stylesheet';
	tater.boot.setupOnloadCallback(link, callback);
	link.href = url;
	document.getElementsByTagName('head')[0].appendChild(link);
}

tater.boot.injectScript = function(url, callback){
	/*
		Injects a JS into the head element, calling callback when it is loaded
	*/
	var script = document.createElement("script")
	script.type = "text/javascript";
	tater.boot.setupOnloadCallback(script, callback);
	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}

tater.boot.resourceURLsIndex = 0;
tater.boot.injectNextResource = function(){
	/*
		Calls tater.injectScript on the resourceURLsIndex script in tater.resourceURLs
		Passes itself as the callback.
		When all scripts are loaded, calls tater.documentReady
	*/
	if(tater.boot.resourceURLsIndex < tater.boot.resourceURLs.length){
		var resource = tater.boot.resourceURLs[tater.boot.resourceURLsIndex];
		if(resource.type == 'script'){
			tater.boot.injectScript(resource.url, tater.boot.injectNextResource);
		} else if(resource.type == 'css'){
			tater.boot.injectCSS(resource.url, tater.boot.injectNextResource);
		} else {
			console.error('Unknown resource type', resource);
		}
		tater.boot.resourceURLsIndex += 1;
	} else {
		tater.boot.documentReady();
	}
}

tater.boot.injectNextResource();

