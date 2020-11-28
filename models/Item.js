class Item {
    constructor(type, prices, pricesTypes, options=[]){
        if(typeof type !== 'string' || typeof prices !== 'object' || typeof pricesTypes !== 'object'){
            return undefined;
        }
        this.type = type;
        this.prices = prices;
        this.pricesTypes = pricesTypes;
        this.options = options;
        this.id = this.#getId();
    }
    #getId = function(){
        let res = '';
        res += new Date().valueOf().toString();
        for(let i = 0; i<10; i++){
            res += `${String.fromCharCode(Math.floor( Math.random() * (123-97)) + 97 )}${Math.floor( Math.random()*10 )}`
        }
        return res;
    }
    static getNew(obj){
        return new Item(obj.type, obj.prices, obj.pricesTypes, obj.options);
    }
    modifyType(type){
        this.type = type;
    }
    modifyPrice(prices, pricesTypes){
        this.prices = prices;
        this.pricesTypes = pricesTypes;
    }
    modifyOptions(options){
        this.options = options;
    }
    toString(){
        return Object.keys(this).length > 0 ? this : undefined;
    }
}

module.exports = Item;