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

            <div>Henlo</div>

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


