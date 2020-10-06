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
                      <Row>
                        <Col>
            <Card className="launchcardtwotop"
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
            <Card className="launchcardtwotop"
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
             <Row>
                        <Col>
            <Card className="launchcardtwo"
            style={{backgroundColor: "lightyellow"}}>
            <div className="messagetext">
                {this.props.data.message}
            </div>
            </Card>
            </Col>
            <Col>
            <Card className="launchcardtwo"
            style={{backgroundColor: "#aaf8ff"}}>
            <div className="launchcontent">
              <Progress
                data={this.props.data}
                />
            </div>
            </Card>
            </Col>
           </Row>
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

class Progress extends React.Component {
    
    render () {
        
        var levelprogress = this.props.data.progress;
        console.log(levelprogress);
        
        var displayprogress = (90.0 + (360.0 * levelprogress)).toString();
        console.log(displayprogress);
        
        if (levelprogress <= 0.5) {

            return (
            <div className="outercircle" style={{backgroundColor: "darkblue", backgroundImage: "linear-gradient(" + displayprogress + "deg, transparent 50%, #00ffff 50%), linear-gradient(90deg, #00ffff 50%, transparent 50%)"}}>
            <div className="innercircle">
            <div className="progressLevel">{this.props.data.level}</div>
            </div> 
            </div>
            );
        } else {
            
             return (
            <div className="outercircle" style={{backgroundColor: "#00ffff", backgroundImage: "linear-gradient(" + displayprogress + "deg, darkblue 50%, transparent 50%), linear-gradient(90deg, transparent 50%, darkblue 50%)"}}>
            <div className="innercircle">
            <div className="progressLevel">{this.props.data.level}</div>
            </div> 
            </div>
            );
        }
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
    
