import React from 'react';
import {Text} from 'react-native';
import {ArrowRight} from 'react-feather';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';

export class DeviceContainer extends React.Component {

    state = {answeredCorrect: 1, answers: this.props.metadata.answers}

    handleNext = (event) => {

	this.props.metadata.handleNext({
	    metadata: {answeredCorrect: this.state.answeredCorrect,
		       type: this.props.type}});
    }

    handleSubmit = (data) => {

	var newanswers = this.state.answers;

	newanswers[data.id] = data.value;

	this.setState({answers: newanswers});

    }
				      

    render () {

	var done = this.state.answers[this.props.data.currentChunk.question.id] != undefined;
	var correct = done && this.state.answers[this.props.data.currentChunk.question.id].toLowerCase() == this.props.data.currentChunk.question.a.toLowerCase();

	return (

	    <DeviceContainerLogging
		data={this.props.data.currentChunk}
		handleNext={this.handleNext}
		handleSubmit={this.handleSubmit}
		done={done}
		correct={correct}
		answers={this.state.answers}
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
		data={props.data.question}
		handleNext={handleNext}
		handleSubmit={handleSubmit}
		answers={props.answers}
		done={props.done}
		correct={props.correct}/>
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
	console.log(event.target.value);
	console.log(this.props.data.a);
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
		    answerWords.push(<div style={{color: (this.props.correct) ? "green" : "red"}} className="deviceanswertext"><Text>{answer_words[i] + " "}</Text></div>);
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

	}
		

	return (

	    <div className="devicequestioncontainer">
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
