const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   POST api/users
// @desc    Register user
router.post('/', [
    check('name','Name is required').not().isEmpty(),
    check('email', 'Please include valid email').isEmail(),
    check('password', 'Please enter a 6 or more char for password').isLength({min:6})
],async (req,res)=>{
   const errors = validationResult(req);
   if(!errors.isEmpty()){
       return res.status(400).json({errors: errors.array() })
   }

   const {name, email, password} = req.body;

   try{
        let user = await User.findOne({email});
        if(user){
           return res.status(400).json({errors: [ {msg:'User already exists' } ]})
        }

        user = new User({name, email, password});

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.get('jwtSecret'), {expiresIn:36000}, (err, token)=>{
            if(err)
                throw err;
            res.json({ token });
        })

    } catch(er) {
        console.error(er);
        res.status(500).send('Server Error')
   }

})

// @desc   Tmp route to delete all users from db
router.get('/dall', (req,res)=>{
    User.deleteMany({},(err)=>{
        res.send(err?'err':'deleted')
    })
})

module.exports = router;