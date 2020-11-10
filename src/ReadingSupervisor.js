import React from 'react';
import ReactDOM from 'react-dom';
import {useLocation, Link} from 'react-router-dom';
import {Card, Button, Row, Col, Container, Modal, ProgressBar} from 'react-bootstrap';
import {InteractionCard} from './InteractionCard.js';
import {getChunk, firstChunk, getData, JSONconvert} from './client.js';
import {FreeBarWrapped2} from './sidebar.js';
import {Text} from 'react-native';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';
import {Tutorial} from './tutorial.js';
import {CheckCircle, Type, AlignLeft, Eye} from 'react-feather';
import {FillGapsContainer} from './LearningContainer.js'

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

export class LearningSupervisor extends React.Component {
    
    state = {fade: null, redirectpath: null}
    
    onClick = (redirectpath) => {
        
        this.setState({fade: true, redirectpath});
        setTimeout(() => {this.setState({redirect: true});}, 1500);
        
    }
    
    onRedirect = () => {
        
        console.log("redirect niga")
        this.setState({redirect: true});
        
    }
    
    render () {
        
        const {data, type, nextList} = this.props.location;
        
        if (this.state.redirect) {
            
            return <Redirect to={this.state.redirectpath}/>
                
        }
        
        return (
            <FreeBarWrapped2 onClick={this.onClick} onRedirect={this.onRedirect} fade={this.state.fade} redirect={this.state.redirect} WrappedComponent={LearningSupervisor1} data={data} type={type} nextList={nextList}/>
            );
    }
}

export class LearningSupervisor1 extends React.Component {
    
    state = {
        parcelData: {answeredCorrect: "-1", type: this.props.type},
        type: this.props.type,
        progressData: {runningProgress: [0,0]},
        loading: 0
    };

    handleNext = async (parcelData) => {
        console.log(parcelData);
        this.setState({loading: 1});
        await this.setState({parcelData});
        this.setState({loading: 0});
    };
    
    render () {
        console.log(this.props.nextList)
        if (this.state.loading == 1) {
            return (
                <div></div>
                );
        } else {
        return (
            <LearningContainerData
            parcelData={this.state.parcelData}
            type={this.props.type}
            handleNext={this.handleNext}
            runningProgress={this.state.progressData.runningProgress}
            data={this.props.data}
            nextList={this.props.nextList}
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
    const {error, loading, data, refresh} = useApi(APIHOST + '/api/startreading', payload, opts);
        
    const handleNext = async (parcelData) => {
        await props.handleNext(parcelData);
        refresh();
    }
        
    const getTokenAndTryAgain = async () => {
        await getAccessTokenWithPopup(opts);
        refresh()
  };
    
    if (props.data !== undefined) {
        var reviewyet = 0;
        for (var i=0; i < props.data.read_data.allChunks.length; i++) {
            if (props.data.read_data.allChunks[i]["first"] == 0) {
                reviewyet += 1;
            }
        }
        return <LearningContainerUpdatable
            allChunks= {props.data.read_data.allChunks}
            type={props.type}
            progress={props.data.read_data.today_progress}
            lives={props.data.read_data.lives}
            runningProgress = {props.runningProgress}
            reviewyet = {reviewyet}
            status = {props.data.read_data.status}
            review_data={props.data.review_data}
            nextList={props.nextList}
        />  
    }
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
    if (data.status == "newUser") {
        return <Redirect to="/newuser"/>;
    }
    var reviewyet = 0;
    for (var i=0; i < data.allChunks.length; i++) {
        if (data.allChunks[i]["first"] == 0) {
            reviewyet += 1;
        }
    }
    console.log(data);
    return (
        <div>
        <LearningContainerUpdatable
            nextList={props.nextList}
            allChunks = {data.allChunks}
            type= {props.type}
            status = {data.status}
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
        status: this.props.status,
        allChunks: this.props.allChunks,
        progress: this.props.progress,
        runningProgress: this.props.runningProgress,
        yet: this.props.progress["yet"],
        reviewProgress: {yet: this.props.reviewyet, done: 0},
        reviews: 0,
        lives: this.props.lives
    }

    bottomRef = React.createRef();
    
    handleNext = (parcelData) => {
        if (this.props.type != "daily_reading") {
            if (parcelData.answers[parcelData.keyloc] == 0) {
                this.setState({progress: {"done": this.state.progress["done"] + 1, "yet": this.state.progress["yet"]}});
                var nowChunk = this.state.allChunks[this.state.currentChunkNo];
                var nowChunks = this.state.allChunks;
                nowChunks.push(nowChunk);
                this.setState({allChunks: nowChunks});
                var i = this.state.currentChunkNo;
                this.setState({currentChunkNo: i+1});
                if (this.state.lives == 1) {
                    this.setState({done: 1, status: "done"});
                    this.props.nextList({status: "dead", lives: this.state.lives});
                } else {
                    this.setState({lives: this.state.lives - 1});
                }
            }
            else if (this.state.currentChunkNo < this.props.allChunks.length - 1) {
                this.setState({progress: {"done": this.state.progress["done"] + 1, "yet": this.state.progress["yet"]-1}});
                var i = this.state.currentChunkNo;
                this.setState({currentChunkNo: i + 1});
            } else {
                this.setState({progress: {"done": this.state.progress["done"] + 1, "yet": this.state.progress["yet"]-1}});
                console.log("DONEDONE");
                parcelData["done"] = 1;
                var i = this.state.currentChunkNo;
                this.setState({done: 1, status: "done"});
                this.props.nextList({status: "alive", lives: this.state.lives});
            }
            return 0;
        }
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
                this.setState({done: 1, status: "done"});
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
        console.log(this.props.type);
        return (
            
    
            <div>
            <LearningContainerLogging
                review_data={this.props.review_data}
                parcelData = {this.state.parcelData}
                currentChunk = {this.props.allChunks[this.state.currentChunkNo]}
                handleNext = {this.handleNext}
                progress = {100*this.state.progress["done"]/(this.state.progress["done"] + this.state.progress["yet"])}
                type = {this.props.type}
                status = {this.state.status}
                allChunks = {this.props.allChunks}
                runningProgress = {this.state.runningProgress}
                reviews = {this.props.allChunks[this.state.currentChunkNo]["first"]}
                currentChunkNo = {this.state.currentChunkNo}
                yet={this.state.yet}
                lives={this.state.lives}
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
    const {error, loading, data, refresh} = useApi(APIHOST + '/api/startreading', payload, opts);
    
    const handleNext = async (parcelData) => {
        props.handleNext(parcelData);
        refresh();
    }
    
    const handleSummary = () => {
        return (
            <Redirect to="/reviewtoday"/>
            );
    }
    
    if (props.status != "done") {

        return (
            <div>
            <FillGapsContainer
                type={props.type}
                status={props.status}
                currentChunk = {props.currentChunk}
                handleNext = {handleNext}
                progress = {props.progress}
                yet={props.yet}
                runningProgress = {props.runningProgress}
                reviews = {props.reviews}
                currentChunkNo = {props.currentChunkNo}
                reviewyet={props.reviewyet}
                reviewProgress={props.reviewProgress}
                lives={props.lives}
            />
            </div>
        );
    } else if (loading) {
        return <div></div>;
    } else {
    
        return (
            <div> <LearningSummaryContainer
                handleSummary={handleSummary}/></div>
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
    
    const handleSummary = (event) => {
        
        return <Redirect to="/reviewtoday"/>;
        
    }
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
        permissions={data.permissions}
        />
    );

}

class LearningSummary extends React.Component {
    
    state = {done: 0,
            readForFun: 0,
            stepTime: 0}
    
    handleSummary = () => {
        
        this.setState({done: 1});
    }
    
    readForFun = () => {
        
        this.setState({readForFun: 1});
        
    }
    
    resetAccount = () => {
        
        this.setState({resetAccount: 1});
        
    }
    
    skipToTomorrow = () => {
        
        this.setState({stepTime: 1});
        
    }
    
    render () {
        
        if (this.state.done == 1) {
            
            return <Redirect to="/reviewtoday"/>;
                
        }
        
        if (this.state.readForFun == 1) {
            
            return <LearningSupervisor1 displayType="readforfun"/>;
            
        }
        
        if (this.state.resetAccount == 1) {
            
            return <ResetAccount/>;
            
        }
        
        if (this.state.stepTime == 1) {
            
            return <StepTime/>;
            
        }
        
        if (this.props.permissions.includes("b")) {
            var readforfun = true;
        } else {
            var readforfun = false;
        }
        
        if (this.props.permissions.includes("s")) {
            var skiptotomorrow = true;
        } else {
            var skiptotomorrow = false;
        }
        
        if (this.props.permissions.includes("r")) {
            var reset = true;
        } else {
            var reset = false;
        }
        
        if (this.props.words.length == 0) {
            
            return (
                
                <div>
            <div style={{marginTop: "5em", fontSize: "30px", textAlign: "center"}}> No reviews needed today. Take a break and let your memory do its work! </div>
                </div>
            );
        }

             
        return (
            <div style={{textAlign: "center"}}>
            <div style={{marginTop: "5em", fontSize: "30px"}}> You're done for today! <br></br> Check in tomorrow for more reviews.</div>
            <div>
            <button style={{borderColor: "green", padding: "15px", color: "green", borderRadius: "30px", marginTop: "2em", backgroundColor: "white"}} onClick={this.handleSummary}>Review today's progress</button>
            </div><div>
{readforfun && <button style={{borderColor: "darkpurple", padding: "15px", color: "darkpurple", borderRadius: "30px", marginTop: "2em", backgroundColor: "white"}} onClick={this.readForFun}>Read for fun!</button>}
{skiptotomorrow && <button style={{borderColor: "darkpurple", padding: "15px", color: "darkpurple", borderRadius: "30px", marginTop: "2em", backgroundColor: "white"}} onClick={this.skipToTomorrow}>Skip to tomorrow</button>}
{reset && <button style={{borderColor: "darkpurple", padding: "15px", color: "darkpurple", borderRadius: "30px", marginTop: "2em", backgroundColor: "white"}} onClick={this.resetAccount}>Reset account.</button>}
            </div>
            </div>
            );
    }
}

const ResetAccount = (props) => {
    
    const payload = {}

    
    const {login, getAccessTokenWithPopup } = useAuth0();
    const opts = {audience: APIHOST, 
                  fetchOptions: {method: 'post',
                                 headers: {'Access-Control-Allow-Credentials': 'true',
                                           'Access-Control-Allow-Origin': '*',
                                           'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                          'Access-Control-Request-Method': 'POST'}}};
    const {error, data, loading, refresh} = useApi(APIHOST + '/api/resetaccount', payload, opts);
    
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
        
        <Redirect to="/"/>
    );

}

const StepTime = (props) => {
    
    const payload = {}

    
    const {login, getAccessTokenWithPopup } = useAuth0();
    const opts = {audience: APIHOST, 
                  fetchOptions: {method: 'post',
                                 headers: {'Access-Control-Allow-Credentials': 'true',
                                           'Access-Control-Allow-Origin': '*',
                                           'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                          'Access-Control-Request-Method': 'POST'}}};
    const {error, data, loading, refresh} = useApi(APIHOST + '/api/steptime', payload, opts);
    
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
        
        <Redirect to="/"/>
    );

}


        
        
