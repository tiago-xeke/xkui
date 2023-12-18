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

	xkrenderClone(viewContainer,container,items,index){
		for(var item of items){
			if(item.type === "component"){
				var VirtualElement = {
					name:item.name,type:"component",
					container:viewContainer,path:[...viewContainer.path,viewContainer],
					item:item.item,items:[]
				};
				xkfillComponent(this,VirtualElement);

				if(index === null){
					viewContainer.items.push(VirtualElement);
				}else{
					viewContainer.items.length > index
						? viewContainer.items.splice(index,0,VirtualElement)
						: viewContainer.items.push(VirtualElement);
				}

				if(item.items.length > 0){
					this.xkrenderClone(viewContainer.items[index === null ? viewContainer.items.length - 1 : index],container,buildedItems,index);
				}
			}else if(item.type === "element"){
				var DOMElement = document.createElement(item.name);
				var VirtualElement = {
					name:item.name,type:"element",item:DOMElement,attributes:{},items:[],
					container:viewContainer,
					path:[...viewContainer.path,viewContainer]
				};
				xkfillElement(this,VirtualElement);

				for(var [attributeName,attributeValue] of Object.entries(item.attributes)){
					DOMElement.setAttribute(attributeName,attributeValue);
					VirtualElement.attributes[attributeName] = attributeValue;
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
					this.xkrenderClone(viewContainer.items[index === null ? viewContainer.items.length - 1 : index],DOMElement,item.items,null);
				}
			}else if(item.type === "text"){
				var DOMElement = document.createTextNode(item.text);
				var VirtualElement = {
					text:item.text,type:"text",item:DOMElement,
					container:viewContainer,
					path:[...viewContainer.path,viewContainer]
				};
				xkfillText(this,VirtualElement);

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

			index++;
		}
	}

	xkrender(viewContainer,container,items,index){
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
					xkfillComponent(this,VirtualElement);

					if(index === null){
						viewContainer.items.push(VirtualElement);
					}else{
						viewContainer.items.length > index
							? viewContainer.items.splice(index,0,VirtualElement)
							: viewContainer.items.push(VirtualElement);
					}

					if(buildedItems.length > 0){
						this.xkrender(viewContainer.items[index === null ? viewContainer.items.length - 1 : index],container,buildedItems,index);
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
					xkfillElement(this,VirtualElement);

					for(var attribute of item.attributes){
						DOMElement.setAttribute(attribute.name,attribute.value);
						VirtualElement.attributes[attribute.name] = attribute.value;
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
						this.xkrender(viewContainer.items[index === null ? viewContainer.items.length - 1 : index],DOMElement,item.items,null);
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
					xkfillText(this,VirtualElement);

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