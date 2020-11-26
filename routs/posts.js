const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');

// @route   POST api/posts
// @desc    create a post
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors :errors.array()});
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/posts
// @desc    get all posts
router.get('/', auth, async (req, res)=>{
    try {
        const posts = await Post.find().sort({ date: -1});
        res.json(posts)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/posts/:id
// @desc    get post by id
router.get('/:id', auth, async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post)
            return res.status(404).json({msg: 'Post not found'});
        res.json(post)
    } catch (err) {
        console.error(err.message);
        if(err.kind == "ObjectId")
            return res.status(404).json({msg: 'Post not found'});
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/posts/:id
// @desc    delete post by id
router.delete('/:id', auth, async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.user.toString() !== req.user.id){
            res.status(401).json({msg: 'User not authorized'});
        }
        await post.remove();
        res.json({msg: 'post removed'});
    } catch (err) {
        console.error(err.message);
        if(err.kind == "ObjectId")
            return res.status(404).json({msg: 'Post not found'});
        res.status(500).send('Server error');
    }
});

// @route   PUT api/posts/like/:id
// @desc    like post
router.put('/like/:id', auth, async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.like.filter(l=> l.user.toString()==req.user.id).length > 0){
            return res.status(400).json({msg: 'post already liked'});
        }
        post.like.unshift({user: req.user.id});
        await post.save();
        res.json(post.like)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// @route   PUT api/posts/unlike/:id
// @desc    like post
router.put('/unlike/:id', auth, async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.like.filter(l=> l.user.toString()==req.user.id).length === 0){
            return res.status(400).json({msg: 'post as not yet been liked'});
        }
        const removeIndex = post.like.map(li=>li.user.toString()).indexOf(req.user.id);
        post.like.splice(removeIndex, 1); 
        await post.save();
        res.json(post.like)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/posts/comment/:id
// @desc    comment a post
router.post('/comment/:id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors :errors.array()});
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        const newCom = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        post.comments.unshift(newCom);
        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    delete a comment
router.delete('/comment/:id/:comment_id', auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        const comment = post.comments.find(com => com.id == req.params.comment_id);
        if(!comment){
            return res.status(404).json({msg: 'Comment does not exist'});
        } if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'User not authorized'});
        }
        const removeIndex = post.comments.map(com => com.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);
        await post.save();
        res.json(post.comments)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
module.exports = router;