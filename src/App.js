import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Col, Row, Button, Container, Modal} from 'react-bootstrap';
import {BrowserRouter, Route, Switch, Router} from 'react-router-dom';
import {Stylesheet, css} from 'aphrodite';
import {Launch} from './launch.js';
import {Sidebar, TopBar} from './sidebar.js';
import {LearningSupervisor} from './ReadingSupervisor.js';
import {MyVocabContainer} from './MyVocabContainer.js';
import {UserSelectContainer} from './UserSelectContainer.js';
import {TestContainer} from './TestContainer.js';
import {Auth0Provider, useAuth0, withAuthenticationRequired} from '@auth0/auth0-react';
import {createBrowserHistory} from 'history';
import {NewUser} from './newuser.js';
import {NewUserTest} from './newusertest.js';
import {CALLBACK} from './api_config.js';
import {Landing} from './landing.js';
import {Login} from './login.js';
import {Signup} from './signup.js';
import {ReviewToday} from './review_today.js';
import {Register} from './register.js';
import {DisplayLists} from './lists.js';

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
            <ProtectedRoute path="/vocab" component={MyVocabContainer}/>
            <ProtectedRoute path="/newuser" component={NewUserTest}/>
            <ProtectedRoute path="/reviewtoday" component={ReviewToday}/>
            <ProtectedRoute path="/lists" component={DisplayLists}/>
            <Route path="/register" component={Register}/>
            <Route path="/login" component={Login}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/" component={Landing} exact/>
        </Switch>
        </Router>
        </Auth0Provider>
    );
}        
            
ReactDOM.render(
    <App/>,
    document.getElementById('root')
);

