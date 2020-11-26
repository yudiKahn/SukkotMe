const router = require('express').Router();
const fs     = require('fs');
const {authAdmin} = require('../middleware/auth');


router.get('/', [authAdmin], (req,res)=>{
    let path = __dirname.replace('routs_api','items.json');
    res.sendFile(path);
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
            fs.writeFileSync(path, JSON.stringify(data), {encoding: 'utf-8'});
            res.json({msg: 'successfuly update.'})
        } catch (err) {
            return res.status(400).json({err});
        }
    }
});

// @route   POST api/items/default
// @desc    return items.json file to default state
router.post('/default', [authAdmin], (req,res)=>{
    const defaultItems = [
        {"type":"Budget Esrog","price":50},
        {"type":"Israeli set", "price": [{"A":35},{"B":29},{"C":24}], "option": ["PITOM", "NO PITOM"]},
        {"type":"Yannever set","price": [{"A":300},{"B":200},{"C":150},{"D":100}], "option": ["PITOM", "NO PITOM"]},
        {"type":"Lulav","price":[{"Deri Much Lulav":40},{"Deri Lulav":20},{"Egyptian Lulav":10}]},
        {"type":"Aruvos","price":3},
        {"type":"Hadasim", "price": [{"A כולו חזון איש" :15}, {"B כולו חיים נאה":10},{"C רובו חיים נאה":5}]},
        {"type":"Hoshnos","price":5},
        {"type":"Koisaklach","price":0},
        {"type":"Plastic bag","price":0},
        {"type":"Schach 6 × 10","price":75},
        {"type":"Schach 8 × 12","price":100},
        {"type":"Plastic Lulav bag","price":4},
        {"type":"Plastic Deri Lulav bag","price":5}
    ];
    try {
        let path = __dirname.replace('routs_api','items.json');
        fs.writeFileSync(path, JSON.stringify(defaultItems), {encoding: 'utf-8'});
        res.json({msg: 'successfuly update.'})
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