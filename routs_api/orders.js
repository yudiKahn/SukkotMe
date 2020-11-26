const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const Order = require('../models/Order');
const User = require('../models/User');
const {authAdmin} = require('../middleware/auth');

// @route   POST api/orders
// @desc    create order
router.post('/',
    [check('userId', 'Something went wrong. Please try again later').isMongoId(),
     check('items', 'Please select some items').isArray({min:1})],
    async (req, res)=>{
        if(!validationResult(req).isEmpty()){
            return res.status(400).json({ err: validationResult(req).array() });
        }
        const {userId} = req.body;
        let user = await User.findById(userId);
        if(user){
            const order = new Order(req.body);
            order.total = order.getTotal();
            try {
                await order.save();
                let orders = await Order.find({userId: user._id});
                return res.json(orders)
            } catch {
                return res.status(400).json({err: [{msg: `Something went wrong. Please try again later.`}]});
            }
        }
        res.status(400).json({err: [{msg: "No User. Please try again later"}]});
    }
);

// @route   GET api/orders/:userId
// @desc    get orders for user
router.get('/:userId',
    async (req,res)=>{
        try {
            const user = await User.findById(req.params.userId);
            const orders = user && await Order.find({userId: user._id});
            return res.json(orders)
        } catch (error) {
            res.status(400).json({err: [{msg: "No User. Please try again later"}]});
        }
    }
);

// @route   GET api/orders
// @desc    get all orders for admin
router.get('/', [authAdmin],
    async (req,res)=>{
        try {
            const orders = await Order.find({});
            return res.json(orders)
        } catch (error) {
            res.status(400).json({err: [{msg: "No User. Please try again later"}]});
        }
    }
);

// @route   PUT api/orders
// @desc    update order
router.put('/',
    [check('orderId', 'Something went wrong. Please try again later').isMongoId(),
     check('items', 'Please include some items').isArray({min:1})],
    async (req, res)=>{
        if(!validationResult(req).isEmpty()){
            return res.status(400).json({ err: validationResult(req).array() });
        }
        try {
            const {orderId, items} = req.body;
            await Order.findByIdAndUpdate(orderId, {items}, {new: true});
            return res.json({msg: 'Successfly Updated'});
        } catch {
            return res.status(400).json({err: [{msg: "Something went wrong. Please try again later"}]});
        }
    }
);

// @route   DELETE api/orders
// @desc    delete order
router.delete('/:orderId',
    async (req, res)=>{
        try {
            let order = await Order.findById(req.params.orderId);
            if(order.ready || order.paid)
                return res.status(400).json({err: [{msg: 'Order Alredy Made..'}]});
            await Order.findByIdAndDelete(req.params.orderId);
            let orders = await Order.find({userId: order.userId});
            return res.json(orders);
        } catch  {
            return res.status(400).json({err: [{msg: "Something went wrong. Please try again later"}]});
        }
    }
);

// @route   POST api/orders/admin/:orderId/:ready/:paid
// @desc    update order ready | paid for admin.
router.post('/admin/:orderId/:ready/:paid', [authAdmin],
    async (req, res)=>{
        try {
            const {orderId, ready, paid} = req.params;
            let order = await Order.findById(orderId);
            order.ready = ready;
            order.paid = paid;
            await order.save();
            return res.json({msg: 'succefully updated.'});
        } catch {
            return res.status(400).json({err: [{msg: "Something went wrong. Please try again later"}]});
        }
    }
);

module.exports = router;