function xkfillComponent(render,component){
	component.render = function(elements,index){
		if(typeof(elements) === "string"){
			var analysedItems = render.xkcore.xkeAnalyser.xkanalyse(elements);
		 	var buildedItems = render.xkcore.xkeAnalyser.xkbuild(analysedItems);

		 	render.xkrender(component,component.container.container,buildedItems,index === undefined ? null : index);
		}else{
			render.xkrenderClone(component,component.container.container,elements.items,index === undefined ? null : index);
		}
	}

	component.clone = function(){
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

		scan(clonedComponent,component.items);

		return clonedComponent;
	}

	component.move = function(container){
		var clone = component.clone();

		component.delete();

		return clone;
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

function xkfillElement(render,element){
	element.clone = function(){
		var clonedElement = {
			name:"clone",
			type:"clone",
			items:[{
				name:element.name,type:"element",attributes:{},items:[]
			}]
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

function xkfillText(render,text){
	text.clone = function(){
		var clonedItem = {
			name:"clone",
			type:"clone",
			items:[{
				text:text.text,type:"text"
			}]
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