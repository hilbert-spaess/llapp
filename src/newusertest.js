import React from 'react';
import {useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {useApi} from './use-api.js';
import {APIHOST} from './api_config.js';
import {Card, Button, Row, Col, Container, Modal, ProgressBar} from 'react-bootstrap';
import {BarWrapped, FreeBarWrapped2} from './sidebar.js';
import {VocabSelectContainer} from './VocabSelect.js';

export class NewUserTest extends React.Component {
    
    render () {
        return (
            <FreeBarWrapped2 WrappedComponent={NewUserTest1}/>
        );
    }
}

export class NewUserTest1 extends React.Component {
    
    state = {readingacademic: null,
             answers: null,
            course: null}
    
    handleReadingChoiceSubmit = (id) => {
        
        this.setState({readingacademic: id});
        
    }
    
    handleLevelTestSubmit = (data) => {
        
        this.setState({answers: data.answers});
    
    }
    
    handleCourseChoiceSubmit = (course) => {
        
        this.setState({course});
    
    }
    
    render () {
        
        if (this.state.readingacademic==null) {
            return <ReadingChoice
                    handleSubmit = {this.handleReadingChoiceSubmit}/>;
        }
        
        if (this.state.course==null) {
            return <CourseChoice
                    readingacademic={this.state.readingacademic}
                    handleSubmit = {this.handleCourseChoiceSubmit}/>;
        }

        return (
            
            <VocabSelectLoader
            data={this.state}/>
            
            );

    }
}

const CourseChoice = (props) => {
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
        return (<CourseChoice1 
                readingacademic = {props.readingacademic}
                choices = {data.choices}
                handleSubmit={props.handleSubmit}/>);
}

export class CourseChoice1 extends React.Component {
    
    render () {
        
        var choices = [];
        
        var keys = Object.keys(this.props.choices);
        
        if (this.props.readingacademic == "2") {
            
            var ids = ["1", "2", "6"]
            
        } 
        if (this.props.readingacademic=="1") {
            
            var ids = ["5", "7"]
            
        }
        
        for (var i = 0; i < keys.length; i++) {
            
            if (ids.includes(keys[i])) {
            
            
            choices.push(<CourseCard
                         name={this.props.choices[keys[i]]["name"]}
                         id={keys[i]}
                         variant="outline-success"
                         buttonText="Choose"
                         handleClick = {this.props.handleSubmit}
                        />);
            }
        }
    
         return (

                <div className="mainbox">
                            <div className="maintext">
                        Choose your reading level.
                        </div>
                       <Row style={{marginTop: "3em", justifyContent: "space-evenly"}}>
             {choices}
                        </Row>
                        </div>

            );
    }
}

class ReadingChoice extends React.Component {
    
    render () {
        
        var choices = [];
        
        choices.push(<CourseCard 
                     name="General Reading"
                     id={1}
                     variant="outline-success"
                     buttonText="Choose"
                     handleClick={this.props.handleSubmit}/>);
    
        choices.push(<CourseCard 
                     name="Academic Reading"
                     id={2}
                     variant="outline-success"
                     buttonText="Choose"
                     handleClick={this.props.handleSubmit}/>);
        
        return (
            
             <div className="mainbox">
                            <div className="maintext">
                        Welcome! What are you working on?
                        </div>
                       <Row style={{marginTop: "3em", justifyContent: "space-evenly"}}>
             {choices}
                        </Row>
                        </div>
        );
    }
}
            
            

export class CourseCard extends React.Component {
    
    onClick = (event) => {
        this.props.handleClick(this.props.id);
    }
    
    render () {
        
        return (
            
             <Card style={{height: "30rem", width: "20rem"}}>
            <div style={{textAlign: "center", marginTop: "1em", fontSize: "30px"}}>{this.props.name}</div>
            <div style={{position: "absolute", bottom: "10%", left: "50%", transform: "translate(-50%,0%)"}}>
            <Button style={{fontSize: "20px"}} block onClick={this.onClick} variant={this.props.variant}>{this.props.buttonText}</Button>
</div>
            
            </Card>


        );
    }
}
    

export class OptionCard extends React.Component {
    
    onClick = (event) => {
        this.props.handleClick(this.props.id);
    }
    
    render () {
        
        return (

            
             <Card style={{height: "20rem", width: "15rem", border: "0"}}>
            <Button style={{fontSize: "20px"}} onClick={this.onClick} variant={this.props.variant}>{this.props.text}</Button>
            
            </Card>


        );
    }
}

export class Ready extends React.Component {
    
    render () {
        
        return (
             <div className="mainbox">
                        <div className="maintext">
            
          Welcome! Let's work out your English level.
            </div>
            </div>
        );
    }
}

        
const VocabSelectLoader = (props) => {
    
        const {login, getAccessTokenWithPopup, user} = useAuth0();
        const opts = {audience: APIHOST};
        const {error, loading, data, refresh} = useApi(APIHOST + '/api/coursevocab', {course: props.data.course, email: user.email}, opts);
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
        return (<VocabSelectContainer
                data={data}
                course={props.data.course}/>);
    }

    

            
             