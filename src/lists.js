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
import {CheckCircle} from 'react-feather';
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
    
    handlePlay = (id) => {
        this.setState({type: "read", payload: {id: id}});
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
    
    const handlePlay = (id) => {
        
        props.handlePlay(id);
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
             play_id: null}
    
    handlePlay = () => {
        
        this.setState({mode: "play"});
        
    }
    
    render () {
            
        if (this.props.submitData != null && this.props.submitData.state == "read") {
            
            console.log("hehe");
            
            return <Redirect to={{pathname: "/read", data: this.props.submitData, type: "hehe"}}/>
        }
         
        console.log(this.props.data.lists.courselists);
        
        var lists = [];
        
        for (var i = 0; i < this.props.data.lists.courselists.length; i++) {
            
            lists.push(<ListCard 
                       data={this.props.data.lists.courselists[i]}
                        handlePlay={this.props.handlePlay}/>);
        }
        
        return (
            
            <Row style={{justifyContent: "center"}}>
                {lists}
                </Row>
            
            );
    }
}

class ListCard extends React.Component {
    
    handlePlay = () => {
        this.props.handlePlay(this.props.data.id)
    }
    
    render () {
        
        console.log("henloe");
        
        return (
            
            <Card style={{width: "15vw", height: "35vh"}}>
            {this.props.data.name}
            <button className="newvocabsubmit" onClick={this.handlePlay}>Play!</button>
            </Card>
           );
    }
}


