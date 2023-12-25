class xkeRender{
	constructor(xkcore){
		this.xkcore = xkcore;
	}

	xkvalidateText(string){
		for(var char of string){
			if(char !== " " && char !== "\n" && char !== "\t"){
				return true;
			}
		}

		return false;
	}

	xknewComponent(DOMElement,component,item,container){
		var self = this;
		
		var itemObject = {
			name:item.name,type:"component",text:"",
			path:[...container.path,container],container:container,
			item:component === null ? {} : component,handle:DOMElement,items:[],
			queryAll:function(attribute,value){
				var returnedItems = [];

				function scan(subItems){
					for(var subItem of subItems){
						if(subItem.type === "component" || subItem.type === "element"){
							if(subItem.hasAttribute(attribute)){
								if(subItem.getAttribute(attribute) === value){
									returnedItems.push(subItem);
								}
							}

							if(subItem.items.length > 0){
								scan(subItem.items);
							}
						}
					}
				}

				scan(this.items);

				return returnedItems;
			},
			query:function(attribute,value){
				var returnedItem;

				function scan(subItems){
					for(var subItem of subItems){
						if(subItem.type === "component" || subItem.type === "element"){
							if(subItem.hasAttribute(attribute)){
								if(subItem.getAttribute(attribute) === value){
									returnedItem = subItem;
									break;
								}
							}

							if(subItem.items.length > 0){
								scan(subItem.items);
							}
						}
					}
				}

				scan(this.items);

				return returnedItem;
			},
			stylize:function(attribute,style){
				var items = this.queryAll("xklocal::category",attribute);

				items.forEach(function(item){
					var randomCategory = `item${self.xkcore.randomID(10)}`;

					var buildedItems = self.xkcore.xksAnalyser.xkshortcut(style(item));

					var styleString = "";

					for(var property of buildedItems){
						styleString += `${property.name}:${property.value};`;
					}

					item.handle.classList.add(randomCategory);

					var styleSheet = document.createElement("style");

					styleSheet.innerHTML = `.${randomCategory}{
						${styleString}
					}`;

					document.head.appendChild(styleSheet);
				})
			},
			render:function(elements,index){
				if(typeof(elements) === "string"){
					var analysedItems = self.xkcore.xkeAnalyser.xkanalyse(elements);
				 	var buildedItems = self.xkcore.xkeAnalyser.xkbuild(analysedItems);

				 	self.xkrender(this,this.handle,buildedItems,index === undefined ? null : index,false);
				}else{
					self.xkrender(this,this.handle,elements.items,index === undefined ? null : index,true);
				}

				if(this.item.update !== undefined){
					this.item.update();
				}
				if(this.xkcore.view.item.update !== undefined){
					this.xkcore.view.item.update();
				}
			},
			clone:function(){
				var clonedComponent = {
					name:"clone",
					type:"clone",
					items:[]
				};

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
							var clonedItem = {name:item.name,type:"element",item:{attributes:{}},items:[]};

							for(var [attributeName,attributeValue] of Object.entries(item.item.attributes)){
								clonedItem.item.attributes[attributeName] = attributeValue;
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

				scan(clonedComponent,[this]);

				return clonedComponent;
			},
			move:function(newContainer){
				var clone = this.clone();

				newContainer.render(clone);

				this.delete();

				if(this.item.update !== undefined){
					this.item.update();
				}
				if(this.xkcore.view.item.update !== undefined){
					this.xkcore.view.item.update();
				}
			},
			index:function(){
				return this.container.items.indexOf(component);
			},
			clear:function(){
				function scan(items){
					for(var item of items){
						item.delete();
					}
				}

				scan(this.items);
			},
			delete:function(){
				if(this.finalize !== undefined){
					this.finalize();
				}

				this.handle.remove();
				this.container.items.splice(this.index(),1);
			},
			hasAttribute:function(name){
				return !(this.item.attributes[name] === undefined);
			},
			getAttribute:function(name){
				return this.item.attributes[name];
			},
			deleteAttribute:function(name){
				delete this.item.attributes[name];
				this.handle.removeAttribute(name);
			},
			setAttribute:function(name,value){
				this.item.attributes[name] = value;

				if(name === "xklocal::category" || name === "xklocal::name"){
					return;
				}else if(name === "xkevent::click"){
					var closestComponent;

					for(var component of this.path){
						if(component === this){
							continue;
						}

						if(component.type === "component"){
							closestComponent = component;
							break;
						}
					}
					if(closestComponent.item[value] !== undefined){
						this.handle.addEventListener("click",function(){
							closestComponent.item[value]();
						});
					}
				}

				this.handle.setAttribute(name,value);
			},
			toggleAttribute:function(name){
				var attributeValue = this.getAttribute(name);

				this.setAttribute(name,!attributeValue);
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
			},
			getText:function(){
				return this.text;
			},
			setText:function(newText){
				this.text = newText;
				this.handle.textContent = newText;
			}
		};

		itemObject.item["handle"] = itemObject;
		return itemObject;
	}

	xknewElement(DOMElement,item,container){
		var self = this;

		return{
			name:item.name,type:"element",text:"",item:{attributes:{}},handle:DOMElement,items:[],
			container:container,path:[...container.path,container],
			queryAll:function(attribute,value){
				var returnedItems = [];

				function scan(subItems){
					for(var subItem of subItems){
						if(subItem.type === "component" || subItem.type === "element"){
							if(subItem.hasAttribute(attribute)){
								if(subItem.getAttribute(attribute) === value){
									returnedItems.push(subItem);
								}
							}

							if(subItem.items.length > 0){
								scan(subItem.items);
							}
						}
					}
				}

				scan(this.items);

				return returnedItems;
			},
			query:function(attribute,value){
				var returnedItem;

				function scan(subItems){
					for(var subItem of subItems){
						if(subItem.type === "component" || subItem.type === "element"){
							if(subItem.hasAttribute(attribute)){
								if(subItem.getAttribute(attribute) === value){
									returnedItem = subItem;
									break;
								}
							}

							if(subItem.items.length > 0){
								scan(subItem.items);
							}
						}
					}
				}

				scan(this.items);

				return returnedItem;
			},
			stylize:function(attribute,style){
				var items = this.queryAll("xklocal::category",attribute);

				items.forEach(function(item){
					var randomCategory = `item${self.xkcore.randomID(10)}`;

					var buildedItems = self.xkcore.xksAnalyser.xkshortcut(style(item));

					var styleString = "";

					for(var property of buildedItems){
						styleString += `${property.name}:${property.value};`;
					}

					item.handle.classList.add(randomCategory);

					var styleSheet = document.createElement("style");

					styleSheet.innerHTML = `.${randomCategory}{
						${styleString}
					}`;

					document.head.appendChild(styleSheet);
				})
			},
			render:function(elements,index){
				if(typeof(elements) === "string"){
					var analysedItems = self.xkcore.xkeAnalyser.xkanalyse(elements);
				 	var buildedItems = self.xkcore.xkeAnalyser.xkbuild(analysedItems);

				 	self.xkrender(this,this.handle,buildedItems,index === undefined ? null : index,false);
				}else{
					self.xkrender(this,this.handle,elements.items,index === undefined ? null : index,true);
				}

				if(this.item.update !== undefined){
					this.item.update();
				}
				if(this.xkcore.view.item.update !== undefined){
					this.xkcore.view.item.update();
				}
			},
			clone:function(){
				var clonedElement = {
					name:"clone",
					type:"clone",
					items:[]
				};

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
							var clonedItem = {name:item.name,type:"element",item:{attributes:{}},items:[]};

							for(var [attributeName,attributeValue] of Object.entries(item.item.attributes)){
								clonedItem.item.attributes[attributeName] = attributeValue;
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

				scan(clonedElement,[this]);

				return clonedElement;
			},
			index:function(){
				return this.container.items.indexOf(this);
			},
			clear:function(){
				function scan(items){
					for(var item of items){
						item.delete();
					}
				}

				scan(this.items);
			},
			delete:function(){
				this.handle.remove();
				this.container.items.splice(this.index(),1);
			},
			move:function(newContainer){
				var clone = this.clone();

				newContainer.render(clone);

				this.delete();

				if(this.item.update !== undefined){
					this.item.update();
				}
				if(this.xkcore.view.item.update !== undefined){
					this.xkcore.view.item.update();
				}
			},
			hasAttribute:function(name){
				return !(this.item.attributes[name] === undefined);
			},
			getAttribute:function(name){
				return this.item.attributes[name];
			},
			deleteAttribute:function(name){
				delete this.item.attributes[name];
				this.handle.removeAttribute(name);
			},
			setAttribute:function(name,value){
				var thisItem = this;

				this.item.attributes[name] = value;

				if(name === "xklocal::category" || name === "xklocal::name"){
					return;
				}else if(name === "xkevent::click"){
					var closestComponent;

					for(var component of this.path){
						if(component === this){
							continue;
						}

						if(component.type === "component"){
							closestComponent = component;
							break;
						}
					}
					if(closestComponent.item[value] !== undefined){
						this.handle.addEventListener("click",function(){
							closestComponent.item[value](thisItem);
						});
					}
				}

				this.handle.setAttribute(name,value);
			},
			toggleAttribute:function(name){
				var hasAttribute = this.hasAttribute(name);

				if(!hasAttribute){
					this.setAttribute(name,true);
				}else{
					hasAttribute
						? this.deleteAttribute(name)
						: this.setAttribute(name,true);
				}
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
			},
			getText:function(){
				return this.text;
			},
			setText:function(newText){
				this.text = newText;
				this.handle.textContent = newText;
			}
		};
	}

	xknewText(DOMElement,item,container){
		return{
			text:item.text,type:"text",item:{},handle:DOMElement,
			container:container,
			path:[...container.path,container],
			clone:function(){
				var clonedItem = {
					name:"clone",
					type:"clone",
					items:[{
						text:this.text,type:"text"
					}]
				};

				return clonedItem.items;
			},
			index:function(){
				return this.container.items.indexOf(this);
			},
			delete:function(){
				this.handle.remove();
				this.container.items.splice(this.index(),1);
			},
			move:function(newContainer){
				var clone = this.clone();

				newContainer.render(clone);

				this.delete();
			},
			getText:function(){
				return this.text;
			},
			setText:function(newText){
				this.text = newText;
				this.item.textContent = newText;
			}
		}
	}

	xkrender(viewContainer,container,items,index,update){
		var self = this;

		for(var item of items){
			if(update){
				if(item.type === "component"){
					if(item.initializePreRender !== undefined){
						item.initializePreRender();
					}

					var DOMElement = document.createElement(item.name.split(":")[1]);
					var VirtualElement = this.xknewComponent(DOMElement,null,item,viewContainer);

					for(var [dataName,dataValue] of Object.entries(item.item)){
						VirtualElement.item[dataName] = dataValue;
					}

					for(var [attributeName,attributeValue] of Object.entries(VirtualElement.item.attributes)){
						VirtualElement.setAttribute(attributeName,attributeValue);
					}

					if(index === null){
						container.appendChild(DOMElement);
						viewContainer.items.push(VirtualElement);
					}else{
						container.insertBefore(DOMElement,container.childNodes.length > index 
							? container.childNodes[index]
							: container.childNodes[container.childNodes.length - 1]
						);

						viewContainer.items.length > index
							? viewContainer.items.splice(index,0,VirtualElement)
							: viewContainer.items.push(VirtualElement);
					}

					if(item.items.length > 0){
						this.xkrender(viewContainer.items[index === null ? viewContainer.items.length - 1 : index],DOMElement,item.items,null,true);
					}

					if(item.initializePostRender !== undefined){
						item.initializePostRender();
					}
					if(item.update !== undefined){
						item.update();
					}
				}else if(item.type === "element"){
					var DOMElement = document.createElement(item.name);
					var VirtualElement = this.xknewElement(DOMElement,item,viewContainer);

					for(var [dataName,dataValue] of Object.entries(item.item)){
						VirtualElement.item[dataName] = dataValue;
					}

					for(var [attributeName,attributeValue] of Object.entries(VirtualElement.item.attributes)){
						VirtualElement.setAttribute(attributeName,attributeValue);
					}

					if(index === null){
						container.appendChild(DOMElement);
						viewContainer.items.push(VirtualElement);
					}else{
						container.insertBefore(DOMElement,container.childNodes.length > index 
							? container.childNodes[index]
							: container.childNodes[container.childNodes.length - 1]
						);

						viewContainer.items.length > index
							? viewContainer.items.splice(index,0,VirtualElement)
							: viewContainer.items.push(VirtualElement);
					}

					if(item.items.length > 0){
						this.xkrender(viewContainer.items[index === null ? viewContainer.items.length - 1 : index],DOMElement,item.items,null,true);
					}
				}else if(item.type === "text"){
					if(this.xkvalidateText(item.text)){
						var DOMElement = document.createTextNode(item.text);
						var VirtualElement = this.xknewText(DOMElement,item,viewContainer);

						if(index === null){
							container.appendChild(DOMElement);
							viewContainer.items.push(VirtualElement);
						}else{
							container.insertBefore(DOMElement,container.childNodes.length > index 
								? container.childNodes[index]
								: container.childNodes[container.childNodes.length - 1]
							);

							viewContainer.items.length > index
								? viewContainer.items.splice(index,0,VirtualElement)
								: viewContainer.items.push(VirtualElement);
						}
					}
				}
			}else{
				if(item.type === "element"){
					if(this.xkcore.hasComponent(item.name)){
						//"component";

						var componentAttributes = {};

						for(var attribute of item.attributes){
							componentAttributes[attribute.name] = attribute.value;
						}

						var componentPath = this.xkcore.getComponent(item.name);
						var component = new componentPath();

						if(component.initializePreRender !== undefined){
							component.initializePreRender(componentAttributes);
						}

						var analysedItems = this.xkcore.xkeAnalyser.xkanalyse(component.render(componentAttributes));
						var buildedItems = this.xkcore.xkeAnalyser.xkbuild(analysedItems);

						var mainItem = null;

						for(var buildedItem of buildedItems){
							if(buildedItem.type === "element"){
								mainItem = buildedItem;
								break;
							}
						}

						var DOMElement = document.createElement(mainItem.name);
						var VirtualElement = this.xknewComponent(DOMElement,component,item,viewContainer);

						for(var attribute of mainItem.attributes){
							VirtualElement.setAttribute(attribute.name,attribute.value);
						}

						if(index === null){
							container.appendChild(DOMElement);
							viewContainer.items.push(VirtualElement);
						}else{
							container.insertBefore(DOMElement,container.childNodes.length > index 
								? container.childNodes[index]
								: container.childNodes[container.childNodes.length - 1]
							);

							viewContainer.items.length > index
								? viewContainer.items.splice(index,0,VirtualElement)
								: viewContainer.items.push(VirtualElement);
						}

						if(mainItem.items.length > 0){
							this.xkrender(viewContainer.items[index === null ? viewContainer.items.length - 1 : index],DOMElement,mainItem.items,index,false);
						}

						if(component.initializePostRender !== undefined){
							component.initializePostRender();
						}
						if(component.update !== undefined){
							component.update();
						}
					}else{
						var DOMElement = document.createElement(item.name);
						var VirtualElement = this.xknewElement(DOMElement,item,viewContainer);

						for(var attribute of item.attributes){
							VirtualElement.setAttribute(attribute.name,attribute.value);
						}

						if(index === null){
							container.appendChild(DOMElement);
							viewContainer.items.push(VirtualElement);
						}else{
							container.insertBefore(DOMElement,container.childNodes.length > index 
								? container.childNodes[index]
								: container.childNodes[container.childNodes.length - 1]
							);

							viewContainer.items.length > index
								? viewContainer.items.splice(index,0,VirtualElement)
								: viewContainer.items.push(VirtualElement);
						}

						if(item.items.length > 0){
							this.xkrender(viewContainer.items[index === null ? viewContainer.items.length - 1 : index],DOMElement,item.items,null,false);
						}
					}
				}else if(item.type === "text"){
					if(this.xkvalidateText(item.text)){
						var DOMElement = document.createTextNode(item.text);
						var VirtualElement = this.xknewText(DOMElement,item,viewContainer);

						if(index === null){
							container.appendChild(DOMElement);
							viewContainer.items.push(VirtualElement);
						}else{
							container.insertBefore(DOMElement,container.childNodes.length > index 
								? container.childNodes[index]
								: container.childNodes[container.childNodes.length - 1]
							);

							viewContainer.items.length > index
								? viewContainer.items.splice(index,0,VirtualElement)
								: viewContainer.items.push(VirtualElement);
						}
					}
				}
			}

			index === null ? null : index++;
		}
	}
}