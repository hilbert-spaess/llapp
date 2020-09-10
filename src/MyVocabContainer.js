import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Button, Row, Col, Container} from 'react-bootstrap';
import {loadVocab} from './client.js';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {APIHOST} from './api_config.js';

export const MyVocabContainer = () => {
    
     const {login, getAccessTokenWithPopup } = useAuth0();
     const opts = {audience: APIHOST};
     const {error, loading, data, refresh} = useApi(APIHOST + '/api/loadvocab', {}, opts);
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
         <div>
                Active Vocab: <br></br>
                <ActiveVocab
                activeVocabDict = {data.active}/>
                <br></br>
                <FutureVocab
                futureVocabDict = {data.future}/>
                    </div>
        );
}        

export class MyVocabContainer2 extends React.Component {
        
    state = {
        activeVocabDict: {},
        futureVocabDict: {},
        loading: true
    }

    parseVocab = (data) => {
        this.setState({activeVocabDict: data.active,
                       futureVocabDict: data.future,
                       loading: false});
    }
        
    componentDidMount = () => {
        loadVocab({userId: this.props.userId}).then(this.parseVocab);
    };

    render () { 
        if (this.state.loading == false) {
            return (
                <div>
                Active Vocab: <br></br>
                <ActiveVocab
                activeVocabDict = {this.state.activeVocabDict}/>
                <br></br>
                <FutureVocab
                futureVocabDict = {this.state.futureVocabDict}/>
                    </div>
                
            );
        } else {
            return (
                <div></div>
                );
        }
    }
}

class ActiveVocab extends React.Component {
    
    render () {
        
        var vocabCards = [];
        const keys = Object.keys(this.props.activeVocabDict);
        for (var i = 0; i < keys.length; i++) {
            
            vocabCards.push(<ActiveVocabCard data = {this.props.activeVocabDict[keys[i]]}></ActiveVocabCard>);
        }
    
        return (
        
            vocabCards
                
        );
    }
}

class ActiveVocabCard extends React.Component {
    
    render () {
        
        return (
            
            <Card>
            
            Word: {this.props.data["w"]} <br></br>
    
            Streak: {this.props.data["s"]}

            </Card>
        );
    }
}

class FutureVocab extends React.Component {
    
    render () {
        
        var vocabCards = [];
        const keys = Object.keys(this.props.futureVocabDict);
        for (var i = 0; i < keys.length; i++) {
            
            vocabCards.push(<FutureVocabCard data = {this.props.futureVocabDict[keys[i]]}></FutureVocabCard>);
        }
    
        return (
        
            vocabCards
                
        );
    }
}

class FutureVocabCard extends React.Component {
    
    render () {
        
        return (
            
            <Card>
            
            Word: {this.props.data["w"]} <br></br>

            </Card>
        );
    }
}

    
            