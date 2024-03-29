import React from 'react';
import ReactDOM from 'react-dom';
import {useLocation} from 'react-router-dom';
import {Card, Button, Row, Col, Container, Modal, ProgressBar} from 'react-bootstrap';
import {getChunk, firstChunk, getData, JSONconvert} from './client.js';
import {SidebarWrapped} from './sidebar.js';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';
import {CheckCircle, Plus, Minus, ArrowLeft} from 'react-feather';
import {Line} from 'rc-progress';
import {LearningContainer} from './LearningContainer.js';
import {LearningSupervisor1} from './ReadingSupervisor.js';

export class DisplayLists extends React.Component {
    
    render () {
        
        const {data} = this.props.location;
        
        return (
            
            <SidebarWrapped WrappedComponent={LoadingDisplayLists} data={data}/>
    
        );
    }
}

export const LoadingDisplayLists = (props) => {
    
     const {login, getAccessTokenWithPopup } = useAuth0();
     const opts = {audience: APIHOST};
     const {error, loading, data, refresh} = useApi(APIHOST + '/api/loadlists', {}, opts);
     const getTokenAndTryAgain = async () => {
        await getAccessTokenWithPopup(opts);
        refresh()
  };
    console.log("to do: cached data");
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
        return <Redirect to="/newusertest"/>;
    }
    return (
         <DisplayListsSubmit
        data={data}/>
        );
}   

class DisplayListsSubmit extends React.Component {
    
    state = {payload: null,
             type: "null"}
    
    handlePlay = (playdata) => {
        console.log(playdata);
        this.setState({type: "read", payload: {id: playdata.id, qno: playdata.qno}});
    }
    
        
    
    render () {
        
        return (
            
            <DisplayListsLogging
            payload={this.state.payload}
            type={this.state.type}
            data={this.props.data}
            handlePlay={this.handlePlay}/>
    );
    }
}

const DisplayListsLogging = (props) => {
    
    const payload = {payload: props.payload, type: props.type};
    const {login, getAccessTokenWithPopup } = useAuth0();
    const opts = {audience: APIHOST, 
                  fetchOptions: {method: 'post',
                                 body: payload,
                                 headers: {'Access-Control-Allow-Credentials': 'true',
                                           'Access-Control-Allow-Origin': '*',
                                           'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                          'Access-Control-Request-Method': 'POST'}}};
    const {error, loading, data, refresh} = useApi(APIHOST + '/api/newlist', payload, opts);
    
    const handlePlay = async (playdata) => {
        
        await props.handlePlay(playdata);
        refresh();
    }
    
    return (
        <DisplayLists1
        data={props.data}
        submitData={data}
        handlePlay={handlePlay}/>
            );
}

class DisplayLists1 extends React.Component {
    
    state = {mode: null,
             focus_id: null,
             animate: true}
    
    handleFocus = (i) => {
        this.setState({mode: "focus"});
        setTimeout(()=>{this.setState({focus_id: i})}, 450);
        
    }
    
    handlePlay = (data) => {
        this.setState({mode: "read"});
        this.props.handlePlay(data);
    }
    
    playAgain = () => {
        this.setState({mode: null});
        this.props.handlePlay({id: this.state.focus_id});
    }
    
    finishHere = () => {
        console.log("henloe");
        this.props.handlePlay({});
        this.setState({mode: null, focus_id: null});
    }
    
    onHide = () => {
        this.setState({focus_id: null});
    }
    
    render () {
            
        if (this.state.mode == "read" && this.props.submitData != null && this.props.submitData.state == "read") {
            
            console.log("hehe");
            return <ListContainerUpdatable data={this.props.submitData} playAgain={this.playAgain} finishHere={this.finishHere}/>
            return <Redirect to={{pathname: "/read", data: this.props.submitData, type: "list"}}/>
        }
         
        console.log(this.props.data.lists.courselists);

        if (this.state.focus_id != null) {
                
                var data = this.props.data.lists.courselists[this.state.focus_id];
                
            
            
            return <FocusList name={data.name}
                words = {data.words}
                hs={data.hs}
                handlePlay={this.handlePlay}
                finishHere={this.finishHere}
                id={data.id}/>;
                    
        }
        
        var lists = [];
        
        for (var i = 0; i < this.props.data.lists.courselists.length; i++) {
            
            lists.push(<ListCard 
                       i={i}
                        handleFocus = {this.handleFocus}
                       data={this.props.data.lists.courselists[i]}
                       handlePlay={this.props.handlePlay}/>);
        }
        
        console.log(this.state.focus_id);
        
        return (
            <div className={this.state.mode == "focus" ? "fastfadeout" : ""}>
            <Modal show={this.state.focus_id != null} onHide={this.onHide}>
            <FocusList 
                data={this.props.data.lists.courselists}
                id={this.state.focus_id}/>
            </Modal>
            <Row className="bottombubbleread" style={{justifyContent: "center", position: "absolute", width: "80%", top: "5%"}}>
                {lists}
                </Row>
            </div>
            );
    }
}

class ListCard extends React.Component {
    
    state = {focus: false, animate: false}
    
    handleFocus = () => {
        this.props.handleFocus(this.props.i);
    }
    
    
    onHide = () => {
        this.setState({focus: false});
    }
    
    render () {
        
        console.log("henloe");
        
        return (
            <>
            <Modal show={this.state.focus} onHide={this.onHide}>
            <FocusList 
                name={this.props.data.name}
                words = {this.props.data.words}
                handlePlay={this.props.handlePlay}
                id={this.props.data.id}/>
            </Modal>
            <Card className="listbubble" onClick={this.handleFocus} style={{width: "30vh", height: "30vh", cursor: "pointer"}}>
            <div className="bubbletext" style={{textAlign: "center"}}> {this.props.data.name} </div>
            </Card>
        </>
           );
    }
}

class FocusList extends React.Component {
    
    state = {qno: 10, playing: false}
    
    handlePlay = () => {
        var data = {id: this.props.id};
        console.log(data);
        this.setState({playing: true});
        this.props.handlePlay(data);
    }
    
    handlePlus = () => {
        if (this.state.qno < 30) {
            this.setState({qno: this.state.qno+1});
        } 
    }
    
    handleMinus = () => {
        if (this.state.qno > 10) {
            this.setState({qno: this.state.qno - 1});
        }
    }
    
    render () {
        
        var words = [];
        
        for (var i = 0; i < Math.min(this.props.words.length, 10); i++) {
            
            words.push(<VocabCard word={this.props.words[i][1]}/>);
            
        }
        
        words.push(<div style={{opacity: "0%"}}><VocabCard word="hi"/></div>);
        
        return (
            
            <Card className={this.state.playing ? "focuslistcardout bubble" : "listsummarycard bubble"}>
            <div style={{textAlign: "left"}}><ArrowLeft onClick={this.props.finishHere} size="2vw" style={{marginTop: "1vh", cursor: "pointer"}}/></div>
            <div style={{fontSize: "2vw", textAlign: "center", marginTop: "1vh", marginBottom: "3vh"}}>{this.props.name}</div>
            <div>
                <Row>
            <Col style={{width: "20%", textAlign: "center"}}>
                <div style={{marginBottom: "5vh", fontSize: "2vw"}}>Words like:</div>
                    <Row style={{justifyContent: "space-evenly"}}>
            {words}<div style={{marginTop: "1vh", marginBottom: "1vh"}}></div></Row></Col>
            <Col style={{width: "80%", textAlign: "center"}}>
            <div style={{fontSize: "2vw", marginBottom: "5vh"}}>High score</div><div style={{marginTop: "3vh"}}>Round {this.props.hs}</div><Line percent={100*(this.props.hs/6)} strokeWidth="1" strokeColor="#048a81" style={{marginTop: "1vh"}}/>
            <div style={{marginTop: "20vh", color: "red", fontSize: "1.5vw"}}>* * * * *</div>
            <div>5 lives</div>
        <div style={{marginTop: "3vh", fontSize: "1.5vw"}}>
            <button style={{borderColor: "green", padding: "15px", color: "green", borderRadius: "30px", fontSize: "1.5vw", backgroundColor: "white"}} className="newvocabsubmit" onClick={this.handlePlay}>Start Round 1!</button></div>
            </Col>
            </Row>
            </div>
            </Card>
        );
    }
}

class ListContainerUpdatable extends React.Component {
    
    state = {parcelData: {}}
    
    saveResult = (data) => {
        this.setState({parcelData: data});
    }
    
    render () {
    
        return (
            
            <ListContainerLogging
            data={this.props.data} parcelData={this.state.parcelData} playAgain={this.props.playAgain} finishHere={this.props.finishHere} saveResult={this.props.saveResult} saveResult={this.saveResult}/>
    
        );
    }
}
            

const ListContainerLogging = (props) => {
    
    
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
    const {error, loading, refresh} = useApi(APIHOST + '/api/loglist', payload, opts);
    
    const saveResult = async (data) => {
        await props.saveResult(data);
        refresh();
    }
    
    return (
        <ListContainer data={props.data} playAgain={props.playAgain} finishHere={props.finishHere} saveResult={saveResult}/>
        );
}
    

class ListContainer extends React.Component {
    
    state = {currentList:0, playing: true, lives: 5, dead: false}
    
    nextList = (data) => {
        
        this.setState({playing: false});
        if (data.status == "dead") {
            this.setState({dead: true});
            this.saveResult("dead");
        }
        else {
        this.setState({currentList: this.state.currentList + 1, lives: data.lives});
        this.saveResult("alive");
        }
    }
    
    nextRound = () => {
        console.log("henlo");
        this.setState({playing: true});
        
    }
    
    playAgain = () => {
        this.setState({currentList: 0, lives: 5, dead: false});
        this.setState({playing: true});
    }
    
    saveResult = (status) => {
        this.props.saveResult({currentList: this.state.currentList, id: this.props.data.read_data.id, status: status});
    }
    
    render () {
        
        var wordnos = {0: "3", 1: "5", 2: "8", 3: "13"};
        
        if (this.state.currentList > 0) {
            
            var words = this.props.data.read_data.words.slice(0,wordnos[this.state.currentList-1]);
            
        }
        
        if (this.state.dead) {
            var wd = "round";
            if (this.state.currentList > 1) {
                
                var wd="rounds";
                
            } 
            
             return (
                
                <Card className="listsummarycard bubble" style={{paddingLeft: "1vw", paddingRight: "1vw"}}>
            <div style={{fontSize: "2vw", textAlign: "center", marginTop: "1vh", marginBottom: "3vh"}}>{this.props.data.read_data.name}</div>
            <div style={{marginTop: "2vh", fontSize: "1.5vw"}}>You ran out of lives! You finished {this.state.currentList} {wd} out of 6.</div>
        <div> <Line percent={100*(this.state.currentList/6)} strokeWidth="1" strokeColor="#048a81" style={{marginTop: "2vh"}}/></div>
            <div style={{marginTop: "3vh", textAlign: "center"}}><button onClick={this.props.playAgain} className="newvocabsubmit" style={{fontSize: "1.5vw"}}>Play again</button></div>
            </Card>
            );
        }
            
        
        if (!this.state.playing) {
            return (
            <ListSummaryCard currentList={this.state.currentList} words={words} nextwordno={wordnos[this.state.currentList]} name={this.props.data.read_data.name} lives={this.state.lives} nextRound={this.nextRound} finishHere={this.props.finishHere}/>);
        }
        
        console.log(this.props.data);
        
        var allChunks = this.props.data["read_data"].allChunks[this.state.currentList];
        
        console.log(allChunks);
        
        var yet = allChunks.length;
        
        return (
            
            <LearningSupervisor1  data={{read_data: {allChunks: allChunks, lives: this.state.lives, today_progress: {yet: yet, done: 0}}}} type="list" nextList={this.nextList}/>
            
            );
            
    }
}

class ListSummaryCard extends React.Component {
    
    render () {
        
        var words = [];
        var newwords = [];
        
        for (var i = 0; i < this.props.words.length; i++) {
            
            words.push(<VocabCard word={this.props.words[i]}/>);
            newwords.push(<VocabCard word={this.props.words[i]}/>);
        
        }
    
        for (var i = 0; i < this.props.nextwordno - this.props.words.length; i++) {
            
            newwords.push(<VocabCard word="?"/>);
            
        }

        var lives = ""

        for (var i =0; i < this.props.lives ; i++) {
            
            lives += "  *  ";
            
        }
        
        return (
            
              <Card className="listsummarycard" style={{paddingLeft: "1vw", paddingRight: "1vw"}}>
            <div style={{fontSize: "2vw", textAlign: "center", marginTop: "1vh", marginBottom: "3vh"}}>{this.props.name}</div>
<div style={{marginTop: "2vh", fontSize: "1.5vw"}}>Finished round {this.props.currentList} of 6.</div>
<div> <Line percent={100*(this.props.currentList/6)} strokeWidth="1" strokeColor="#048a81" style={{marginTop: "2vh"}}/></div>
    <div style={{fontSize: "1.5vw", marginTop: "5vh"}}>Remaining lives:</div>
<div style={{marginTop: "2vh", color: "red", fontSize: "1.5vw"}}>{lives}</div>
<div style={{fontSize: "1.5vw", marginTop: "3vh"}}>Next round:</div>
        <Row style={{height: "auto", justifyContent: "left", marginTop: "4vh"}}>{newwords}</Row>
              <div style={{marginTop: "5vh", textAlign: "center"}}><button onClick={this.props.nextRound} className="newvocabsubmit" style={{fontSize: "1.5vw"}}>Start Round {this.props.currentList+1}!</button>
            <button onClick={this.props.finishHere} className="newvocabsubmit" style={{fontSize: "1.5vw"}}>Finish here</button></div>
            </Card>

        );
    }
}

class VocabCard extends React.Component {
    
    render () {
        
            if (this.props.word.length > 14) {
                var size = "1.5vw";
            }
            else if (this.props.word.length > 10) {
                var size = "1.75vw";
            } 
            else {
                var size = "2vw";
            }
            var size="1.5vw";

            return (

                <Card
                style={{height: "4vw", width: "13vw", marginRight: "1vw", marginLeft: "1vw", backgroundColor: "#f5f5f5", marginBottom: "1vw"}}>

                <div className="cardHeader"
                style={{textAlign: "center",
                      fontSize: size}}>
                           <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
                {this.props.word}
                </div>
                </div>
        </Card>
        );
    }
}


    
    


