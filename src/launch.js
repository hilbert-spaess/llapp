import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import {Stylesheet, css} from 'aphrodite';
import {Card, Container, Row, Col, Nav, Navbar, Form, FormControl, Popover, OverlayTrigger, Overlay, Toast} from 'react-bootstrap';
import {FreeBarWrapped, FreeBarWrappedLaunch} from './sidebar.js';
import {Auth0Provider, useAuth0, withAuthenticationRequired} from '@auth0/auth0-react';
import {BookOpen, Type, FastForward, Info} from 'react-feather';
import {useApi} from './use-api.js';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';
import {Circle} from 'rc-progress';

export class Launch extends React.Component {
    
    render () {
        const {data} = this.props.location;
        console.log(data);
        return (
            <FreeBarWrappedLaunch WrappedComponent={LaunchAnimationWrap} data={data}/>
        );
    }
}

class LaunchAnimationWrap extends React.Component {
    
    render () {
        
        return (
            
            <div className="launchwindow">
            <LaunchAnimation data={this.props.data}/>
            </div>
        );
    }
}  

class LaunchAnimation extends React.Component {
    
    state = {data: this.props.data}
    
    loadData = (data) => {
        
        this.setState({data});
        
    }
    
    render () {
        
        if (this.state.data !== undefined) {
            return <Launch1 data={this.state.data}/>;
        }
        
        return (
            <>
            <LaunchMondrian style={{fontFamily: "lora"}}/>
            <LaunchLoader
            loadData={this.loadData}/>
            </>
            );
    }
}

const LaunchLoader = (props) => {
    
    
    
     const {login, getAccessTokenWithPopup } = useAuth0();
     const opts = {audience: APIHOST};
     const {error, loading, data, refresh} = useApi(APIHOST + '/api/launchscreen', {}, opts);
     const getTokenAndTryAgain = async () => {
        await getAccessTokenWithPopup(opts);
        refresh()
  };
    console.log(props.data);
    if (props.data !== undefined) {
        return <Launch1
                data={props.data}/>
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
    return <div></div>;
    }
    if (data.displayType == "newUser") {
        return <Redirect to="/newuser"/>;
    }
    console.log(data.notification);
    
    props.loadData(data);
    
    return <div></div>;

}

class LaunchMondrian extends React.Component {
    
    render () {
        
        return (
            <>
            </>
            );
    }
}
        

class Launch1 extends React.Component {

    state = {
	sidebarOpen: 1
    }

    onSetSidebarOpen = () => {
	this.setState({sidebarOpen: 1});
    }
    
    render () {
        return (
            <Mondrian data={this.props.data} style={{fontFamily: "lora"}}/>
        );
    }
}

class Notification extends React.Component {
    
    render () {
        if (this.props.no == 0) {
            return (<div></div>);
        }

        return (
                     <div className="notification">
            <div className="centerno">{this.props.no}</div>
            </div>
        );
    }
}

class Progress extends React.Component {
    
    render () {
        
        var levelprogress = this.props.data.levelprogress;
        console.log(levelprogress);
        
        var displayprogress = (90.0 + (360.0 * levelprogress)).toString();
        console.log(displayprogress);
        
        if (levelprogress <= 0.5) {

            return (
            <div className="outercircle" style={{backgroundColor: "darkblue", backgroundImage: "linear-gradient(" + displayprogress + "deg, transparent 50%, #00ffff 50%), linear-gradient(90deg, #00ffff 50%, transparent 50%)"}}>
            <div className="innercircle">
            <div className="progressLevel"><div style={{fontSize: "25px", display: "inline-block"}}>LVL</div>{this.props.data.level}</div>
            </div> 
            </div>
            );
        } else {
            
             return (
            <div className="outercircle" style={{backgroundColor: "#00ffff", backgroundImage: "linear-gradient(" + displayprogress + "deg, darkblue 50%, transparent 50%), linear-gradient(90deg, transparent 50%, darkblue 50%)"}}>
            <div className="innercircle">
            <div className="progressLevel"><div style={{fontSize: "25px", display: "inline-block"}}>LVL</div>{this.props.data.level}</div>
            </div> 
            </div>
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
                style={{height: "3rem", width: "9rem", marginRight: "0.3rem", marginLeft: "0.3rem", marginTop: "0.5rem", borderColor: colour}}>

                <div className="cardHeader"
                style={{textAlign: "center",
                      padding: "0.75rem"}}>
                {this.props.word} <br></br>
                </div>
            </Card>
<StreakShow streak={this.props.streak}/>
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
                pips.push(<div className="pipsmall pip-green"/>);
            }

            for (var i = 0; i < (4 - (this.props.streak % 5)); i++) {
                console.log("Hi2");
                pips.push(<div className="pipsmall pip-green-hollow"/>);
            }
        } else if (this.props.streak < 9) {
            
            for (var i = 0; i < (this.props.streak % 4); i++) {
                console.log("Hi1");
                pips.push(<div className="pipsmall pip-blue"/>);
            }

            for (var i = 0; i < (4 - (this.props.streak % 4)); i++) {
                console.log("Hi2");
                pips.push(<div className="pipsmall pip-blue-hollow"/>);
            }
        }

        return (
            <div>
            {pips}
            </div>
        );

    }
} 

class Mondrian extends React.Component {
    
    state = {animate: false, redirect: true, type: null}
    
    readClick = () => {
        
        console.log("read click");
        this.setState({animate: true, redirect: false, type: "read"});
        
    }
    
    vocabClick = () => {
        
        this.setState({animate: true, redirect: false, type: "vocab"});
        
    }
    
    listsClick = () => {
        
        this.setState({animate: true, redirect: false, type: "lists"});
        
    }
    
    render () {
        
        if (this.state.redirect && this.state.type=="read") {
    return (<Redirect to={{pathname: "/read", data: this.props.data, type: "daily_reading"}}/>);

        }
        
        if (this.state.redirect && this.state.type=="vocab") {
            
            return (<Redirect to={{pathname: "/vocab", data: this.props.data}}/>);

        }
        
        if (this.state.redirect && this.state.type=="lists") {
            
            return (<Redirect to={{pathname: "/lists", data: this.props.data}}/>);

        }
        
        return (
            <>
            <SideBox data={this.props.data}/>
            <button onClick={this.readClick} onAnimationEnd={() => this.setState({ redirect: true})} className={this.state.animate ? "bubble readingbubble upbubbleread" : "bubble readingbubble bottombubbleread"}>
            <div className="bubbletext">
<BookOpen size="2vw"/><br></br> Daily Reading </div>
            <Notification no={this.props.data.read_notification}/>
            </button>
            <button onClick={this.vocabClick} onAnimationEnd={() => this.setState({redirect: true })} className={this.state.animate ? "bubble vocabubble upbubblevocab" : "bubble vocabubble bottombubblevocab"}>
<div className="bubbletext" style={{color: "white"}}>
<Type size="2vw"/><br></br> My Vocab </div></button>
        <button onClick={this.listsClick} className={this.state.animate ? "bubble listsbubble upbubblelists" : "bubble listsbubble bottombubblelists"}>
            <div className="bubbletext">Quick Session</div></button>
            </>
            );
    }
}

const SideBox = (props) => {
    
    console.log(props.data.levelprogress);
    
    return (
        
        <div className="sidebox">
        <div style={{position: "absolute", top: "10%", left: "10%", width: "80%"}}><div style={{position: "absolute", fontSize: "3vw", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}><div style={{fontSize: "1vw", display: "inline-block"}}>LVL</div>{props.data.level}</div><Circle strokeWidth={3} percent={100*props.data.levelprogress}></Circle></div>
        <div style={{position: "absolute", bottom: "20%", height: "15%", width: "100%", left: "0"}}><div style={{width: "45%", border: "5px solid lightblue", borderRadius: "20px", position: "absolute", height: "100%", left: "2.5%"}}><div style={{top: "50%", left: "50%", position: "absolute", transform: "translate(-50%, -50%)"}}>{props.data.wordnos[0]}</div></div><div style={{width: "45%", right: "2.5%", position: "absolute", border: "5px solid #003366", borderRadius: "20px", height: "100%"}}><div style={{top: "50%", left: "50%", position: "absolute", transform: "translate(-50%, -50%)"}}>{props.data.wordnos[1]}</div></div></div>
        </div>

    );
}

const LogoutButton = () => {
    
    const {logout} = useAuth0();
    
    return (
        
        <button onClick={() => logout({returnTo: window.location.origin})}>
        Log out
        </button>
    );
}
    
