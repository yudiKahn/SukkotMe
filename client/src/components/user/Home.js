import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import Donut from '../layout/Donut';

const Home = ({isAuth}) => {
    const feedback = [`Rabbi Schneur Zalman of Liadi taught that when G‑d told Moses that the Jews should take an etrog, 
    He sent messengers to gather them in Calabria. Thus, even as Napoleon wreaked havoc on Europe during his
     wars of conquest, Rabbi Schneur Zalman sent a messenger to retrieve for him a Calabria citron from Italy.`,
     `When World War I broke out, a Chassid named Avraham Erlanger, living in Switzerland,
      received a telegram from the fifth Rebbe asking that he arrange a Calabria etrog.
      Against huge odds, Erlanger managed to obtain a number of Calabria etrogim, which he sent with a messenger 
      all the way to Lubavitch, arriving just in time for the holiday.`];
    if(!isAuth)
        return <Redirect to="/"/>
    return (<Fragment>
        {/*!isTishrei && <ItsNotTishrei/> */}
        <div className="parallax prlx-1">
            <div className="w-100 h-100">
                <h1 className="text-center text-white w-75 mx-auto">ALL YOUR SUKKOT NEEDS IN ONE PLACE.</h1>
                <div className="btns px-5 w-100 text-center">
                    <Link to="/shop" className="btn btn-success m-1">SHOP</Link>
                    <Link to="/gallery" className="btn btn-dark m-1">GALLERY</Link>
                </div>
            </div>
        </div>
        <div className="w-100 globe">
            <div className="w-100 h-100" style={{backgroundColor:'rgba(71, 71, 71, .1)'}}>
                <div className="row mx-0 justify-content-center">
                    <div className="col col-4">
                        <Donut per={47} color="#28a745" label="U.S.A"/>
                    </div>
                    <div className="col col-4">
                        <Donut per={39} color="#00004d" label="LONDON"/>
                    </div>
                    <div className="col col-4">
                        <Donut per={25} color="#ff4d4d" label="ISRAEL"/>
                    </div>
                </div>
            </div>
        </div>
        <div className="parallax prlx-2">
            <div className="w-100 h-100">
                <div id="feedback" className="carousel slide h-100" data-ride="carousel">
                    <div className="carousel-inner h-100" style={{zIndex:20}}>
                       <div className="carousel-item active">
                            <p><i className="fa fa-quote-left"></i>
                                &nbsp;{feedback[0]}&nbsp;
                            <i className="fa fa-quote-right"></i></p>
                       </div>
                       <div className="carousel-item">
                            <p><i className="fa fa-quote-left"></i>
                                &nbsp;{feedback[1]}&nbsp;
                            <i className="fa fa-quote-right"></i></p>
                       </div>
                    </div>
                    <a style={{zIndex:20}} className="carousel-control-prev" href="#feedback" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a style={{zIndex:20}} className="carousel-control-next" href="#feedback" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </div>
        </div>
    </Fragment>)
}

Home.propTypes = {
    isAuth: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth
})

export default connect(mapStateToProps)(Home);