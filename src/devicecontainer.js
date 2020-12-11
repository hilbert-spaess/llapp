import React from 'react';
import {Text} from 'react-native';

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

	return (

	    <div className="devicetextcontainer">
		<div className="devicetext">
		    {this.props.data.text}
		</div>
	    </div>
	);
    }
}

class QuestionContainer extends React.Component {

    state = {values: Object.keys(this.props.data.i).map(x => ""),
	     currentInteraction: 0,
	     done: 0}

    onSubmit = () => {

	this.props.handleNext();

    }

    render () {

	var answerWords = [];
	const answer_words = this.props.data.q.split(" ");
	const keys = Object.keys(this.props.data.i);

	for (var i = 0; i < answer_words.length; i++) {

	    if (!this.state.done && keys.includes(i.toString())) {

		answerWords.push(<input className="deviceanswerinput" style={{width: (answer_words[i].length + 2).toString() + "ch"}} type="text" value={this.state.values[i]}/>);

	    } else {

		answerWords.push(<div className="deviceanswertext"><Text>
								       {answer_words[i] + " "}
								   </Text></div>);
	    }
	}
		

	return (

	    <div className="devicequestioncontainer">
		<div className="devicequestion">
		    <Text className="deviceanswertext">
			{answerWords}
		    </Text>
		</div>
		<div>
		    <button onClick={this.onSubmit}>Submit</button>
		</div>
	    </div>

	);
    }
}
