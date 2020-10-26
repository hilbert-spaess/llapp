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
import {PlusCircle} from 'react-feather';

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
        const {data} = this.props.location;
        console.log(data);
        return (
            <FreeBarWrapped WrappedComponent={LoadingVocabContainer} data={data}/>
        );
    }
}

export const LoadingVocabContainer = (props) => {
    
     const {login, getAccessTokenWithPopup } = useAuth0();
     const opts = {audience: APIHOST};
     const {error, loading, data, refresh} = useApi(APIHOST + '/api/loadvocab', {}, opts);
     const getTokenAndTryAgain = async () => {
        await getAccessTokenWithPopup(opts);
        refresh()
  };
    console.log(props.data);
    if (props.data !== undefined) {
        return <MyVocabContainerSubmit
                data={props.data.vocab_data}/>;
    }
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
         <MyVocabContainerSubmit
        data={data}/>
        );
}   

class MyVocabContainerSubmit extends React.Component {
    
    state = {payload: null,
             type: "null"}
    
    handleSubmit = (vocab) => {
        
        this.setState({payload: vocab,
                       type: "submit"});
        
    }
    
    handleWipe = () => {
        
        this.setState({payload: null, type: "null"});
        
    }
    
    confirmSubmit = (data) => {
        
        this.setState({payload: data, type: "confirm"});
        
    }
    
    render () {
        
        return (
            
            <MyVocabContainerLogging
            payload={this.state.payload}
            type={this.state.type}
            data={this.props.data}
            handleSubmit={this.handleSubmit}
            handleWipe={this.handleWipe}
            confirmSubmit={this.confirmSubmit}/>
    );
    }
}

const MyVocabContainerLogging = (props) => {
    
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
    const {error, loading, data, refresh} = useApi(APIHOST + '/api/newvocabword', payload, opts);
    
    const handleSubmit = async (vocab) => {
        props.handleSubmit(vocab);
        console.log("WOOOOOOOW");
        console.log("WOOOOOOOW");
        refresh();
    }
    
    const wipeSubmit = async () => {
        props.handleWipe();
        console.log("WOOOOOOOW");
        console.log("WOOOOOOOW");
        refresh();
    }
    
    const confirmSubmit = async (data) => {
        props.confirmSubmit(data);
        refresh();
    }
    
    return (
        <MyVocabContainer1
        data={props.data}
        handleSubmit={handleSubmit}
        submitdata={data}
        wipeSubmitData={wipeSubmit}
        confirmSubmit={confirmSubmit}/>
            );
}
    

class MyVocabContainer1 extends React.Component {
    
    state = {
        showDialog: false,
        showAddNew: false,
        detailId: null,
        detailActive: null,
        vocab: this.props.data.vocab
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
    
    addVocab = () => {
        
        this.setState({showAddNew: true});
        console.log("Add vocab you dumbo");
        
    }
    
    hideShowNew = () => {
        this.setState({showAddNew: false});
        this.props.wipeSubmitData();
    }
    
    handleNewVocabSubmit = (vocab) => {
        console.log(vocab);
        this.props.handleSubmit(vocab);
    }
    
    confirmSubmit = (data) => {
        
        this.props.confirmSubmit(data);
        this.setState({showAddNew: false});
        
        var newvocab = this.state.vocab;
        newvocab.push({"w": data[0], "l": this.props.data.maxlevel});
        this.setState({vocab: newvocab});
        
    }
    
    render () {
        
        var words = [];
        
        for (var i = 0; i <this.state.vocab.length; i++) {
            
            words.push(this.state.vocab[i]["w"]);
                       
        }
        
        var levels = {};
        
        var levelgrids = [];
        
        for (var i = 0; i < this.state.vocab.length; i++ ) {
            
            var l = this.state.vocab[i]["l"];
            if (levels[l.toString()] === undefined) {
                levels[l.toString()] = [];
            }
            levels[l.toString()].push(this.state.vocab[i]);
            
        }
        
        var levelkeys = Object.keys(levels);
        
        for (var i =0; i<levelkeys.length; i++) {
            
            levelgrids.push(<div style={{marginTop: "1em", marginBottom: "5em"}}>
                            <VocabGrid 
                            VocabDict={levels[levelkeys[i]]}
                            thislevel = {levelkeys[i]}
                            showDetail = {this.props.showDetail} userlevel = {this.props.data.level}
                            size="2em"/></div>);
        }
        
        return (
            <div>
            <div style={{marginTop: "1em", fontSize: "50px", textAlign: "center"}}>
 <PlusCircle size={50} onClick={this.addVocab} style={{cursor: "pointer", marginRight: "3em", color: "green"}}/>    My Vocab <span style={{color: "white"}}> <PlusCircle size= {50} style={{marginLeft: "3em"}}/> </span>
            </div>
            <Modal centered show={this.state.showDialog} onHide={this.onHide}>
            {this.state.detailActive && this.props.data.active[this.state.detailId]['w']}
    </Modal>
            <Modal centered show={this.state.showAddNew} onHide={this.hideShowNew}>
                <FindNew
                 submitdata={this.props.submitdata}
                 newchoices={this.props.data.choices}
                 handleSubmit={this.handleNewVocabSubmit}
                 words={words}
                 handleHide={this.hideShowNew}
                 wipeSubmit={this.props.wipeSubmitData}
                 confirmSubmit={this.confirmSubmit}/>
                </Modal>
{levelgrids}
<div style={{marginBottom: "3em"}}/>
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
    <Container fluid="xl">
    <Row style={{justifyContent: "center"}}
     >
         <Col>
<div style={{textAlign: "left", fontSize: "30px"}}>Level {this.props.thislevel} </div></Col></Row>
 <Row 
     style={{justifyContent: "space-evenly left"}}>
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
        
        if (this.props.data['s'] < 5) {
            var colour = "lightgreen";
            var variant = "success";
        } else if (this.props.data['s'] < 8) {
            var colour = "lightblue";
            var variant = "";
        } else {
            var colour = "white";
            var variant = "success";
        }
        
        if (this.props.active) {
            
            return (

                     <div>
                <Modal centered show={this.state.showDialog} onHide={this.onHide}>
            <VocabDetail
                data={this.props.data}
                active={this.props.active}
                colour={colour}
                variant={variant}/>
                </Modal>
                <Card
                onClick={this.handleClick}
                className="myvocabcard"
                style={{height: "5rem", width: "15rem", marginRight: "1rem", marginLeft: "1rem", marginTop: "1rem", backgroundColor: colour}}>
                <div className="cardHeader"
                style={{textAlign: "center",
                      padding: "1rem",
                      fontSize: this.props.size}}>
                {this.props.data["w"]}
                </div>
</Card>
<div style={{width: "15rem", marginRight: "1rem", marginLeft: "1rem"}}>
<StreakBar streak={this.props.data["s"]} variant={variant}/></div>
</div>
            );
    }  else {
        
        return (
            
           <div>
                <Modal centered show={this.state.showDialog} onHide={this.onHide}>
            <VocabDetail
                data={this.props.data}
                active={this.props.active}
                colour={colour}/>
                </Modal>
                <Card
                onClick={this.handleClick}
                className="myvocabcard"
                style={{height: "5rem", width: "15rem", marginRight: "1rem", marginLeft: "1rem", marginTop: "1rem", backgroundColor: "lightgrey"}}>

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

export class StreakBar extends React.Component {
    
    render () {
        
        var pips = [];
        
        if (this.props.streak < 5) {
            
            var now = (this.props.streak)*100/4;
        
            for (var i = 0; i < (this.props.streak % 5); i++) {
                console.log("Hi1");
                pips.push(<div className="pip pip-green"/>);
            }

            for (var i = 0; i < (4 - (this.props.streak % 5)); i++) {
                console.log("Hi2");
                pips.push(<div className="pip pip-green-hollow"/>);
            }
        } else if (this.props.streak < 9) {
            
            var now = (this.props.streak % 4) * 100/4;
            
            for (var i = 0; i < (this.props.streak % 4); i++) {
                console.log("Hi1");
                pips.push(<div className="pip pip-blue"/>);
            }

            for (var i = 0; i < (4 - (this.props.streak % 4)); i++) {
                console.log("Hi2");
                pips.push(<div className="pip pip-blue-hollow"/>);
            }
        }
        console.log(now);
        return (
            <div style={{marginBotttom: "0.5em"}}>
            <ProgressBar now={now} variant =  {this.props.variant} style={{height: "8px"}}/>
            </div>
        );
    }
}

export class StreakShow extends React.Component {
    
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
            <div style={{marginTop: "0.5em"}}>
            {pips}
            </div>
        );

    }
}

class VocabDetail extends React.Component {

    render () {

	return (
        <div>
        <div style={{height: "5em", backgroundColor: this.props.colour}}>
	    <div className="vocabdisplay">
		    {this.props.data["w"]}
	    </div>
{this.props.active && <StreakBar streak={this.props.data['s']} variant={this.props.variant}/>}
        </div>
        <div className="chinesedef">
            {"chinesedef" in this.props.data && <div>{this.props.data["chinesedef"]}</div>}
        </div>
        <div className="chinesedef" style={{marginTop: "1em"}}>
            {"d" in this.props.data && this.props.data["d"]}
        </div>
        <div style={{textAlign: "center", fontSize: "2em", marginTop: "1em"}}>
            {this.props.active && <StreakShow 
                streak={this.props.data['s']}/>}
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
                  
        

class FindNew extends React.Component {
    
    state = {warning: "",
             inputting: true,
             loading: false}
    
    handleChange = (event) => {
        
        if (this.state.warning != "" || ((this.props.submitdata != null) && (this.props.submitdata["state"] == "not_in_dictionary"))) {
            
            this.setState({warning: ""});
            this.props.wipeSubmit();
            this.setState({inputting: true});
            
        }
        
        if (this.state.inputting == true) {
        
            event.preventDefault();
            this.setState({value: event.target.value});
        }
    }
    
    handleSubmit = (event) => {
        
        event.preventDefault();
        
        if (this.state.inputting == true) {
            
            console.log(this.props.words);
            
            if (this.props.words.includes(this.state.value)) {
                
                this.setState({warning: "Already in vocab!"});
                
            }
            
            else {
        
                this.setState({loading: true,
                               inputting: false});
                console.log("Word submit");
                this.props.handleSubmit(this.state.value);
            }
        }
    }
    
    
    render () {
        
        console.log("SUBMIT DATA");
        if ((this.props.submitdata != null) && (this.props.submitdata["state"] == "in_dictionary") && (this.props.submitdata["data"][0][0] == this.state.value)) {
            var choosing = true;
            console.log("CHOOSINGTRUE");
        } else {
            var choosing = false;
            console.log("CHOOSINGFALSE");
        }
        
        if ((this.props.submitdata != null) && (this.props.submitdata["state"] == "not_in_dictionary") && (this.props.submitdata["data"] == this.state.value)) {
            
            console.log("CHANGING WARNING");
            
            var warning = "Not in dictionary.";
            
            
        } else {
            
            var warning = "";
            
        }
        
        return (
            
            <Card className="findnewcard">
            <div style={{marginTop: "0.5em"}}>
            {!choosing && "Add a new word"}
{choosing && "Confirm new word:"}
            </div>
           
            <div style={{color: "red", marginTop: "0.5em"}}>{this.state.warning}{warning}</div>
            <div>{!choosing && <NewInput 
                              handleSubmit={this.handleSubmit}
                              handleChange={this.handleChange}
                              value={this.state.value}/>}</div>
            <div>{choosing && <Choose data={this.props.submitdata["data"]} 
                                      handleCancel={this.props.handleHide}
                                      confirmSubmit={this.props.confirmSubmit}/>}</div>
             
            </Card>
            
        );
    }
}

class NewInput extends React.Component {
    
    render () {
        
        return (
            <>
             <form className="commentForm" onSubmit={this.props.handleSubmit}>
                <input type="text" style={{fontSize: "2em",  border: "none", outline: "none", borderBottom: "1px dashed black", textAlign: "center", width: "80%"}} value={this.props.value} onChange={this.props.handleChange}/>
                    </form>
            <div style={{textAlign: "center"}}>
            <button className="newvocabsubmit" onClick={this.props.handleSubmit} style={{width: "50%"}}>Add word</button>
            </div>
            </>
        );
    }
}
        
class Choose extends React.Component {
    
    render () {
        
        var options = []
        
        for (var i = 0; i < this.props.data.length; i++ ) {
            console.log(i);
            options.push(<Option confirmSubmit={this.props.confirmSubmit} data={this.props.data[i]}/>);
    
        }
    
        console.log(options);
        
        return (
            <>
            <div>{options}</div>
            <button className="cancelbutton" onClick={this.props.handleCancel} style={{width: "30%", marginBottom: "1em"}}>Cancel</button>
            </>
        );
    }
}

class Option extends React.Component {
    
    handleClick = () => {
        
        this.props.confirmSubmit(this.props.data);
        
    }
    
    render () {
        
        console.log(this.props.data);
        
        return (
            <Card className="newvocaboptioncard" onClick = {this.handleClick} style={{cursor: "pointer", borderColor: "lightgrey", marginBottom: "1em", marginLeft: "10%", marginRight: "10%"}}>
            
            <div> <span style={{fontSize: "30px", marginRight: "1em"}}>{this.props.data[0] + "       "}</span><span style={{fontSize: "20px", color: "grey"}}> {this.props.data[2]}</span></div>

            </Card>

        );
    }
}
            
            
            



    
            