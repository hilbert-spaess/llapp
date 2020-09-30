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
     const {error, loading, data, refresh} = useApi(APIHOST + '/api/notificationno', {}, opts);
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
                      <Row>
                        <Col>
            <Card className="launchcardtwo"
            style={{backgroundColor: "lightgreen"}}>
            <Notification
            no={this.props.data.notification}
            tutorial ={this.props.data.tutorial}
            />
            <div className="launchcontent">
              <Link to="/read">
                <BookOpen/> <br></br>
                Start reading.
            
              </Link>
            </div>
            </Card>
            </Col>
            <Col>
            <Card className="launchcardtwo"
            style={{backgroundColor: "lightblue"}}>
              <div className="launchcontent">
              <Link to="/vocab">
                <Type/> <br></br>
                  My Words	
            
              </Link>
              </div>
            </Card>
            </Col>
            </Row>
            <Card className="launchcard">
              <div className="launchcontent">
                <Link to="/progress">
                  <FastForward/> <br></br>
            My Progress
            </Link>
            </div>
            </Card>
            </div>
            </Container>
        );
    }
}

const NotificationLoader = () => {
    
    
    
     const {login, getAccessTokenWithPopup } = useAuth0();
     const opts = {audience: APIHOST};
     const {error, loading, data, refresh} = useApi(APIHOST + '/api/notificationno', {}, opts);
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
    if (data.notification == 0) {
        return (<div></div>);
    }
    console.log(data.notification);
    
    return (
            <Notification
            no={data.notification}
            tutorial ={data.tutorial}
            />
    );

}

class Notification extends React.Component {
    
    state = {show: false}
    
    componentDidMount () {
        
        setTimeout(() => {this.setState({show: this.props.tutorial});}, 500);
    }
    
    handleClose = () => {
        this.setState({show: !this.state.show});
    }
    
    render () {
        if (this.props.no == 0) {
            return (<div></div>);
        }

        return (
            <div>
            
<Toast onClose={this.handleClose} show={this.state.show} animation={true} style={{position: 'absolute', top: "-30%", right: 0}}>
  <Toast.Header style={{fontSize: "large"}}>
    <strong className="mr-auto">Tutorial</strong>
    <small>Just now</small>
  </Toast.Header>
  <Toast.Body style={{fontSize: "12px"}}>The notification means that you've got {this.props.no} new reviews!</Toast.Body>
</Toast>
                     <div className="notification">
            <div className="centerno">{this.props.no}</div>
</div>
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
    
