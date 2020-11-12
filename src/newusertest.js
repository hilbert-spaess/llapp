import React from 'react';
import {useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {useApi} from './use-api.js';
import {APIHOST} from './api_config.js';
import {Card, Button, Row, Col, Container, Modal, ProgressBar} from 'react-bootstrap';
import {BarWrapped, FreeBarWrapped2} from './sidebar.js';
import {VocabSelectContainer} from './VocabSelect.js';
import {ArrowLeft} from 'react-feather';

export class NewUserTest1 extends React.Component {
    
    render () {
        return (
            <FreeBarWrapped2 WrappedComponent={NewUserTest1}/>
        );
    }
}

export class NewUserTest extends React.Component {
    
    render () {
        
        return (
            <div className="launchwindow">
            <div style={{width: "100vw", height: "100vh"}}>
            <div style={{position: "absolute", top: "3%", left: "2%", fontSize: "2vw", fontFamily: "Montserrat", fontWeight: "600"}}>RiceCake</div>
            <NewUserTest2/></div></div>
        );
            
            }
}

export class NewUserTest2 extends React.Component {
    
    state = {individual: null,
        readingacademic: null,
             answers: null,
            course: null}
    
    handleIndividualChoiceSubmit = (id, delay) => {
        
        setTimeout(()=>{this.setState({individual: id});}, delay);
        
    }
    
    handleIndividualCourseBack = () => {
        console.log("hehehe");
        this.setState({individual: null});
        
    }
    
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
        
        setTimeout(()=>{this.setState({course: newcourse});}, 1500);
    
    }
    
    render () {
        
        console.log(this.state.readingacademic != null);
        console.log(this.state.readingacademic);
        console.log(this.state.individual);
        
        if (this.state.individual == null) {
            
            console.log("Henloe");
            
            return <IndividualChoice
                    handleSubmit={this.handleIndividualChoiceSubmit}/>;
                    
        }
        
        if (this.state.individual == 0) {
            
            if (this.state.course == null) {
                
                return <CourseChoice individual={this.state.individual} handleBack={this.handleIndividualCourseBack} handleSubmit={this.handleCourseChoiceSubmit}/>
                    
            }
                
            else {
                return <VocabSelectLoader data={this.state}/>
                    
            }
            
        }
        
        if (this.state.individual == 1) {
            
            if (this.state.institution == null) {
                
                return <div>Select Institution</div>
                
            }
            
            else if (this.state.course == null) {
                
                return <div>Select course</div>
                
            }
            
            else {
                
                return <VocabSelectLoader data={this.state}/>
                    
            }
            
        }
        
        
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

class IndividualChoice extends React.Component {
    
    state = {blank: "________", i: 0, done: false, chosen: false}
    
    handleSubmit = (id, text) => {
        
        this.setState({chosen: true, blank: text});
        let timerId2 = setInterval(() => this.handleCounts(text), 50);
        this.props.handleSubmit(id, 50*(text.length+5) + 500);
        
    }
    
    handleCounts = () => {
        
        if (this.state.i < this.state.blank.length) {
            this.setState({i: this.state.i+1});
        }
        else {
            this.setState({done: true});
        }
    }
    
    render () {
        
        var m = Math.max(10, this.state.blank.length).toString();
        
        var choices = [];
        
        choices.push(<ChoiceBubble no={2} id={0} text="personalised English courses" handleSubmit={this.handleSubmit}/>);
        choices.push(<ChoiceBubble no={2} id={1} text="courses from my school" handleSubmit={this.handleSubmit}/>);            
        
        return (
            <>
            <div className="choicetextbox"><div className={this.state.done ? "fadeoutchoice" : ""}>
            <div className="choicetext">
            I'm looking for {this.state.blank.slice(0, this.state.i)}
            </div></div></div>
            {!this.state.chosen && <Row className="userchoicerow">
            {choices}
        </Row>}
            </>
            );
    }
}

class BackArrow extends React.Component {
    
    render () {
        
        return (
            
            <div onClick={this.props.handleBack} style={{position: "absolute", bottom: "6vh", left: "4vw", cursor: "pointer"}}><ArrowLeft size="3vw"/></div>

        );
    }
}


class ChoiceBubble extends React.Component {
    
    handleSubmit = () => {
        
        this.props.handleSubmit(this.props.id, this.props.text);
        
    }
    
    render () {
        
        return (
            
            <div onClick={this.handleSubmit} className="choicebubble">
            <div className="choicebubbletext">
            {this.props.text}</div></div>
            
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
                individual = {props.individual}
                readingacademic = {props.readingacademic}
                choices = {data.choices}
                handleSubmit={props.handleSubmit}
                handleBack={props.handleBack}/>);
}

export class CourseChoice1 extends React.Component {
    
    state = {blank: "", done: false}
    
    handleSubmit = (id, text) => {
        
        this.setState({blank: text, done: true});
        this.props.handleSubmit(id);
        
    }
    
    handleBack = () => {
        console.log("hehe");
        this.props.handleBack();
    }
    
    render () {
        
        var choices = [];
        
        var keys = Object.keys(this.props.choices);
        
        
        if (this.props.individual == "0") {
            
            var ids = ["5", "6", "2"];
            
        }
        
        if (this.props.readingacademic == "2") {
            
            console.log("BEMBLO");
            
            var ids = ["1", "2", "6"]
            
        } 
        if (this.props.readingacademic=="1") {
            
            var ids = ["5", "7"]
            
        }
        
        for (var i = 0; i < ids.length; i++) {
            
            
            
            choices.push(<ChoiceBubble
                         text={this.props.choices[ids[i]]["name"]}
                         id={ids[i]}
                         handleSubmit = {this.handleSubmit}
                        />);
        }
    
         return (
                        <>
             <BackArrow handleBack={this.props.handleBack}/>
            <div className="choicetextbox"><div className={this.state.done ? "fadeoutchoice" : ""}>
            <div className="choicetext">
            I'd like to study <input className="choiceinput" value={this.state.blank} style={{width: "13ch"}}/> vocab.
            </div></div></div>
            {!this.state.done && <Row className="userchoicerow">
            {choices}
        </Row>}
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
            <div className="maintext" style={{textAlign: "center", fontFamily: "Montserrat", fontWeight: "400"}}>Welcome. What sort of English can we help you with?</div>
            
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
             
            <Card className="coursecard" onClick={this.onClick} style={{cursor: "pointer", width: "25vw", height: "25vh", borderColor: bordercolor}}>
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
        return (<VocabSelectContainer
                data={data}
                course={props.data.course}/>);
    }

    

            
             