const router                          = require('express').Router();
const {check, validationResult, body} = require('express-validator');
const User                            = require('../models/User');
const bcrypt                          = require('bcryptjs');
const jwt                             = require('jsonwebtoken');
const {authUser, authAdmin}           = require('../middleware/auth');
const config = require('config');

function isAdmin({email,password,_id}){
    let res = false,
        admin = config.get('ADMIN');
    if(email && password)
        res = admin.find(obj => obj.email==email && obj.password==password) ? true : false;
    if(_id)
        res = admin.find(obj => obj.id.toString() === _id.toString()) ? true : false;
    return res;
};

// @route   POST api/users
// @desc    register user
router.post('/',
    [body('email').custom(e=> User.find({email: e}).then(d => d.length>0 && Promise.reject('Email already taken'))),
     check('email', 'Please enter a valid Email address').isEmail(),
     check('password', 'Please enter min of 6 digit password').isLength({min: 6}),
     check('street', 'Please enter street').not().isEmpty(),
     check('city', 'Please enter city').not().isEmpty(),
     check('state', 'Please enter state').not().isEmpty(),
     check('zip', 'Please enter Zip code').not().isEmpty(),
     check('phone_number', 'please enter a valid Phone number').isMobilePhone("any"),
     check('firstName', 'Please Enter your First Name').isLength({min: 2}),
     check('lastName', 'Please Enter your Last Name').isLength({min: 2})],   
    async (req,res)=>{
        if(!validationResult(req).isEmpty()){
            return res.status(400).json({ err: validationResult(req).array() });
        } else {
            const {street, city, state, zip, password} = req.body;
            const cryptPassword = await bcrypt.hash(password, 10);

            let is_admin = isAdmin(req.body);

            req.body.address = {street, city, state, zip};
            req.body.password = cryptPassword;
            const user = new User(req.body);
            try {
                let savedUser = await user.save();
                jwt.sign({user:{id:savedUser._id}}, config.get('jwtSecret'), {expiresIn: "14 days"}, (err, token)=>{
                    if(err)
                        throw err;
                    return res.json({msg: 'User saved Succefully', token, user: savedUser, isAdmin:is_admin});
                });
            } catch (er){
                console.error(er);
                res.status(400).json({err: [{msg: "Something went wrong, Please try again later"}]});
            }
        }
    }
);

// @route   POST api/users/login
// @desc    login to account
router.post('/login',
    [check('email', 'Please enter a valid email').isEmail(),
     check('password', 'Please enter min of 6 digit password').isLength({min: 6}),
     body('email').custom(e=>User.findOne({email: e}).then(d => !d && Promise.reject('No user found'))) ],
    async (req, res)=>{
        if(!validationResult(req).isEmpty()){
            return res.status(400).json({ err: validationResult(req).array() });
        } else {
            const {email, password} = req.body;
            let user = await User.find({email});
            let isUser = (user.length===1) && (await bcrypt.compare(password, user[0].password));
            if(isUser){
                let is_admin = isAdmin({email, password,_id: user[0]._id});
                jwt.sign({user:{id: user[0]._id}}, config.get('jwtSecret'), {expiresIn: "14 days"}, (err, token)=>{
                    if(err)
                        throw err;
                    return  res.json({msg: 'Successfully Login', token, user: user[0], isAdmin:is_admin})
                });
            } else
              return res.status(400).json({err: [{msg: "No user found"}]});       
        }
    }
);

// @route   PUT api/users
// @desc    update user profile
router.put('/',
    [check('userId', 'Something went wrong, Please try again later').isMongoId(),
    check('email', 'Please enter a valid Email address').isEmail(),
    check('street', 'Please enter street').not().isEmpty(),
    check('city', 'Please enter city').not().isEmpty(),
    check('state', 'Please enter state').not().isEmpty(),
    check('zip', 'Please enter Zip code').not().isEmpty(),
    check('phone_number', 'please enter a valid Phone number').isMobilePhone("any"),
    check('firstName', 'Please Enter your First Name').isLength({min: 2}),
    check('lastName', 'Please Enter your Last Name').isLength({min: 2})],
    async (req, res)=>{
        if(!validationResult(req).isEmpty())
            return res.status(400).json({ err: validationResult(req).array() });
        const {userId, email, street, city, state, zip, phone_number, firstName, lastName} = req.body;
        let update = {
            email , phone_number,
            address: {street, city, state, zip}, lastName, firstName
        };
        let usersWithSameEmail = await User.find({email});
        if(usersWithSameEmail.length>0)
            return res.status(400).json({err: [{msg: "Email already taken"}]});
        try {
            let user = await User.findByIdAndUpdate(userId, update, {new: true});
            return res.json({msg: 'Successfully Updated', user});
        } catch {
            return res.status(400).json({err: [{msg: "Something went wrong, Please try again later"}]});
        }
    }
);


// @route   DELETE api/users
// @desc    delete user by id
router.delete('/:id', async (req, res)=>{
    const id = req.params.id;
    try {
       let removedUser = await User.findByIdAndDelete(id);
       if(removedUser)
            return res.json({msg: 'Successfully Removed'});
        res.status(400).json({err: [{msg: 'No User found to delete'}]});
    } catch {
        res.status(400).json({err: [{msg: "Something went wrong, Please try again later"}]});
    }
});

// @route   GET api/users
// @desc    get all users
router.get('/', authAdmin, async (req, res)=>{
    let users = await User.find().select('-password -__v');
    if(users.length > 0)
        return res.json(users);
    res.status(400).json({err: [{msg: "No Users found"}]})
});

// @route   GET api/users/user
// @desc    get user by id
router.get('/user', authUser, async (req, res)=>{
    let user = await User.findById(req.user.id).select('-password -__v');
    let is_admin = isAdmin(user);
    if(user)
        return res.json({user, isAdmin: is_admin});
    res.status(400).json({err: [{msg: "No User found"}]});
});

module.exports = router;