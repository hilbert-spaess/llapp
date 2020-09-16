import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Button, Row, Col, Container, CardDeck, ProgressBar, Modal} from 'react-bootstrap';
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
    
    state = {
        showDialog: false
    }
    
    render () {
        return (
            <BarWrapped WrappedComponent={LoadingVocabContainer}/>
        );
    }
}

export const LoadingVocabContainer = () => {
    
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
         <MyVocabContainer1
        data={data}/>
        );
}   

class MyVocabContainer1 extends React.Component {
    
    state = {
        showDialog: false,
        detailId: null,
        detailActive: null
    }
    
    showDetail = (id, active) => {
        
        console.log(id);
        
        this.setState({detailId: id,
                       detailActive: active,
                       showDialog: true
                      })
    }
    
    onHide = () => {
        
        this.setState({showDialog: false})
        
    }
    
    render () {
        
        return (
            <div>
            <Modal centered show={this.state.showDialog} onHide={this.onHide}>
            {this.state.detailActive && this.props.data.active[this.state.detailId]['w']}
    </Modal>
        <div
        style={{textAlign: "center", fontSize: "4rem", marginTop: "3rem"}}>
                Active Vocab <br></br>
</div>
                <VocabGrid
                VocabDict = {this.props.data.active}
                showDetail={this.showDetail}
                size="2em"
                active={true}/>
                <br></br>
<div style={{textAlign: "center", fontSize: "4rem", marginTop: "3rem"}}>
                Future Vocab: <br></br>
</div>
                <VocabGrid
                VocabDict = {this.props.data.future}
                size="2em"
                active={false}/>
                    </div>
    );

    }
}

class VocabGrid extends React.Component {
    
    state = {
        keys: null
    }
    
    componentDidMount = () => {
        var keys = Object.keys(this.props.VocabDict);
        shuffle(keys);
        this.state.keys = keys
    }
        
    
    render () {
        
        var vocabCards = [];
         var keys = Object.keys(this.props.VocabDict);
        shuffle(keys);
        for (var i = 0; i < keys.length; i++) {
            
            vocabCards.push(<VocabCard
                            id = {keys[i]}
                            data = {this.props.VocabDict[keys[i]]}
                            size={this.props.size}
                            active={this.props.active}
                            showDetail={this.props.showDetail}
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
    
    state = {
        
        showDialog: false
    }
    
    onHide = () => {
        this.setState({showDialog: false});
    }
     
    
    handleClick = () => {
        
        this.setState({showDialog: true});
        
    }
    
    render () {
        
        return (
            
            <div>
            <Modal centered show={this.state.showDialog} onHide={this.onHide}>
    {this.props.data['w']}
            </Modal>
            <Card
            onClick={this.handleClick}
            className="myvocabcard"
            style={{height: "10rem", width: "15rem", marginRight: "1rem", marginLeft: "1rem", marginTop: "1rem"}}>
            
            <div className="cardHeader"
            style={{textAlign: "center",
                  padding: "1rem",
                  fontSize: this.props.size}}>
            {this.props.data["w"]} <br></br>
{this.props.active &&<ProgressBar 
                now={this.props.data["s"]*10}
                variant="success"
                style={{marginTop: "1rem"}}/>}
            </div>


            </Card>
</div>
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

    
            