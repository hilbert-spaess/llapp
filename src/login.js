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
    
    state = {err: null,
            forgotPassword: null}
    
    handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value    , err: null});
  }
    
    handleSubmit = (event) => {
        
        event.preventDefault();
        
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
    
    forgotPassword = () => {
        
        this.setState({forgottenPassword: true});
        
    }
    
    handleCancelPassword = () => {
        
        this.setState({forgottenPassword: false});
        
    }
    
    handlePasswordSent = () => {
        
        this.setState({forgottenPassword: "sent"});
        
    }
    render () {
        
        if (this.state.forgottenPassword == true) {
            
            return (
                <ForgotPassword
                handleCancel={this.handleCancelPassword}
                passwordSent={this.handlePasswordSent}/>
                );
        }
        
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
            onSubmit={this.handleSubmit}
            className="comentForm">
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
        <button type="submit" className="btn btn-primary btn-xl login-rounded-pill mt-4">Login</button>
 </form></div>
    <div className="loginsubs">
          <div>  New user? <Link to="/signup">Sign up </Link>here.</div>
          <div style={{marginTop: "0.5em"}}> <Link onClick={this.forgotPassword}> Forgot your password? </Link></div>
          <div style={{marginTop: "0.5em"}}> Return to <Link to="/">Landing Page</Link>.</div>
            
    </div>
    </Card>
            </Row>
  </header>
          
</div>
          
            );
    }
}

class ForgotPassword extends React.Component {
    
    state = {err: null,
            responsedata: null,
            passwordSent: false}
    
    handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value    , err: null});
    }
    
    handleSubmit = () => {
        
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({client_id:"3Quvqqshf1rWfO46Cmry14XeDjhwQMwM", email: this.state.email, connection: "Username-Password-Authentication"})
    }
        fetch("https://dev-yt8x5if8.eu.auth0.com/dbconnections/change_password", requestOptions).then(data => this.setState({responsedata: data}));
        console.log(this.state.responsedata);
        
        this.setState({passwordSent: true});
    }
    
    handleTryAgain = () => {
        
        this.setState({email: "", err: null, responsedata: null, passwordSent: false});
        
    }
    
    render () {
        
        if (this.state.passwordSent) {
            
            return (
                
                 <>
            <header className="loginmasthead text-center">
            <Row style={{justifyContent: "space-around"}}>
    <Card style={{paddingBottom: "100px"}} className="login-content">
        <div style={{fontSize: "30px"}}>Verification Email Sent.</div>
        <div style={{textAlign: "center"}}>
<button onClick={this.handleTryAgain} style={{width: "60%", marginTop: "1em"}} className="btn btn-primary btn-xl login-rounded-pill mt-4">Try Again</button> </div>
            </Card>
            </Row>
            </header>
            </>

            );
        }
        
        return (
            
            <>
            <header className="loginmasthead text-center">
            <Row style={{justifyContent: "space-around"}}>
    <Card style={{paddingBottom: "100px"}} className="login-content">
            <div style={{fontSize: "30px"}}>Confirm Email</div>
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
        </form>
        </div>
<div style={{textAlign: "center"}}>
<button onClick={this.handleSubmit} style={{width: "60%", marginTop: "1em"}} className="btn btn-primary btn-xl login-rounded-pill mt-4">Send Reset Email </button> </div>
 <div className="loginsubs">
          <div> <Link onClick={this.props.handleCancel}>Go Back</Link></div>
              </div>
        </Card>
        </Row>
</header>
</>
 
);
}
}
            
        
        
