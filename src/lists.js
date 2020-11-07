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
             focus_id: null}
    
    handleFocus = (i) => {
        
        this.setState({mode: "focus", focus_id: i});
        
    }
    
    onHide = () => {
        this.setState({focus_id: null});
    }
    
    render () {
            
        if (this.props.submitData != null && this.props.submitData.state == "read") {
            
            console.log("hehe");
            
            return <Redirect to={{pathname: "/read", data: this.props.submitData, type: "list"}}/>
        }
         
        console.log(this.props.data.lists.courselists);
        
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
            <>
            <Modal show={this.state.focus_id != null} onHide={this.onHide}>
            <FocusList 
                data={this.props.data.lists.courselists}
                id={this.state.focus_id}/>
            </Modal>
            <Row style={{justifyContent: "center"}}>
                {lists}
                </Row>
            </>
            );
    }
}

class ListCard extends React.Component {
    
    state = {focus: false}
    
    handleFocus = () => {
        this.setState({focus: true});
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
            <Card onClick={this.handleFocus} style={{width: "15vw", height: "35vh", cursor: "pointer"}}>
            {this.props.data.name}
            </Card>
        </>
           );
    }
}

class FocusList extends React.Component {
    
    state = {qno: 10}
    
    handlePlay = () => {
        var data = {qno: this.state.qno, id: this.props.id};
        console.log(data);
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
        
        for (var i = 0; i < this.props.words.length; i++) {
            
            words.push(this.props.words[i][1] + ",");
            
        }
        
        return (
            
            <Card>
            {this.props.name}<br></br>
            {words}<br></br>
            Question #: {this.state.qno} <Plus onClick={this.handlePlus} style={{cursor: "pointer"}}/> <Minus onClick={this.handleMinus} style={{cursor: "pointer"}}/>
            <button className="newvocabsubmit" onClick={this.handlePlay}>Play!</button>
            </Card>
        );
    }
}

    
    


