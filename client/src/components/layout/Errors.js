import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const Errors = ({errors}) => errors.length > 0 && (<div className="errors px-3 py-5">
    <div>
        {errors.map((e,i)=><div className="alert alert-danger" key={i}>
            {e.msg}
        </div>)}
    </div>
</div>)

Errors.propTypes = {
    errors: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    errors: state.errors
});

export default connect(mapStateToProps)(Errors);

