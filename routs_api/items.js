const router = require('express').Router();
const fs     = require('fs');
const {authAdmin} = require('../middleware/auth');
const Item = require('../models/Item');

// @route   GET api/items
// @desc    get all items.
router.get('/', [authAdmin], (req,res)=>{
    let path = __dirname.replace('routs_api','items.json');
    try {
        let data = JSON.parse(fs.readFileSync(path, {encoding: 'utf-8'}));
        return res.json(data);
    } catch (err) {
        return res.status(400).json(err);
    }
})

// @route   POST api/items
// @desc    add item to items.json file
router.post('/', [authAdmin], (req, res)=>{
    let path = __dirname.replace('routs_api','items.json');
    const itemsFile = fs.readFileSync(path, {encoding: 'utf-8'});
    let data = req.body;

    let isArraysMatch = matchArrays(JSON.parse(itemsFile), data);
    if(isArraysMatch)
        return res.json({msg: 'No Change Made.'});
    else{
        try {
            let items = data.map(obj => Item.getNew(obj).toString() && Item.getNew(obj));
            fs.writeFileSync(path, JSON.stringify(items), {encoding: 'utf-8'});
            res.json({msg: 'successfuly update.', items})
        } catch (err) {
            return res.status(400).json({err});
        }
    }
});

// @route   POST api/items/default
// @desc    return items.json file to default state
router.post('/default', [authAdmin], (req,res)=>{
    const defaultItems = [

    ];
    try {
        let path = __dirname.replace('routs_api','items.json');
        fs.writeFileSync(path, JSON.stringify(defaultItems), {encoding: 'utf-8'});
        res.json({msg: 'Back To Default.'})
    } catch (err) {
        return res.status(400).json({err});
    }
});

module.exports = router;

function matchArrays(arr1, arr2){
    if(typeof arr1 !== 'object' || typeof arr2 !== 'object') return false;
    if(arr1.length !== arr2.length) return false;

    let arr1Str = arr1.map(obj => JSON.stringify(obj));
    let arr2Str = arr2.map(obj => JSON.stringify(obj));
    for(let i=0; i<arr1Str.length; i++){
        if(arr2Str.indexOf(arr1Str[i]) < 0)
            return false;
    }
    return true;
}