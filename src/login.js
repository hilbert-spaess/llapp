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
import {CALLBACK} from './api_config.js';
import auth0 from 'auth0-js';

export const Login = () => {
    
    var webAuth = new auth0.WebAuth({
        domain: "accounts.ricecake.ai",
        clientID: "3Quvqqshf1rWfO46Cmry14XeDjhwQMwM",
        redirectUri: CALLBACK,
        responseType: "token"});
    
    
    
    return (<div>
            <LoginForm
            webAuth={webAuth}/>
            </div>);
    
}

class LoginForm extends React.Component {
    
    state = {err: null}
    
    handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value    , err: null});
  }
    
    handleSubmit = () => {
        
        if (this.state.email == null) {
            this.setState({err: {description: "Email required"}});
        }
        
        else if (this.state.password == null) {
             this.setState({err: {description: "Password required"}});
        }  
        
        else {
            this.props.webAuth.login({
                realm: "Username-Password-Authentication",
                email: this.state.email,
                password: this.state.password}, (err) => {
              if (err) {console.log(err); this.setState({err});}
            })
        }
    }
    
    render () {
        
        return (
            <div className="fill">
            <header className="loginmasthead text-center text-white">
            <Row style={{justifyContent: "space-around"}}>
    <Card className="login-content">
            <div className="loginerror">
            {this.state.err && this.state.err["description"]}
    </div>
      <div className="container">
        <form
            autoComplete="off">
            <div className="formgroup">
            <input className="logininput"
            name="email"
            type="text"
            onChange={this.handleInputChange}
            placeholder="Email"/>
    </div>
<div className="formgroup">
     <input className="logininput"
            name="password"
            type="password"
            onChange={this.handleInputChange}
            placeholder="Password"/>
    </div>
        </form>
        <button onClick={this.handleSubmit} className="btn btn-primary btn-xl login-rounded-pill mt-4">Login</button>  </div>

    <div className="loginsubs">
            New user? <Link to="/signup">Sign up </Link>here.
            
    </div>
    </Card>
            </Row>
  </header>
          
</div>
          
            );
    }
}