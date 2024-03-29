import React from 'react';
import {Text} from 'react-native';
import {ArrowRight, BookOpen, Edit3} from 'react-feather';
import {Card, Button, Row, Col, Container, Modal, ProgressBar} from 'react-bootstrap';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';

export class DeviceContainer extends React.Component {

    state = {answeredCorrect: 1, answers: this.props.metadata.answers, limbo: 0}

    handleNext = (event) => {

	this.props.metadata.handleNext({
	    metadata: {answeredCorrect: this.state.answeredCorrect,
		       type: this.props.type}});
    }

    handleSubmit = (data) => {

	var newanswers = this.state.answers;

	newanswers[data.id] = data.value.trim();

	this.setState({answers: newanswers, limbo: 1});

    }

    handleCloseDialog = () => {

	this.setState({limbo: 0});

    }
				      

    render () {

	var done = this.state.answers[this.props.data.currentChunk.question.id] != undefined;
	var correct = done && this.state.answers[this.props.data.currentChunk.question.id].toLowerCase() == this.props.data.currentChunk.question.a.toLowerCase();

	return (

	    <DeviceContainerLogging
		data={this.props.data.currentChunk}
		handleNext={this.handleNext}
		handleCloseDialog={this.handleCloseDialog}
		handleSubmit={this.handleSubmit}
		done={done || this.props.tutor}
		limbo={this.state.limbo}
		correct={correct}
		answers={this.state.answers}
		tutor={this.props.tutor}
		answer={this.state.answers[this.props.data.currentChunk.question.id]}
		parcelData={{answers: this.state.answers, course_id: this.props.metadata.course_id}}/>

	);
    }
}

const DeviceContainerLogging = (props) => {

    const payload=props.parcelData;
    const {login, getAccessTokenWithPopup } = useAuth0();
    const opts = {audience: APIHOST, 
                  fetchOptions: {method: 'post',
                                 body: payload,
                                 headers: {'Access-Control-Allow-Credentials': 'true',
                                           'Access-Control-Allow-Origin': '*',
                                           'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                          'Access-Control-Request-Method': 'POST'}}};
    const {error, loading, data, refresh} = useApi(APIHOST + '/api/analysislog', payload, opts);

    const handleSubmit = async (data) => {
	await props.handleSubmit(data);
	refresh();
    }

    const handleNext = () => {

	props.handleNext();

    }

    return (

	<div>
	    <TextContainer
		data={props.data}/>
	    <QuestionContainer
		limbo={props.limbo}
		data={props.data.question}
		handleNext={handleNext}
		handleSubmit={handleSubmit}
		answers={props.answers}
		done={props.done}
		correct={props.correct}
		answer={props.answer}
		tutor={props.tutor}
		handleCloseDialog={props.handleCloseDialog}/>
	</div>
    );
}

class TextContainer extends React.Component {

    render () {

	if (Object.keys(this.props.data).includes("text")) {

	    var text="\"" + this.props.data.text + "\"";

	} else {

	    var text = "";

	}

	return (

	    <div className="devicetextcontainer">
		<div className="devicetext">
		    {text}
		</div>
	    </div>
	);
    }
}

class QuestionContainer extends React.Component {

    state = {value: "",
	     check: 0,
	     done: 0,
	     answerCard: false,
	     correct: null}
	

    onSubmit = () => {
	this.setState({value: ""});
	this.props.handleNext({});

    }

    handleChange = (event) => {

	this.setState({value: event.target.value});

    }

    handleSubmit = (event) => {
	event.preventDefault();
	this.props.handleSubmit({id: this.props.data.id, value: this.state.value});

    }

    render () {

	var answerWords = [];
	const answer_words = this.props.data.q.split(" ");
	const keys = Object.keys(this.props.data.i);
	const punct = [".", ",", ":", ";", "?", "!"];

	for (var i = 0; i < answer_words.length; i++) {

	    if (keys.includes(i.toString())) {

		if (!this.props.done) {
		    answerWords.push(<input type="text" className="deviceanswerinput" style={{width: (answer_words[i].length + 2).toString() + "ch"}} value={this.state.value} onChange={this.handleChange}/>);
		    		if (punct.includes(answer_words[i].charAt(answer_words[i].length - 1))) {
		    console.log("henlo");

					    answerWords.push(<div className="deviceanswertext"><Text>
												     {answer_words[i].charAt(answer_words[i].length - 1) + " "}
									 </Text>
				     </div>
							    );
		}
		} else {
		    answerWords.push(<div style={{color: (this.props.correct) ? "green" : "red"}} className="deviceanswertext"><Text>{(this.props.tutor) ? this.props.answer + " " : answer_words[i] + " "}</Text></div>);
		}
	    }

	    else {

		answerWords.push(<div className="deviceanswertext"><Text>
								       {answer_words[i] + " "}
								   </Text></div>);
	    }
	}
		   

	var interaction = "";

	if (this.props.data.i[keys[0]].mode=="devicefill") {

	    var interaction = "Fill in the gap with a literary device.";

	} else if (this.props.data.i[keys[0]].mode=="choose") {

	    var interaction = this.props.data.i[keys[0]].choices.join(" | ");

	} else if (this.props.data.i[keys[0]].mode == "definition") {

	    var interaction = this.props.data.def;

	}
		

	return (

	    <div className="devicequestioncontainer">
		<Modal centered dialogClassName="answercardmodal" show={this.props.limbo} onHide={this.props.handleCloseDialog}>
		    <AnswerCard
			word={this.props.data.a.toLowerCase()}
		    handleHide={this.props.handleCloseDialog}
		    specificInteraction={this.props.data}/>
		</Modal>
		<div className="devicequestion">
		    <Text className="deviceanswertext">
			<form className="commentForm" onSubmit={this.handleSubmit}>
			    {answerWords}
			</form>
		    </Text>
		</div>
		<InteractionCard
		interaction={interaction}
		    done={this.props.done}
		    handleSubmit={this.onSubmit}/>
		<div>
		</div>
	    </div>

	);
    }
}

class InteractionCard extends React.Component {

    componentDidUpdate () {
        
        if (this.props.done==true) {
	setTimeout(() => {try {this.nameInput.focus();} catch (e) {console.log("Error");}}, 200);
        }
    }

    render () {

	return (
	    <>
		<div className="deviceinteraction">
		    {this.props.interaction}
		</div>
	        <button className="nextbuttonlimbo" type="submit" autoFocus ref = {(c) => {this.nameInput=c;}} onClick={this.props.handleSubmit}></button>
	    </>
	);
    }
}

class AnswerCard extends React.Component {
                                                         
    componentDidUpdate (prevProps) {
        
        console.log(this.props.show);
        
        if (prevProps.show == false && this.props.show == true) {
            console.log("big FAT HEMLO");
            setTimeout(() => {this.nameInput.focus();}, 200);
            
                                                                                          
        }
    }
    

    render () {
        
	var colour="#003153";
	var fontcolour="white";
	var full=true;
        
     return (
	    <div>
	     <div className="colourbar"style={{backgroundColor: colour, color: fontcolour}}>
<div className="vocabdisplay">{this.props.word}</div><SecondInput handleHide={this.props.handleHide}/>
</div>
         <div className="answercarddef">
        <BookOpen style={{marginRight: "1em"}}/>
            {"def" in this.props.specificInteraction && this.props.specificInteraction["def"]}
</div>
<hr></hr>
{("samples" in this.props.specificInteraction) && 
       <div className="answercardsamples" style={{marginTop: "1em", marginLeft: "0.5em", marginBottom: "2em"}}> <SampleSentences samples={this.props.specificInteraction["samples"]}/></div>}
</div>

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
        <div style={{fontFamily: "PT Serif"}}> {this.state.show &&
        <form className="commentForm" onSubmit={this.handleHide}>
        <button className="nextbuttonlimbo2" type="submit" autoFocus ref={this.innerRef}/>
            </form>}</div>
    );
  }
}

class SampleSentences extends React.Component {
    
    render () {
        
        var words = [];
        
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
                    words.push(<Text style={{fontWeight: "bold", wordBreak: "keep-all", display: "inline-block", overflowWrap: "normal"}}>{spc + sentencearray[i]}</Text>);
                } else {
                    words.push(<Text style={{wordBreak: "keep-all", display: "inline-block", overflowWrap: "normal"}}>{spc + sentencearray[i]}</Text>);
                }
            };
        }

        
        return (
            
<Text style={{wordBreak: "keep-all", wordWrap: "normal", overflowWrap: "normal", fontSize: "1.5vw", textAlign: "center", fontStyle: "italic", fontFamily: "Open Sans"}}>
             <Edit3 style={{marginRight: "1em"}}/> {this.props.samples.length > 0 && words}
    </Text>
        );
    }
}


