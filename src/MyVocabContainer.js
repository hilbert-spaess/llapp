import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Button, Row, Col, Container, CardDeck} from 'react-bootstrap';
import {loadVocab} from './client.js';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {APIHOST} from './api_config.js';
import {Sidebar, TopBar} from './sidebar.js';

export class MyVocabContainer extends React.Component {
    
    render () {
        return (
        <Container fluid>
                <Row>
                <TopBar/>
                </Row>
                    <Row className="mainrow">
                <Col xs="auto" className="sidenav">
                </Col>
                    <Col>
                    <MyVocabContainer1/>
                    </Col>
                    </Row>
                    </Container>
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
                Active Vocab: <br></br>
                <VocabGrid
                VocabDict = {data.active}
                size="3em"/>
                <br></br>
                Future Vocab: <br></br>
                <VocabGrid
                VocabDict = {data.future}
                size="2em"/>
                    </div>
        );
}        

class VocabGrid extends React.Component {
    
    render () {
        
        var vocabCards = [];
        const keys = Object.keys(this.props.VocabDict);
        for (var i = 0; i < keys.length; i++) {
            
            vocabCards.push(<VocabCard 
                            data = {this.props.VocabDict[keys[i]]}
                            size={this.props.size}
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
            </div>
    
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

    
            