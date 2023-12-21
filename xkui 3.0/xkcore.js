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
		var self = this;

		if(this.hasView(name)){
			this.view = {
				name:name,
				type:"view",
				path:["root"],
				container:"root",
				items:[],
				item:this.getView(name),
				handle:this.getContainer(),
				render:function(elements,index){
					if(typeof(elements) === "string"){
						var analysedItems = self.xkeAnalyser.xkanalyse(elements);
					 	var buildedItems = self.xkeAnalyser.xkbuild(analysedItems);

					 	self.xkeRender.xkrender(this,this.handle,buildedItems,index === undefined ? null : index,false);
					}else{
						self.xkeRender.xkrender(this,this.handle,elements.items,index === undefined ? null : index,true);
					}
				},
				clone:function(){
					var clonedView = {
						name:"clone",
						type:"clone",
						items:[{
							name:this.name,type:"component",items:[],item:{}
						}]
					};

					for(var [dataName,dataValue] of Object.entries(this.item)){
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

					scan(clonedView.items,this.items);

					return clonedView;
				},
				clear:function(){
					function scan(items){
						for(var item of items){
							item.delete();
						}
					}

					scan(this.items);
				},
				hasAttribute:function(name){
					return !(this.item.attributes[name] === undefined);
				},
				getAttribute:function(name){
					return this.item.attributes[name];
				},
				deleteAttribute:function(name){
					delete this.item.attributes[name];
				},
				setAttribute:function(name,value){
					this.item.attributes[name] = value;
				},
				toggleAttribute:function(name){
					var attributeValue = this.item.getAttribute(name);

					this.item.setAttribute(name,!attributeValue);
				},
				getScroll:function(){
					return{
						insertX:this.handle.scrollLeft,
						insertY:this.handle.scrollTop
					}
				},
				setScroll:function(x,y){
					this.handle.scrollLeft = x;
					this.handle.scrollTop = y;
				},
				getOffset:function(){
					var viewport = this.handle.getBoundingClientRect();

					return{
						scaleX:this.handle.offsetWidth,
						scaleY:this.handle.offsetHeight,
						scrollScaleX:this.handle.scrollWidth,
						scrollScaleY:this.handle.scrollHeight,
						insertX:this.handle.offsetLeft,
						insertY:this.handle.offsetTop,
						viewportInsertX:viewport.left,
						viewportInsertY:viewport.top
					}
				}
			}

			var viewItem = this.view;
			var viewItems = "";

			viewItem.item = new viewItem.item();

			if(viewItem.item.initializePreRender !== undefined){
				viewItem.item.initializePreRender();
			}

			viewItems = viewItem.item.render();

			var analysedItems = this.xkeAnalyser.xkanalyse(viewItems);
			var buildedItems = this.xkeAnalyser.xkbuild(analysedItems);

			this.xkeRender.xkrender(viewItem,viewItem.handle,buildedItems,null,false);

			if(viewItem.item.initializePostRender !== undefined){
				viewItem.item.initializePostRender();
			}
		}else{
			throw "This view do not exists";
		}
	}
}