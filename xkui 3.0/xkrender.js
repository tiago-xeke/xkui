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
		var self = this;

		for(var item of items){
			if(update){
				if(item.type === "component"){
					if(item.initializePreRender !== undefined){
						item.initializePreRender();
					}

					var DOMElement = document.createElement(item.name.split(":")[1]);
					var VirtualElement = {
						name:item.name,type:"component",
						path:[...viewContainer.path,viewContainer],container:viewContainer,
						item:{},handle:DOMElement,items:[],
						render:function(elements,index){
							if(typeof(elements) === "string"){
								var analysedItems = self.xkcore.xkeAnalyser.xkanalyse(elements);
							 	var buildedItems = self.xkcore.xkeAnalyser.xkbuild(analysedItems);

							 	self.xkrender(this,this.handle,buildedItems,index === undefined ? null : index,false);
							}else{
								self.xkrender(this,this.handle,elements.items,index === undefined ? null : index,true);
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
						},
						setAttribute:function(name,value){
							this.item.attributes[name] = value;
						},
						toggleAttribute:function(name){
							var attributeValue = component.item.getAttribute(name);

							component.item.setAttribute(name,!attributeValue);
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
					};

					for(var [dataName,dataValue] of Object.entries(item.item)){
						VirtualElement.item[dataName] = dataValue;
					}

					for(var [attributeName,attributeValue] of Object.entries(VirtualElement.item.attributes)){
						DOMElement.setAttribute(attributeName,attributeValue);
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
				}else if(item.type === "element"){
					var DOMElement = document.createElement(item.name);
					var VirtualElement = {
						name:item.name,type:"element",item:{},handle:DOMElement,items:[],
						container:viewContainer,path:[...viewContainer.path,viewContainer],
						render:function(elements,index){
							if(typeof(elements) === "string"){
								var analysedItems = self.xkcore.xkeAnalyser.xkanalyse(elements);
							 	var buildedItems = self.xkcore.xkeAnalyser.xkbuild(analysedItems);

							 	self.xkrender(this,this.handle,buildedItems,index === undefined ? null : index,false);
							}else{
								self.xkrender(this,this.handle,elements.items,index === undefined ? null : index,true);
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
					};

					for(var [dataName,dataValue] of Object.entries(item.item)){
						VirtualElement.item[dataName] = dataValue;
					}

					for(var [attributeName,attributeValue] of Object.entries(VirtualElement.item.attributes)){
						DOMElement.setAttribute(attributeName,attributeValue);
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
			}else{
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

						for(var buildedItem of buildedItems){
							if(buildedItem.type === "element"){
								mainItem = buildedItem;
								break;
							}
						}

						var DOMElement = document.createElement(mainItem.name);
						var VirtualElement = {
							name:`${item.name}:${mainItem.name}`,type:"component",
							path:[...viewContainer.path,viewContainer],container:viewContainer,
							item:component,handle:DOMElement,items:[],
							render:function(elements,index){
								if(typeof(elements) === "string"){
									var analysedItems = self.xkcore.xkeAnalyser.xkanalyse(elements);
								 	var buildedItems = self.xkcore.xkeAnalyser.xkbuild(analysedItems);

								 	self.xkrender(this,this.handle,buildedItems,index === undefined ? null : index,false);
								}else{
									self.xkrender(this,this.handle,elements.items,index === undefined ? null : index,true);
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

						if(mainItem.items.length > 0){
							this.xkrender(viewContainer.items[index === null ? viewContainer.items.length - 1 : index],DOMElement,mainItem.items,index,false);
						}

						if(component.initializePostRender !== undefined){
							component.initializePostRender();
						}
					}else{
						var DOMElement = document.createElement(item.name);
						var VirtualElement = {
							name:item.name,type:"element",item:{attributes:{}},handle:DOMElement,items:[],
							container:viewContainer,path:[...viewContainer.path,viewContainer],
							render:function(elements,index){
								if(typeof(elements) === "string"){
									var analysedItems = self.xkcore.xkeAnalyser.xkanalyse(elements);
								 	var buildedItems = self.xkcore.xkeAnalyser.xkbuild(analysedItems);

								 	self.xkrender(this,this.handle,buildedItems,index === undefined ? null : index,false);
								}else{
									self.xkrender(this,this.handle,elements.items,index === undefined ? null : index,true);
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
							this.xkrender(viewContainer.items[index === null ? viewContainer.items.length - 1 : index],DOMElement,item.items,null,false);
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
			}

			index === null ? null : index++;
		}
	}
}