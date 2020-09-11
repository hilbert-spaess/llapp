import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Button, Row, Col, Container, Modal} from 'react-bootstrap';
import {InteractionCard} from './InteractionCard.js';
import {getChunk, firstChunk, getData, JSONconvert} from './client.js';
import {Sidebar, TopBar} from './sidebar.js';
import {Text} from 'react-native';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';

export class LearningSupervisor extends React.Component {
    
    state = {
        parcelData: {answeredCorrect: "-1"},
        loading: 0
    };

    handleNext = async (parcelData) => {
        console.log(parcelData);
        this.setState({loading: 1});
        await this.setState({parcelData});
        this.setState({loading: 0});
    };
    
    render () {
        if (this.state.loading == 1) {
            return (
                <div>Loading...</div>
                );
        } else {
        return (
            <LearningContainerData
            parcelData={this.state.parcelData}
            handleNext={this.handleNext}
            />
        );
    }
    }
}

            

const LearningContainerData = (props) => {
    
    console.log(props.parcelData);
    const payload = props.parcelData;
    console.log(payload);
    const {login, getAccessTokenWithPopup } = useAuth0();
    const opts = {audience: APIHOST, 
                  fetchOptions: {method: 'post',
                                 body: payload,
                                 headers: {'Access-Control-Allow-Credentials': 'true',
                                           'Access-Control-Allow-Origin': '*',
                                           'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                          'Access-Control-Request-Method': 'POST'}}};
    const {error, loading, data, refresh} = useApi(APIHOST + '/api/getchunk', payload, opts);
        
    const handleNext = async (parcelData) => {
        await props.handleNext(parcelData);
        refresh();
    }
        
    console.log(data);
    const getTokenAndTryAgain = async () => {
        await getAccessTokenWithPopup(opts);
        refresh()
  };
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        if (error.error === 'consent_required') {
      return (
        <button onClick={getTokenAndTryAgain}>Consent to reading users</button>
      );
    }
    return <div>Oops {error.message}</div>;
    }
    if (data.displayType == "newUser") {
        return <Redirect to="/newuser"/>;
    }
    console.log(data.context);
    return (
        <div>
        <LearningContainer
interaction={data.interaction}
chunkid={data.chunkid}
context={data.context}
grammar={data.grammar}
currentInteraction={data.currentInteraction}
keyloc={data.keyloc}
displayType={data.displayType}
tryAgain={getTokenAndTryAgain}
storeAnswer={props.storeAnswer}
handleNext={handleNext}
/>
</div>
    );
}

class LearningContainer extends React.Component {

    state = {
        done: 0,
        interaction: this.props.interaction,
        stats: {},
        showDialog: false,
        chunkid: this.props.chunkid,
        isLoading: 0,
        context: this.props.context,
        grammar: this.props.grammar,
        userid: this.props.userid,
        answeredCorrect: "-1",
        currentInteraction: this.props.currentInteraction,
        displayType: this.props.displayType,
        answers: [],
        key: this.props.keyloc
        }
    
    storeAnswer = (correct) => {
        this.setState(prevState => ({
            answers: [...prevState.answers, correct]
        }));
    };
    loadData = (data) => {
        this.setState({stats: data});
    }
    
    handleNext = (correct) => {
        this.props.handleNext({
              answeredCorrect: correct,
              interaction: this.state.interaction,
              currentInteraction: this.state.currentInteraction,
              chunkId: this.state.chunkid,
              keyloc: this.props.keyloc,
              answers: this.state.answers});
    }
    
    render () {
        
        console.log(this.state.displayType);
        console.log(this.props.key);
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
            answers={this.state.answers}
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
        limbo: false,
        answeredCorrect: -1
    }
    
    handleNext = (event) => {
        this.props.handleNext(this.state.answeredCorrect);
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
            this.setState({limbo: true})
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
        console.log("HEMLO KECCHAN");
        console.log(this.props.interaction);
        if (this.props.interaction[this.state.currentInteraction]["key"] == 1) {
            this.handleOpenDialog();
        } else {
            this.handleCloseDialog();
        }
            
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
        answers={this.props.answers}
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
        limbo={this.state.limbo}
        handleNext={this.handleNext}
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
        interaction={this.props.interaction}
	    value={this.state.value}
        answers={this.props.answers}
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
	    
	    if (!("i" in context[i])) {
		words.push(<Text>{context[i]['w']} </Text>);
	    } else if (i != location) {
            console.log("HEMLOE");
            console.log(this.props.answers[context[i]["i"]])
            if (this.props.answers[context[i]["i"]] == 1) {
                console.log("HI");
                words.push(<Text style={{color: "green"}}>{context[i]['w']} </Text>);
            } else {
                words.push(<Text style={{color: "red"}}>{context[i]['w']} </Text>);
            }
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
