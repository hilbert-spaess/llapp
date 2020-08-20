import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Button, Row, Col, Container} from 'react-bootstrap';
import {showWordsBasicBlank} from './helpers.js';

export class InteractionCard extends React.Component {

    render () {
	console.log(this.props.interaction);
	if (this.props.done == 0) {
	return (
	    <Card className="interactionbox">
		    <FillBlankExamples
		interactionMode = {this.props.interactionMode}
		interaction = {this.props.interaction}
		currentInteraction={this.props.currentInteraction}
		handleNext={this.props.handleNext}
		answer = {this.props.answer}
		/>
		</Card>
	);
	} else if (this.props.answeredCorrect==0) {
	    return (
		    <Card> Correct </Card>
	    );
	} else {
	    return (
		    <Card> Incorrect </Card>
	    );
	}
    }
}

class FillBlankExamples extends React.Component {

    render () {
	if (this.props.interactionMode=="1") {
            var words1 = "";
            var words2 = "";
            if ("0" in this.props.interaction) {
		words1= showWordsBasicBlank(this.props.interaction["0"]["s"], this.props.interaction['0']['l']);
            }
            if ("1" in this.props.interaction) {
		words2= showWordsBasicBlank(this.props.interaction["1"]['s'], this.props.interaction['1']['l']);
            }
            return (
		    <div className="interactiontext">
		    Other examples: <br></br>
		    
		{words1} <br></br> <br></br>
		    {words2}
		</div>
            );
	} else if (this.props.interactionMode=="2") {
	    var synonym1 = "";
	    var synonym2 = "";
	    var synonym3 = "";
	    if ("0" in this.props.interaction) {
		synonym1 = this.props.interaction["0"]["s"];
	    }
	    if ("1" in this.props.interaction) {
		synonym2 = this.props.interaction["1"]["s"];
	    }
	    if ("2" in this.props.interaction) {
		synonym3 = this.props.interaction["2"]["s"];
	    }
	    return (
		    <div className="interactiontext">
		    Synonyms: <br></br>
		    {synonym1}{", "+synonym2}{", "+synonym3}
		</div>
	    );
	} else if (this.props.interactionMode=="3") {
	    var synonym0 = "";
	    var synonym1 = "";
	    var synonym2 = "";
	    var synonym3 = "";
	    
	    if ("0" in this.props.interaction) {
		synonym0 = this.props.interaction["0"]["s"];
	    }
	    if ("1" in this.props.interaction) {
		synonym1 = this.props.interaction["1"]["s"];
	    }
	    if ("2" in this.props.interaction) {
		synonym2 = this.props.interaction["2"]["s"];
	    }
	    if ("3" in this.props.interaction) {
		synonym3 = this.props.interaction["3"]["s"];
	    }	
	    return (
		    <div className="interactiontext">
		    Choose one from (remember to convert to the right tense): <br></br>
		    {synonym0} | {synonym1} | {synonym2} | {synonym3}
		</div>
	    );
	}
	    
    }
}
