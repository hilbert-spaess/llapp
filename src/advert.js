import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import {useApi} from './use-api.js';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';
import {Card, Container, Row, Col, Nav, Navbar, Form, FormControl, Popover, OverlayTrigger, Overlay, Toast} from 'react-bootstrap';
import {Auth0Provider, useAuth0, withAuthenticationRequired} from '@auth0/auth0-react';

export const Advert = () => {

    const {user, isAuthenticated, isLoading} = useAuth0();

    if (isLoading) {
        return <div></div>;
    }

    if (isAuthenticated) {
        return <Redirect to = "/home"/>;
    }

    return <Advert1/>;

}

class Advert1 extends React.Component {

    render () {

        const isMobile = window.innerWidth <= 1000;

        if (isMobile) {

            return (

                <MobileAdvert/>

            );
        } else {

            return (

                <DesktopAdvert/>

            );
        }

    }
}

class MobileAdvert extends React.Component {

    render () {

        return (

                <div style={{overflow: "scroll"}}>
		    <nav className="navbar navbar-custom navbar-expand" style={{backgroundColor: "transparent", height: "10vh", marginLeft: "5%", marginRight: "5%"}}>
			      <a href="/" style={{fontSize: "20px"}}>RiceCake</a>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item signloglink">
            <Link style={{color: "green", marginRight: "1em"}} to="/signup">Sign Up </Link>
          </li>
          <li className="nav-item signloglink">
            <Link style={{color: "green"}} to="/login">Log In</Link>
          </li>
        </ul>
  </nav>
                  <header className="masthead text-white">
    <div className="masthead-content">
    <Row>
      <div style={{width: "70vw", marginLeft: "10vw", marginTop: "5vh"}}>
        <h2 className="masthead-heading mb-0" style={{fontSize: "8vw"}}>Weekly tutoring. Daily exercises.</h2>
        <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "6vw"}}>Improve your written English quickly and intelligently.</h3>
            <div align="left">
        <Link align="left" to="/signup" className="btn btn-primary btn-xl rounded-pill mt-5">Sign up now</Link>
            </div>
        </div>
    </Row>
    </div>
    <div className="bg-circle-1 bg-circle"></div>
    <div className="bg-circle-2 bg-circle"></div>
    <div className="bg-circle-3 bg-circle"></div>
    <div className="bg-circle-4 bg-circle"></div>
  </header>
		</div>
            
		    

        );
    }
}

class DesktopAdvert extends React.Component {

    render () {

        return (

            <div>Hemlo</div>

        );
    }
}


