import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner  from '../Spinner';
import {getPost} from '../../actions/post';
import PostItem from '../posts/PostItem';
import {Link} from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = props => {
    const {getPost, post: {post, loading}, match} = props;
    useEffect(()=>{
        getPost(match.params.id);
    }, [getPost])

    return loading || post === null ? <Spinner/> : <Fragment>
        <Link to="/posts" className="btn">Back To Posts</Link>
        <PostItem post={post} showAction={false}/>
        <CommentForm postId={post._id}/>
        <div className="comments">
            {post.comments.map((c,i)=>(
                <CommentItem key={i} comment={c} postId={post._id}/>
            ))}
        </div>
    </Fragment>
}

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, {getPost})(Post);