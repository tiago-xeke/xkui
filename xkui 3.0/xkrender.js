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

					var analysedItems = this.xkcore.xkeAnalyser.xkanalyse(component.render(componentAttributes));
					var buildedItems = this.xkcore.xkeAnalyser.xkbuild(analysedItems);

					var VirtualElement = {name:item.name,type:"component",item:component,items:[]};

					viewContainer.items.push(VirtualElement);

					if(buildedItems.length > 0){
						this.xkrender(viewContainer.items[viewContainer.items.length - 1],container,buildedItems);
					}
				}else{
					var DOMElement = document.createElement(item.name);
					var VirtualElement = {name:item.name,type:"tag",attributes:[],items:[]};

					for(var attribute of item.attributes){
						DOMElement.setAttribute(attribute.name,attribute.value);
						VirtualElement.attributes.push({name:attribute.name,value:attribute.value});
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
					var VirtualElement = {text:item.text,type:"text"};

					container.appendChild(DOMElement);
					viewContainer.items.push(VirtualElement);
				}
			}
		}
	}
}