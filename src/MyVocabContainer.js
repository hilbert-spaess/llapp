import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Button, Row, Col, Container, CardDeck, ProgressBar} from 'react-bootstrap';
import {loadVocab} from './client.js';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {APIHOST} from './api_config.js';
import {BarWrapped} from './sidebar.js';

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export class MyVocabContainer extends React.Component {
    render () {
        return (
            <BarWrapped WrappedComponent={MyVocabContainer1}/>
        );
    }
}

export const MyVocabContainer1 = () => {
    
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
        <div
            style={{textAlign: "center", fontSize: "4rem", marginTop: "3rem"}}>
                Active Vocab <br></br>
</div>
                <VocabGrid
                VocabDict = {data.active}
                size="3em"
                active={true}/>
                <br></br>
<div style={{textAlign: "center", fontSize: "4rem", marginTop: "3rem"}}>
                Future Vocab: <br></br>
</div>
                <VocabGrid
                VocabDict = {data.future}
                size="2em"
                active={false}/>
                    </div>
        );
}        

class VocabGrid extends React.Component {
    
    render () {
        
        var vocabCards = [];
        var keys = Object.keys(this.props.VocabDict);
        shuffle(keys);
        for (var i = 0; i < keys.length; i++) {
            
            vocabCards.push(<VocabCard 
                            data = {this.props.VocabDict[keys[i]]}
                            size={this.props.size}
                            active={this.props.active}
        ></VocabCard>);
        }
    
        return (
    <Container>
    <Row 
     style={{justifyContent: "center"}}>
            {vocabCards}
</Row>
            </Container>
                
        );
    }
}

class VocabCard extends React.Component {
    
    render () {
        
        return (
            
            <Card
            style={{height: "20rem", width: "15rem", marginRight: "1rem", marginLeft: "1rem", marginTop: "1rem"}}>
            
            <div className="cardHeader"
            style={{textAlign: "center",
                  padding: "1rem",
                  fontSize: this.props.size}}>
            {this.props.data["w"]} <br></br>
{this.props.active &&<ProgressBar 
                now={this.props.data["s"]*10}
                style={{marginTop: "1rem"}}/>}
            </div>


            </Card>
        );
    }
}

class FutureVocab extends React.Component {
    
    render () {
        
        var vocabCards = [];
        const keys = Object.keys(this.props.futureVocabDict);
        for (var i = 0; i < keys.length; i++) {
            
            vocabCards.push(<VocabCard data = {this.props.futureVocabDict[keys[i]]}></VocabCard>);
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

    
            