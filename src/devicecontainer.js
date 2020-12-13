import React from 'react';
import {Text} from 'react-native';
import {ArrowRight} from 'react-feather';

export class DeviceContainer extends React.Component {

    state = {answeredCorrect: 1}

    handleNext = (event) => {

	this.props.metadata.handleNext({
	    metadata: {answeredCorrect: this.state.answeredCorrect,
		       type: this.props.type}});
    }
				      

    render () {

	return (

	    <div>
		<TextContainer
		    data={this.props.data.currentChunk}/>
		<QuestionContainer
		    data={this.props.data.currentChunk.question}
		    handleNext={this.handleNext}/>
	    </div>
	);
    }
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
	     currentInteraction: 0,
	     done: 0,
	     correct: 0}

    onSubmit = () => {

	this.setState({value: "", done: 0, correct: 0});
	this.props.handleNext();

    }

    handleChange = (event) => {

	this.setState({value: event.target.value});

    }

    handleSubmit = (event) => {
	event.preventDefault();
	console.log(event.target.value);
	console.log(this.props.data.a);
	this.setState({done: 1, correct: (this.state.value == this.props.data.a)});

    }

    render () {

	var answerWords = [];
	const answer_words = this.props.data.q.split(" ");
	const keys = Object.keys(this.props.data.i);
	const punct = [".", ",", ":", ";", "?", "!"];

	for (var i = 0; i < answer_words.length; i++) {

	    if (keys.includes(i.toString())) {

		if (!this.state.done) {
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
		    answerWords.push(<div style={{color: (this.state.correct) ? "green" : "red"}} className="deviceanswertext"><Text>{answer_words[i] + " "}</Text></div>);
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
		<div className="deviceinteraction">
		    {interaction}
		</div>
		<div>
		    {(this.state.done == 0) ? <div></div> : <ArrowRight size={50} style={{position: "fixed", top: "5%", right: "5%", cursor: "pointer"}} onClick={this.onSubmit}/>}
		</div>
	    </div>

	);
    }
}
