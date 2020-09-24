import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import {Stylesheet, css} from 'aphrodite';
import {Card, Container, Row, Col, Nav, Navbar, Form, FormControl} from 'react-bootstrap';
import {BarWrapped} from './sidebar.js';
import {Auth0Provider, useAuth0, withAuthenticationRequired} from '@auth0/auth0-react';
import {BookOpen, Type, FastForward} from 'react-feather';

export class Launch extends React.Component {
    
    render () {
        return (
            <BarWrapped WrappedComponent={Launch1}/>
        );
    }
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
                    <div className="maintext">
            <Card className="launchcard">
              <Link to="/read">
                <BookOpen/> <br></br>
                Start reading.
            
              </Link>
            </Card>
            <Card className="launchcard">
              <Link to="/vocab">
                <Type/> <br></br>
                  My Words	
            
              </Link>
            </Card>
            <Card className="launchcard">
                <Link to="/progress">
                  <FastForward/> <br></br>
            My Progress
            </Link>
            </Card>
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
    
