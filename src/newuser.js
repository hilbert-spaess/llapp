import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {useApi} from './use-api.js';
import {APIHOST} from './api_config.js';
import {Card, Button, Row, Col, Container, Modal} from 'react-bootstrap';
import {SidebarWrapped} from './sidebar.js';

export class NewUser extends React.Component {
    
    render () {
        return (
            <SidebarWrapped WrappedComponent={NewUser1}/>
        );
    }
}

const NewUser1 = (props) => {
        const {login, getAccessTokenWithPopup } = useAuth0();
        const opts = {audience: APIHOST};
        const {error, loading, data, refresh} = useApi(APIHOST + '/api/newuser', {}, opts);
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
        return <div>Oops {error.message}</div>;
        }
        return (<NewUser2 
                choices = {data.choices}/>);
}

            


export class NewUser2 extends React.Component {
    
    state = {
        choice: 0
    };
    
    choose = (choice) => {
        
        this.setState({choice});
    };
    
    
    render () {
        
        var choices = [];
        
        for (var i = 0; i < 2; i++) {
            
            choices.push(<CourseCard
                         name={this.props.choices[i]["name"]}
                         id={this.props.choices[i]["id"]}
                         choose={this.choose}/>);
        }
        
        if (this.state.choice == 0) {

            return (
                    <div className="mainbox">
                        <div className="maintext">
                    Welcome! Choose a course to get started.
                    choices
                    </div>
                    </div>
            );
    } else {
        return <Choose id={this.state.choice}/>;
    }
        
    }
}

const Choose = (props) => {
        const {login, getAccessTokenWithPopup } = useAuth0();
        const opts = {audience: APIHOST};
        const {error, loading, data, refresh} = useApi(APIHOST + '/api/newuser', {courseChoice: props.id}, opts);
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
        return <div>Oops {error.message}</div>;
        }
        return (<Redirect to="/newusertest"/>);
    }


class CourseCard extends React.Component {
    
    onClick = (event) => {
        this.props.choose(this.props.id);
    }
    
    render () {
        return (
            <Card>
            {this.props.name}
            <input 
            type="button"
            value="Choose"
            onClick={this.onClick}>
            </input>
            
            </Card>
            );
    }
}
