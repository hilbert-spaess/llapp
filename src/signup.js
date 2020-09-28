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


export const Signup = () => {
    
    var webAuth = new auth0.WebAuth({
        domain: "accounts.ricecake.ai",
        clientID: "3Quvqqshf1rWfO46Cmry14XeDjhwQMwM",
        redirectUri: CALLBACK,
        responseType: "token"});
    
    return (<div>
            <nav className="navbar navbar-expand-sm navbar-dark navbar-custom fixed-top">
    <div className="container">
      <Link className="navbar-brand" to="/">RiceCake</Link>
        
    </div>
  </nav>
            <SignUpForm
            webAuth={webAuth}/>
            </div>);
    
}

class SignUpForm extends React.Component {
    
    state = {err: null}
    
    handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value, err: null    });
  }
    
    handleSubmit = () => {
        
        if (this.state.email == null) {
            this.setState({err: {description: "Email required"}});
        }
        
        else if (this.state.password == null) {
             this.setState({err: {description: "Password required"}});
        }  
        
        else if (this.state.password.length < 8) {
            this.setState({err: {description: "Password must be at least 8 characters"}});
        }
        
        else if (this.state.password === this.state.confirmpassword) {
            
            this.props.webAuth.signup({
            connection: "Username-Password-Authentication",
            email: this.state.email,
            password: this.state.password},  (err) => {
          if (err) {console.log(err); this.setState({err});}
        })
            
        }
    }
    
    convert = (err) => {
        
        if (err == "Invalid sign up") {
            return "Can't sign you up. Is this email already in use?";
        }
        
        return err;
    }
    
    render () {
        
        return (
            <div className="fill">
            <header className="loginmasthead text-center text-white">
    <div className="masthead-content">
            <div className="loginerror">
            {this.state.err && this.convert(this.state.err["description"])}
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
    <div className="formgroup">
     <input className="logininput"
            name="confirmpassword"
            type="password"
            onChange={this.handleInputChange}
            placeholder="Confirm Password"/>
    </div>
        </form>
        <button onClick={this.handleSubmit} className="btn btn-primary btn-xl login-rounded-pill mt-4">Sign up</button>  </div>
    </div>

    <div className="loginsubs">
            Already signed up? <Link to="/login">Log in </Link>here.
            
    </div>
    
  </header>
</div>
          
            );
    }
}