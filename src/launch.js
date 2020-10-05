import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import {Stylesheet, css} from 'aphrodite';
import {Card, Container, Row, Col, Nav, Navbar, Form, FormControl, Popover, OverlayTrigger, Overlay, Toast} from 'react-bootstrap';
import {BarWrapped} from './sidebar.js';
import {Auth0Provider, useAuth0, withAuthenticationRequired} from '@auth0/auth0-react';
import {BookOpen, Type, FastForward} from 'react-feather';
import {useApi} from './use-api.js';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';

export class Launch extends React.Component {
    
    render () {
        return (
            <BarWrapped WrappedComponent={LaunchLoader}/>
        );
    }
}

const LaunchLoader = () => {
    
    
    
     const {login, getAccessTokenWithPopup } = useAuth0();
     const opts = {audience: APIHOST};
     const {error, loading, data, refresh} = useApi(APIHOST + '/api/launchscreen', {}, opts);
     const getTokenAndTryAgain = async () => {
        await getAccessTokenWithPopup(opts);
        refresh()
  };
    if (loading) {
        return <div></div>;
    }
    if (error) {
        if (error.error === 'consent_required') {
      return (
        <button onClick={getTokenAndTryAgain}>Consent to reading users</button>
      );
    }
    return <div></div>;
    }
    if (data.displayType == "newUser") {
        return <Redirect to="/newusertest"/>;
    }
    console.log(data.notification);
    
    return (
            <Launch1
        data={data}/>
    );

}

class Launch1 extends React.Component {

    state = {
	sidebarOpen: 1
    }

    onSetSidebarOpen = () => {
	this.setState({sidebarOpen: 1});
    }
    
    render () {
        return (
          <Container fluid="lg">
                    <div>
            <Card className="messagecard">
              <div className="messagetext">
                  {this.props.data.message}
            </div>
            </Card>
                      <Row>
                        <Col>
            <Card className="launchcardtwo"
            style={{backgroundColor: "lightgreen"}}>
            <Notification
            no={this.props.data.read_notification}
            />
            <div className="launchcontent">
              <Link to="/read">
                <BookOpen/> <br></br>
                Start Reading
            
              </Link>
            </div>
            </Card>
            </Col>
            <Col>
            <Card className="launchcardtwo"
            style={{backgroundColor: "lightpink"}}>
            <div className="launchcontent">
              <Link to="/vocab">
                <Type/> <br></br>
                My Vocab
            
              </Link>
            </div>
            </Card>
            </Col>
           </Row>
            </div>
            </Container>
        );
    }
}

class Notification extends React.Component {
    
    render () {
        if (this.props.no == 0) {
            return (<div></div>);
        }

        return (
                     <div className="notification">
            <div className="centerno">{this.props.no}</div>
            </div>
        );
    }
}

const LogoutButton = () => {
    
    const {logout} = useAuth0();
    
    return (
        
        <button onClick={() => logout({returnTo: window.location.origin})}>
        Log out
        </button>
    );
}
    
