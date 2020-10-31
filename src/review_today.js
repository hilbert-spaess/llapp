import React from 'react';
import ReactDOM from 'react-dom';
import {useLocation, Link} from 'react-router-dom';
import {Card, Button, Row, Col, Container, Modal, ProgressBar} from 'react-bootstrap';
import {InteractionCard} from './InteractionCard.js';
import {getChunk, firstChunk, getData, JSONconvert} from './client.js';
import {FreeBarWrapped, FreeBarWrapped2} from './sidebar.js';
import {Text} from 'react-native';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';
import {Tutorial} from './tutorial.js';
import {CheckCircle, Type, AlignLeft, Eye} from 'react-feather';
import {LearningContainer} from './LearningContainer.js'

export class ReviewToday extends React.Component {
    
    render () {
        return (
            <FreeBarWrapped WrappedComponent={TodayProgressData}/>
            );
    }
}

const TodayProgressData = (props) => {
    
    const {login, getAccessTokenWithPopup } = useAuth0();
    const opts = {audience: APIHOST, 
                  fetchOptions: {method: 'post',
                                 body: {},
                                 headers: {'Access-Control-Allow-Credentials': 'true',
                                           'Access-Control-Allow-Origin': '*',
                                           'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                          'Access-Control-Request-Method': 'POST'}}};
    const {error, loading, data, refresh} = useApi(APIHOST + '/api/todayprogress', {}, opts);

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
        <TodayProgressContainer
            data={data}/>
    );
}

class TodayProgressContainer extends React.Component {
    
    state = {vocab: false}
    
    handleSummary = () => {
        
        console.log("no hemlo");
        this.setState({vocab: true});
        
    }
    
    render () {
        
        if (this.state.vocab) {
            
            return <Redirect to="/vocab"/>
                
        }
        
        console.log(this.props.data);
        
        var chunks = [];
        
        for (var i = 0; i < this.props.data["todaychunks"].length; i++) {
            
            chunks.push(<ReviewChunk
                          data={this.props.data["todaychunks"][i]}/>);
            
        }
        
        return (
    <div style={{marginTop: "20vh", paddingLeft: "5%", paddingRight: "5%", paddingBottom: "20em", marginBottom: "3em"}}>
            <div className="maintext" style={{textAlign: "center", fontSize: "40px", marginTop: "1em"}}>Today's work</div>
        <VocabGrid style={{fontSize: "20px", marginTop: "5em"}} words={this.props.data["words"]}/>
        <div style={{textAlign: "center"}}>
        <button style={{borderColor: "green", padding: "15px", color: "green", borderRadius: "30px", marginTop: "2em", backgroundColor: "white"}} onClick={this.handleSummary}>Go to My Vocab</button>
        </div>
            </div>

        );
    }
}

class ReviewChunk extends React.Component {
    
     render () {
        
        var words = []
        var punct = [".",",",";","!","?",":", "'s", "’s", "n't", "n’t"];
         
        console.log(punct.includes("n't"));
            
        
        var sentencearray = this.props.data[0].split("#");
        var loc = this.props.data[3];
        var wd = this.props.data[4];
        console.log(sentencearray);
        console.log(loc);


        for (var i =0; i < sentencearray.length; i++) {
            if ((punct.includes(sentencearray[i]))) {
                var spc = "";
            } else {
                var spc = " ";
            }
            console.log(sentencearray[i]);
            console.log(sentencearray[i] == "n't");
            console.log(spc == "");
            if (i == loc) {
                words.push(<Text style={{color: "green",  overflowWrap: "normal"}}>{spc + sentencearray[i]}</Text>);
            } else {
                words.push(<Text style={{ overflowWrap: "normal"}}>{spc + sentencearray[i]}</Text>);
            }
        };

        if (words.length > 0) {
            return (
                <div style={{marginTop: "1em", marginBottom: "1em", border: "1px solid lightgrey", borderRadius: "50px", padding: "1em"}}>
                <div style={{fontSize: "35px"}}>{wd}</div>
                <Text style={{fontSize: "25px", lineHeight: "2em", textAlign: "center",fontFamily: "roboto", wordBreak: "keep-all", display: "inline-wrap"}}>

                {words}
                </Text>
                </div>
            );
        }
        
        else {
            return (
                <div></div>
                );
        }
    }
}

class VocabGrid extends React.Component {
    
    render () {
        
        var vocabCards = [];
        
        for (var i = 0; i <this.props.words.length; i++) {
            
            vocabCards.push(<VocabCard
                            word={this.props.words[i]["w"]}
                            streak={this.props.words[i]["s"]}/>);
        }
        
        return (
            <>
<Row style={{justifyContent:"center", paddingBottom: "3em"}}>
            {vocabCards}
</Row>
</>
        );
    }
}

class VocabCard extends React.Component {
    
    render () {
    
         if (this.props.streak < 4) {
                var colour = "lightgreen";
            } else if (this.props.streak < 8) {
                var colour = "lightblue";
            } else {
                var colour = "white";
            }
        
        return (
            
            <div>
                <Card
                style={{height: "5rem", width: "15rem", marginRight: "1rem", marginLeft: "1rem", marginTop: "3rem", borderColor: colour}}>

                <div className="cardHeader"
                style={{textAlign: "center",
                       marginTop: "1rem",
                       fontSize: "2em"}}>
                {this.props.word} <br></br>
                <StreakShow streak={this.props.streak}/>
                </div>
            </Card>
            </div>
        
        );
    }
}


class StreakShow extends React.Component {
    
    render () {
        
        var pips = []
        
        if (this.props.streak < 5) {
        
            for (var i = 0; i < (this.props.streak % 5); i++) {
                console.log("Hi1");
                pips.push(<div className="pip pip-green"/>);
            }

            for (var i = 0; i < (4 - (this.props.streak % 5)); i++) {
                console.log("Hi2");
                pips.push(<div className="pip pip-green-hollow"/>);
            }
        } else if (this.props.streak < 9) {
            
            for (var i = 0; i < (this.props.streak % 4); i++) {
                console.log("Hi1");
                pips.push(<div className="pip pip-blue"/>);
            }

            for (var i = 0; i < (4 - (this.props.streak % 4)); i++) {
                console.log("Hi2");
                pips.push(<div className="pip pip-blue-hollow"/>);
            }
        }

        return (
            <div style={{marginTop: "0.1em"}}>
            {pips}
            </div>
        );

    }
}      

        
        
