var xkeAnalyser = function(){
    var self = this;
    self.shortItems = [];
    self.ignoreItems = [];
    self.shortAttributes = [];

    self.restoreAttribute = function(string){
        var newString = string.replaceAll("xk1","'");
        newString = newString.replaceAll("xk2",'"');
        newString = newString.replaceAll("xkignore1","xk1");
        return newString.replaceAll("xkignore2","xk2");
    }

    self.restoreText = function(string){
        var newString = string.replaceAll("xk3","<");
        newString = newString.replaceAll("xk4",">");
        newString = newString.replaceAll("xkignore3","xk3");
        return newString.replaceAll("xkignore4","xk4");
    }

    this.xkaddShortItem = function(item){
        self.shortItems.push(item.toLowerCase());
    }

    this.xkaddIgnoreItem = function(item){
        self.ignoreItems.push(item.toLowerCase());
    }

    this.xkaddShortAttribute = function(attribute){
        self.shortAttributes.push(attribute.toLowerCase());
    }

    this.xkanalyse = function(string){
        var isIgnoredItem = false;
        var ignoredItemName = "";
        var analysedElements = [];

        function addItems(items){
            for(var item of items){
                var newElement = {};

                for(var [name,value] of Object.entries(item)){
                    newElement[name] = value;
                }

                if(item.text.length > 0){analysedElements.push(newElement)}
            }
        }

        function analyseString(index){
            var quoteType = string[index];
            var text = string[index];

            for(var index01 = index + 1;index01 < string.length;index01++){
                text += string[index01];

                if(string[index01] == quoteType){
                    addItems([{text:text,type:"string"}]);
                    return index01;
                }
            }
        }

        function analyseNumber(index){
            var text = "";

            for(var index01 = index;index01 < string.length;index01++){
                if(/[0-9]/.test(string[index01]) == false){
                    addItems([{text:text,type:"number"}]);
                    return index01 - 1;
                }

                text += string[index01];
            }
        }

        function analyseTag(index){
            var isCloseTag = string[index] == "/";
            var afterName = false;
            var text = "";

            for(var index01 = isCloseTag ? index + 1 : index;index01 < string.length;index01++){
                var char = string[index01];

                if(/[a-z,A-Z,0-9,-,:]/.test(char) == false && !(afterName && isCloseTag)){
                    if(!afterName){
                        if(self.ignoreItems.includes(text.toLowerCase()) && self.shortItems.includes(text.toLowerCase()) === false){
                            isIgnoredItem = true;
                            ignoredItemName = text.toLowerCase();
                        }
                    }

                    addItems([{text:text,type:afterName ? "attribute" : "name"}]);

                    if(afterName == false){
                        afterName = true;
                    }

                    text = "";
                }

                if(/[0-9]/.test(char) && afterName && !(isCloseTag)){
                    var newIndex = analyseNumber(index01);
                    index01 = newIndex;
                    continue;
                }

                if((char == "'" || char == '"') && !(isCloseTag)){
                    var newIndex = analyseString(index01);
                    index01 = newIndex;
                    continue;
                }

                if(char == " "){
                    continue;
                }

                if(char == "=" && !(isCloseTag)){addItems([{text:"=",type:"equal"}])}
                if(char == "/" && !(isCloseTag)){addItems([{text:"/",type:"closeBar"}])}

                if(char == ">"){
                    addItems([{text:">",type:"tagEnd"}]);

                    var newIndex = index01;
                    return newIndex;
                }

                if(/[a-z,A-Z,0-9,-,:]/.test(char)){
                    text += char;
                }
            }
        }

        function analyseText(index){
            var text = "";

            for(var index01 = index+1;index01 < string.length;index01++){
                var char = string[index01];

                if(char == "<" && (
                    (/[a-z,A-Z,0-9]/.test(string[index01+1])) || (string[index01+1] == "/" && /[a-z,A-Z,0-9]/.test(string[index01+2]))
                )){
                    addItems([{text:text,type:"text"}]);
                    return index01-1;
                }

                text += char;

                if(index01 == string.length-1){
                    addItems([{text:text,type:"text"}]);
                    return string.length;
                }
            }
        }

        function analyseIgnoredItem(index){
            var text = "";

            for(var index01 = index+1;index01 < string.length;index01++){
                var char = string[index01];

                if(char == "<" && string[index01+1] === "/" && string.toLowerCase().indexOf(ignoredItemName,index01+2) === (index01+2)){
                    addItems([{text:text,type:"text"}]);
                    return index01-1;
                }

                text += char;

                if(index01 == string.length-1){
                    addItems([{text:text,type:"text"}]);
                    return string.length;
                }
            }
        }

        for(var index01 = 0;index01 < string.length;index01++){
            var char = string[index01];

             if(isIgnoredItem){

                var newIndex = analyseIgnoredItem(index01-1);
                index01 = newIndex;

                isIgnoredItem = false;

            }else if(char == "<" && /[a-z,A-Z,0-9,/]/.test(string[index01+1])){

                if(string[index01+1] == "/"){
                    addItems([{text:"</",type:"closeTagInit"}]);
                }else{
                    addItems([{text:"<",type:"tagInit"}]);
                }

                var newIndex = analyseTag(index01+1);
                index01 = newIndex;

            }else{

                var newIndex = analyseText(index01-1);
                index01 = newIndex;

            }
        }

        return analysedElements;
    }

    this.xkbuild = function(items){
        var buildedElements = {items:[]};
        var deep = [buildedElements];

        function analyseAttribute(index,name){
            var attribute = {name:name,value:"value"};
            var haveValue = false;

            if(self.shortAttributes.includes(name)){
                attribute.value = attribute.name;
                return {index:index,name:attribute.name,value:attribute.value};
            }

            for(var index01 = index;index01< items.length;index01++){
                var item = items[index01];

                if(item.type == "equal"){haveValue = true}

                if(haveValue && (item.type == "string" || item.type == "number")){
                    attribute.value = item.type == "string" ? self.restoreAttribute(item.text.slice(1,-1)) : item.text;
                    return {index:index01,name:attribute.name,value:attribute.value};
                }
            }
        }

        function analyseTag(index,tag,short){
            for(var index01 = index;index01 < items.length;index01++){
                var item = items[index01];

                if(item.type == "name"){continue}

                if(item.type == "tagEnd"){
                    if(!(short)){deep.push(tag)}
                    return index01;
                }

                if(item.type == "attribute"){
                    var attribute = analyseAttribute(index01,item.text);

                    tag.attributes.push({name:attribute.name,value:attribute.value});
                    index01 = attribute.index;
                }
            }
        }

        for(var index01 = 0;index01 < items.length;index01++){
            var item = items[index01];

            var addIn = deep[deep.length-1].items;

            if(item.type == "tagInit"){
                if(items[index01+1].type == "name"){

                    var isShort = self.shortItems.includes(items[index01+1].text);

                    addIn.push({name:items[index01+1].text,attributes:[],items:[],type:"element"});         

                    var newIndex = analyseTag(index01+1,addIn[addIn.length-1],isShort);
                    index01 = newIndex;

                }
            }else if(item.type == "closeTagInit"){
                deep.pop();

                var newIndex = index01+2;
                index01 = newIndex;

            }else if(item.type == "text"){

                addIn.push({text:self.restoreText(item.text),type:"text"});

            }
        }

        return buildedElements.items;
    }
}

var xksAnalyser = function(){
    var self = this;

    self.customPropertys = [];
    self.transpiledPropertys = [];

    this.xkaddProperty = function(name,callback){
        self.customPropertys.push({
            name:name,
            callback:callback
        });
    }

    this.xkaddTranspiledProperty = function(name,newName){
        self.transpiledPropertys.push({
            name:name,
            newName:newName
        });
    }

    self.xkanalyse = function(string){
        var propertys = [];

        function addItems(items){
            for(var item of items){
                var newElement = {};

                for(var [name,value] of Object.entries(item)){
                    newElement[name] = value;
                }

                if(item.text.length > 0){propertys.push(newElement)}
            }
        }

        function analyseProperty(index){
            var afterName = false;
            var text = "";

            for(var index01 = index;index01 < string.length;index01++){
                var char = string[index01];

                if(!afterName && char === " "){
                    continue;
                }

                if(/[a-z,A-Z,0-9,#,-,(,)]/.test(char)){
                    text += char;
                }

                if(!afterName && char === ":"){
                    addItems([{text:text,type:"propertyName"}]);
                    afterName = true;

                    text = "";
                }

                if(afterName && char === " "){
                    addItems([{text:text,type:"propertyValue"}]);

                    text = "";
                }

                if(afterName && (char === "\n" || char === ";")){
                    addItems([{text:text,type:"propertyValue"}]);
                    return index01;
                }

                if(index01 === string.length-1){
                    addItems([{text:text,type:afterName ? "propertyValue" : "propertyName"}]);
                    return string.length;
                }
            }
        }

        for(var index01 = 0;index01 < string.length;index01++){
            var char = string[index01];

            if(/[a-z,A-Z,0-9,#,-]/.test(char)){

                var newIndex = analyseProperty(index01);
                index01 = newIndex;

            }
        }

        return propertys;
    }

    self.xkbuild = function(items){
        var propertys = [];

        for(var item of items){
            if(item.type === "propertyName"){
                propertys.push({
                    name:item.text,
                    value:"",
                    type:"property"
                })
            }else if(item.type === "propertyValue"){
                propertys[propertys.length - 1].value += propertys[propertys.length - 1].value === ""
                    ?  `${item.text}`
                    : ` ${item.text}`;
            }
        }

        return propertys;
    }

    self.xktranspile = function(items){
        var propertys = [];

        main:for(var item of items){
            for(var property of self.customPropertys){
                if(property.name === item.name){
                    propertys = propertys.concat(
                        self.xkshortcut(property.callback(item.value.split(" ")))
                    );

                    continue main;
                }
            }

            propertys.push(item);
            var lastProperty = propertys[propertys.length - 1];

            for(var property of self.transpiledPropertys){
                if(property.name === lastProperty.name){
                    lastProperty.name = property.newName;
                    break;
                }
            }
        }

        return propertys;
    }

    self.xkshortcut = function(string){
        var analysedItems = self.xkanalyse(string);
        var buildedItems = self.xkbuild(analysedItems);
        var transpiledItems = self.xktranspile(buildedItems);

        return transpiledItems;
    }
}