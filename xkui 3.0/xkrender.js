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

	xkfillComponent(component){

		component.clone = function(){
			var clonedComponent = {
				name:"clone",
				items:{
					name:component.name,type:"component",items:[],item:{}
				}
			};

			for(var [dataName,dataValue] of Object.entries(component.item)){
				clonedComponent.items.item[dataName] = dataValue;
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

			scan(clonedComponent.items,component.items);

			return clonedComponent;
		}

		component.index = function(){
			return component.container.items.indexOf(component);
		}

		component.clear = function(){
			function scan(items){
				for(var item of items){
					item.delete();
				}
			}

			scan(component.items);
		}

		component.delete = function(){
			if(component.finalize !== undefined){
				component.finalize();
			}

			component.clear();
			component.container.items.splice(component.index(),1);
		}
		
		component.hasAttribute = function(name){
			return !(component.item.attributes[name] === undefined);
		}

		component.getAttribute = function(name){
			return component.item.attributes[name];
		}

		component.deleteAttribute = function(name){
			delete component.item.attributes[name];
		}

		component.setAttribute = function(name,value){
			component.item.attributes[name] = value;
		}

		component.toggleAttribute = function(name){
			var attributeValue = component.item.getAttribute(name);

			component.item.setAttribute(name,!attributeValue);
		}
	}

	xkfillElement(element){
		element.clone = function(){
			var clonedElement = {
				name:"clone",
				items:{
					name:element.name,type:"element",attributes:{},items:[]
				}
			};

			for(var [dataName,dataValue] of Object.entries(element.item)){
				clonedElement.items.item[dataName] = dataValue;
			}

			for(var [attributeName,attributeValue] of Object.entries(element.attributes)){
				clonedElement.items.attributes[attributeName] = attributeValue;
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

			scan(clonedElement.items,element.items);

			return clonedElement;
		}

		element.index = function(){
			return element.container.items.indexOf(element);
		}

		element.clear = function(){
			function scan(items){
				for(var item of items){
					item.delete();
				}
			}

			scan(element.items);
		}

		element.delete = function(){
			element.item.remove();
			element.container.items.splice(element.index(),1);
		}

		element.hasAttribute = function(name){
			return !(element.attributes[name] === undefined);
		}

		element.getAttribute = function(name){
			return element.attributes[name];
		}

		element.deleteAttribute = function(name){
			delete element.attributes[name];
			element.item.removeAttribute(name);
		}

		element.setAttribute = function(name,value){
			element.attributes[name] = value;
			element.item.setAttribute(name,value);
		}

		element.toggleAttribute = function(name){
			var hasAttribute = element.hasAttribute(name);

			if(!hasAttribute){
				element.setAttribute(name,true);
			}else{
				hasAttribute
					? element.deleteAttribute(name)
					: element.setAttribute(name,true);
			}
		}
	}

	xkfillText(text){
		text.clone = function(){
			var clonedItem = {
				name:"clone",
				items:{
					text:text.text,type:"text"
				}
			};

			return clonedItem.items;
		}

		text.index = function(){
			return text.container.items.indexOf(text);
		}

		text.delete = function(){
			text.item.remove();
			text.container.items.splice(text.index(),1);
		}

		text.getText = function(){
			return text.text;
		}

		text.setText = function(newText){
			text.text = newText;
			text.item.textContent = newText;
		}
	}

	xkrender(viewContainer,container,items){
		for(var item of items){
			if(item.type === "tag"){
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

					var VirtualElement = {
						name:item.name,type:"component",container:viewContainer,
						path:[...viewContainer.path,viewContainer],
						item:component,items:[]
					};
					this.xkfillComponent(VirtualElement);

					viewContainer.items.push(VirtualElement);

					if(buildedItems.length > 0){
						this.xkrender(viewContainer.items[viewContainer.items.length - 1],container,buildedItems);
					}

					if(component.initializePostRender !== undefined){
						component.initializePostRender();
					}
				}else{
					var DOMElement = document.createElement(item.name);
					var VirtualElement = {
						name:item.name,type:"element",item:DOMElement,attributes:{},items:[],
						container:viewContainer,
						path:[...viewContainer.path,viewContainer]
					};
					this.xkfillElement(VirtualElement);

					for(var attribute of item.attributes){
						DOMElement.setAttribute(attribute.name,attribute.value);
						VirtualElement.attributes[attribute.name] = attribute.value;
					}

					container.appendChild(DOMElement);
					viewContainer.items.push(VirtualElement);

					if(item.items.length > 0){
						this.xkrender(viewContainer.items[viewContainer.items.length - 1],DOMElement,item.items);
					}
				}
			}else if(item.type === "text"){
				if(this.xkvalidateText(item.text)){
					var DOMElement = document.createTextNode(item.text);
					var VirtualElement = {
						text:item.text,type:"text",item:DOMElement,
						container:viewContainer,
						path:[...viewContainer.path,viewContainer]
					};
					this.xkfillText(VirtualElement);

					container.appendChild(DOMElement);
					viewContainer.items.push(VirtualElement);
				}
			}
		}
	}
}