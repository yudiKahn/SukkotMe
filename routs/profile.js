const router = require('express').Router();
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Post = require('../models/Post');
const {check, validationResult} = require('express-validator');
const request = require('request');

// @route  GET api/profile/me
// @desc   get current user profile
router.get('/me', auth, async (req,res)=>{
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar'], User);
        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user'})
        }

        res.json(profile)

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
})

// @route  POST api/profile
// @desc   create | update user profile
router.post('/', [auth, [
    check('status', 'status is required').not().isEmpty(),
    check('skills','skills is required').not().isEmpty()
]], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    const fields = ['company', 'website', 'location', 'bio', 'status', 'githubusername'];
    const social = ['youtube', 'facebook', 'twitter', 'instagram', 'linkedin'];
    const profileObj = {
        user: req.user.id,
        social: {}
    };
    Object.keys(req.body).map(k=>{
        if(req.body[k] && k.toString()=='skills'){
            profileObj[k] = req.body[k].toString().split(',').map(skill=>skill.trim())
        } else if(req.body[k] && fields.indexOf(k.toString()) > -1){
            profileObj[k] = req.body[k];
        } else if(req.body[k] && social.indexOf(k.toString()) > -1) {
            profileObj.social[k] = req.body[k];
        }
    })
    
    try {
        let profile = await Profile.findOne({user: req.user.id});
        if(profile){ //update
            profile = await Profile.findOneAndUpdate({user: req.user.id}, { $set: profileObj}, {new: true});
            return res.json(profile);
        } else {    //create
            profile = new Profile(profileObj);
            await profile.save();
            res.json(profile)
        }
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
})

// @route  GET api/profile
// @desc   get all profiles
router.get('/', async (req,res)=>{
    try {
        const profiles = await Profile.find({}).populate('user', ['name', 'avatar'], User);
        res.json(profiles);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  GET api/profile/user/:user_id
// @desc   get user profile
router.get('/user/:user_id', async (req,res)=>{
    try {
        const profile = await Profile.findOne({user: req.params.user_id})
            .populate('user', ['name', 'avatar'], User);
        if(!profile){
            return res.status(400).json({msg: 'profile not found'})
        }
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        if(err.kind=='ObjectId')
            return res.status(400).json({msg: 'profile not found'})
        res.status(500).send('Server error');
    }
});

// @route  DELETE api/profile
// @desc   delete profile, user and post
router.delete('/', auth, async (req,res)=>{
    try {
        await Post.deleteMany({user: req.user.id});
        await Profile.findOneAndRemove({user: req.user.id});
        await User.findOneAndRemove({_id: req.user.id});
        res.json({msg: 'User deleted'});
    } catch (err) {
       console.error(err.message);
       res.status(500).send('Server error'); 
    }
})

// @route   PUT api/profile/experience
// @desc    add experience to profile
router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    const {title, company, location, from, to, current, description} = req.body;
    const newExp = {title, company, location, from, to, current, description};
    try {
        const profile = await Profile.findOne({user: req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

// @route  DELETE api/profile/experience/:exp_id
// @desc   delete experience from profile
router.delete('/experience/:exp_id', auth, async (req,res)=>{
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const removeIndex = profile.experience.map(e=>e.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// @route   PUT api/profile/education
// @desc    add education to profile
router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty()
]], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    const {school, degree, fieldofstudy, from, to, current, description} = req.body;
    const newEduc = {school, degree, fieldofstudy, from, to, current, description};
    try {
        const profile = await Profile.findOne({user: req.user.id});
        profile.education.unshift(newEduc);
        await profile.save();
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

// @route  DELETE api/profile/education/:edu_id
// @desc   delete education from profile
router.delete('/education/:edu_id', auth, async (req,res)=>{
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const removeIndex = profile.education.map(e=>e.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// @route   Get api/profile/github/:username
// @desc    get user repos from github
router.get('/github/:username', (req,res)=>{
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=creates
            :asc&client_id=${process.env.GITHUB_CLIENT}&client_secret=${process.env.GITHUB_SECRET}`,
            method: "GET",
            headers: {'user-agent': 'node.js'}
        }

        request(options, (err, resp, body)=>{
            if(err){
                console.error(err);
            } if(resp.statusCode !== 200) {
                res.status(404).json({msg: 'No github profile found'})
            }
            res.json(JSON.parse(body))
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;