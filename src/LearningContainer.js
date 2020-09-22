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
            displayType= {data.displayType}
        />          
</div>
    );
}

class LearningContainerUpdatable extends React.Component {
    
    state = {
        parcelData: {},
        currentChunkNo: 0,
        displayType: this.props.displayType,
        allChunks: this.props.allChunks
    }
    
    handleNext = (parcelData) => {
        console.log(parcelData)
        console.log("updatein");
        if ((parcelData.interaction[parcelData.keyloc]["streak"] == 0 && parcelData.first == 1) || (parcelData.answers[parcelData.keyloc] == 0)) {
            var nowChunk = this.state.allChunks[this.state.currentChunkNo];
            nowChunk["first"] = 0;
            if (parcelData.first == 1) {
                var lower = parcelData.interaction[parcelData.keyloc]["lower_upper"][0];
                var upper = parcelData.interaction[parcelData.keyloc]["lower_upper"][1];
                var int = {};
                int['0'] = parcelData.interaction[parcelData.keyloc];
                var loc = int['0']["location"] - lower;
                var len = int['0']["length"] - lower;
                int['0']["location"] = loc;
                console.log(loc);
                int['0']["length"] = len;
                nowChunk["keyloc"] = 0;
                nowChunk["interaction"] = int;
                var cont = {};
                for (var i = lower; i < upper; i++) {
                    cont[i-lower] = this.state.allChunks[this.state.currentChunkNo]['context'][i];
                };
                console.log(cont)
                cont[loc]["i"] = 0;
                nowChunk["context"] = cont;
            }
            var nowChunks = this.state.allChunks;
            nowChunks.push(nowChunk);
            this.setState({allChunks: nowChunks});
            var i = this.state.currentChunkNo;
            this.setState({currentChunkNo: i+1});
        } else {
            if (this.state.currentChunkNo < this.props.allChunks.length - 1) {
                var i = this.state.currentChunkNo;
                this.setState({currentChunkNo: i + 1});
            } else {
                parcelData["done"] = 1;
                this.setState({done: 1});
                this.setState({displayType: "done"});
            }
        }
        this.setState({parcelData});
        console.log(this.state.currentChunkNo);
    }
    
    render () {
        return (
    
            <LearningContainerLogging
                parcelData = {this.state.parcelData}
                currentChunk = {this.props.allChunks[this.state.currentChunkNo]}
                handleNext = {this.handleNext}
                progress = {100*this.state.currentChunkNo/this.props.allChunks.length}
                displayType = {this.state.displayType}
                allChunks = {this.props.allChunks}
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
    
    if (props.displayType != "done") {

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
        <div> <LearningSummaryContainer/></div>
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
        setTimeout(() => {if (Object.keys(this.props.currentChunk["interaction"]).length > this.state.currentInteraction+1) {
            this.nextInteraction();
        } else {
            if (this.props.currentChunk['first'] == 0) {
                this.handleNext();
            } else {
                this.setState({limbo: true});
            }
        }}, 200);
        
    }
    
    
    handleNext = (event) => {
        this.props.handleNext({
        answeredCorrect: this.state.answeredCorrect,
        chunkId: this.props.currentChunk["chunkid"],
        keyloc: this.props.currentChunk["keyloc"],
        first: this.props.currentChunk["first"],
        answers: this.state.answers,
        done: 0,
        interaction: this.props.currentChunk["interaction"]});
        this.setState({currentInteraction: 0,
                       answers: [],
                       limbo: false});
    }

    
    render () {
        if ("alternatives" in this.props.currentChunk["interaction"][this.state.currentInteraction]) {
            var alternatives = this.props.currentChunk["interaction"][this.state.currentInteraction]["alternatives"];
        } else {
            var alternatives = [];
        }     
        const context = this.props.currentChunk["context"];
        const interaction = this.props.currentChunk["interaction"];
        const location = this.props.currentChunk["interaction"][this.state.currentInteraction]["location"];
        const answer= this.props.currentChunk["context"][this.props.currentChunk["interaction"][this.state.currentInteraction]["location"]]['w'];
        alternatives.push(answer.toLowerCase())
        console.log(answer);
        const answerlength = answer.length;
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
	    specificInteraction={interaction[this.state.currentInteraction]}
        first={this.props.currentChunk["first"]}/>
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
        first={this.props.currentChunk["first"]}
        alternatives={alternatives}
		context={context}
		length={length}
		interaction={interaction}
		currentInteraction={this.state.currentInteraction}
		answer={answer}
        answers={this.state.answers}
		location={location}
		handleAnswer={this.handleAnswer}
        limbo={this.state.limbo}
        showDialog={this.state.showDialog}
        answerlength={answerlength}/>
            
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
        first={this.props.currentChunk["first"]}
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
        console.log(this.props.answer.toLowerCase())
        console.log(a.toLowerCase())
        console.log(this.props.alternatives);
        console.log(a.toLowerCase() in this.props.alternatives)
        if (this.props.alternatives.includes(a.toLowerCase())) {
                console.log("hemloe");
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
        if ((punct.includes(context[i]['w']))) {
            var spc = "";
        } else {
            var spc = " ";
        }
        
        if (!("i" in context[i])) {
    words.push(<Text style={{wordBreak: "keep-all", display: "inline-block", overflowWrap: "normal"}}>{spc + context[i]['w']}</Text>);
        } else if (this.props.limbo || i != location) {
            if (this.props.answers[context[i]["i"]] == 1) {
                words.push(<Text style={{color: "green", overflowWrap: "normal"}}>{spc + context[i]["w"]}</Text>);
            } else {
                words.push(<Text style={{color: "red", overflowWrap: "normal"}}>{spc + context[i]["w"]}</Text>);
            }
        } else {
            words.push(spc);
        words.push(<input key = {this.props.showDialog} autoFocus ref = {(input) => {this.nameInput=input;}} value={value} onChange={this.handleChange} style={{backgroundColor: "transparent", outline: "0", wordBreak: "keep-all", display: "inline-block", border: "0", width: this.props.answerlength.toString() + "ch", height: "1em", borderBottom: "2px dotted blue", textAlign: "left"}}/>);
        }
    };

        return (
		<Card className="maintext"
            key={this.props.showDialog}>
		<Text style={{fontSize: "30px", lineHeight: "2em", display: "inline-block", wordBreak: "keep-all"}}>
        <form className="commentForm" onSubmit={this.handleSubmit}>
           
            {words}
        </form>
	    </Text>
		</Card>
        );
    };
};



class AnswerCard extends React.Component {
    
    state = {barLevel: 100*this.props.specificInteraction["streak"]/10}
                                                         
    componentDidUpdate (prevProps) {
        
        console.log(this.props.show);
        
        if (prevProps.show == false && this.props.show == true) {
            console.log("big FAT HEMLO");
            setTimeout(() => {this.nameInput.focus();}, 200);
            
                                                                                          
        }
    }
    

    render () {
    console.log(this.props.specificInteraction["mode"])
    console.log("samples" in this.props.specificInteraction)
    console.log(this.state.barLevel);
	if (this.props.answeredCorrect == 1) {
	    var styling = "Correct";
	} else {
	    var styling = "Wrong";
	}
    if (this.props.specificInteraction["key"] == "1") {
        var streak = (this.props.specificInteraction["streak"]).toString();
    } else {
        var streak = "";
    }
    var full = ((streak == "0" && this.props.first == 1) || this.props.answeredCorrect == 0);
    if (this.props.show == true) {
	return (
	    <div key={this.props.show}>
	    <div className="vocabdisplay">
		    {this.props.word}
	    </div>
        <div className="chinesedef">
            {"chinesedef" in this.props.specificInteraction && <div>Chinese definition here.</div>}
        </div>
        <div className="chinesedef">
            {"def" in this.props.specificInteraction && this.props.specificInteraction["def"]}
        </div>
        <div className="cardprogress">
            <MyProgressBar now={10*(this.props.specificInteraction["streak"])}
                        next={100*(this.props.specificInteraction["streak"] + this.props.answeredCorrect)/10}
                        />
        </div>
        <div className="samplesentences">
            {full && ("samples" in this.props.specificInteraction) && <SampleSentences samples={this.props.specificInteraction["samples"]}/>}
    </div>
<div>
        <form className="commentForm" onSubmit={this.props.handleHide}>
            {full && <FirstInput 
handleHide={this.props.handleHide}
styling={styling}
/>}
{!full && <SecondInput handlehide={this.props.handleHide} styling={styling}/>}
        </form>
</div>
		</div>
	); } else {
        return (
            <div key={this.props.show}>
	    <div className="vocabdisplay">
		    {this.props.word}
	    </div>
        <div className="chinesedef">
            Chinese definition here.
        </div>
        <div className="cardprogress">
            <MyProgressBar now={10*(this.props.specificInteraction["streak"])}
                        next={100*(this.props.specificInteraction["streak"] + this.props.answeredCorrect)/10}
                        />
        </div>
        <div className="samplesentences">
            {("samples" in this.props.specificInteraction) && <SampleSentences samples={this.props.specificInteraction["samples"]}/>}
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
    
    }
}
}

class FirstInput extends React.Component {
  constructor(props) {
    super(props);
    this.innerRef = React.createRef();
  }
    
    state = {value: ""}
    
    handleChange = (event) => {
        this.setState({value: event.target.value});
    }
       

  componentDidMount() {
    // Add a timeout here
    setTimeout(() => {
        try {this.innerRef.current.focus();} catch (e) {console.log("Error");}}, 500);
  }

  render() {
    return (
        <div style={{textAlign: "center"}}>
        <input type="text" autoFocus style={{width: "80%", textAlign: "center", fontSize: "30px", marginTop: "1em", marginBottom: "0.5em"}} id="myInput" ref={this.innerRef} value={this.state.value} onChange={this.handleChange}/>
            </div>
    );
  }
}

class SecondInput extends React.Component {
  constructor(props) {
    super(props);
    this.innerRef = React.createRef();
  }

  componentDidMount() {
    // Add a timeout here
    setTimeout(() => {
        try {this.innerRef.current.focus();} catch (e) {console.log("Error");}}, 500);
    }

  render() {
      
    return (
        <button type="submit" autoFocus ref={this.innerRef}/>
    );
  }
}


class MyProgressBar extends React.Component {
    
    state = {now: this.props.now}
    
    componentDidMount () {
        
        setTimeout(() => {this.setState({now: this.props.next});}, 200);
        
    }
    
    render () {
        return (
            <ProgressBar now={this.state.now}
                        variant="success"/>
    );
    }
}
      

class SampleSentences extends React.Component {
    
    render () {
        
        return (
            <div>
            {this.props.samples.length > 0 && this.props.samples[0][0].split("#").join(" ")}
    </div>
        );
    }
}

const LearningSummaryContainer = (props) => {
    
    const payload = {}
    
    const {login, getAccessTokenWithPopup } = useAuth0();
    const opts = {audience: APIHOST, 
                  fetchOptions: {method: 'post',
                                 headers: {'Access-Control-Allow-Credentials': 'true',
                                           'Access-Control-Allow-Origin': '*',
                                           'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                          'Access-Control-Request-Method': 'POST'}}};
    const {error, data, loading, refresh} = useApi(APIHOST + '/api/todaywords', payload, opts);
    
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

    return (
        
        <LearningSummary
        words={data.words}
        />
    );

}

class LearningSummary extends React.Component {
    
    render () {
        
        var words = []
        
        for (var i = 0; i < this.props.words.length; i++) {
            words.push(<div style={{textAlign: "center", fontSize: "20px"}}>{this.props.words[i]}</div>);
        };
             
        return (
            <div>
            <div style={{marginTop: "5em", fontSize: "30px", textAlign: "center"}}> Today's work is done. New words learned: </div>
            
            <div style={{marginTop: "3em"}}> {words} </div>
            <div style={{marginTop: "2em", fontSize: "30px", textAlign: "center"}}> Check in tomorrow for new reviews. </div>
            </div>
            );
    }
}
        
        
