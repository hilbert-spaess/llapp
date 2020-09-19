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

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

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
            console.log("DONE")
            this.setState({done: 1});
        }
        console.log(this.state.currentChunkNo);
    }
    
    render () {
            
            console.log(this.props.allChunks[this.state.currentChunkNo]);
    
        return (
            <LearningContainerLogging
                parcelData = {this.state.parcelData}
                currentChunk = {this.props.allChunks[this.state.currentChunkNo]}
                handleNext = {this.handleNext}
                progress = {100*this.state.currentChunkNo/this.props.allChunks.length}
                done = {this.state.done}
            />
        );
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
        console.log("WOOOOOOOW");
        console.log("WOOOOOOOW");
        refresh();
    }
    
    console.log(props.currentChunk)
    
    if (props.done == 0) {

    return (
        <div>
        <LearningContainer
            currentChunk = {props.currentChunk}
            handleNext = {handleNext}
            progress = {props.progress}
        />
        </div>
    );
} else {
    return (
        <div> Henlo </div>
        );
}
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
            this.setState({answeredCorrect: 1});
        } else {
            this.setState({answeredCorrect: 0});
        }
        console.log("HANDLING NOW");
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
    
    
    handleNext = (event) => {
        this.props.handleNext({
        answeredCorrect: this.state.answeredCorrect,
        chunkId: this.props.currentChunk["chunkid"],
        keyloc: this.props.currentChunk["keyloc"],
        answers: this.state.answers,
        interaction: this.props.currentChunk["interaction"]});
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
        
        if (this.state.isLoading == 0 ) {
                return (
	    <Container fluid="lg">
                    <div id="myModal">
		<Modal centered show={this.state.showDialog} onHide={this.handleCloseDialog}>
                    
		<AnswerCard
        show={this.state.showDialog}
	    word={context[location]['vw']}
	    answeredCorrect={this.state.answeredCorrect}
	    handleHide={this.handleCloseDialog}
	    specificInteraction={interaction[this.state.currentInteraction]}/>
		    </Modal>
</div>
            <Row>
            <Col>
            <ProgressBar now={this.props.progress} variant="success"
            style={{marginTop: "4rem"}}/>
            </Col>
            </Row>
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
		handleAnswer={this.handleAnswer}
        limbo={this.state.limbo}
        showDialog={this.state.showDialog}/>
            
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
    
    componentDidMount () {
	setTimeout(() => {try {this.nameInput.focus();} catch (e) {console.log("Error");}}, 200);
    }
    
    componentDidUpdate = (prevProps) => {
            if (prevProps.interaction !== this.props.interaction) {
                this.setState({values: range(0, Object.keys(this.props.interaction).length - 1).map((thing) => this.props.context[this.props.interaction[thing]["location"]]["w"][0])});
            }
            setTimeout(() => {try {this.nameInput.focus();} catch (e) {console.log("Error");}}, 200);
    }
    
    
    handleChange = (event) => {
        var newvalues = this.state.values;
        newvalues[this.props.currentInteraction] = event.target.value;
        this.setState({values: newvalues});
        event.preventDefault();
    }
    
    state = {values: range(0, Object.keys(this.props.interaction).length - 1).map((thing) => this.props.context[this.props.interaction[thing]["location"]]["w"][0])}

    handleSubmit = (event) => {
        console.log("hemlo");
        var a = this.state.values[this.props.currentInteraction];
        if (a.toLowerCase() == this.props.answer.toLowerCase()) {
                this.props.handleAnswer(1);
        } else {
                this.props.handleAnswer(0);
        }
        event.preventDefault();
    }
   
        
    render () {
            
	var context = this.props.context;
	var location = this.props.location;
	var value= this.state.values[this.props.currentInteraction];
    var x = this.props.showDialog;
    console.log(x);
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
	    } else if (this.props.limbo || i != location) {
            if (this.props.answers[context[i]["i"]] == 1) {
                words.push(<Text style={{color: "green"}}>{spc + context[i]["w"]}</Text>);
            } else {
                words.push(<Text style={{color: "red"}}>{spc + context[i]["w"]}</Text>);
            }
        } else {
		words.push(<input key = {this.props.showDialog} autoFocus ref = {(input) => {this.nameInput=input;}} value={value} onChange={this.handleChange} style={{backgroundColor: "transparent", borderColor: "transparent", textAlign: "center"}}/>);
	    }
	};    
        return (
		<Card className="maintext"
            key={this.props.showDialog}>
		<Text style={{fontSize: "30px", lineHeight: "2em"}}>
        <form className="commentForm" onSubmit={this.handleSubmit}>
           
            {words}
        </form>
	    </Text>
		</Card>
        );
    };
};

class Words extends React.Component {
        
    componentDidUpdate = (prevProps) => {
        if (prevProps.context !== this.props.context) {
            this.setState({value: this.props.context[this.props.location]['w'][0]});
        }
    }
    
    state = {value: this.props.context[this.props.location]['w'][0]}

    componentDidMount () {
	this.nameInput.focus();
    }
    
    handleChange = (event) => {
	this.setState({value: event.target.value});
    }
    
    handleSubmit = (event) => {
        this.props.handleSubmit(this.state.value);
        event.preventDefault();
    }
    
    componentDidUpdate (prevProps) {
        if ((prevProps.showDialog == true) && (this.props.showDialog==false)) {
            
        }
    }
    
    render () {
	var context = this.props.context;
	var location = this.props.location;
	var value= this.state.value;
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
	    } else if (this.props.limbo || i != location) {
            console.log(this.props.answers[context[i]["i"]])
            if (this.props.answers[context[i]["i"]] == 1) {
                words.push(<Text style={{color: "green"}}>{spc + context[i]['w']}</Text>);
            } else {
                words.push(<Text style={{color: "red"}}>{spc + context[i]['w']}</Text>);
            }
        } else {
		words.push(<form className="commentForm" onSubmit={this.handleSubmit}><input key = {this.props.showDialog} autoFocus ref = {(input) => {this.nameInput=input;}} value={value} onChange={this.handleChange} style={{backgroundColor: "transparent", borderColor: "transparent", textAlign: "center"}}/></form>);
	    }
	};
	return words
    }
}


class AnswerCard extends React.Component {
    
    componentDidUpdate (prevProps) {
        
        console.log("small FAT HEMLO");
        console.log(this.props.show);
        
        if (prevProps.show == false && this.props.show == true) {
            console.log("big FAT HEMLO");
            setTimeout(() => {this.nameInput.focus();}, 200);
        }
    }

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
    if (this.props.show == true) {
	return (
	    <div key={this.props.show}>
	    <div className="vocabdisplay">
		    {this.props.word}
	    </div>
		<div>
		<p>{streak}</p>
		</div>
<div>
        <form className="commentForm" onSubmit={this.props.handleHide}>
		<FirstInput 
handleHide={this.props.handleHide}
styling={styling}
/>
        </form>
</div>
		</div>
	);
    } else {
        return (
            <div>
             <div className="vocabdisplay">
		    {this.props.word}
	    </div>
		<div>
		<p>{streak}</p>
		</div>
    </div>);
}
    }
}

class FirstInput extends React.Component {
  constructor(props) {
    super(props);
    this.innerRef = React.createRef();
  }

  componentDidMount() {
    // Add a timeout here
    setTimeout(() => {
      this.innerRef.current.focus();
    }, 500)
  }

  render() {
    return <button type="submit" id="myInput" onClick={this.props.handleHide} ref={this.innerRef} className={"answerButton" + this.props.styling}>Continue</button>;
  }
}
