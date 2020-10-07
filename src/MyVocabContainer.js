import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Button, Row, Col, Container, CardDeck, ProgressBar, Modal} from 'react-bootstrap';
import {loadVocab} from './client.js';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {APIHOST} from './api_config.js';
import {BarWrapped, FreeBarWrapped} from './sidebar.js';
import {Text} from 'react-native';
import {Redirect} from 'react-router-dom';

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
            <div style={{marginTop: "1em", textAlign: "center", fontSize: "50px"}}>My Vocab</div>
            <Modal centered show={this.state.showDialog} onHide={this.onHide}>
            {this.state.detailActive && this.props.data.active[this.state.detailId]['w']}
    </Modal>
        <div style={{marginTop: "1em"}}>
<VocabGrid
VocabDict={this.props.data.vocab}
showDetail={this.props.showDetail}
userlevel={this.props.data.level}
size="2em"/></div>
                    </div>
    );

    }
}
            

class VocabGrid extends React.Component {
    
    state = {
        keys: null
    }
    
    render () {
        
        var vocabCards = [];
        
        for (var i = 0; i <this.props.VocabDict.length; i++) {
            
            vocabCards.push(<VocabCard
                            id = {i}
                            data = {this.props.VocabDict[i]}
                            size={this.props.size}
                            showDetail={this.props.showDetail}
                            active={this.props.VocabDict[i]['l'] <= this.props.userlevel}
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
        
        if (this.props.active) {
            
            return (

                     <div>
                <Modal centered show={this.state.showDialog} onHide={this.onHide}>
            <VocabDetail
                data={this.props.data}/>
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
    {this.props.active && <ProgressBar 
                    now={this.props.data["s"]*10}
                    variant="success"
                    style={{marginTop: "1rem"}}/>}
                </div>
</Card>
</div>
            );
    }  else {
        
        return (
            
           <div>
                <Modal centered show={this.state.showDialog} onHide={this.onHide}>
            <VocabDetail
                data={this.props.data}/>
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
                </div>
</Card>
</div>
);
    }
    }
}

class VocabDetail extends React.Component {

    render () {

	return (
        <div>
	    <div className="vocabdisplay">
		    {this.props.data["w"]}
	    </div>
        <div className="chinesedef">
            {"chinesedef" in this.props.data && <div>{this.props.data["chinesedef"]}</div>}
        </div>
        <div className="chinesedef">
            {"d" in this.props.data && this.props.data["d"]}
        </div>
        <div className="cardprogress">
            {"s" in this.props.data && <ProgressBar variant="success" now={10*(this.props.data["s"])}/>}
        </div>
        <div className="samplesentences" style={{marginBottom: "2em"}}>
            {("samples" in this.props.data) && <SampleSentences samples={this.props.data["samples"]}/>}
    </div>
		</div>
	); 
    
    }
}

class SampleSentences extends React.Component {
    
    render () {
        
        var words = []
        
        if (this.props.samples.length > 0) {
            
            
        
            var sentencearray = this.props.samples[0][0].split("#");
            var loc = this.props.samples[0][1];
            console.log(sentencearray);
            console.log(loc);
            
            for (var i =0; i < sentencearray.length; i++) {
                if (i == loc) {
                    words.push(<Text style={{fontWeight: "bold"}}>{sentencearray[i]} </Text>);
                } else {
                    words.push(<Text>{sentencearray[i]} </Text>);
                }
            };
        }

        
        return (
            <Text style={{fontSize: "25px", textAlign: "center"}}>
            
            {this.props.samples.length > 0 && words}
    </Text>
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

    
            