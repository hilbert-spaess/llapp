import React from 'react';
import {Line} from 'rc-progress';
import {Text} from 'react-native';
import {ArrowLeft, ArrowRight, Edit} from 'react-feather';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';

export class AnalysisContainer extends React.Component {

    state = {answeredCorrect: -1, currentPage: 0, maxPage: 0,  answers: this.props.metadata.answers, questions: {}}

    componentDidMount () {

	var newquestions = [];

	for (var i =0; i <this.props.data.currentChunk.questions.length; i++) {

	    var keys = Object.keys(this.props.data.currentChunk.questions[i].i);

	    var outcome = true;

	    for (var j =0; j < keys.length; j++) {

		console.log(Object.keys(this.props.metadata.answers));

		console.log(this.props.data.currentChunk.questions[i].i[keys[j]].id);

		if (!Object.keys(this.props.metadata.answers).includes(this.props.data.currentChunk.questions[i].i[keys[j]].id.toString())) {
		    console.log("henloe");
		    outcome = false;

		}

	    }

	    newquestions.push(outcome);

	}
	console.log(newquestions);
	this.setState({questions: newquestions});

    }
    
    handleNext = (event) => {

	this.props.metadata.handleNext({
	    metadata: {answeredCorrect: this.state.answeredCorrect,
		       type: this.props.type}});
    }

    handleSubmit = (data) => {

	

	const keys = Object.keys(data.i);

	for (var i = 0; i< keys.length; i++) {

	    console.log(data.values);
	    console.log(this.state.answers);
	    
	    var newfree = this.state.answers;
	    newfree[data.i[keys[i]].id] = data.values[keys[i]];
	    var newquestions = this.state.questions;
	    newquestions[this.state.currentPage] = true;
	    this.setState({answers: newfree, questions: newquestions});

	}

	
	

    }

    nextPage = () => {
	"decide whether done or not";

	console.log("hemlo");
	console.log(this.state.done);

	console.log(this.state.currentPage);
	console.log(this.props.data.currentChunk.questions.length);

	if (this.state.currentPage < this.props.data.currentChunk.questions.length -1 ) {

	    this.setState({done: 1});

	    const c = this.state.currentPage

	    this.setState({currentPage: c + 1});

	    if (c+1 >= this.state.maxPage) {

		this.setState({done: 0, maxPage: c+1});

	    }

	} else {

	    this.setState({currentPage: 0, maxPage: 0});
	    this.handleNext();

	}
    }

    handleBack = () => {

	if (this.state.currentPage > 0) {

	    this.setState({done: 1, currentPage: this.state.currentPage - 1});

	}
    }

    handleForward = () => {

	this.setState({currentPage: this.state.currentPage + 1});

    }

    handleEdit = () => {
	var newquestions = this.state.questions;
	newquestions[this.state.currentPage] = 0;
	this.setState({questions: newquestions});

    }
	    

    render () {

	

	console.log(this.props.data.currentChunk.questions);
	console.log(this.state.currentPage);
	console.log(this.state.maxPage);
	console.log(this.props.data.currentChunk.questions[this.state.currentPage]);
	console.log("helloe");
	console.log(this.props.metadata.course_id);

	return (

		<AnalysisContainerLogging
	    data={this.props.data.currentChunk}
	    freeAnswers={this.state.answers}
	    questions={this.state.questions}
	    currentPage={this.state.currentPage}
	    nextPage={this.nextPage}
	    handleSubmit={this.handleSubmit}
		    handleEdit={this.handleEdit}
		    parcelData={{answers: this.state.answers, course_id: this.props.metadata.course_id}}
		    maxPage={this.state.maxPage}
		    handleBack={this.handleBack}
		    handleForward={this.nextPage}
		    done={this.state.questions[this.state.currentPage]}
	    />

	);
    }
}

const AnalysisContainerLogging = (props) => {

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
	

    return (

	    <div>
		{props.currentPage > 0 && <BackButton
					      onClick={props.handleBack}/>}
		{(props.done) && <ForwardButton color={(props.currentPage == props.maxPage) ? "green" : "black"}
								      onClick={props.nextPage}/>}
		<TextContainer
		    data={props.data}/>
		<QuestionContainer
		    main_questions={props.data.main_questions}
		    freeAnswers={props.freeAnswers}
		    questions={props.questions}
		    data={props.data.questions[props.currentPage]}
		    maxed={(props.currentPage == props.maxPage)}
		    done={props.done}
		    handleSubmit={handleSubmit}
		    handleEdit={props.handleEdit}/>
	    </div>
    );
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

	const words = this.props.data.text.split(" ");
	var Words = [];

	for (var i = 0; i < words.length; i++) {

	    Words.push(<TextWord
			   word={words[i]}/>);

	}

	return (

	    <div className="analysistextcontainer">
		<div className="analysistext">
			{this.props.data.text}
		</div>
	    </div>

	);
    }
}

class TextWord extends React.Component {

    state = {hover: 0,
	     select: 0,
	     selectMode: "word",
	     selectState: 0}

    mouseEnter = () => {

	if (!(this.state.selectMode=="none") && (this.state.selectState == 0)) {

	    this.setState({hover : 1});

	}

    }

    mouseLeave = () => {

	if (this.state.selectMode && (this.state.selectState == 0)) {

	    this.setState({hover : 0});

	}
    }

    handleClick = () => {

	if (this.state.selectMode == "word") {

	    const x = "handle word being chosen";

	}
    }

    render () {

	return (

	    <div onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={this.handleClick} className={(this.state.hover) ? "analysistext texthover" : "analysistext"} style={{display: "inline-block"}}>
			   <Text className="analysistext">
			       {this.props.word + " "}
			   </Text>
	</div>
															      );
    }
}

	

class QuestionContainer extends React.Component {


    handleSubmit = (data) => {

	this.props.handleSubmit(data);

    }

    nextPage = () => {

	this.props.nextPage();

    }

    handleEdit = () => {
	
	this.props.handleEdit();

    }

    render () {

	console.log(this.props.done);

	return (

	    <div className="analysisquestioncontainer">
		<div className="analysismainquestion">
		    {this.props.main_questions[this.props.data.t]}
		</div>
		<Subquestion
		    data={this.props.data}
		    questions={this.props.questions}
		    answers={this.props.freeAnswers}
		    handleEdit={this.handleEdit}
		    done={this.props.done}
		    onSubmit={this.handleSubmit}/>
	    </div>

	);
    }
}

class Subquestion extends React.Component {

    state = {values: {},
	     currentInteraction: Object.keys(this.props.data.i)[0]}

    componentDidMount () {

	const keys = Object.keys(this.props.data.i);
	for (var i =0; i < keys.length; i++) {
	    var newvalues = this.state.values;
	    newvalues[keys[i]] = this.props.answers[this.props.data.i[keys[i]].id];
	    this.setState({values: newvalues});
	}
    }

    handleSubmit = (event) => {
	event.preventDefault();
	this.props.onSubmit({values: this.state.values,
			     m: this.props.data.m,
			     i: this.props.data.i,
			     id: this.props.data.id,
			     questionNo: this.props.questionNo});

    }

    handleInputChange = (event) => {
	var newvalues = this.state.values;
	newvalues[parseInt(event.target.name)] = event.target.value
	this.setState({values: newvalues});
    }

    handleFocus = (event) => {

	this.setState({currentInteraction: event.target.name});

    }

    handleEdit = () => {

	var newvalues = this.state.values;
	var keys = Object.keys(this.props.data.i);

	for (var i = 0; i < keys.length; i++) {

	    newvalues[keys[i]] = this.props.answers[this.props.data.i[keys[i]].id];

	}

	this.setState({values: newvalues});

	this.props.handleEdit();

    }

    render () {
	if (this.props.data.m == "summary") {
	    var answerWords = "";
	} else {
	    var answerWords = [];
	}
	var doneWords = [];
	const answer_words = this.props.data.a.split(" ");
	const keys = Object.keys(this.props.data.i);
	const punct = [".", ",", ":", ";", "?", "!"];

	console.log(answerWords);

	for (var i = 0; i < answer_words.length; i++) {

	    if (this.props.data.m == "summary") {

		if (keys.includes(i.toString()) && this.props.data.i[i].mode=="filled") {
		    
		    answerWords += this.props.answers[this.props.data.i[i].id] + " ";

		} else {

		    answerWords += answer_words[i] + " ";

		}
	    }

	    else if (!this.props.done) {

		if (keys.includes(i.toString())) {

		    if (this.props.data.i[i].mode == "text") {

			answerWords.push(<div className="analysisanswertext"><Text>"</Text></div>);
			answerWords.push(<input className="analysisanswerinput" onFocus={this.handleFocus} style={{width: (this.props.data.i[i].a.length + 1).toString() + "ch"}} type="text" placeholder={this.props.answers[this.props.data.i[i].id]} onChange={this.handleInputChange} name={i.toString()}/>);
			answerWords.push(<div className="analysisanswertext"><Text>"</Text></div>);					 } else if (this.props.data.i[i].mode == "free") {

		    const x = i;

		    answerWords.push(<textarea name={i.toString()} rows="2"  onFocus={this.handleFocus}   onChange={this.handleInputChange} className="analysisanswerinput analysisanswerinputarea">{this.props.answers[this.props.data.i[x].id]}</textarea>);

		} else if (this.props.data.i[i].mode == "filled") {

		    answerWords.push(<div className="analysisanswertext"><Text>{this.props.answers[this.props.data.i[i].id]}</Text></div>);

		}

		else {

			answerWords.push(<input name={i.toString()}  onFocus={this.handleFocus}  className="analysisanswerinput" style={{width: (this.props.data.i[i].a.length + 1).toString() + "ch"}} type="text" onChange={this.handleInputChange} placeholder={this.props.answers[this.props.data.i[i].id]}/>);

		}

		    
		if (this.props.data.i[i].a != undefined && punct.includes(this.props.data.i[i].a.charAt(this.props.data.i[i].a.length - 1))) {
		    console.log("henlo");

					    answerWords.push(<div className="analysisanswertext"><Text>
												     {this.props.data.i[i].a.charAt(this.props.data.i[i].a.length - 1) + " "}
									 </Text>
				     </div>
							    );
		}
		}

		else {

		    answerWords.push(<div className="analysisanswertext"><Text>{answer_words[i]}</Text></div>);

		}
		    
		answerWords.push(<div className="analysisanswertext"><Text>{" "}</Text></div>);	
			
	    }

	    else if (this.props.done) {

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



	if (this.props.done) {

	    var interaction = <div></div>;

	} else {

	    if (this.props.data.i[document.activeElement.name] != undefined) {

		var idata  = this.props.data.i[document.activeElement.name];
		console.log(idata);

	    } else {

		var idata = this.props.data.i[keys[0]];
		console.log(idata);

	    }

	    console.log(this.state.currentInteraction);
	    console.log(keys);

	    if (this.props.data.i[this.state.currentInteraction] != undefined) {
		

	    switch (this.props.data.i[this.state.currentInteraction].mode) {

	    case "text":

		var interaction = "Choose appropriate quotes from the text.";
		break;

	    case "choose":

		var interaction = this.props.data.i[this.state.currentInteraction].choices.join(" | ");
		break;

	    case "free":

		var interaction = "Type your answer in the gap.";
		break;

	    case "fill":

		var interaction = "Type your answer in the gap.";
		break;

	    default:

		var interaction = "Henlo";

	    }
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
		{Object.keys(this.props.data.i).length > 0 && <Edit style={{marginBottom: "5%", cursor: "pointer"}} onClick={this.handleEdit} size={30}/>}
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
		
		<div className="analysisinteraction">
		    {interaction}
		</div>
		<div>
		{!this.props.done && <button className="subquestionsubmit" onClick={this.handleSubmit}>Submit</button>}
		    {(this.props.done && this.props.data.m != "summary") ? <div className="subquestion">{donetext}</div> : <div></div>}
		</div>
		{(this.props.done && this.props.data.m != "summary") ? <div className="subanswer"><Text className="analysisanswertext">{doneWords}</Text></div> : <div></div>}
		
	    </div>

	);
    }
}

	    

class ProgressBar extends React.Component {

    render () {

	return (

	    <div className="analysisprogress">
	    <Line percent={this.props.progress} strokeWidth="1"/>
	    </div>
	    
	);

    }
}
