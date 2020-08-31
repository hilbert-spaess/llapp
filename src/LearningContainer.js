import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Button, Row, Col, Container, Modal} from 'react-bootstrap';
import {InteractionCard} from './InteractionCard.js';
import {getChunk, firstChunk} from './client.js';
import {Sidebar, TopBar} from './sidebar.js';
import {Text} from 'react-native';

export class LearningContainer extends React.Component {

    state = {
        done: 0,
        interaction: {},
        showDialog: false,
        chunkid: 0,
        isLoading: 1,
        context: {},
        grammar: {},
        userid: this.props.userid,
        answeredCorrect: "-1",
        currentInteraction: "0",
        displayType: "sentence",
        answers: [],
        key: 0
        }

    componentDidMount = () => {
        firstChunk({userId: this.state.userid}).then(this.loadChunk);

    };

    storeAnswer = (correct) => {
        this.setState(prevState => ({
            answers: [...prevState.answers, correct]
        }));
    };

    handleNext = (correct) => {
        this.setState({isLoading: 1});
        console.log("STREAK");
        console.log(this.state.interaction[this.state.currentInteraction]["streak"]);
        console.log(correct);
        getChunk({userId: this.state.userid,
              answeredCorrect: correct,
              interaction: this.state.interaction,
              currentInteraction: this.state.currentInteraction,
              chunkId: this.state.chunkid,
              key: this.state.key,
              answers: this.state.answers}).then(this.loadChunk);
        };

        handleCloseDialog = () => {
        this.setState({showDialog: false});
        this.handleNext(this.state.answeredCorrect);
        }

        handleOpenDialog = () => {
        this.setState({showDialog: true})
    }

    loadChunk = (data) => {
        if (data.displayType != "done") {
            console.log("HENLO");
            this.setState({displayType: data.displayType,
                   context: data.context,
                   grammar: data.grammar,
                   interaction: data.interaction,
                   length: data.length,
                   currentInteraction: data.currentInteraction,
                   chunkid: data.chunkid,
                   isLoading: 0,
                   done: 0,
                   key: data.key});
        } else {
            console.log("HEMLO");
            this.setState({displayType: data.displayType});
        }
    };
    
    render () {
        console.log(this.state.displayType);
        if (this.state.isLoading == 0 ) {
            console.log(this.state.context);
                return (
                <div>
                <Sidebar />
                <TopBar/>
                <LearningInstance
            context={this.state.context}
            interaction={this.state.interaction}
            handleNext={this.handleNext}
            storeAnswer={this.storeAnswer}
            />
                </div>
                );
        }
        else if (this.state.displayType == "done") {
            return (
            <div>
                <Sidebar/>
                <TopBar/>
                <div className = "ui centered card">
                No more reviews.
                </div>
                </div>
            );
        } else {
            return (
                <div className="card">
                </div>
            );
        }
    }
};

class LearningInstance extends React.Component {
    
    state = {
        currentInteraction: 0,
        location: this.props.interaction[0]["location"],
        answer: this.props.context[this.props.interaction[0]["location"]]['w'],
        interactionMode: this.props.interaction[0]["mode"],
        length: this.props.interaction[0]["length"],
        showDialog: 0,
        done: 0,
        answeredCorrect: -1
    }

    nextInteraction = () => {
        console.log("Loading the next interaction innit");
        const a = this.state.currentInteraction + 1;
        console.log(a);
        this.setState({currentInteraction: a,
                   location: this.props.interaction[a]["location"],
                   answer: this.props.context[this.props.interaction[a]["location"]]['w'],
                   interactionMode: this.props.interaction[a]["mode"],
                   length: this.props.interaction[a]["length"],
                });
    }      

    handleCloseDialog = () => {
        
        this.setState({showDialog: 0});
        console.log("CURRENT INTERACTION");
        console.log(this.state.currentInteraction);
        if (Object.keys(this.props.interaction).length > this.state.currentInteraction+1) {
            this.setState({done: 0,
                   answeredCorrect: -1});
            this.nextInteraction();
        } else {
            this.props.handleNext(this.state.answeredCorrect);
        }
    }

    handleOpenDialog = () => {
        console.log("opening dialog");
        this.setState({showDialog: 1})
    }
    
    handleAnswer = (correct) => {
        console.log("HENNNNLO");
        this.props.storeAnswer(correct);
        if (correct) {
            this.setState({done: 1,
                   answeredCorrect: 1});
        } else {
            this.setState({done: 1,
                   answeredCorrect: 0});
        }
        this.handleOpenDialog();
    }
    
    render () {
	return (
	    <Container fluid="lg">
		<Modal centered show={this.state.showDialog} onHide={this.handleCloseDialog}>
		<AnswerCard
	    word={this.props.context[this.state.location]['vw']}
	    answeredCorrect={this.state.answeredCorrect}
	    handleHide={this.handleCloseDialog}
	    specificInteraction={this.props.interaction[this.state.currentInteraction]}/>
		    </Modal>
		    <Row>
		    <Col>
		    <TextCard
		context={this.props.context}
		length={this.state.length}
		interaction={this.props.interaction}
		currentInteraction={this.state.currentInteraction}
		answer={this.state.answer}
		location={this.state.location}
		handleAnswer={this.handleAnswer}/>
		    </Col>
		    </Row>
		    <Row>
		    <Col>
		    <InteractionCard
		done={this.state.done}
		answeredCorrect={this.state.answeredCorrect}
		interactionMode={this.state.interactionMode}
		interaction={this.props.interaction[this.state.currentInteraction]}
		answer={this.state.answer}
		    />
		    </Col>
		    </Row>
		</Container>
	);
    }
}

class TextCard extends React.Component {

    constructor(props) {
	super(props);
	this.textInput = React.createRef();
    }

    state = {value: this.props.context[this.props.location]['w'][0]}

    componentDidMount() {
	console.log("MOUNTING!");
    }
    
    handleChange = (event) => {
	this.setState({value: event.target.value});
    }

    handleSubmit = (event) => {
	console.log("hemlo");
	if (this.props.currentInteraction + 1 < Object.keys(this.props.interaction).length) {
	    this.setState({value: this.props.context[this.props.interaction[this.props.currentInteraction+1]["location"]]['w'][0]});
	}
	if (this.state.value.toLowerCase() == this.props.answer.toLowerCase()) {
            this.props.handleAnswer(1);
	} else {
            this.props.handleAnswer(0);
	}
	event.preventDefault();
	
    }
   
    
    render () {
	
        return (
		<Card className="maintext">
		<form className="commentForm" onSubmit={this.handleSubmit}>		
		<Text style={{fontSize: "30px"}}>

           
		<Words
	    context={this.props.context}
	    length={this.props.length}
	    location={this.props.location}
	    handleChange={this.handleChange}
	    value={this.state.value}
	    />
	    </Text>
		</form>
		</Card>
        );
    };
};

class Words extends React.Component {

    componentDidMount () {
	this.nameInput.focus();
    }
    
    render () {
	var context = this.props.context;
	var location = this.props.location;
	var value= this.props.value;
	var length = this.props.length;
	var words = [];
	var tcolour = "black";
	var answer = {};
	for (var i = 0; i < length; i++) {
	    if (context[i]["u"] == 1) {
		var tcolour = "black";
	    } else {
		var tcolour = "black";
	    }
	    
	    if (i!=location) {
		words.push(<Text>{context[i]['w']} </Text>);
	    } else {
		words.push(<input autoFocus ref = {(input) => {this.nameInput=input;}} value={value} onChange={this.props.handleChange} style={{backgroundColor: "transparent", borderColor: "transparent", textAlign: "center"}}/>);
	    }
	};
	return words
    }
}


class AnswerCard extends React.Component {

    render () {
	if (this.props.answeredCorrect == 1) {
	    var styling = "Correct";
	} else {
	    var styling = "Wrong";
	}
    if (this.props.specificInteraction["key"] == "1") {
        var streak = "Streak: " + (this.props.specificInteraction["streak"] + this.props.answeredCorrect).toString();
    } else {
        var streak = "";
    }
	return (
	    <div>
	    <div className="vocabdisplay">
		    {this.props.word}
	    </div>
		<div>
		<p>{streak}</p>
		</div>
		<Button className={"answerButton" + styling} onClick={this.props.handleHide}>Continue</Button>
		</div>
	);
    }
}

