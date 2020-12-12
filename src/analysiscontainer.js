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
    
    handleNext = (event) => {

	this.props.metadata.handleNext({
	    metadata: {answeredCorrect: this.state.answeredCorrect,
		       type: this.props.type}});
    }

    handleSubmit = (data) => {

	console.log(data);

	const keys = Object.keys(data.i);

	for (var i = 0; i< keys.length; i++) {
	    
	    var newfree = this.state.answers;
	    newfree[data.i[keys[i]].id] = data.values[keys[i]];
	    var newquestions = this.state.questions;
	    newquestions[data.id] = 1
	    this.setState({answers: newfree, questions: newquestions});

	}
	

    }

    nextPage = () => {

	console.log(this.state.currentPage);
	console.log(this.props.data.currentChunk.questions.length);

	if (this.state.currentPage < this.props.data.currentChunk.questions.length -1 ) {

	    const c = this.state.currentPage

	    this.setState({currentPage: c + 1});

	    if (c+1 >= this.state.maxPage) {

		this.setState({maxPage: c+1});

	    }

	} else {

	    this.setState({currentPage: 0, maxPage: 0});
	    this.handleNext();

	}
    }

    handleBack = () => {

	if (this.state.currentPage > 0) {

	    this.setState({currentPage: this.state.currentPage - 1});

	}
    }

    handleForward = () => {

	this.setState({currentPage: this.state.currentPage + 1});

    }

    handleEdit = (id) => {

	var newquestions = this.state.questions;
	newquestions[id] = 0;
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
	    done={this.state.maxPage >= this.state.currentPage}
	    handleSubmit={this.handleSubmit}
		    handleEdit={this.handleEdit}
		    parcelData={{answers: this.state.answers, course_id: this.props.metadata.course_id}}
		    maxPage={this.state.maxPage}
		    handleBack={this.handleBack}
		    handleForward={this.handleForward}
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

    const nextPage = async () => {
	props.nextPage();
	refresh();
    }
	

    return (

	    <div>
		{props.currentPage > 0 && <BackButton
					      onClick={props.handleBack}/>}
		{(props.currentPage < props.maxPage) && <ForwardButton
								      onClick={props.handleForward}/>}
		<TextContainer
		    data={props.data}/>
		<QuestionContainer
		    main_questions={props.data.main_questions}
		    freeAnswers={props.freeAnswers}
		    questions={props.questions}
		    page_data={props.data.questions[props.currentPage]}
		    nextPage={nextPage}
		    done={props.done}
		    handleSubmit={props.handleSubmit}
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

    state = {currentQuestion: 1,
	     limbo: 0}

    handleSubmit = (data) => {

	this.props.handleSubmit(data);

	if (this.state.currentQuestion < this.props.page_data.length) {

	    this.setState({currentQuestion: this.state.currentQuestion + 1});

	} else if (data.m == "summary") {

	    this.nextPage();

	} else {

	    this.setState({limbo: 1});

	}
    }

    nextPage = () => {

	this.setState({currentQuestion: 1, limbo: 0});
	this.props.nextPage();

    }

    handleEdit = (id) => {
	
	this.setState({currentQuestion: this.props.page_data.length,
		       limbo: 0});
	this.props.handleEdit(id);

    }

    render () {

	const subQuestions = [];

	console.log(this.props.page_data);
	console.log(this.state.currentQuestion);


	for (var i = 0; i < this.props.page_data.length; i++) {
	    
	    console.log(i);
	    if (this.props.questions[this.props.page_data[i].id] == 1 || i < this.state.currentQuestion) {
	    subQuestions.push(<Subquestion
				  data={this.props.page_data[i]}
				  questiondata={this.props.questions[this.props.page_data[i].id]}
				  questions={this.props.questions}
				  done={(this.props.questions[this.props.page_data[i].id] == 1) || (i >= this.state.currentQuestion)}
				  questionNo={i}
				  handleEdit = {this.handleEdit}
				  freeAnswers={this.props.freeAnswers}
				  onSubmit={this.handleSubmit}/>);
	    }
	}

	return (

	    <div className="analysisquestioncontainer">
		<div className="analysismainquestion">
		    {this.props.main_questions[this.props.page_data[0].t]}
		</div>
		{subQuestions}
		    {(this.state.limbo) ? <button className="nextpagebutton" onClick={this.nextPage}>Continue</button> : <div></div>}
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

	    if (this.props.data.i[keys[i]].mode == "free" || this.props.data.i[keys[i]].mode == "filled") {

		var newvalues = this.state.values;
		newvalues[keys[i]] = this.props.freeAnswers[this.props.data.i[keys[i]].id];
		this.setState({values: newvalues});

	    }
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

    handleEdit = (i) => {

	console.log("henlo");
	var newvalues = this.state.values;
	console.log(this.props.data.i);
	console.log(i);
	newvalues[i] = this.props.freeAnswers[this.props.data.i[i].id];
	this.props.handleEdit(this.props.data.id);

    }

    render () {
	if (this.props.data.m == "summary") {
	    var answerWords = "";
	} else {
	    var answerWords = [];
	}
	const answer_words = this.props.data.a.split(" ");
	const keys = Object.keys(this.props.data.i);
	const punct = [".", ",", ":", ";", "?", "!"];

	console.log(this.state.values);
	console.log(this.props.data.i);

	for (var i = 0; i < answer_words.length; i++) {

	    if (this.props.data.m == "summary") {

		if (keys.includes(i.toString()) && this.props.data.i[i].mode=="filled") {
		    console.log(this.props.freeAnswers);
		    console.log(this.props.data.i[i]);
		    answerWords += this.props.freeAnswers[this.props.data.i[i].id] + " "

		} else {

		    answerWords += answer_words[i] + " "

		}
	    }

				   

	    else if (!this.props.done && keys.includes(i.toString()) && (!Object.keys(this.props.freeAnswers).includes(this.props.data.i[i].id))) {

		if (this.props.data.i[i].mode == "text") {

		    answerWords.push(<div className="analysisanswertext"><Text>"</Text></div>);
									     answerWords.push(<input className="analysisanswerinput" onFocus={this.handleFocus} style={{width: (this.props.data.i[i].a.length + 1).toString() + "ch"}} type="text" onChange={this.handleInputChange} name={i.toString()}/>);
		    answerWords.push(<div className="analysisanswertext"><Text>"</Text></div>);

		} else if (this.props.data.i[i].mode == "finish") {

		    answerWords.push(<textarea name={i.toString()}  onFocus={this.handleFocus}  rows="2"  onChange={this.handleInputChange} className="analysisanswerinputarea"/>);
		    break;
		} else if (this.props.data.i[i].mode == "free") {

		    const x = i;

		    answerWords.push(<textarea name={i.toString()} rows="2"  onFocus={this.handleFocus}   onChange={this.handleInputChange} className="analysisanswerinput analysisanswerinputarea">{this.props.freeAnswers[this.props.data.i[x].id]}</textarea>);

		} else if (this.props.data.i[i].mode == "filled") {

		    answerWords.push(<div className="analysisanswertext"><Text>{this.props.freeAnswers[this.props.data.i[i].id]}</Text></div>);

		}

		    else {

			answerWords.push(<input name={i.toString()}  onFocus={this.handleFocus}  className="analysisanswerinput" style={{width: (this.props.data.i[i].a.length + 1).toString() + "ch"}} type="text" onChange={this.handleInputChange}/>);

		    }

		if (this.props.data.i[i].a != undefined && punct.includes(this.props.data.i[i].a.charAt(this.props.data.i[i].a.length - 1))) {
		    console.log("henlo");

					    answerWords.push(<div className="analysisanswertext"><Text>
												     {this.props.data.i[i].a.charAt(this.props.data.i[i].a.length - 1) + " "}
									 </Text>
				     </div>
							    );
		}

		answerWords.push(<div className="analysisanswertext"><Text>{" "}</Text></div>);

	    } else {

		if (keys.includes(i.toString())) {

		    if (this.props.data.i[i].mode == "free") {

			const x = i;

			
			answerWords.push(<div className="analysisanswertext" style={{textDecoration: "underline"}}><Text>{this.props.freeAnswers[this.props.data.i[x].id]}</Text> <Edit style={{cursor: "pointer"}} name={i} onClick={() => this.handleEdit(x)}/>
				     </div>
				    );
		    } else {

			if (this.props.data.i[i].mode == "text") {

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

			
		}

		else {


		answerWords.push(<div className="analysisanswertext"><Text>
				     {answer_words[i]}
								     </Text></div>);
		}

		if (keys.includes(i.toString())) {
		    console.log(this.props.data.i[i].a);
		}


	    answerWords.push(<div className="analysisanswertext"><Text>{" "}</Text></div>);
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
		
		<div className="analysisinteraction">
		    {interaction}
		</div>
		{!this.props.done && <button className="subquestionsubmit" onClick={this.handleSubmit}>Submit</button>}
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
