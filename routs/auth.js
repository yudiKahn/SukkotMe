const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');

// @route  GET api/auth
// @desc   check user by jwt and return user
router.get('/', auth, async (req,res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(er) {
        console.error(er.message);
        res.status(500).send('Server error')
    }
})

// @route  POST api/auth
// @desc   login user
router.post('/', [
    check('email', 'Please include valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req,res)=>{
   const errors = validationResult(req);
   if(!errors.isEmpty()){
       return res.status(400).json({errors: errors.array() })
   }

   const {email, password} = req.body;

   try{
        const user = await User.findOne({email});
        const isMatchPass = user && await bcrypt.compare(password, user.password);
        if(!user || !isMatchPass){
           return res.status(400).json({errors: [ {msg:'Invalid user' } ]});
        }

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

module.exports = router;