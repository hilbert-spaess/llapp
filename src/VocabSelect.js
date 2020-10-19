import React from 'react';
import {useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {useApi} from './use-api.js';
import {APIHOST} from './api_config.js';
import {Card, Button, Row, Col, Container, Modal, ProgressBar} from 'react-bootstrap';
import {BarWrapped} from './sidebar.js';

export class VocabSelectContainer extends React.Component {
    
    state = {floatingWords: [],
             chosen: Array(this.props.data.course_vocab.length).fill(0),
             done: 0}
    
    handleVocabClick = (id) => {
        
        if (this.state.floatingWords.length < 5) {
            
            var newfloatingwords = this.state.floatingWords;
            newfloatingwords.push([id, this.props.data.course_vocab[id]]);
            this.setState({floatingWords: newfloatingwords});

            var newchosen = this.state.chosen;
            newchosen[id] = 1;
            this.setState({chosen: newchosen});
        }
            
    }
    
    handleDeleteClick = (id) => {
        
        if (id < this.state.floatingWords.length) {
        
            var newwords = this.state.floatingWords.slice(0, id).concat(this.state.floatingWords.slice(id+1));

            var chosenid = this.state.floatingWords[id][0];

            this.setState({floatingWords: newwords});

            var newchosen = this.state.chosen;
            newchosen[chosenid] = 0;
            this.setState({chosen: newchosen});
            
        }

    }
        
    
    handleVocabSumit = (vocab) => {
        
         if (this.state.floatingWords.length < 5) {
             console.log("bemlo");
             
            
            var newfloatingwords = this.state.floatingWords;
            newfloatingwords.push([0,vocab]);
            console.log(newfloatingwords);
            this.setState({floatingWords: newfloatingwords});
            
        }
    }
    
    submitClick = () => {
        
        this.setState({done: 1});
        
    }
    
    render () {
        
        if (this.state.done==1) {
            
            return <Done
                    words={this.state.floatingWords}
                    course={this.props.data.course}/>;
            
        }
        
        return (
            
            <>
            
            <div className="maintext" style={{textAlign:"center"}}>Help us find some words at your level.</div>

            <FloatingWords
            words= {this.state.floatingWords}
            handleClick = {this.handleDeleteClick}
            />
            
            <UserInputContainer
            handleSubmit={this.handleVocabSumit}
            done={(this.state.floatingWords.length >= 5)}
            submitClick = {this.submitClick}/>
  <div>          
{(this.state.floatingWords.length < 5) && <VocabChoiceContainer
            floatingWords={this.state.floatingWords}
            course_vocab={this.props.data.course_vocab}
            handleClick={this.handleVocabClick}
            chosen={this.state.chosen}/>}</div>
                
                <div style={{marginBottom: "3em"}}/>

            </>

        );
    }
}

class FloatingWords extends React.Component {
        
    
    render () {
        
        var vocab_choice = [];
        var l = this.props.words.length;
        
        for (var i= 0 ; i < 5; i++) {
            
            if (i >= l) {
                var word = "";
                var color="white";
            } else {
                var word=this.props.words[i][1];
                var color="#ccffcc";
            }
            
            vocab_choice.push(<FloatingVocabCard
                              style={{backgroundColor: color}}
                              id={i}
                              word={word}
                              handleClick={this.props.handleClick}/>);
        }
        
        
        return (
            
            <div>
            <Container>
        <Row 
         style={{justifyContent: "center"}}>
                {vocab_choice}
    </Row>
            </Container>
            </div>
        
        ); 
    }
}

            

class UserInputContainer extends React.Component {
    
    state = {value: ""}
    
    handleChange = (event) => {
        event.preventDefault();
        this.setState({value: event.target.value});
    }
    
    handleSubmit = (event) => {
        event.preventDefault();
        console.log("hemlo");
        if (this.state.value != "") {
            this.props.handleSubmit(this.state.value);
            this.setState({value: ""});
        }
    }
    
    render () {
        
        if (this.props.done) {
            
            return (
                <div style={{textAlign: "center", marginTop: "3em"}}>
                <button onClick={this.props.submitClick} className="selectdonebutton">Generate Course</button>
                </div>
            );
            
        } else {
        
            return (

                <div className="newuserinputcontainer" style={{marginBottom: "0.5em"}}>
                Tell us some words at your target level:<br></br>

                <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" style={{fontSize: "2em",  border: "none", outline: "none", borderBottom: "1px dashed black", textAlign: "center"}} className="newuserinput" value={this.state.value} onChange={this.handleChange}/>
                    </form>

                </div>

            );
        }
    }
}

class VocabChoiceContainer extends React.Component {
    
    state = {chosen: Array(this.props.course_vocab.length).fill(0)}
    
    render () {
        
        var vocab_choice = [];
        
        for (var i= 0 ; i < this.props.course_vocab.length; i++) {
            
            if (this.props.chosen[i] == 0) {
            
            vocab_choice.push(<VocabCard
                              id={i}
                              word={this.props.course_vocab[i]}
                              handleClick={this.props.handleClick}/>);
            }
        }
        
        return (
            <div className="vocabchoicecontainer">
             Or choose from our dictionary:
            <Container>
        <Row 
         style={{justifyContent: "center"}}>
                {vocab_choice}
    </Row>
            </Container>
            </div>
        );
    }
}

class VocabCard extends React.Component {
    
    state = {clicked: false}
    
    handleClick = () => {
        
        this.props.handleClick(this.props.id);
        
    }
    
    render () {
            
            return (

                <div>
                <Card
                onClick={this.handleClick}
                className="myvocabcard"
                style={{height: "10rem", width: "15rem", marginRight: "1rem", marginLeft: "1rem", marginTop: "1rem"}}>

                <div className="cardHeader"
                style={{textAlign: "center",
                      padding: "1rem",
                      fontSize: "2em"}}>
                {this.props.word}
                </div>
        </Card>
        </div>
        );
    }
}

class FloatingVocabCard extends React.Component {
    
    handleClick = () => {
        
        console.log("hemlo");
        this.props.handleClick(this.props.id);
        
    }
    
    render () {
        
            console.log(this.props.word=="");
        
            if ((this.props.word) == "") {
                
                var name = "floatingemptycard";
            
            } else {
                
                var name = "floatingvocabcard";
                
            }
              
            
            return (

                <div>
                <Card
                className={name}
                style={{height: "10rem", width: "15rem", marginRight: "1rem", marginLeft: "1rem", marginTop: "1rem", position: "relative"}}>
                    <div>{this.props.word!="" && <Cross onClick={this.handleClick}/>}</div>
                <div className="floatingcardheader"
                style={{textAlign: "center",
                       marginTop: "3rem",
                      fontSize: "2em"}}>
                {this.props.word}
                </div>
        </Card>
        </div>
        );
    }
}

class Cross extends React.Component {
    
    render () {
        
      return (

          <button onClick={this.props.onClick} className="crossbackground">
              <div className="cross1">
                <div className="cross2"></div></div>
          </button>
      );
    }
}

const Done = (props) => {
    
     const {login, getAccessTokenWithPopup } = useAuth0();
     const opts = {audience: APIHOST};
     const {error, loading, data, refresh} = useApi(APIHOST + '/api/coursevocabsubmit', {words: props.words, course: props.course}, opts);
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
        
        <Redirect to="/home"/>
        
    );
}




            
            