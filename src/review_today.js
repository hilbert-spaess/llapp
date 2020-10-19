import React from 'react';
import ReactDOM from 'react-dom';
import {useLocation, Link} from 'react-router-dom';
import {Card, Button, Row, Col, Container, Modal, ProgressBar} from 'react-bootstrap';
import {InteractionCard} from './InteractionCard.js';
import {getChunk, firstChunk, getData, JSONconvert} from './client.js';
import {FreeBarWrapped} from './sidebar.js';
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
    
    render () {
        
        console.log(this.props.data);
        
        var chunks = [];
        
        for (var i = 0; i < this.props.data["todaychunks"].length; i++) {
            
            chunks.push(<ReviewChunk
                          data={this.props.data["todaychunks"][i]}/>);
            
        }
        
        return (
    <div style={{paddingLeft: "10%", paddingRight: "10%"}}>
            <div className="maintext" style={{textAlign: "center", fontSize: "40px", marginTop: "1em"}}>Today's work</div>
        <VocabGrid style={{fontSize: "20px"}} words={this.props.data["words"]}/>
            {chunks}
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
                words.push(<Text style={{color: "green"}}>{spc + sentencearray[i]}</Text>);
            } else {
                words.push(<Text>{spc + sentencearray[i]}</Text>);
            }
        };

        if (words.length > 0) {
            return (
                <div style={{marginTop: "1em", marginBottom: "1em", border: "1px solid lightgrey", borderRadius: "50px", padding: "1em"}}>
                <div style={{fontSize: "35px"}}>{wd}</div>
                <Text style={{fontSize: "25px", lineHeight: "2em", textAlign: "center",fontFamily: "roboto"}}>

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
            <Container justifyContent="center">
<Row style={{justifyContent:"center"}}>
            {vocabCards}
</Row>
           </Container>     
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
                style={{height: "10rem", width: "15rem", marginRight: "1rem", marginLeft: "1rem", marginTop: "1em", borderColor: colour}}>

                <div className="cardHeader"
                style={{textAlign: "center",
                       fontSize: "2em",
                       marginBottom: "1.5em",
                      padding: "2rem"}}>
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

        
        
