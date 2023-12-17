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

			var viewItem = this.view;

			viewItem.clone = function(){
				var clonedView = {
					name:"clone",
					items:{
						name:viewItem.name,type:"component",items:[],item:{}
					}
				};

				for(var [dataName,dataValue] of Object.entries(viewItem.item)){
					clonedView.items.item[dataName] = dataValue;
				} 

				function scan(container,items){
					for(var item of items){
						if(item.type === "component"){
							var clonedItem = {name:item.name,type:"component",items:[],item:{}};

							for(var [dataName,dataValue] of Object.entries(item.item)){
								clonedItem.item[dataName] = dataValue;
							}

							if(item.items.length > 0){
								scan(clonedItem,item.items);
							}

							container.items.push(clonedItem);
						}else if(item.type === "element"){
							var clonedItem = {name:item.name,type:"element",attributes:{},items:[],item:{}};

							for(var [attributeName,attributeValue] of Object.entries(item.attributes)){
								clonedItem.attributes[attributeName] = attributeValue;
							}

							for(var [dataName,dataValue] of Object.entries(item.item)){
								clonedItem.item[dataName] = dataValue;
							}

							if(item.items.length > 0){
								scan(clonedItem,item.items);
							}

							container.items.push(clonedItem);
						}else if(item.type === "text"){
							var clonedItem = {text:item.text,type:"text"};

							container.items.push(clonedItem);
						}
					}
				}

				scan(clonedView.items,viewItem.items);

				return clonedView;
			}

			viewItem.clear = function(){
				function scan(items){
					for(var item of items){
						item.delete();
					}
				}

				scan(viewItem.items);
			}

			viewItem.hasAttribute = function(name){
				return !(viewItem.item.attributes[name] === undefined);
			}

			viewItem.getAttribute = function(name){
				return viewItem.item.attributes[name];
			}

			viewItem.deleteAttribute = function(name){
				delete viewItem.item.attributes[name];
			}

			viewItem.setAttribute = function(name,value){
				viewItem.item.attributes[name] = value;
			}

			viewItem.toggleAttribute = function(name){
				var attributeValue = viewItem.item.getAttribute(name);

				viewItem.item.setAttribute(name,!attributeValue);
			}

			viewItem.getScroll = function(){
				return{
					insertX:viewItem.container.scrollLeft,
					insertY:viewItem.container.scrollTop
				}
			}

			viewItem.setScroll = function(x,y){
				viewItem.container.scrollLeft = x;
				viewItem.container.scrollTop = y;
			}

			viewItem.getOffset = function(){
				var viewport = viewItem.container.getBoundingClientRect();

				return{
					scaleX:viewItem.container.offsetWidth,
					scaleY:viewItem.container.offsetHeight,
					scrollScaleX:viewItem.container.scrollWidth,
					scrollScaleY:viewItem.container.scrollHeight,
					insertX:viewItem.container.offsetLeft,
					insertY:viewItem.container.offsetTop,
					viewportInsertX:viewport.left,
					viewportInsertY:viewport.top
				}
			}

			var viewItems = "";

			if(typeof(viewItem.item.render) === "function"){
				viewItems = viewItem.item.render();
			}else{
				viewItems = viewItem.item.render;
			}

			var analysedItems = this.xkeAnalyser.xkanalyse(viewItems);
			var buildedItems = this.xkeAnalyser.xkbuild(analysedItems);

			this.xkeRender.xkrender(viewItem,viewItem.container,buildedItems);
		}else{
			throw "This view do not exists";
		}
	}
}