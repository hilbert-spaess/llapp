import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Button, Row, Col, Container, Modal, ProgressBar} from 'react-bootstrap';
import {InteractionCard} from './InteractionCard.js';
import {getChunk, firstChunk, getData, JSONconvert} from './client.js';
import {BarWrapped} from './sidebar.js';
import {Text} from 'react-native';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';

export class LearningSupervisor extends React.Component {
    
    render () {
        return (
            <BarWrapped WrappedComponent={LearningSupervisor1}/>
            );
    }
}

export class LearningSupervisor1 extends React.Component {
    
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
    console.log(data);
    return (
        <div>
        <LearningContainerUpdatable
            allChunks = {data.allChunks}
        />          
</div>
    );
}

class LearningContainerUpdatable extends React.Component {
    
    state = {
        parcelData: {},
        currentChunkNo: 0,
        done: 0,
        allChunks: this.props.allChunks
    }
    
    handleNext = (parcelData) => {
        console.log(parcelData)
        this.setState({parcelData});
        console.log("updatein");
        if (this.state.currentChunkNo < this.props.allChunks.length - 1) {
            var i = this.state.currentChunkNo;
            this.setState({currentChunkNo: i + 1});
        } else {
            this.setState({done: 1});
        }
        console.log(this.state.currentChunkNo);
    }
    
    render () {
        
        if (this.state.done == 0) {
            
            console.log(this.props.allChunks[this.state.currentChunkNo]);
    
        return (
            <LearningContainerLogging
                parcelData = {this.state.parcelData}
                currentChunk = {this.props.allChunks[this.state.currentChunkNo]}
                handleNext = {this.handleNext}
            />
        );
    } else {
        return (0);
    }
    }
}   

const LearningContainerLogging = (props) => {
    
    const payload = props.parcelData;
    const {login, getAccessTokenWithPopup } = useAuth0();
    const opts = {audience: APIHOST, 
                  fetchOptions: {method: 'post',
                                 body: payload,
                                 headers: {'Access-Control-Allow-Credentials': 'true',
                                           'Access-Control-Allow-Origin': '*',
                                           'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                          'Access-Control-Request-Method': 'POST'}}};
    const {error, loading, refresh} = useApi(APIHOST + '/api/getchunk', payload, opts);
    
    const handleNext = async (parcelData) => {
        props.handleNext(parcelData);
        refresh();
    }
    
    console.log(props.currentChunk)

    return (
        <div>
        <LearningContainer
            currentChunk = {props.currentChunk}
            handleNext = {props.handleNext}
        />
        </div>
    );
}

    
    

class LearningContainer extends React.Component {

    state = {
        done: 0,
        showDialog: false,
        isLoading: 0,
        answeredCorrect: "-1",
        answers: [],
        currentInteraction: 0,
        limbo: false
        }
    
    storeAnswer = (correct) => {
        this.setState(prevState => ({
            answers: [...prevState.answers, correct]
        }));
    };
    
    handleAnswer = (correct) => {
        this.storeAnswer(correct);
        if (correct) {
            this.setState({done: 1,
                   answeredCorrect: 1});
        } else {
            this.setState({done: 1,
                   answeredCorrect: 0});
        }
        if (this.props.currentChunk["interaction"][this.state.currentInteraction]["key"] == 1) {
            this.handleOpenDialog();
        } else {
            this.handleCloseDialog();
        }
            
    }
    
    nextInteraction = () => {
        const a = this.state.currentInteraction + 1;
        this.setState({currentInteraction: a});
    }
    
    handleOpenDialog = () => {
        this.setState({showDialog: true});
    }

    handleCloseDialog = () => {
        
        this.setState({showDialog: 0,
                      done: 0});
        console.log("CURRENT INTERACTION");
        console.log(this.state.currentInteraction);
        if (Object.keys(this.props.currentChunk["interaction"]).length > this.state.currentInteraction+1) {
            this.nextInteraction();
        } else {
            this.setState({limbo: true})
        }
    }
    
    handleNext = (correct) => {
        this.props.handleNext({
        answeredCorrect: this.state.answeredCorrect,
        chunkId: this.props.currentChunk["chunkid"],
        keyloc: this.props.currentChunk["keyloc"],
        answers: this.state.answers});
        this.setState({currentInteraction: 0,
                       answers: [],
                       limbo: false});
    }

    
    render () {
        const context = this.props.currentChunk["context"];
        const interaction = this.props.currentChunk["interaction"];
        const location = this.props.currentChunk["interaction"][this.state.currentInteraction]["location"];
        const answer= this.props.currentChunk["context"][this.props.currentChunk["interaction"][this.state.currentInteraction]["location"]]['w'];
        const interactionMode= this.props.currentChunk["interaction"][this.state.currentInteraction]["mode"];
        const length = this.props.currentChunk["interaction"][this.state.currentInteraction]["length"];
        console.log(interaction);
        console.log(interactionMode);
        
        if (this.state.isLoading == 0 ) {
                return (
	    <Container fluid="lg">
		<Modal centered show={this.state.showDialog} onHide={this.handleCloseDialog}>
		<AnswerCard
	    word={context[location]['vw']}
	    answeredCorrect={this.state.answeredCorrect}
	    handleHide={this.handleCloseDialog}
	    specificInteraction={interaction[this.state.currentInteraction]}/>
		    </Modal>
		    <Row>
		    <Col>
		    <TextCard
		context={context}
		length={length}
		interaction={interaction}
		currentInteraction={this.state.currentInteraction}
		answer={answer}
        answers={this.state.answers}
		location={location}
		handleAnswer={this.handleAnswer}/>
		    </Col>
		    </Row>
		    <Row>
		    <Col>
		    <InteractionCard
		done={this.state.done}
		answeredCorrect={this.state.answeredCorrect}
		interactionMode={interactionMode}
		interaction={interaction[this.state.currentInteraction]}
		answer={answer}
        limbo={this.state.limbo}
        handleNext={this.handleNext}
		    />
		    </Col>
		    </Row>
		</Container>
	);
        }
        else if (this.props.displayType == "done") {
            return (
                <div className = "ui centered card">
                No more reviews.
                </div>
            );
        } else {
            return (
                <div className="card">
                </div>
            );
        }
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
    
    componentDidUpdate = (prevProps) => {
        if (prevProps.context !== this.props.context) {
            this.setState({value: this.props.context[this.props.location]['w'][0]});
        }
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
    var punct = [".",",",";","!","?",":", "'s"];
	for (var i = 0; i < length; i++) {
	    if (context[i]["u"] == 1) {
		var tcolour = "black";
	    } else {
		var tcolour = "black";
	    }
        if ((punct.includes(context[i]['w'])) || i == 0) {
            var spc = "";
        } else {
            var spc = " ";
        }
	    
	    if (!("i" in context[i])) {
		words.push(<Text>{spc + context[i]['w']}</Text>);
	    } else if (i != location) {
            console.log(this.props.answers[context[i]["i"]])
            if (this.props.answers[context[i]["i"]] == 1) {
                words.push(<Text style={{color: "green"}}>{spc + context[i]['w']}</Text>);
            } else {
                words.push(<Text style={{color: "red"}}>{spc + context[i]['w']}</Text>);
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
