import React from 'react';
import ReactDOM from 'react-dom';
import {useLocation} from 'react-router-dom';
import {Card, Button, Row, Col, Container, Modal, ProgressBar} from 'react-bootstrap';
import {InteractionCard} from './InteractionCard.js';
import {getChunk, firstChunk, getData, JSONconvert} from './client.js';
import {FreeBarWrapped} from './sidebar.js';
import {Text} from 'react-native';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';
import {Tutorial} from './tutorial.js';
import {CheckCircle, Type, AlignLeft, Eye, BookOpen, Edit3} from 'react-feather';
import {StreakShow} from './MyVocabContainer.js';
import {Line} from 'rc-progress';

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

function get_second_streak(streak1, first) {
    
    console.log(first);
    console.log(streak1);
    
    if (first == 1) {
        
        return streak1 + 1;
        
    } else {
        
        if (streak1 < 5) {
            
            return 1;
            
        }
        
        if (streak1 < 9) {
            
            return 5;
            
        }
    }
}

export class LearningContainer extends React.Component {

    state = {
        done: 0,
        showDialog: false,
        isLoading: 0,
        answeredCorrect: "-1",
        answers: [],
        currentInteraction: 0,
        limbo: false,
        runningProgress: this.props.runningProgress
        }

    bottomRef = React.createRef();
    
    
    
    storeAnswer = (correct) => {
        this.setState(prevState => ({
            answers: [...prevState.answers, correct]
        }));
    };
    
    handleAnswer = (correct) => {
        this.storeAnswer(correct);
        if (correct) {
            this.setState({answeredCorrect: 1});
            this.setState({runningProgress: [this.state.runningProgress[0]+1, this.state.runningProgress[1]] });
        } else {
            this.setState({answeredCorrect: 0});
            this.setState({runningProgress: [this.state.runningProgress[0], this.state.runningProgress[1]+1] });
        }
        console.log("HANDLING NOW");
        if (this.props.currentChunk["interaction"][this.state.currentInteraction]["key"] == 1) {
            this.handleOpenDialog();
        } else {
            this.handleCloseDialog();
        }
            
    }
    
    nextInteraction = () => {
        const a = this.state.currentInteraction + 1;
        this.setState({currentInteraction: a});
    }
    
    handleOpenDialog = () => {
        this.setState({showDialog: true});
    }
    
    handleHide = (answer) => {
        
        console.log(answer);
        const target= this.props.currentChunk["context"][this.props.currentChunk["interaction"][this.state.currentInteraction]["location"]]['vw']
        console.log(target);
        console.log(answer==target);
        if (answer == target) {
            this.handleCloseDialog();
        }
    }

    handleCloseDialog = () => {
            this.setState({showDialog: false,
                          done: 0});
            console.log("CURRENT INTERACTION");
            console.log(this.state.currentInteraction);
            setTimeout(() => {if (Object.keys(this.props.currentChunk["interaction"]).length > this.state.currentInteraction+1) {
                console.log("hehe");
                this.nextInteraction();
            } else {
            if (this.props.currentChunk['first'] == 0) {
                    this.handleNext();
                } else {
                    this.setState({limbo: true});
                }
            }}, 200);
    }
    
    
    handleNext = (event) => {
        
        console.log(get_second_streak(this.props.currentChunk["interaction"][this.props.currentChunk["keyloc"]]["streak"], this.props.currentChunk["first"]));
        console.log(this.props.displayType); 
        if (this.props.displayType == "readforfun") {
            var x = "readforfunlogging";
        } else {
            var x = this.props.displayType;
        }
        
        this.props.handleNext({
        answeredCorrect: this.state.answeredCorrect,
        chunkId: this.props.currentChunk["chunkid"],
        keyloc: this.props.currentChunk["keyloc"],
        first: this.props.currentChunk["first"],
        displayType: x,
        answers: this.state.answers,
        streak: get_second_streak(this.props.currentChunk["interaction"][this.props.currentChunk["keyloc"]]["streak"], this.props.currentChunk["first"]),
        runningProgress: this.state.runningProgress,
        done: 0,
        interaction: this.props.currentChunk["interaction"]});
        this.setState({currentInteraction: 0,
                       answers: [],
                       limbo: false});
    }

    
    render () {
        console.log(this.props.progress);
        if ("alternatives" in this.props.currentChunk["interaction"][this.state.currentInteraction]) {
            var alternatives = this.props.currentChunk["interaction"][this.state.currentInteraction]["alternatives"];
        } else {
            var alternatives = [];
        }     
        const context = this.props.currentChunk["context"];
        const interaction = this.props.currentChunk["interaction"];
        const location = this.props.currentChunk["interaction"][this.state.currentInteraction]["location"];
        const answer= this.props.currentChunk["context"][this.props.currentChunk["interaction"][this.state.currentInteraction]["location"]]['w'];
        alternatives.push(answer.toLowerCase())
        console.log(answer);
        const answerlength = answer.length;
        const interactionMode= this.props.currentChunk["interaction"][this.state.currentInteraction]["mode"];
        const length = this.props.currentChunk["interaction"][this.state.currentInteraction]["length"];
        console.log(interactionMode);
        if ((interactionMode == "6" && this.props.currentChunk["first"] != 1) || (interactionMode=="4")) {
            var letterNo = 2;
        } else {
            var letterNo = 1;
        }
        
        if (this.props.currentChunk["first"] == 1) {
            var progress = this.props.progress;
        } else {
            var progress = this.props.reviewProgress;
        }
        
        console.log(this.props.progress);
        console.log(progress);
        
        if (this.state.isLoading == 0 ) {
                return (
	    <Container fluid="lg">
                    <div id="myModal">
		<Modal centered size="lg" show={this.state.showDialog} onHide={this.handleCloseDialog}>
                    
		<AnswerCard
        show={this.state.showDialog}
	    word={context[location]['vw']}
	    answeredCorrect={this.state.answeredCorrect}
	    handleHide={this.handleHide}
	    specificInteraction={interaction[this.state.currentInteraction]}
        first={this.props.currentChunk["first"]}
        displayType={this.props.displayType}
        handleClose={this.handleCloseDialog}/>
		    </Modal>
</div>
        <div style={{paddingTop: "10vh"}}>
            <RunningProgressTracker
                runningProgress={this.state.runningProgress}
                yet={this.props.yet}
                reviewyet={this.props.reviewyet}/>
            <Row>
		    <Col>
                    <Line percent={progress} strokeWidth="1" strokeColor="#048a81" style={{marginTop: "2em"}}/>
            </Col>
            </Row>
           <div style={{marginTop: "5vh"}}>
		    <Row>
		    <Col>
		    <TextCard
        first={this.props.currentChunk["first"]}
        alternatives={alternatives}
		context={context}
		length={length}
		interaction={interaction}
		currentInteraction={this.state.currentInteraction}
		answer={answer}
        answers={this.state.answers}
		location={location}
		handleAnswer={this.handleAnswer}
        limbo={this.state.limbo}
        showDialog={this.state.showDialog}
        answerlength={answerlength}
        letterNo={letterNo}/>   
		    </Col>
		    </Row>
            
		    <Row>
		    <Col>
		    <InteractionCard
		done={this.state.done}
		answeredCorrect={this.state.answeredCorrect}
		interactionMode={interactionMode}
		interaction={interaction[this.state.currentInteraction]}
		answer={answer}
        limbo={this.state.limbo}
        handleNext={this.handleNext}
        first={this.props.currentChunk["first"]}
		    />
		    </Col>
		    </Row>
            <div style={{marginTop: "2em"}} ref={this.bottomRef}/>
                </div>
        </div>
		</Container>
	);
        }
        else if (this.props.displayType == "done") {
            return (
                <div className = "ui centered card">
                No more reviews.
                </div>
            );
        } else {
            return (
                <div className="card">
                </div>
            );
        }
    }
}

class TextCard extends React.Component {
    
    componentDidMount () {
	setTimeout(() => {try {this.nameInput.focus();} catch (e) {console.log("Error");}}, 200);
    }
    
    componentDidUpdate = (prevProps) => {
            if (prevProps.interaction !== this.props.interaction) {
                this.setState({values: range(0, Object.keys(this.props.interaction).length - 1).map((thing) => this.props.context[this.props.interaction[thing]["location"]]["w"][0])});
            }
            setTimeout(() => {try {this.nameInput.focus();} catch (e) {console.log("Error");}}, 200);
    }
    
    
    handleChange = (event) => {
        var newvalues = this.state.values;
        newvalues[this.props.currentInteraction] = event.target.value;
        this.setState({values: newvalues});
        event.preventDefault();
    }
    
    state = {values: range(0, Object.keys(this.props.interaction).length - 1).map((thing) => this.props.context[this.props.interaction[thing]["location"]]["w"][0])}

    handleSubmit = (event) => {
        console.log("hemlo");
        var a = this.state.values[this.props.currentInteraction];
        console.log(this.props.answer.toLowerCase())
        console.log(a.toLowerCase())
        console.log(this.props.alternatives);
        console.log(a.toLowerCase() in this.props.alternatives)
        if (this.props.alternatives.includes(a.toLowerCase())) {
                console.log("hemloe");
                this.props.handleAnswer(1);
        } else {
                this.props.handleAnswer(0);
        }
        event.preventDefault();
    }
   
        
    render () {
            
	var context = this.props.context;
	var location = this.props.location;
	var value= this.state.values[this.props.currentInteraction];
    var x = this.props.showDialog;
    console.log(x);
	var length = this.props.length;
	var words = [];
	var tcolour = "black";
	var answer = {};
    var punct = [".",",",";","!","?",":", "'s", "n't", "n’t", "’s", "'re", "’re"];
    for (var i = 0; i < length; i++) {
        if (context[i]["u"] == 1) {
        var tcolour = "black";
        } else {
        var tcolour = "black";
        }
        if ((punct.includes(context[i]['w']))) {
            var spc = "";
        } else {
            var spc = " ";
        }
        
        if (!("i" in context[i])) {
    words.push(<Text style={{wordBreak: "keep-all", display: "inline-block", overflowWrap: "normal"}}>{spc + context[i]['w']}</Text>);
        } else if (this.props.limbo || i != location) {
            if (this.props.answers[context[i]["i"]] == 1) {
                words.push(<Text style={{color: "#048a81", overflowWrap: "normal"}}>{spc + context[i]["w"]}</Text>);
            } else {
                words.push(<Text style={{color: "red", overflowWrap: "normal"}}>{spc + context[i]["w"]}</Text>);
            }
        } else {
            words.push(spc);
        words.push(<input spellcheck="false" className="workinput" type="text"  key = {this.props.showDialog} autocomplete="off" autoFocus ref = {(input) => {this.nameInput=input;}} value={value} onChange={this.handleChange} style={{backgroundColor: "transparent", outline: "0", wordBreak: "keep-all", flex: "none", display: "inline-block", border: "0", width: (this.props.answerlength+1).toString() + "ch", borderTop: "0", outlineTop: "0", lineHeight: "20px", borderBottom: "1px solid grey", textAlign: "left"}}/>);
        }
    };

        return (
		<Card className="maintext" style={{backgroundColor: "#f5f5f5"}}
            key={this.props.showDialog}>
		<Text spellcheck="false" style={{fontSize: "30px", lineHeight: "2em", display: "inline-block", wordBreak: "keep-all", fontFamily: "roboto"}}>
        <form className="commentForm" onSubmit={this.handleSubmit}>
           
            {words}
        </form>
	    </Text>
		</Card>
        );
    };
};



class AnswerCard extends React.Component {
    
    state = {barLevel: 100*this.props.specificInteraction["streak"]/10}
                                                         
    componentDidUpdate (prevProps) {
        
        console.log(this.props.show);
        
        if (prevProps.show == false && this.props.show == true) {
            console.log("big FAT HEMLO");
            setTimeout(() => {this.nameInput.focus();}, 200);
            
                                                                                          
        }
    }
    

    render () {
    console.log(this.props.specificInteraction["mode"])
    console.log("samples" in this.props.specificInteraction)
    console.log(this.props.specificInteraction["samples"]);
    console.log(this.state.barLevel);
	if (this.props.answeredCorrect == 1) {
	    var styling = "Correct";
	} else {
	    var styling = "Wrong";
	}
    if (this.props.specificInteraction["key"] == "1") {
        var streak = (this.props.specificInteraction["streak"]).toString();
    } else {
        var streak = "";
    }
    var streak1 = this.props.specificInteraction["streak"];
    if (this.props.answeredCorrect == 0 || this.props.first == 0) {
        if (streak1 == 0 && this.props.answeredCorrect == 0) {
            var streak2 = 0;
        } else if (streak1 < 5) {
            var streak2 = 1;
        } else if (streak2 < 9) {
            var streak2 = 5;
        }
    } else {
        var streak2 = streak1 + 1;
    }   
    if (streak2 < 5) {
        var colour="lightblue";
        var fontcolour="black";
    } else if (streak2 < 9) {
        var colour="#003153";
        var fontcolour="white";
    }
    var full = ((streak == "0" && this.props.first == 1) || this.props.answeredCorrect == 0);
    if (this.props.first == 0) {
        streak1 = streak2;
    }
    if (this.props.show == true) {
	return (
	    <div key={this.props.show}>
	     <div style={{height: "5em", backgroundColor: colour, color: fontcolour}}>
            {full && <FirstInput 
handleHide={this.props.handleHide}
styling={styling}
bgcolor={colour}
        word={this.props.word}
/>}
{!full && <div><div className="vocabdisplay">{this.props.word}</div><SecondInput handleHide={this.props.handleClose} styling={styling}/></div>}
</div>
 <div className="cardprogress">
            {(this.props.displayType != "readforfun") && <AnimatedStreakShow 
                streak2={streak2}
                streak1={streak1}/>}
        </div>
         <BookOpen style={{marginRight: "1em", marginTop: "1em", marginLeft: "2em", display: "inline-block"}}/>
        <div className="chinesedef" style={{marginLeft: "2em", paddingLeft: "1em", paddingRight: "1em"}}> 
            {"def" in this.props.specificInteraction && this.props.specificInteraction["def"]}
        </div>
        <hr></hr>
{full &&
        <Edit3 style={{display: "inline-block", marginLeft: "2em"}}/>}
<div className="chinesedef" style={{marginBottom: "0.5em", color: "grey", paddingLeft: "1em", paddingRight: "1em", marginLeft: "2em"}}>
            {full && ("samples" in this.props.specificInteraction) && <SampleSentences samples={this.props.specificInteraction["samples"]}/>}
    </div>
		</div>
	); } else {
        return (
            <div key={this.props.show}>
	    <div className="vocabdisplay">
		    {this.props.word}
	    </div>
        <div className="chinesedef">
            Chinese definition here.
        </div>
        <div className="cardprogress">
            <AnimatedStreakShow 
                streak2={streak2}
                streak1={streak2}/>
        </div>
        <div className="samplesentences">
            {("samples" in this.props.specificInteraction) && (this.props.specificInteraction["samples"].length > 0) && <SampleSentences samples={this.props.specificInteraction["samples"]}/>}
    </div>
<div>
		<FirstInput 
handleHide={this.props.handleHide}
styling={styling}
/>
</div>
		</div>
    );
    
    }
}
}

class AnimatedStreakShow extends React.Component {
    
    state = {streak: this.props.streak1}
    
    componentDidMount () {
        
        setTimeout(() => {this.setState({streak: this.props.streak2});}, 200);
        
    }
    
    render () {
        
        var pips = [];
        
        console.log(this.state.streak);
        
        if (this.state.streak < 5) {
        
            for (var i = 0; i < (this.state.streak % 5); i++) {
                console.log("Hi1");
                pips.push(<div className="pipbig pip-green"/>);
            }

            for (var i = 0; i < (4 - (this.state.streak % 5)); i++) {
                console.log("Hi2");
                pips.push(<div className="pipbig pip-green-hollow"/>);
            }
        } else if (this.state.streak < 9) {
            
            for (var i = 0; i < (this.state.streak % 4); i++) {
                console.log("Hi1");
                pips.push(<div className="pipbig pip-blue"/>);
            }

            for (var i = 0; i < (4 - (this.state.streak % 4)); i++) {
                console.log("Hi2");
                pips.push(<div className="pipbig pip-blue-hollow"/>);
            }
        }

        return (
            <div style={{marginTop: "0.5em"}}>
            {pips}
            </div>
        );

    }
}

class FirstInput extends React.Component {
  constructor(props) {
    super(props);
    this.innerRef = React.createRef();
  }
    
    state = {value: ""}
    
    handleChange = (event) => {
        this.setState({value: event.target.value});
    }
    
    handleHide = (event) => {
        this.props.handleHide(this.state.value);
        event.preventDefault();
    }
       

  componentDidMount() {
    // Add a timeout here
    setTimeout(() => {
        try {this.innerRef.current.focus();} catch (e) {console.log("Error");}}, 500);
  }

  render() {
    return (
        <form className="commentForm" onSubmit={this.handleHide}>
        <div style={{textAlign: "center"}}>
        <input className="answercardinput" type="text" autoFocus autocomplete="off" style={{fontSize: "50px", outline: "0", border: "0", backgroundColor: this.props.bgcolor, width: "80%", textAlign: "center", marginBottom: "0.5em"}} placeholder={this.props.word} id="myInput" ref={this.innerRef} value={this.state.value} onChange={this.handleChange}/>
            </div>
</form>
    );
  }
}

class SecondInput extends React.Component {
  constructor(props) {
    super(props);
    this.innerRef = React.createRef();
  }
    
  state = {show: false};

  componentDidMount() {
    // Add a timeout here
    setTimeout(() => {
        try {this.setState({show: true}); this.innerRef.current.focus();} catch (e) {console.log("Error");}}, 400);
    }
    
    handleHide = (event) => {
        this.props.handleHide();
        event.preventDefault();
    }

  render() {
      
    return (
        <div> {this.state.show &&
        <form className="commentForm" onSubmit={this.handleHide}>
        <button className="nextbuttonlimbo2" type="submit" autoFocus ref={this.innerRef}/>
            </form>}</div>
    );
  }
}


class MyProgressBar extends React.Component {
    
    state = {now: this.props.now}
    
    componentDidMount () {
        
        setTimeout(() => {this.setState({now: this.props.next});}, 200);
        
    }
    
    render () {
        return (
            <ProgressBar now={this.state.now}
                        variant="success"/>
    );
    }
}
      

class SampleSentences extends React.Component {
    
    render () {
        
        var words = []
        
        var punct = [".",",",";","!","?",":", "'s", "n't", "n’t", "’s"];
        
        if (this.props.samples.length > 0) {
            
            
        
            var sentencearray = this.props.samples[0][0].split("#");
            var loc = this.props.samples[0][1];
            console.log(sentencearray);
            console.log(loc);
            
            for (var i =0; i < sentencearray.length; i++) {
                if ((punct.includes(sentencearray[i]))) {
                    var spc = "";
                } else {
                    var spc = " ";
                }
                if (i==0) {
                    var spc = "";
                }
                if (i == loc) {
                    words.push(<Text style={{fontWeight: "bold"}}>{spc + sentencearray[i]}</Text>);
                } else {
                    words.push(<Text>{spc + sentencearray[i]}</Text>);
                }
            };
        }

        
        return (
            <Text style={{fontSize: "25px", textAlign: "center"}}>
            
            {this.props.samples.length > 0 && words}
    </Text>
        );
    }
}

class RunningProgressTracker extends React.Component {

    render () {

        if (this.props.runningProgress[0] + this.props.runningProgress[1] == 0) {
            return (
                <div className="runningprogresstracker">
                    <CheckCircle 
                    style={{marginRight: "0.5em",
                            marginLeft: "1em"}}/>100%
                </div>
            )
        }
 
        return (
            <div className="runningprogresstracker">
                <CheckCircle
                style={{marginRight: "0.5em",
                marginLeft: "1em"}}/> {Math.round(this.props.runningProgress[0]*100/(this.props.runningProgress[0] + this.props.runningProgress[1]))}%
            </div>
        )
    }
}
