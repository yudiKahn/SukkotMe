import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const Alerts = ({alerts}) => alerts.length > 0 && (<div className="alerts px-3 py-5">
    <div>
        {alerts.map((e,i)=><div className={`alert alert-${e.type || 'danger'}`} key={i}>
            {e.msg}
        </div>)}
    </div>
</div>)

Alerts.propTypes = {
    alerts: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    alerts: state.alerts
});

export default connect(mapStateToProps)(Alerts);

