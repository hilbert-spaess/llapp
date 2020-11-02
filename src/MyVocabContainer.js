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
import {PlusCircle, BookOpen, Edit3, Edit, ChevronLeft, ChevronRight} from 'react-feather';

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
    
    handleDelete = (data) => {
        
        this.setState({payload: data, type: "delete"});
        
    }
    
    handleSubmitChoice = (selected, choices, level, vocab, insertlength) => {
        
        this.setState({payload: {s: selected, c: [...choices], l: level, i: insertlength, v:vocab}, type: "submit_choice"});
        
    }
    
    render () {
        
        return (
            
            <MyVocabContainerLogging
            payload={this.state.payload}
            type={this.state.type}
            data={this.props.data}
            handleSubmit={this.handleSubmit}
            handleWipe={this.handleWipe}
            confirmSubmit={this.confirmSubmit}
            handleDelete={this.handleDelete}
            handleSubmitChoice={this.handleSubmitChoice}/>
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
    
    const handleDelete = async (data) => {
        props.handleDelete(data);
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
    
    const handleSubmitChoice = async (selected, choices, level, vocab, insertlength) => {
        console.log(choices);
        props.handleSubmitChoice(selected, choices, level, vocab, insertlength);
        refresh();
    }
    
    return (
        <MyVocabContainer1
        data={props.data}
        handleSubmit={handleSubmit}
        handleSubmitChoice={handleSubmitChoice}
        handleDelete = {handleDelete}
        submitdata={data}
        wipeSubmitData={wipeSubmit}
        confirmSubmit={confirmSubmit}/>
            );
}
    

class MyVocabContainer1 extends React.Component {
    
    constructor(props) {
        super(props);
        this.myRefs = [];
        for (var i =0; i < 10; i++) {
            this.myRefs.push(React.createRef());
        }
        this.scrollRef = React.createRef();
    }
    
    state = {
        showDialog: false,
        showAddNew: false,
        levelAddNew: null,
        detailId: null,
        detailActive: null,
        vocab: this.props.data.vocab
    }
    

    executeScroll = (i) => {
        console.log("scrolling nibba");
        console.log(i);
        this.scrollToRef(this.myRefs[i]);
    }
    
    scrollToRef = (ref) => {
        ref.current.scrollIntoView({behavior: 'smooth'})
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
    
    addVocab = (level) => {
        
        this.setState({showAddNew: true, levelAddNew: level});
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
    
    handleDelete = (data) => {
        
        this.props.handleDelete(data);
        var newvocab = this.state.vocab;
        console.log("HERE + DELETIN");
        console.log(data.no);
        newvocab.splice(data.no, 1);
        this.setState({vocab: newvocab});
    }
    
        
    
    confirmSubmit = (data) => {
        
        this.props.confirmSubmit(data);
        this.setState({showAddNew: false});
        
        var newvocab = this.state.vocab;
        newvocab.push({"w": data[0], "l": this.props.data.maxlevel});
        this.setState({vocab: newvocab});
        
    }
    
    handleSubmitChoice = async (choices, selected) => {
        
        this.setState({showAddNew: false});
        console.log(this.state.vocab);
        this.props.handleSubmitChoice(choices, selected, this.state.levelAddNew, this.state.vocab);
        
        var newselected = [...selected];
        
        var newvocab = this.state.vocab;
        
        var level = this.state.levelAddNew;
        
        var levels = [];
        
        for (var i = 0; i < this.state.vocab.length; i++ ) {
            
            var l = this.state.vocab[i]["l"];
            if (levels[l.toString()] === undefined) {
                levels[l.toString()] = [];
            }
            levels[l.toString()].push([this.state.vocab[i], i]);
            
        }
        var levelkeys = Object.keys(levels);
        var levelslength = levelkeys.length;
        
        var overflow = newselected.length;
        
        for (var l = level; l < levelslength + 1; l++) {
            
            var total = levels[l.toString()].length + overflow;
            overflow = Math.max(0, total - 15);
            if (total > 15) {
                for (var z = 0; z < overflow; z++) {
                    console.log(levels[l.toString()].length);
                    console.log(levels[l.toString()]);
                    console.log([levels[l.toString()].length - 1 - z]);
                    console.log(z);
                    console.log(overflow);
                    newvocab[levels[l][levels[l].length - 1 - z].slice(1)]['l'] += 1;
                }
            }
        }
        
        for (var i = 0; i < newselected.length; i++) {
            
            newvocab.unshift({'w': choices[newselected[i]]['w'], 'l': this.state.levelAddNew});
            
        }
        
        this.setState({vocab: newvocab});
        
        this.props.handleSubmitChoice(choices, selected, this.state.levelAddNew, newvocab, newselected.length);
    
        
    }
    
    render () {
        
        console.log(this.scrollTop);
        
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
            levels[l.toString()][levels[l.toString()].length-1]['no'] = i;
            
        }
        
        var levelkeys = Object.keys(levels);
        var levelslength = levelkeys.length;
        
        for (var i =0; i<levelkeys.length; i++) {
            
            if (i==0) {
                var color = "#f1f1f9";
            }
            else if (i==1) {
                var color = "#efeff8";
            }
            else {
                var color = "#ebebf7";
            }
            
            levelgrids.push(<div ref={this.myRefs[i]}>
                            <VocabGrid
                            color={color}
                            VocabDict={levels[levelkeys[i]]}
                            thislevel = {levelkeys[i]}
                            handleDelete={this.handleDelete}
                            handleAddNew={this.addVocab}
                            showDetail = {this.props.showDetail} userlevel = {this.props.data.level}
                            size="2em"/></div>);
        }
        
        var newchoices = [];
        for (var i =0; i<this.props.data.choices.length; i++) {
            if (!(words.includes(this.props.data.choices[i]['w']))) {
                newchoices.push(this.props.data.choices[i]);
            }
        }
        
        
        return (
            <div style={{overflow: "auto"}} onScroll={this.handleScroll}>
            <div style={{paddingTop: "1em", fontSize: "50px", textAlign: "left", letterSpacing: "-1px", fontWeight: "300", paddingLeft: "5%", backgroundColor: "#f1f1f9"}}>   My Vocab 
            </div>
            <Modal size="lg" centered show={this.state.showDialog} onHide={this.onHide}>
            {this.state.detailActive && this.props.data.active[this.state.detailId]['w']}
    </Modal>
            <Modal size="lg" dialogClassName="bigassmodal" centered show={this.state.showAddNew} onHide={this.hideShowNew}>
                <FindNew
                 submitdata={this.props.submitdata}
                 newchoices={newchoices}
                 handleSubmit={this.handleNewVocabSubmit}
                 handleSubmitChoice={this.handleSubmitChoice}
                 words={words}
                 handleHide={this.hideShowNew}
                 wipeSubmit={this.props.wipeSubmitData}
                 confirmSubmit={this.confirmSubmit}/>
                </Modal>
{levelgrids}
                    </div>
    );

    }
}

class CountSummary extends React.Component {
    
    render () {
        
        var greencount = 0;
        var bluecount = 0;
        var pinkcount = 0;
        
        for (var i = 0; i < this.props.vocab.length; i++) {
            
            if (this.props.vocab[i]['s'] < 5) {
                
                greencount = greencount + 1;
                
            } else if (this.props.vocab[i]['s'] < 9) {
                
                bluecount = bluecount + 1;
                
            } else {
                
                pinkcount = pinkcount + 1;
                
            }
        }
                
                
        
        return (
            
            <Row style={{justifyContent: "center", marginTop: "1em"}}>
            <div className="countsummary" style={{backgroundColor: "lightgreen"}}>
                <div style={{paddingLeft: "1em", paddingTop: "0.5em", color: "grey"}}>Novice</div>
                <div className="countcontent">{greencount}</div></div>
            <div className="countsummary" style={{backgroundColor: "lightblue"}}>
                <div style={{paddingLeft: "1em", paddingTop: "0.5em", color: "grey"}}>Proficient</div>
                <div className="countcontent">{bluecount}</div></div>
             <div className="countsummary" style={{backgroundColor: "lightpink"}}>
                 <div style={{paddingLeft: "1em", paddingTop: "0.5em", color: "grey"}}>Expert</div>
                 <div className="countcontent">{pinkcount}</div></div>
            </Row>
            );
    }
}

class LevelFinder extends React.Component {
    
    render () {
        
        var levels = [];
        
        for (var i = 0; i < 10; i++) {
            
            if (i < this.props.userlevel) {
                
                var colour = "lightgreen";
                const j = i;
                levels.push(<LevelCircle no={i} colour={colour} onClick={() => {this.props.onClick(j)}}/>);
                
            } else if (i < this.props.levelslength) {
                var colour = "lightgrey";
                const j = i;
                levels.push(<LevelCircle no={i} colour={colour} onClick={() => {this.props.onClick(j)}}/>);
                }
                
                else {
                
                var colour = "lightgrey";
                var onClick = () => this.props.onClick(this.props.userlevel - 1);
                levels.push(<LevelCircle no={i} colour={colour} onClick={() => {this.props.onClick( this.props.userlevel - 1)}}/>);
                
            }
            
        
            
        }
        
        return (
            
            <div>
             <Container fluid="xl">
             <Row style={{justifyContent: "center", marginTop: "1em"}}>
             {levels}
            </Row>
</Container>
            </div>
            
            );
        
    }
}

class LevelScroller extends React.Component {
    
    render () {
        
        var scrollercircles = [];
        
        for (var i =0; i < this.props.levelno; i++) {
            var line = true;
            if (i == this.props.levelno - 1) {
                line = false;
            }
            
            scrollercircles.push(<ScrollerCircle line={line}/>);
                                 
        }
        
        return (
            
            <div>{scrollercircles}</div>
            
            );
    }
}

class ScrollerCircle extends React.Component {
    
    render () {
        
        return (
            <>
            <div className="scrollercircle"/>
            {this.props.line && <div className="scrollerline"/>}
            </>
            );
    }
}
            
class LevelCircle extends React.Component {
    
    render () {
        
        return (
            <div style={{display: "inline-block", backgroundColor: this.props.colour}} className="levelcircle" onClick={this.props.onClick}>
            <div className="centerno">
            {this.props.no + 1}
            </div></div>
                
       );
    }
}
            
            

class VocabGrid extends React.Component {
    
    state = {
        keys: null,
        edit: false
    }
    
    handleEditClick = () => {
        
        console.log("editing now");
        this.setState({edit: !this.state.edit});
        
    }
    
    handleAddNew = () => {
    
        this.props.handleAddNew(this.props.thislevel);
        
    }
    
    render () {
        
        var vocabCards = [];
        
        if (this.state.edit) {
            vocabCards.push(<div style={{marginTop: "1em", marginBottom: "2em"}}><AddNewCard
                            onClick={this.handleAddNew} color={this.props.color}/></div>);
        }
        
        for (var i = 0; i <this.props.VocabDict.length; i++) {
            
            vocabCards.push(<div style={{marginTop: "1em", marginBottom: "2em"}}><VocabCard
                            id = {i}
                            edit = {this.state.edit}
                            data = {this.props.VocabDict[i]}
                            size={this.props.size}
                            showDetail={this.props.showDetail}
                            active={this.props.VocabDict[i]['l'] <= this.props.userlevel}
                            handleDelete={this.props.handleDelete}
        ></VocabCard></div>);
        }
        
        
    
        return (
    <div style={{paddingLeft: "5%", paddingBottom: "3em", paddingRight: "5%", backgroundColor: this.props.color}}>
            <div style={{paddingTop:"2em"}}/>
            <div>{(this.props.thislevel > this.props.userlevel) && <Edit style={{cursor: "pointer"}} onClick={this.handleEditClick}/>}</div>
 <Row 
     style={{justifyContent: "left"}}>
            {vocabCards}
</Row>
            </div>
                
        );
    }
}

class VocabCard extends React.Component {
    
    state = {
        
        showDialog: false,
        showDeleteConfirm: false
    }
    
    onHide = () => {
        this.setState({showDialog: false});
    }
    
    onDeleteHide = () => {
        this.setState({showDeleteConfirm: false});
    }
     
    
    handleClick = () => {
        if (!this.props.edit) {
            this.setState({showDialog: true});
        }
        
    }
    
    handleDeleteClick = () => {
        console.log("DELETE");
        this.setState({showDeleteConfirm: true});
    }
    
    handleDeleteConfirm = () => {
        console.log("EXTERMINATE");
        this.props.handleDelete({no: this.props.data.no, data: this.props.data});
        this.onDeleteHide();
    }
    
    render () {
        
        console.log(this.props.edit);
        
        if (this.props.data['s'] < 5) {
            var colour = "lightblue";
            var fontcolour = "black";
            var variant = "success";
        } else if (this.props.data['s'] < 8) {
            var colour = "#003366";
            var variant = "";
            var fontcolour = "white";
        } else {
            var colour = "white";
            var variant = "success";
        }
        if (!this.props.active) {
            var bgcolor = "lightgrey";
        } else {
            var bgcolor = "";
        }
        
        if (this.props.data['w'].length > 12) {
            var size = "1.75em";
        } else {
            var size = this.props.size;
        }
        
        return (
            
           <div>
                <Modal size="lg" centered show={this.state.showDialog} onHide={this.onHide}>
            <VocabDetail
                fontcolour={fontcolour}
                data={this.props.data}
                active={this.props.active}
                colour={colour}/>
                </Modal>
                <Modal centered show={this.state.showDeleteConfirm} onHide={this.onDeleteHide}>
                    <DeleteConfirm data={this.props.data} onClick={this.handleDeleteConfirm}/>
                </Modal>
                <Card
                onClick={this.handleClick}
                className="myvocabcard"
                style={{height: "5rem", width: "15rem", marginRight: "1rem", marginLeft: "1rem", marginTop: "1rem", backgroundColor: bgcolor}}>
                    {this.props.edit && <Cross onClick={this.handleDeleteClick}/>}
                <div className="cardHeader"
                style={{textAlign: "center",
                      padding: "1rem",
                      fontSize: size}}>
                {this.props.data["w"]} <br></br> 
                </div>
<div style={{marginBottom: "1em"}}>
    {this.props.active && <StreakShow style={{marginBottom: "1em"}} streak={this.props.data['s']} variant={variant}/>}
    </div>
</Card>
</div>
);
}
}

class AddNewCard extends React.Component {
    
    render () {
        
        return (
            <Card style={{height: "5em", width: "15rem", marginRight: "1rem", marginLeft: "1rem", marginTop: "1rem", border: "0", backgroundColor: this.props.color}}><div style={{textAlign: "center", marginTop: "1em"}}><PlusCircle size={50} style={{cursor: "pointer"}} onClick={this.props.onClick}/></div></Card>
            );
    }
}

class Cross extends React.Component {
    
    render () {
        
        console.log("render CROSS-SAN");
        
      return (

          <button onClick={this.props.onClick} className="myvocabcrossbackground">
              <div className="cross1">
                <div className="cross2"></div></div>
          </button>
      );
    }
}

class DeleteConfirm extends React.Component {
    
    render () {
        
        return (
            <Card style={{borderRadius: "10px"}}>
            <div style={{height: "2em", backgroundColor: "red", color: "white", textAlign: "center", fontSize: "20px"}}>
            Confirm Delete
            </div>
            <div className="vocabdisplay">
            {this.props.data['w']}
            </div>
            <div style={{justifyContent: "center", textAlign: "center"}}>
            <button className="deleteconfirmbutton" onClick={this.props.onClick} style={{width: "50%"}}>Delete</button>
            </div>
            </Card>
        );
        
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
        
        var pips = [];
        
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
            <div style={{textAlign: "center", marginLeft: "1rem", marginRight: "1rem", marginBottom: "3em"}}>
            {pips}
            </div>
        );

    }
}

class VocabDetail extends React.Component {

    render () {

	return (
        <div>
        <div style={{height: "5em", backgroundColor: this.props.colour, color: this.props.fontcolour}}>
	    <div className="vocabdisplay">
		    {this.props.data["w"]}
	    </div>
<div style={{textAlign: "center", marginTop: "0.5em"}}>
{this.props.active && <StreakShow streak={this.props.data['s']} variant={this.props.variant}/>}
</div>
        </div>
        <BookOpen style={{marginRight: "1em", marginTop: "3em", marginLeft: "2em", display: "inline-block"}}/>
        <div className="chinesedef" style={{marginLeft: "2em", paddingLeft: "1em", paddingRight: "1em"}}> 
            {"d" in this.props.data && this.props.data["d"]}
        </div>
        <hr></hr>
         <Edit3 style={{display: "inline-block", marginLeft: "2em"}}/> 
        <div className="chinesedef" style={{marginBottom: "0.5em", color: "grey", paddingLeft: "1em", paddingRight: "1em", marginLeft: "2em"}}>
          {("samples" in this.props.data) && <SampleSentences samples={this.props.data["samples"]}/>}
    </div>
		</div>
	); 
    
    }
}

class SampleSentences extends React.Component {
    
    render () {
        
        var words = [];
        
        var punct = [".",",",";","!","?",":", "'s", "n't", "n’t", "’s"];
        
        if (this.props.samples.length > 0) {
        
            
        
            var sentencearray = this.props.samples[0][0].split("#");
            var loc = this.props.samples[0][1];
            console.log(sentencearray);
            console.log(loc);
            
            for (var i =0; i < sentencearray.length; i++) {
                    if ((punct.includes(sentencearray[i]))) {
                    var spc = "";
                } else {
                    var spc = " ";
                }
                if (i==0) {
                    var spc = "";
                }
                if (i == loc) {
                    words.push(<Text style={{fontWeight: "bold"}}>{spc + sentencearray[i]}</Text>);
                } else {
                    words.push(<Text>{spc + sentencearray[i]}</Text>);
                }
            };
        }
        
        var words2 = []
        
        if (this.props.samples.length > 1) {
            
            
        
            var sentencearray = this.props.samples[1][0].split("#");
            var loc = this.props.samples[1][1];
            console.log(sentencearray);
            console.log(loc);
            
            for (var i =0; i < sentencearray.length; i++) {
                    if ((punct.includes(sentencearray[i]))) {
                    var spc = "";
                } else {
                    var spc = " ";
                }
                if (i==0) {
                    spc = "";
                }
                if (i == loc) {
                    words2.push(<Text style={{fontWeight: "bold"}}>{spc + sentencearray[i]}</Text>);
                } else {
                    words2.push(<Text>{spc + sentencearray[i]}</Text>);
                }
            };
        }

        
        return (
            <div style={{marginBottom: "2em"}}>
            <Text style={{fontSize: "25px", textAlign: "center"}}>
            
            {this.props.samples.length > 0 && words} <hr></hr>
            {this.props.samples.length > 1 && words2}
    </Text>
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
                  
        

class FindNew extends React.Component {
    
    state = {warning: "",
             inputting: true,
             loading: false,
             choices: this.props.newchoices,
             window: 1,
             selected: new Set()}
    
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
    
    handleClickRight = () => {
        
        console.log((1.0 * this.state.choices.length)/9);
        console.log(this.state.window);
        console.log(this.state.choices.length);
        
        if (this.state.window < ((1.0 * this.state.choices.length)/9)) {
            
            this.setState({window: this.state.window + 1});
            
        }
    }
    
    handleClickLeft = () => {
        
        if (this.state.window > 1) {
            
            this.setState({window: this.state.window - 1});
            
        }
        
    }
    
    handleSelect = (id) => {
        
        console.log(id);
        var newselected = this.state.selected;
        if (!(this.state.selected.has(9*(this.state.window-1)+id))) {
            newselected.add(9*(this.state.window-1)+id);
        } else {
            newselected.delete(9*(this.state.window-1)+id);
        }
        this.setState({selected: newselected}); 
    }
    
    handleSubmitChoice = (event) => {
        
        event.preventDefault();
        
        if (this.state.inputting == true) {
            
            console.log(this.state.selected);
            this.props.handleSubmitChoice(this.state.choices, this.state.selected);
            
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
        console.log(this.props.newchoices);
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
            
            <>
            <FindNewGrid
                            handleClick={this.handleSelect}
                            color="white"
                            window={this.state.window}
                            selected={this.state.selected}
                            VocabDict={this.state.choices.slice(9*(this.state.window-1),9*this.state.window)}
                            thislevel = "0"
                            size="2em"/>
    <div style={{textAlign: "center"}}><ChevronLeft style={{cursor: "pointer"}} onClick={this.handleClickLeft} color="green" size={50}/><ChevronRight style={{cursor: "pointer"}} onClick={this.handleClickRight} size={50} color="green"/></div>
            <div style={{textAlign: "center"}}> {!choosing && this.state.selected.size > 0 && <NewSubmitButton onClick={this.handleSubmitChoice} no={this.state.selected.size}/>}</div>
           
            
            
             
            </>
            
        );
    }
}

class NewSubmitButton extends React.Component {
    
    render () {
        
        if (this.props.no == 1) {
           var wd = "word";
        } else {
           var wd = "words";
        }
        
        return (
            
            <button onClick={this.props.onClick} className="newvocabsubmit">Add {this.props.no} new {wd}.</button>
        );
    }
}

class FindNewGrid extends React.Component {
    
    state = {
        keys: null,
        edit: false
    }
    
    handleEditClick = () => {
        
        console.log("editing now");
        this.setState({edit: !this.state.edit});
        
    }
    
    
    render () {
        
        var vocabCards = [];
        
        if (this.state.edit) {
            vocabCards.push(<div style={{marginTop: "1em", marginBottom: "2em"}}><AddNewCard
                            onClick={this.props.handleAddNew} color={this.props.color}/></div>);
        }
        
        for (var i = 0; i <this.props.VocabDict.length; i++) {
            
            if (this.props.selected.has(9*(this.props.window-1)+i)) {
                
                var border = "2px solid red";
                console.log("BORDER BORER");
                
            } else {
                console.log("BRDER NO");
                var border = "";
                
            }
            
            vocabCards.push(<div style={{marginTop: "1em", marginBottom: "2em"}}><FindNewCard
                            id = {i}
                            edit = {this.state.edit}
                            border={border}
                            data = {this.props.VocabDict[i]}
                            size={this.props.size}
                            handleClick={this.props.handleClick}
                            active={this.props.VocabDict[i]['l'] <= this.props.userlevel}
                            handleDelete={this.props.handleDelete}
        /></div>);
        }
        
        
    
        return (
    <div style={{paddingLeft: "5%", paddingBottom: "3em", paddingRight: "5%", backgroundColor: this.props.color}}>
            <div style={{paddingTop:"2em"}}/>
            <div>{(this.props.thislevel > this.props.userlevel) && <Edit style={{cursor: "pointer"}} onClick={this.handleEditClick}/>}</div>
 <Row 
     style={{justifyContent: "center"}}>
            {vocabCards}
</Row>
            </div>
                
        );
    }
}

class FindNewCard extends React.Component {
    
    state = {
        
        showDialog: false,
        showDeleteConfirm: false
    }
    
    handleClick = () => {
        
        this.props.handleClick(this.props.id)
        
    }
    
    render () {
        
        console.log(this.props.edit);
        
        if (this.props.data['s'] < 5) {
            var colour = "lightblue";
            var fontcolour = "black";
            var variant = "success";
        } else if (this.props.data['s'] < 8) {
            var colour = "#003366";
            var variant = "";
            var fontcolour = "white";
        } else {
            var colour = "white";
            var variant = "success";
        }
        if (!this.props.active) {
            var bgcolor = "lightgrey";
        } else {
            var bgcolor = "";
        }
        
        return (
            
           <div>
                <Card
                onClick={this.handleClick}
                className="myvocabcard"
                style={{height: "5rem", width: "15rem", marginRight: "1rem", marginLeft: "1rem", marginTop: "1rem", backgroundColor: bgcolor, border: this.props.border}}>
                    {this.props.edit && <Cross onClick={this.handleDeleteClick}/>}
                <div className="cardHeader"
                style={{textAlign: "center",
                      padding: "1rem",
                      fontSize: this.props.size}}>
                {this.props.data["w"]} <br></br> 
                </div>
<div style={{marginBottom: "1em"}}>
    {this.props.active && <StreakShow style={{marginBottom: "1em"}} streak={this.props.data['s']} variant={variant}/>}
    </div>
</Card>
</div>
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
            
            
            



    
            