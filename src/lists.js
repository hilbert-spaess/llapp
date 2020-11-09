import React from 'react';
import ReactDOM from 'react-dom';
import {useLocation} from 'react-router-dom';
import {Card, Button, Row, Col, Container, Modal, ProgressBar} from 'react-bootstrap';
import {getChunk, firstChunk, getData, JSONconvert} from './client.js';
import {FreeBarWrapped} from './sidebar.js';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';
import {CheckCircle, Plus, Minus} from 'react-feather';
import {Line} from 'rc-progress';
import {LearningContainer} from './LearningContainer.js';
import {LearningSupervisor1} from './ReadingSupervisor.js';

export class DisplayLists extends React.Component {
    
    render () {
        
        const {data} = this.props.location;
        
        return (
            
            <FreeBarWrapped WrappedComponent={LoadingDisplayLists} data={data}/>
    
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
    
    const handlePlay = (playdata) => {
        
        props.handlePlay(playdata);
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
    
    onHide = () => {
        this.setState({focus_id: null});
    }
    
    render () {
            
        if (this.props.submitData != null && this.props.submitData.state == "read") {
            
            console.log("hehe");
            return <ListContainer data={this.props.submitData} />
            return <Redirect to={{pathname: "/read", data: this.props.submitData, type: "list"}}/>
        }
         
        console.log(this.props.data.lists.courselists);

        if (this.state.focus_id != null) {
            
            if (this.state.focus_id == 0) {
                
                var data = {name: "Quick Session", id: "quicksession", words: []};
            
            } else {
                
                var data = this.props.data.lists.courselists[this.state.focus_id-1];
                
            }
            
            return <FocusList name={data.name}
                words = {data.words}
                handlePlay={this.props.handlePlay}
                id={data.id}/>;
                    
        }
        
        var lists = [];

        lists.push(<ListCard i={0} handleFocus={this.handleFocus} data={{name: "Quick Session", id: "quicksession", words: []}} handlePlay={this.props.handlePlay}/>);
        
        for (var i = 1; i < this.props.data.lists.courselists.length+1; i++) {
            
            lists.push(<ListCard 
                       i={i}
                        handleFocus = {this.handleFocus}
                       data={this.props.data.lists.courselists[i-1]}
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
            <Row className="bottombubbleread" style={{justifyContent: "center", position: "absolute", width: "80%", top: "10%"}}>
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
        var data = {qno: this.state.qno, id: this.props.id};
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
            
            words.push(<div>{this.props.words[i][1]}</div>);
            
        }
        
        return (
            
            <Card className={this.state.playing ? "focuslistcardout" : "focuslistcard"}>
            <div style={{fontSize: "2vw", textAlign: "center", marginBottom: "3vh"}}>{this.props.name}</div>
            <div>
                <Row>
            <Col style={{width: "20%", textAlign: "center"}}>
                <div>Words like:</div><hr></hr>
            {words}</Col>
            <Col style={{width: "80%", textAlign: "center"}}>
            <div>High score: 0</div>
            <div>5 Lives</div>
            <button className="newvocabsubmit" onClick={this.handlePlay}>Start Round 1!</button>
            </Col>
            </Row>
            </div>
            </Card>
        );
    }
}

class ListContainer extends React.Component {
    
    state = {currentList:0, playing: true}
    
    nextList = () => {
        
        this.setState({playing: false});
        this.setState({currentList: this.state.currentList + 1});
        
    }
    
    nextRound = () => {
        console.log("henlo");
        this.setState({playing: true});
        
    }
    
    render () {
        
        var wordnos = {0: "3", 1: "5", 2: "8", 3: "13"};
        
        if (this.state.currentList > 0) {
            
            var words = this.props.data.read_data.words.slice(0,wordnos[this.state.currentList-1]);
            
        }
        
        if (!this.state.playing) {
            return <div className="listsummarycard">
                Completed level {this.state.currentList}: {wordnos[this.state.currentList-1]} words. {words}. Next level: {wordnos[this.state.currentList]} words.
                <button onClick={this.nextRound} className="newvocabsubmit">Start Round {this.state.currentList+1}!</button></div>
        }
        
        console.log(this.props.data);
        
        var allChunks = this.props.data["read_data"].allChunks[this.state.currentList];
        
        console.log(allChunks);
        
        var yet = allChunks.length;
        
        return (
            
            <LearningSupervisor1  data={{read_data: {allChunks: allChunks, today_progress: {yet: yet, done: 0}}}} type="list" nextList={this.nextList}/>
            
            );
            
    }
}


    
    


