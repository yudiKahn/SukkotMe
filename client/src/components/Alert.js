import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const Alert = ({alerts}) => alerts !== null && alerts.length > 0 && alerts.map(a=>
    <div key={a.id} className={`alert alert-${a.alertType}`}>{a.msg}</div>);
        

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
}
const mapStateToProps = (state) => ({
    alerts: state.alert
})
export default connect(mapStateToProps)(Alert);
