import React from 'react';
import {Card, Row, Col} from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {useApi} from './use-api.js';

export class NewUser extends React.Component {
    
    state = {
        choice: 0
    };
    
    choose = (choice) => {
        
        this.setState({choice});
    };
    
    
    render () {
        
        if (this.state.choice == 0) {

            return (
                    <div>
                    <Row>
                    <Col>
                    <div className="maintext">
                    Welcome! Choose a course to get started.
                    </div>
                    </Col>
                    </Row>
                    <Row>
                    <Col>
                    <CourseCard
                    name="Toefl Core 250: core TOEFL vocab and reading."
                    id="1"
                    choose={this.choose}
                    />
                    </Col>
                    </Row>
                    </div>
            );
    } else {
        return <Choose id={this.state.choice}/>;
    }
        
    }
}

const Choose = (props) => {
        const {login, getAccessTokenWithPopup } = useAuth0();
        const opts = {audience: 'http://localhost:5000'};
        const {error, loading, data, refresh} = useApi('http://localhost:5000/api/newuser', {courseChoice: props.id}, opts);
        const getTokenAndTryAgain = async () => {
        await getAccessTokenWithPopup(opts);
        refresh()
      };
        if (loading) {
            return <div>Loading...</div>;
        }
        if (error) {
            if (error.error === 'consent_required') {
          return (
            <button onClick={getTokenAndTryAgain}>Consent to reading users</button>
          );
        }
        return <div>Oops {error.message}</div>;
        }
        return (<Redirect to="/read"/>);
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
