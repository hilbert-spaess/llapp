import React from 'react';
import ReactDOM from 'react-dom';
import {useLocation, Link} from 'react-router-dom';
import {Card, Button, Row, Col, Container, Modal, ProgressBar} from 'react-bootstrap';
import {InteractionCard} from './InteractionCard.js';
import {getChunk, firstChunk, getData, JSONconvert} from './client.js';
import {SidebarWrapped} from './sidebar.js';
import {Text} from 'react-native';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';
import {Tutorial} from './tutorial.js';
import {CheckCircle, Type, AlignLeft, Eye} from 'react-feather';
import {FillGapsContainer} from './LearningContainer.js';
import {AnalysisContainer} from './analysiscontainer.js';
import {ImproveContainer} from './improvecontainer.js';
import {Line} from 'rc-progress';

function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx);
};

export class LearningSupervisor extends React.Component {
    
    render () {
        
        const {data, type, nextList} = this.props.location;
        
        return (
            <SidebarWrapped doesRemember={false}  WrappedComponent={LearningSupervisor1} data={data} type={type} nextList={nextList}/>
            );
    }
};

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
            data={this.props.data}
            nextList={this.props.nextList}
            />
        );
    }
    }
};

            

const LearningContainerData = (props) => {
    
    var payload = props.parcelData;
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
    };
        
    const getTokenAndTryAgain = async () => {
        await getAccessTokenWithPopup(opts);
        refresh();
    };
    
    if (props.data !== undefined) {
        
        return <LearningContainerUpdatable
            allChunks= {props.data.read_data.allChunks}
            type={props.type}
            metadata={{progress: props.data.read_data.today_progress, lives: props.data.read_data.lives, review_data: props.data.review_data, nextList: props.nextList}}   
            status = {props.data.read_data.status}
               />;  
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
        return <Redirect to="/newusertest"/>;
    }
    console.log(data);
    return (
        <div>
        <LearningContainerUpdatable
          allChunks = {data.allChunks}
          type= {props.type}
          metadata={{progress: data.today_progress, review_data: data.review_data, nextList: props.nextList}}
          status = {data.status}
        />          
        </div>
    );
};

class LearningContainerUpdatable extends React.Component {
    
    state = {
        parcelData: {},
        currentChunkNo: 0,
        status: this.props.status,
        allChunks: this.props.allChunks,
        progress: this.props.metadata.progress,
        lives: this.props.metadata.lives
    }

    bottomRef = React.createRef();

    handleNextDaily = (parcelData) => {
        if (parcelData.first == 1 && parcelData.answeredCorrect == 0) {
            this.setState({progress: {done: this.state.progress.done + 1, yet: this.state.progress.yet}});
            var nowChunk = this.state.allChunks[this.state.currentChunkNo];
            var nowChunks = this.state.allChunks;
            nowChunks.push(nowChunk);
            this.setState({allChunks: nowChunks});
            var i = this.state.currentChunkNo;
            this.setState({currentChunkNo: i+1});
        } else {
            this.setState({progress: {done: this.state.progress.done + 1, yet: this.state.progress.yet - 1}});
            if (this.state.currentChunkNo < this.props.allChunks.length - 1) {
                var i = this.state.currentChunkNo;
                this.setState({currentChunkNo: i + 1});
            } else {
                parcelData["done"] = 1;
                var i = this.state.currentChunkNo;
                this.setState({done: 1, status: "done"});
            }
        }
        this.setState({parcelData});

    }

    handleNextQuick = (parcelData) => {

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
    };
    
    handleNext = (parcelData) => {
        if (this.props.type != "daily_reading") {
            this.handleNextQuick(parcelData);
        }
        this.handleNextDaily(parcelData);
        return 0;
    }
    
    render () {

        const progress = 100*this.state.progress.done/(this.state.progress.done + this.state.progress.yet);
        
        return (
            
            <LearningContainerLogging
              metadata={{progress: progress, lives: this.state.lives, review_data: this.props.metadata.review_data, parcelData: this.state.parcelData, handleNext: this.handleNext}}
              data={{currentChunk: this.props.allChunks[this.state.currentChunkNo], allChunks: this.props.allChunks, currentChunkNo: this.state.currentChunkNo}}
                type = {this.props.type}
                status = {this.state.status}
            />
        );
    }
}   

const LearningContainerLogging = (props) => {
    
    
    const payload = props.metadata.parcelData;
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
        props.metadata.handleNext(parcelData.metadata);
        refresh();
    };
    
    const handleSummary = () => {
        return (
            <Redirect to="/reviewtoday"/>
            );
    };
    
    if (props.status != "done") {

	return (
	    <div className="fillgapscard">
		<div style={{marginTop: "5%"}}>
	    <ProgressLine
		progress={props.metadata.progress}/>
		</div>
		
	    <LearningContainer
		type={props.type}
			status={props.status}
			data = {{currentChunk: props.data.currentChunk}}
		metadata = {{handleNext: handleNext, progress: props.metadata.progress, currentChunkNo: props.metadata.currentChunkNo, lives: props.metadata.lives}}/>
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

class LearningContainer extends React.Component {

    render () {

	    if (this.props.data.currentChunk.mechanism == "analysis") {

	    return (

		<AnalysisContainer
		    type={this.props.type}
		    status={this.props.status}
		    data = {this.props.data}
		    metadata = {this.props.metadata}
		/>
	    );
	} else if (this.props.data.currentChunk.mechanism == "improve") {

	    return (

		    <ImproveContainer
			type={this.props.type}
			status={this.props.status}
			data = {this.props.data}
			metadata = {this.props.metadata}/>

	    );
		

	} else {

        return (
            <FillGapsContainer
                type={this.props.type}
                status={this.props.status}
                currentChunk = {this.props.data.currentChunk}
                handleNext = {this.props.metadata.handleNext}
                progress = {this.props.metadata.progress}
                currentChunkNo = {this.props.metadata.currentChunkNo}
                lives={this.props.metadata.lives}
            />
        );
	}
    }
}

class ProgressLine extends React.Component {

    render () {

	return (

	      <Line percent={this.props.progress} strokeWidth="1"/>

	);
    }
}

const LearningSummaryContainer = (props) => {
    
    const payload = {};

    
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
        refresh();
  };
    
    const handleSummary = (event) => {
        
        return <Redirect to="/reviewtoday"/>;
        
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
        permissions={data.permissions}
        />
    );

}

class LearningSummary extends React.Component {
    
    state = {done: 0,
            readforFun: 0,
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


        
        
