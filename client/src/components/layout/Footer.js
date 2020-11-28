import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Footer = ({isAuth}) => {
    if(!isAuth)
        return null
    return (<footer>
        <div className="w-100 h-100 row mx-0 py-3">
            <div className="col-6 my-3" style={{minWidth:300}}>
                <h5 className="text-dark">CONTACT:</h5>
                <p className="pl-4">Yanky Kahn:
                   &nbsp;&nbsp;<a href="tel:18186052066" rel="noreferrer" target="_blank"><i className="text-dark fa fa-phone"></i></a>
                   &nbsp;&nbsp;<a href="https://maps.google.com/maps?q=18253+Topham+St+Tarazana+CA+91335" rel="noreferrer" target="_blank"><i className="text-dark fa fa-map-marker"></i></a>
                   &nbsp;&nbsp;<a href="mailto:chabad18hotmail.com" rel="noreferrer" target="_blank"><i className="text-dark fa fa-envelope"></i></a>
                   &nbsp;&nbsp;<a href="https://wa.link/l46ku1" rel="noreferrer" target="_blank"><i className="text-dark fa fa-whatsapp"></i></a>
                </p>
            </div>
            <div className="col-6 my-3" style={{minWidth:300}}>
                <h5 className="text-dark">OPENING HOUERS:</h5>
                <ul style={{listStyle: 'none'}}>
                    <li>sun-mon.........9-22</li>
                    <li>tue-wen...........8-01</li>
                    <li>thu-fri...............8-15</li>
                    <li>sat......................7-14</li>
                </ul>
            </div>
        </div>
        <p className="text-dark text-center p-2 m-0"><small>&copy; Yudi Kahn {new Date().getFullYear()}</small></p>
    </footer>)
}

Footer.propTypes = {
    isAuth: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth,
});

export default connect(mapStateToProps)(Footer);