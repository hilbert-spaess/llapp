import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Col, Row, Button, Container, Modal} from 'react-bootstrap';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Stylesheet, css} from 'aphrodite';
import {Launch} from './launch.js';
import {Sidebar, TopBar} from './sidebar.js';
import {LearningContainer} from './LearningContainer.js';
import {MyVocabContainer} from './MyVocabContainer.js';
import {UserSelectContainer} from './UserSelectContainer.js';
import {TestContainer} from './TestContainer.js';

class MainElement extends React.Component {

    state = {
        userId: 0,
	sidebarOpen: true
    }

    onUserSubmit = (value) => {
        this.setState({userId: value});
    }

    onSetSidebarOpen = () => {
	this.setState({sidebarOpen: true});
    }
    
    render () {
	
	return (
            <BrowserRouter>
              <Switch>
                <Route path="/test">
                  <TestContainer/>
                </Route>
                <Route path="/home">
                  <Home
                    userId={this.state.userId}
                    newUser={this.onUserSubmit}/>
                </Route>
                <Route path="/read">
                  <LearningContainer
                    userid={this.state.userId}
                /></Route>
		<Route path="/vocab">
		<MyVocabContainer
	    userid={this.state.userId}/>
		</Route>
              </Switch>
		</BrowserRouter>
        );
    }
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
                  <UserSelectContainer
                    onSubmit={this.onUserSubmit}
                  />
                </div>
            );
        }
    };
}	
            
ReactDOM.render(
    <MainElement/>,
    document.getElementById('root')
);

