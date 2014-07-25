
/*
	JSS simplifies the generation of CSS content.

		var context = $.s.context({
			'purple':'#FF0',
			'testWidth':200
		});
		context.append('This is a comment', { 'testHeight':250 });

		var bodySelector = context.append($.s.select('body', {'background-color':'#F00'}));
		bodySelector.append($.s.select('.page', {
			'border':'solid 1px #999',
			'background-color':'@purple',
			'width':'@{testWidth}px',
			'height':'@{testHeight}px',
		}));
		context.render();

		// This is a comment
		body {
			background-color: #F00;
		}
		body .page {
			border: solid 1px #999;
			background-color: #FF0;
			width: 200px;
			height: 250px;
		}
*/
(function(context) {
	var jss = {};

	var ContextId = 0;

	var Context = function(variables){
		this.id = 'css' + ContextId++;
		this.variables = jQuery.extend(true, {}, variables);
		this.children = [];

		this.append = function(){
			/*
				Add to this context a variable number of arguments

				String arguments are added as comments

				Arguments with `render` functions are rendered as children (most likely selectors)
				
				Object arguments like maps are mapped to this.variables:
					context.append({'red':'#F00'});
					context.variables.red; // returns '#F00'

				Returns the first argument:
					var foo = context.append($.s.select('.page')); // assigns to foo the .page selector
			*/
			for(var i=0; i < arguments.length; i++){
				var arg = arguments[i];

				if(typeof arg == 'string'){
					this.children[this.children.length] = arg;
					continue;					
				}

				if(typeof arg.render == 'function'){
					this.children[this.children.length] = arg;
					continue;
				}

				if(typeof arg == 'object'){
					this.variables = jQuery.extend(true, arg, this.variables);
					continue;
				}

				console.error("Unhandled context argument type", typeof arg, arg);
			}
			if(arguments.length > 0) return arguments[0];
			return null;
		}

		this.apply = function(){
			// Apply this CSS context to the `document`
			var style = document.getElementById(this.id);
			if(style == null) {
				style = document.createElement("style");
				style.id = this.id;
				style.type = 'text/css';
				document.head.appendChild(style);   
			}
			style.innerHTML = this.render(this.variables);
		}

		this.render = function(variables){
			var result = '/* Rendered by jss */\n';
			for(var i=0; i < this.children.length; i++){
				var child = this.children[i];
				if(typeof child == 'string'){
					result += '/* ' + child + ' */\n';
					continue;
				}
				if(typeof child.render == 'function'){
					result += child.render(this.variables, []) + '\n';
					continue;
				}
				console.error('Unhandled context child type', typeof child, child);
			}
			return result;
		}
		_.bindAll(this, 'render', 'append', 'apply');		
	}

	var Selector = function(){
		if(arguments.length < 1){
			throw 'The first argument when creating a selector must be a CSS selector';
		}
		this.selector = arguments[0];
		this.children = [];
		this.attributes = {};

		this.append = function(){
			/*
				Add to this selector a variable number of arguments

				String arguments are added as comments

				Arguments with `render` functions are rendered as children (most likely selectors)
				
				Object arguments like maps are mapped to this.attributes:
					selector.append({'red':'#F00'});
					selector.attributes.red; // returns '#F00'

				Returns the first argument:
					var foo = selector.append($.s.select('.page')); // assigns to foo the .page selector
			*/
			for(var i=0; i < arguments.length; i++){
				var arg = arguments[i];

				if(typeof arg == 'string' || typeof arg.render == 'function'){
					this.children[this.children.length] = arg;
					continue;					
				}
				if(typeof arg == 'object'){
					this.attributes = jQuery.extend(true, arg, this.variables);
					continue;
				}

				console.error("Unhandled context argument type", typeof arg, arg);
			}

			if(arguments.length > 0) return arguments[0];
			return null;
		}

		this.render = function(variables, parentSelectors){
			var selectors = parentSelectors.slice(0);
			selectors[selectors.length] = this.selector;
			var result = selectors.join(' ') + ' {\n';
			for(var key in this.attributes){
				result += '\t' + key + ': ' + this._compileValue(variables, this.attributes[key]) + ';\n';
			}
			result += '}\n';

			for(var i=0; i < this.children.length; i++){
				var child = this.children[i];
				if(typeof child == 'string'){
					result += '/* ' + child + ' */\n';
					continue;
				}
				if(typeof child.render == 'function'){
					result += child.render(variables, selectors);
					continue;
				}
				console.error('Unhandled selector child type', typeof child, child);
			}
			return result;
		}

		this._compileValue = function(variables, value){
			/*
				Render the CSS value by replacing the variables.
			*/
			for(var key in variables){
				if('@' + key == value) return variables[key];
			}

			var result = value;
			for(var key in variables){
				result = result.replace('@{' + key + '}', variables[key]);
			}
			return result;
		}

		this.append.apply(this, Array.prototype.slice.call(arguments, 1));
		_.bindAll(this, 'render', 'append');
	}

	jss['constructApply'] = function(constructor, args){
		/*
			Call `new constructor` with args applied as `arguments` (instead of passing a single array argument).
			`jss.constructApply(Something, ['one', 'two', 'three'])` is like calling `new Something('one', 'two', 'three')`
		*/
		function F() {
			return constructor.apply(this, args);
		}
		F.prototype = constructor.prototype;
		return new F();
	}

	jss['context'] = function(){
		return jss.constructApply(Context, arguments);
	}

	jss['select'] = function(){
		return jss.constructApply(Selector, arguments);
	}

	if(typeof module !== 'undefined' && module.exports) {
		// In a CommonJS environment, export our methods
		module.exports = jss;
	} else {
		// otherwise, attach to the $.s namespace
		var dollar = context.$ || {};
		dollar.s = jss;
		context.$ = dollar;
	}
}(this));
