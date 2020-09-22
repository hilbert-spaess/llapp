import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Button, Row, Col, Container} from 'react-bootstrap';
import {showWordsBasicBlank} from './helpers.js';

export class InteractionCard extends React.Component {
    
    componentDidUpdate () {
        
        if (this.props.limbo==true) {
	setTimeout(() => {try {this.nameInput.focus();} catch (e) {console.log("Error");}}, 200);
        }
    }

    render () {
	console.log(this.props.interaction);
    var choice = this.props.interactionMode;
    console.log(choice);
    if (choice == "6") {
        if (this.props.first == 1) {
            choice = "3";
        } else {
            choice = "4";
        }
    }
    if (this.props.limbo == true) {
        return (
        <Card className="interactionbox">
            <form onSubmit={this.props.handleNext}>
              <button style={{backgroundColor: "green", width: "100px", height: "50px"}} type="submit" autoFocus ref = {(c) => {this.nameInput=c;}} onClick={this.props.handleNext}></button>
            </form>
            </Card>
            );
    } else if (this.props.done == 0) {
        return (
            <Card className="interactionbox">
                <FillBlankExamples
            interactionMode = {choice}
            interaction = {this.props.interaction}
            answer = {this.props.answer}
            first = {this.props.first}
            />
            </Card>
        );
        }
    else {
        return (
            <div></div>
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
                <InteractionText 
                interaction = {this.props.interaction}
                interactionMode = {this.props.interactionMode}
        /><br></br>
		    
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
                <InteractionText 
                interaction = {this.props.interaction}
                interactionMode = {this.props.interactionMode}
        /><br></br>
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
                <InteractionText 
                interaction = {this.props.interaction}
                interactionMode = {this.props.interactionMode}
        /><br></br>
		    {synonym0} | {synonym1} | {synonym2} | {synonym3}
		</div>
	    );
	} else if (this.props.interactionMode=="4") {
        
        return (
            <div className="interactiontext">
            <InteractionText
            interaction={this.props.interaction}
            interactionMode={this.props.interactionMode}
            /> <br></br>
{this.props.interaction["def"]}
</div>
         );
    }
                               
	    
    }
}

class InteractionText extends React.Component {
    
    render () {
    if (this.props.interactionMode == "1") {
        return (
            <div>
            {this.props.interaction["tag"]}. Other examples: 
        </div>
        );
    } else if (this.props.interactionMode == "2") {
        return (
            <div>
            {this.props.interaction["tag"]}. Synonyms: 
</div>  
        );
   } else if (this.props.interactionMode == "3") {
       return (
           <div>
</div>
       );
    } else if (this.props.interactionMode == "4") {
        return (
            <div>
</div>
    );
    }
}
}


        
        

