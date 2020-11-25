import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Moment from 'react-moment';
import {deleteEducation} from '../../actions/profile';

const Education = ({education, deleteEducation}) => {
    const educations = education.map(e=> (<tr key={e._id}>
        <td>{e.school}</td>
        <td className="hide-sm">{e.degree}</td>
        <td className="hide-sm">
            <Moment format="YYYY/MM/DD">{e.from}</Moment> - 
            {e.to?<Moment format="YYYY/MM/DD">{e.to}</Moment>:'Now'}
        </td>
        <td className="btn btn-danger" onClick={()=>deleteEducation(e._id)}>Delete</td>
    </tr>))

    return (<Fragment>
        <h2 className="my-2">Education Credentials</h2>
        <table className="table" style={{width:'100%'}}>
            <thead>
                <tr>
                    <th>School</th>
                    <th className="hide-sm">Degree</th>
                    <th className="hide-sm">Years</th>
                    <th className="hide-sm"></th>
                </tr>
            </thead>
            <tbody>
                {educations}
            </tbody>
        </table>
    </Fragment>)
}

Education.propTypes = {
    education: PropTypes.array.isRequired,
    deleteEducation: PropTypes.func.isRequired,
}

export default connect(null, {deleteEducation})(Education)
