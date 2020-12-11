import React from 'react';
import {ArrowLeft, ArrowRight, Edit} from 'react-feather';
import {Text} from 'react-native';

export class TutorAnalysisContainer extends React.Component {

    state = {currentPage: 0}

    handleBack = () => {

	if (this.state.currentPage > 0) {

	    this.setState({currentPage: this.state.currentPage - 1});

	}
    }

    handleForward = () => {

	this.setState({currentPage: this.state.currentPage + 1});

    }

    render () {

	console.log(this.props);

	return (

	    <div>
		{this.state.currentPage > 0 && <BackButton
					      onClick={this.handleBack}/>}
		{(this.state.currentPage < this.props.data.currentChunk.questions.length-1) && <ForwardButton
								      onClick={this.handleForward}/>}
		<TextContainer
		    data={this.props.data.currentChunk}/>
		<QuestionContainer
		    main_questions={this.props.data.currentChunk.main_questions}
		    page_data={this.props.data.currentChunk.questions[this.state.currentPage]}
		    answers={this.props.metadata.answers}/>
	    </div>

	);
    }
}

class BackButton extends React.Component {

    render () {

	return (
	    <div className="backbutton">
		<ArrowLeft  size={40} style={{cursor: "pointer"}} onClick={this.props.onClick}/>
	    </div>

	);
    }
}

class ForwardButton extends React.Component {

    render () {

	return (
	    <div className="forwardbutton">
		<ArrowRight size={40}  style={{cursor: "pointer"}} onClick={this.props.onClick}/>
	    </div>

	);
    }
}

class TextContainer extends React.Component {

    render () {

	return (

	    <div className="analysistextcontainer">
		<div className="analysistext">
		    {this.props.data.text}
		</div>
	    </div>

	);
    }
}

class QuestionContainer extends React.Component {

    render () {

	console.log(this.props.answers);

	const subQuestions = [];

	for (var i = 0; i < this.props.page_data.length; i++) {

	    subQuestions.push(<Subquestion
				  data={this.props.page_data[i]}
				  answers={this.props.answers}
				  questionNo={i}/>);

	}
				  

	return (

	    <div className="analysisquestioncontainer">
		<div className="analysismainquestion">
		    {this.props.main_questions[this.props.page_data[0].t]}
		</div>
		{subQuestions}
	    </div>
	    

	);
    }
}

class Subquestion extends React.Component {

    render () {

	if (this.props.data.m == "summary") {
	    var answerWords = "";
	} else {
	    var answerWords = [];
	}
	const answer_words = this.props.data.a.split(" ");
	const keys = Object.keys(this.props.data.i);
	const punct = [".", ",", ":", ";", "?", "!"];

	for (var i = 0; i < answer_words.length; i++) {

	    if (this.props.data.m == "summary") {

		if (keys.includes(i.toString()) && this.props.data.i[i].mode == "filled") {

		    answerWords += this.props.answers[this.props.data.i[i].id] + " ";
		} else {

		    answerWords += answer_words[i] + " ";
		}
	    }

	    else {
		if (keys.includes(i.toString())) {

		    if (this.props.data.i[i].mode == "free") {

			const x = i;

			answerWords.push(<div className="analysisanswertext" style={{textDecoration: "underline"}}><Text>{this.props.answers[this.props.data.i[x].id]}</Text></div>);

		    } else if (this.props.data.i[i].mode == "text") {

		    answerWords.push(<div className="analysisanswertext"><Text>
									     {"\"" + this.props.data.i[i].a + "\""}
									 </Text>
				     </div>
				    );
		    } else {
				 answerWords.push(<div className="analysisanswertext"><Text>
									     {this.props.data.i[i].a}
									 </Text>
				     </div>
			);
			}
	    }

	    else {

		answerWords.push(<div className="analysisanswertext"><Text>
				     {answer_words[i]}
								     </Text></div>);
	    }

	answerWords.push(<div className="analysisanswertext"><Text>{" "}</Text></div>)
	    }
	}
    

    return (

	<div className="subquestioncontainer">
	    <div className="subquestion">
		{(this.props.questionNo+1).toString() + ". " + this.props.data.q}
	    </div>
		{(this.props.data.m == "summary") &&
		 <textarea className="summaryarea">
		     {answerWords}
		 </textarea>}
		{(this.props.data.m != "summary") &&
		 <div className="subanswer">
		    <Text className="analysisanswertext">
			{answerWords}
		    </Text>
		    
		 </div>}
	</div>
    );
    }
}
