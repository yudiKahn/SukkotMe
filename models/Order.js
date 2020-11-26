const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'},
    items: [{
        name: {type: String, required: true},
        price: {type: Number, required: true},
        q: {type: Number, required: true}
    }],
    total: {type: Number, required: true},
    comment: {type: String},
    ready: {type: Boolean, default: false},
    paid: {type: Boolean, default: false}
}, { timestamps: true });

const Order = mongoose.model('Order', schema);

Order.prototype.getTotal = function(){
    let res=0;
    for(let item of this.items){
        res += (Number(item.price) * Number(item.q));
    }
    return res;
}

module.exports = Order;