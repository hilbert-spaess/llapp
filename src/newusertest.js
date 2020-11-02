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
        
        var newcourse = course;
        if (newcourse == "1") {
            newcourse = "6"
        }
        
        this.setState({course: newcourse});
    
    }
    
    render () {
        
        console.log(this.state.readingacademic != null);
        console.log(this.state.readingacademic);
        
        if (this.state.readingacademic == null || this.state.course==null) {
            
            return (
                
                <div>
                <ReadingChoice 
                handleSubmit={this.handleReadingChoiceSubmit}
                selected={this.state.readingacademic}/>
                {(this.state.readingacademic != null) && <CourseChoice readingacademic={this.state.readingacademic} handleSubmit = {this.handleCourseChoiceSubmit}/>}
                </div>
            );
        }
        

        return (
            
            <VocabSelectLoader
            data={this.state}/>
            
            );

    }
}

class SelectPanel extends React.Component {
    
    render () {
        
        if (this.props.type=="reading") {
            
            var text = "Welcome. What sort of English can we help you with?";
            
        }
        
        return (
            
            <div className="selectpanel">
            <div className="ricecakeheader">RiceCake</div>
            <div className="ricecakesub">{text}</div>
            </div>
            
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
        console.log("rendering course choice");
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
            
            console.log("BEMBLO");
            
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
                        <>
                       <div style={{textAlign: "center"}} className="maintext"> Choose your reading level.</div>
                       <Row style={{marginTop: "3em", justifyContent: "space-evenly"}}>
             {choices}
                        </Row>
                </>
            );
    }
}

class ReadingChoice extends React.Component {
    
    render () {
        
        var choices = [];
        
        choices.push(<CourseCard 
                     name="General Reading"
                     id={1}
                     selected={this.props.selected==1}
                     variant="outline-success"
                     buttonText="Choose"
                     handleClick={this.props.handleSubmit}/>);
    
        choices.push(<CourseCard 
                     name="Academic Reading"
                     id={2}
                     selected={this.props.selected==2}
                     variant="outline-success"
                     buttonText="Choose"
                     handleClick={this.props.handleSubmit}/>);
        
        return (
            <>
            <div className="maintext" style={{textAlign: "center"}}>Welcome. What sort of English can we help you with?</div>
            
                       <Row style={{marginTop: "3em", justifyContent: "space-evenly"}}>
             {choices}
                        </Row>
</>
        );
    }
}
            
            

export class CourseCard extends React.Component {
    
    onClick = (event) => {
        this.props.handleClick(this.props.id);
    }
    
    render () {
        
        if (this.props.selected) {
            var bordercolor = "red";
        } else {
            var bordercolor = "";
        }
        
        if (this.props.id == 1) {
            var posclass = "coursecardleft";
        }
        if (this.props.id == 2) {
            var posclass = "coursecardright";
        }
        
        return (
             
            <Card className="coursecard" onClick={this.onClick} style={{cursor: "pointer", width: "30em", height: "15em", borderColor: bordercolor}}>
            <div className="coursecardname" onClick={this.onClick}>{this.props.name}</div>         
            </Card>


        );
    }
}

class TextScroller extends React.Component {
    
    render () {
        
        var wordCards = [];
        var words = [];
        
        if (this.props.id==1) {
            
            var words = ["damp", "leap", "insane", "demolish", "imaginative", "herd", "crumble", "sneak", "refund", "chink", "dreadful", "weep", "furious", "slump", "quest" ,"oak", "delightful", "feast", "revenge", "hurricane", "revenge"];
        }
        
        if (this.props.id==2) {
            
            var words = ["abbreviate", "clarify", "autonomy", "paean","cause", "coherent", "enumerate", "dichotomy", "devise", "recapitulate", "plethora", "paradigm", "maxim", "objective", "implicit", "unprecedented", "scrutinise", "rationale"];
        }
        
        for (var i =0; i < words.length; i ++ ) {
            
            wordCards.push(<WordCard word={words[i]}/>);
        
        }
        
        return (
            
            <div className="textscroller">
             {wordCards}
            </div>
            );
    }
}

class WordCard extends React.Component {
    
    render () {
        
        return (
            
            <div className="textscrollerword">
            {this.props.word}
             </div>
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

    

            
             