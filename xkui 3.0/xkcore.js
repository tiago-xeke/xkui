class xkui{
	constructor(){
		this.container = document.body;

		this.views = {};
		this.view = {};

		this.components = {};

		//XKE - XKElements
		//XKS - XKStyles
		//XKC - XKCode

		this.xkeAnalyser = new xkeAnalyser();
		this.xkeRender = new xkeRender(this);
	}

	//Containers

	setContainer(container){
		if(typeof(container) === "string"){
			this.container = document.querySelector(container);
		}else{
			this.container = container;
		}
	}

	getContainer(){
		return this.container;
	}

	//Views

	setView(name,elements){
		this.views[name] = elements;
	}

	hasView(name){
		return !(this.views[name] === undefined);
	}

	getView(name){
		if(this.hasView(name)){
			return this.views[name];
		}else{
			throw "This view do not exists";
		}
	}

	deleteView(name){
		if(this.hasView(name)){
			delete this.views[name];
		}else{
			throw "This view do not exists";
		}
	}

	setComponent(name,elements){
		this.components[name] = elements;
	}

	hasComponent(name){
		return !(this.components[name] === undefined);
	}

	getComponent(name){
		if(this.hasComponent(name)){
			return this.components[name];
		}else{
			throw "This component do not exists";
		}
	}

	deleteComponent(name){
		if(this.hasComponent(name)){
			delete this.components[name];
		}else{
			throw "This component do not exists";
		}
	}

	renderView(name){
		if(this.hasView(name)){
			this.view = {
				name:name,
				type:"view",
				container:this.getContainer(),
				path:[this.getContainer()],
				items:[],
				item:this.getView(name)
			}

			var view = this.view;

			view.item.hasAttribute = function(name){
				return view.item.attributes[name] === undefined;
			}

			view.item.getAttribute = function(name){
				return view.item.attributes[name];
			}

			view.item.deleteAttribute = function(name){
				delete view.item.attributes[name];
			}

			view.item.setAttribute = function(name,value){
				view.item.attributes[name] = value;
			}

			view.item.toggleAttribute = function(name){
				var attributeValue = view.item.getAttribute(name);

				view.item.setAttribute(name,!attributeValue);
			}

			view.item.getScroll = function(){
				return{
					insertX:view.container.scrollLeft,
					insertY:view.container.scrollTop
				}
			}

			view.item.setScroll = function(x,y){
				view.container.scrollLeft = x;
				view.container.scrollTop = y;
			}

			view.item.getOffset = function(){
				var viewport = view.container.getBoundingClientRect();

				return{
					scaleX:view.container.offsetWidth,
					scaleY:view.container.offsetHeight,
					scrollScaleX:view.container.scrollWidth,
					scrollScaleY:view.container.scrollHeight,
					insertX:view.container.offsetLeft,
					insertY:view.container.offsetTop,
					viewportInsertX:viewport.left,
					viewportInsertY:viewport.top
				}
			}

			var viewItems = "";

			if(typeof(view.item.render) === "function"){
				viewItems = view.item.render();
			}else{
				viewItems = view.item.render;
			}

			var analysedItems = this.xkeAnalyser.xkanalyse(viewItems);
			var buildedItems = this.xkeAnalyser.xkbuild(analysedItems);

			this.xkeRender.xkrender(view,view.container,buildedItems);
		}else{
			throw "This view do not exists";
		}
	}
}