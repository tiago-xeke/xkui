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

	xkrender(viewContainer,container,items,index,update){
		for(var item of items){
			if(item.type === "element"){
				if(this.xkcore.hasComponent(item.name)){
					var componentAttributes = {};

					for(var attribute of item.attributes){
						componentAttributes[attribute.name] = attribute.value;
					}

					var componentPath = this.xkcore.getComponent(item.name);
					var component = new componentPath();

					if(component.initializePreRender !== undefined){
						component.initializePreRender();
					}

					var analysedItems = this.xkcore.xkeAnalyser.xkanalyse(component.render(componentAttributes));
					var buildedItems = this.xkcore.xkeAnalyser.xkbuild(analysedItems);

					var mainItem = null;

					for(var item of buildedItems){
						if(item.type === "element"){
							mainItem = item;
							break;
						}
					}

					var DOMElement = document.createElement(mainItem.name);
					var VirtualElement = {
						name:item.name,type:"component",container:viewContainer,
						path:[...viewContainer.path,viewContainer],
						item:component,handle:DOMElement,items:[],
						render:function(elements,index){
							if(typeof(elements) === "string"){
								var analysedItems = render.xkcore.xkeAnalyser.xkanalyse(elements);
							 	var buildedItems = render.xkcore.xkeAnalyser.xkbuild(analysedItems);

							 	render.xkrender(this,viewContainer.item,buildedItems,index === undefined ? null : index,false);
							}else{
								render.xkrender(this,viewContainer.item,elements.items,index === undefined ? null : index,true);
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

							scan(clonedComponent,this.items);

							return clonedComponent;
						},
						move:function(container){
							var clone = this.clone();

							this.delete();

							return clone;
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

							this.clear();
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
						},
						setAttribute:function(name,value){
							this.item.attributes[name] = value;
						},
						toggleAttribute:function(name){
							var attributeValue = component.item.getAttribute(name);

							component.item.setAttribute(name,!attributeValue);
						}
					};

					for(var attribute of mainItem.attributes){
						DOMElement.setAttribute(attribute.name,attribute.value);
						VirtualElement.item.attributes[attribute.name] = attribute.value;
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

					if(buildedItems.length > 0){
						this.xkrender(viewContainer.items[index === null ? viewContainer.items.length - 1 : index],DOMElement,buildedItems,index,update);
					}

					if(component.initializePostRender !== undefined){
						component.initializePostRender();
					}
				}else{
					var DOMElement = document.createElement(item.name);
					var VirtualElement = {
						name:item.name,type:"element",item:{attributes:{}},handle:DOMElement,items:[],
						container:viewContainer,path:[...viewContainer.path,viewContainer],
						clone:function(){
							var clonedElement = {
								name:"clone",
								type:"clone",
								items:[{
									name:this.name,type:"element",item:{attributes:{}},items:[]
								}]
							};

							for(var [dataName,dataValue] of Object.entries(this.item)){
								clonedElement.items.item[dataName] = dataValue;
							}

							for(var [attributeName,attributeValue] of Object.entries(this.item.attributes)){
								clonedElement.items.item.attributes[attributeName] = attributeValue;
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

							scan(clonedElement.items,this.items);

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
							this.item.remove();
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
						}
					};

					for(var attribute of item.attributes){
						DOMElement.setAttribute(attribute.name,attribute.value);
						VirtualElement.item.attributes[attribute.name] = attribute.value;
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
						this.xkrender(viewContainer.items[index === null ? viewContainer.items.length - 1 : index],DOMElement,item.items,null,update);
					}
				}
			}else if(item.type === "text"){
				if(this.xkvalidateText(item.text)){
					var DOMElement = document.createTextNode(item.text);
					var VirtualElement = {
						text:item.text,type:"text",item:{},handle:DOMElement,
						container:viewContainer,
						path:[...viewContainer.path,viewContainer],
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
							this.item.remove();
							this.container.items.splice(this.index(),1);
						},
						getText:function(){
							return this.text;
						},
						setText:function(newText){
							this.text = newText;
							this.item.textContent = newText;
						}
					};

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

			index === null ? null : ++index;
		}
	}
}