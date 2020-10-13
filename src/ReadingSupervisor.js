import React from 'react';
import ReactDOM from 'react-dom';
import {useLocation, Link} from 'react-router-dom';
import {Card, Button, Row, Col, Container, Modal, ProgressBar} from 'react-bootstrap';
import {InteractionCard} from './InteractionCard.js';
import {getChunk, firstChunk, getData, JSONconvert} from './client.js';
import {FreeBarWrapped} from './sidebar.js';
import {Text} from 'react-native';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';
import {Tutorial} from './tutorial.js';
import {CheckCircle, Type, AlignLeft, Eye} from 'react-feather';
import {LearningContainer} from './LearningContainer.js'

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

export class LearningSupervisor extends React.Component {
    
    render () {
        return (
            <FreeBarWrapped WrappedComponent={LearningSupervisor1}/>
            );
    }
}

export class LearningSupervisor1 extends React.Component {
    
    state = {
        parcelData: {answeredCorrect: "-1"},
        loading: 0,
        runningProgress: [0, 0]
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
                <div></div>
                );
        } else {
        return (
            <LearningContainerData
            parcelData={this.state.parcelData}
            handleNext={this.handleNext}
            runningProgress={this.state.runningProgress}
            />
        );
    }
    }
}

            

const LearningContainerData = (props) => {
    
    const location = useLocation();
    console.log(location.pathname);
    var payload = props.parcelData;
    payload["lessons"] = (location == "/lessons");
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
    
    const handleTutorialNext = async () => {
        await props.handleNext({tutorial: "done", answeredCorrect: "-1"});
        refresh();
    }
        
    console.log(data);
    const getTokenAndTryAgain = async () => {
        await getAccessTokenWithPopup(opts);
        refresh()
  };
    if (loading) {
        return <div></div>;
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
    if (data.displayType == "tutorial") {
        return <Tutorial
                currentChunk={data.tutorialchunk}
                handleNext={handleTutorialNext}
                />;
    }
        
    console.log(data);
    var reviewyet = 0;
    for (var i=0; i < data.allChunks.length; i++) {
        if (data.allChunks[i]["first"] == 0) {
            reviewyet += 1;
        }
    }
    return (
        <div>
        <LearningContainerUpdatable
            allChunks = {data.allChunks}
            displayType= {data.displayType}
            progress={data.today_progress}
            runningProgress = {props.runningProgress}
            reviewyet = {reviewyet}
        />          
</div>
    );
}

class LearningContainerUpdatable extends React.Component {
    
    state = {
        parcelData: {},
        currentChunkNo: 0,
        displayType: this.props.displayType,
        allChunks: this.props.allChunks,
        progress: this.props.progress,
        runningProgress: this.props.runningProgress,
        yet: this.props.progress["yet"],
        reviewProgress: {yet: this.props.reviewyet, done: 0},
        reviews: 0
    }

    bottomRef = React.createRef();
    
    componentDidUpdate () {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        this.bottomRef.current.scrollIntoView({behaviour: 'smooth'});
    }

    handleNext = (parcelData) => {
        console.log(parcelData)
        console.log("updatein");
        if (parcelData.first == 1) {
            this.setState({progress: {"done": this.state.progress["done"] + 1, "yet": this.state.progress["yet"]-1}});
        } else {
            this.setState({reviewProgress: {"done": this.state.reviewProgress["done"] + 1, "yet": this.state.reviewProgress["yet"]-1}});
        }
        this.setState({runningProgress: parcelData.runningProgress});
        if ((parcelData.interaction[parcelData.keyloc]["streak"] == 0 && parcelData.first == 1) || (parcelData.answers[parcelData.keyloc] == 0)) {
            this.setState({reviewyet: this.state.reviewyet + 1});
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
                nowChunk["keyloc"] = '0';
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
            console.log(this.state.progress);
            if (this.state.currentChunkNo < this.props.allChunks.length - 1) {
                var i = this.state.currentChunkNo;
                this.setState({currentChunkNo: i + 1});
            } else {
                console.log("DONEDONE");
                parcelData["done"] = 1;
                var i = this.state.currentChunkNo;
                this.setState({done: 1, displayType: "done"});
            }
        }
        var reviewyet = 0;
        for (var j= i+1; j < this.props.allChunks.length; j++) {
            if (this.props.allChunks[i]["first"] == 0) {
                reviewyet += 1;
            }
        }
        this.setState({reviewProgress: {"done": this.state.reviewProgress["done"], "yet": reviewyet}})
        this.setState({parcelData});
        console.log(this.state.currentChunkNo);
    }
    
    render () {
        console.log(this.state.progress);
        var reviewyet = 0;
        for (var i=this.state.currentChunkNo; i < this.props.allChunks.length; i++) {
            if (this.props.allChunks[i]["first"] == 0) {
                reviewyet += 1;
            }
        }
        return (
    
            <div>
            <LearningContainerLogging
                parcelData = {this.state.parcelData}
                currentChunk = {this.props.allChunks[this.state.currentChunkNo]}
                handleNext = {this.handleNext}
                progress = {100*this.state.progress["done"]/(this.state.progress["done"] + this.state.progress["yet"])}
                displayType = {this.state.displayType}
                allChunks = {this.props.allChunks}
                runningProgress = {this.state.runningProgress}
                reviews = {this.props.allChunks[this.state.currentChunkNo]["first"]}
                currentChunkNo = {this.state.currentChunkNo}
                yet={this.state.yet}
                reviewProgress={100*this.state.reviewProgress["done"]/(this.state.reviewProgress["done"] + this.state.reviewProgress["yet"])}
            />
            <div ref={this.bottomRef}/></div>
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
    const {error, loading, data, refresh} = useApi(APIHOST + '/api/getchunk', payload, opts);
    
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
            yet={props.yet}
            runningProgress = {props.runningProgress}
            reviews = {props.reviews}
            currentChunkNo = {props.currentChunkNo}
            reviewyet={props.reviewyet}
            reviewProgress={props.reviewProgress}
        />
        </div>
    );
} else if (loading) {
    return <div></div>;
} else {
    return (
        <div> <LearningSummaryContainer/></div>
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
        return <div></div>;
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
            <div style={{marginTop: "2em", fontSize: "30px", textAlign: "center"}}> Check in tomorrow for new reviews. Or check your <Link style={{color: "blue"}} to="/vocab">vocab</Link> progress here.</div>
            </div>
            );
    }
}

        
        
