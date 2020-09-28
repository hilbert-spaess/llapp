import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Col, Row, Button, Container, Modal} from 'react-bootstrap';
import {BrowserRouter, Route, Switch, Router} from 'react-router-dom';
import {Stylesheet, css} from 'aphrodite';
import {Launch} from './launch.js';
import {Sidebar, TopBar} from './sidebar.js';
import {LearningSupervisor} from './LearningContainer.js';
import {MyVocabContainer} from './MyVocabContainer.js';
import {UserSelectContainer} from './UserSelectContainer.js';
import {TestContainer} from './TestContainer.js';
import {Auth0Provider, useAuth0, withAuthenticationRequired} from '@auth0/auth0-react';
import {createBrowserHistory} from 'history';
import {NewUser} from './newuser.js';
import {NewUserTest} from './newusertest.js';
import {CALLBACK} from './api_config.js';
import {ProgressContainer} from './progress.js';
import {Landing} from './landing.js';
import {Login} from './login.js';
import {Signup} from './signup.js';

export const history = createBrowserHistory();

const ProtectedRoute = ({ component, ...args }) => (
  <Route component={withAuthenticationRequired(component)} {...args} />
);

const onRedirectCallback = (appState) => {
  // Use the router's history module to replace the url
  history.replace(appState?.returnTo || window.location.pathname);
};

function App() {
    
    return (
         <Auth0Provider
        domain="accounts.ricecake.ai"
        clientId="3Quvqqshf1rWfO46Cmry14XeDjhwQMwM"
                    
             redirectUri={CALLBACK}
        onRedirectCallback={onRedirectCallback}
        useRefreshTokens={true}
        >
        <Router history={history}>
        <Switch>
            <ProtectedRoute path="/home" component={Launch} exact/>
            <ProtectedRoute path="/read" component={LearningSupervisor}/>
            <ProtectedRoute path="/newuser" component={NewUser}/>
            <ProtectedRoute path="/vocab" component={MyVocabContainer}/>
            <ProtectedRoute path="/newusertest" component={NewUserTest}/>
            <ProtectedRoute path="/progress" component={ProgressContainer}/>
            <Route path="/login" component={Login}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/" component={Landing} exact/>
        </Switch>
        </Router>
</Auth0Provider>
    );
}

const Home2 = () => {
    
    const {user, isAuthenticated, isLoading} = useAuth0();
    
    if (! (isAuthenticated)) {
        return <LoginButton/>
    }
    
    if (isLoading) {
        return <div>Loading...</div>;
    };
    
    return (
        isAuthenticated && (
            <div className="content">
            {user.username}
            <Launch
                userId={user.username}
            />
            </div>
    ));
}
            


class Home extends React.Component {

    state = {
        userId: this.props.userId
    }

    handleFinishTest = () => {
        this.setState({testMode: 0,
                       usualMode: 1});
    };

    onUserSubmit = (value) => {
        this.props.newUser(value);
        this.setState({userId: value});
    }
    
    render () {
        if (this.state.userId!=0) {
            return (
                <div className="content">
                  <Launch
                    userId={this.state.userId}
                  />
                </div>
            );
        } else {
	    return (
                <div className="content">
                    <LoginButton/>
                  <UserSelectContainer
                    onSubmit={this.onUserSubmit}
                  />
                </div>
            );
        }
    };
}	

const LoginButton = () => {
        
        const {loginWithRedirect} = useAuth0();
        
        return (
            <div className="ui centered card">
         <button onClick={()=> loginWithRedirect()} >Log In </button>
            </div>
        );
}
        
            
ReactDOM.render(
    <App/>,
    document.getElementById('root')
);

