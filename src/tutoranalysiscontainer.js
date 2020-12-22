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
		    data={this.props.data.currentChunk.questions[this.state.currentPage]}
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

    state = {hover: this.props.data.text.split(" ").map(x => "no"),
	     select: this.props.data.text.split(" ").map(x => "no"),
	     selectQuestion: this.props.selectQuestion,
	     selected: false}

    mouseEnter = (i) => {

	if (this.state.selectQuestion && !this.state.selected) {

	    var newhover = this.state.hover;
	    newhover[i] = "yes";
	    this.setState({hover: newhover});
	}
    }

    render () {

	const paras = this.props.data.text.split("\n");

	console.log(paras.length);

	var Words = [];

	for (var j = 0; j < paras.length; j++){

	    const words = paras[j].split(" ");

	    for (var i = 0; i < words.length; i++) {

	    	Words.push(<div className="analysistext" style={{"display": "inline-block", "fontFamily": "roboto"}}>
			       <Text className="analysistext" style={{"fontFamily": "PT Serif", "fontSize": "1.3vw", "textJustify": "inter-word", "textAlign": "justify"}}>
			       {words[i] + " "}
		    </Text>
			   </div>);		

	    }

	    Words.push(<br></br>);

	}

	console.log(Words.length);
	console.log(this.props.data.text.split()[0] == "\"By");
	console.log(this.props.data.text.split()[0]);

	return (

		<div className="analysistextcontainer">
		    <div className="analysistext">
			{this.props.data.text.split(" ")[0] == "\"By" ? Words : this.props.data.text}
		    </div>
		</div>

	    );
    }
}

class QuestionContainer extends React.Component {

    render () {

	console.log(this.props.answers);
				  
	return (

	    <div className="analysisquestioncontainer">
		<div className="analysismainquestion">
		    {this.props.main_questions[this.props.data.t]}
		</div>
		<Subquestion
		    data={this.props.data}
		    answers={this.props.answers}/>
		
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
	var doneWords = [];

	for (var i = 0; i < answer_words.length; i++) {

	    if (this.props.data.m == "summary") {

		if (keys.includes(i.toString()) && this.props.data.i[i].mode=="filled") {
		    
		    answerWords += this.props.answers[this.props.data.i[i].id] + " ";

		} else {

		    answerWords += answer_words[i] + " ";

		}
	    }

	    else {

		if (keys.includes(i.toString())) {

		    if (this.props.data.i[i].mode == "free") {

			const x = i;

			
			answerWords.push(<div className="analysisanswertext" style={{textDecoration: "underline"}}><Text>{this.props.answers[this.props.data.i[i].id]}</Text>
				     </div>
					);
			doneWords.push(<div className="analysisanswertext" style={{textDecoration: "underline"}}><Text>{this.props.data.i[i].a}</Text></div>);
		    } else {

			if (this.props.data.i[i].mode == "text") {

		    answerWords.push(<div className="analysisanswertext"><Text>
									     {"\"" + this.props.answers[this.props.data.i[i].id] + "\""}
									 </Text>
				     </div>
				    );
			    doneWords.push(<div className="analysisanswertext"><Text>
									       {"\"" + this.props.data.i[i].a + "\""}</Text></div>);
			} else {

			    		    answerWords.push(<div className="analysisanswertext"><Text>
									     {this.props.answers[this.props.data.i[i].id]}
									 </Text>
				     </div>
							    );
			    doneWords.push(<div className="analysisanswertext"><Text>{this.props.data.i[i].a}</Text></div>);
			}
		    

		    }
		}

		else {


		answerWords.push(<div className="analysisanswertext"><Text>
				     {answer_words[i]}
								     </Text></div>);
		doneWords.push(<div className="analysisanswertext"><Text>
				     {answer_words[i]}
								     </Text></div>);
		}

		answerWords.push(<div className="analysisanswertext"><Text>{" "}</Text></div>);
		doneWords.push(<div className="analysisanswertext"><Text>{" "}</Text></div>);

	    }
	}

	var question = this.props.data.q.split("\n");
	var Question=[];
	for (var i =0; i < question.length; i++){
	    Question.push(<div className="subquestion">{question[i]}</div>);
	}

	 if (Object.keys(this.props.data).includes("d")) {
	    var donetext = this.props.data.d;
	} else if (this.props.data.m == "filler") {
	    var donetext = "";
	} else {
	    var donetext = "Here's our sample answer to this question:";
	}


    return (

	    <div className="subquestioncontainer">
		{Object.keys(this.props.data.i).length > 0 && <Edit style={{marginBottom: "5%", color: "green",  cursor: "pointer"}} onClick={this.handleEdit} size={30}/>}
		<div className="subquestion">
		    {Question}
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
		{this.props.data.m != "summary" && this.props.data.m != "noanswer" ? <>
		<div className="subquestion">{donetext}</div>
		 <div className="subanswer"><Text className="analysisanswertext">{doneWords}</Text></div></> : <div></div>}
		
	    </div>
    );
    }
}
