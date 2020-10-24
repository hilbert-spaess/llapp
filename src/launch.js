import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import {Stylesheet, css} from 'aphrodite';
import {Card, Container, Row, Col, Nav, Navbar, Form, FormControl, Popover, OverlayTrigger, Overlay, Toast} from 'react-bootstrap';
import {FreeBarWrapped} from './sidebar.js';
import {Auth0Provider, useAuth0, withAuthenticationRequired} from '@auth0/auth0-react';
import {BookOpen, Type, FastForward, Info} from 'react-feather';
import {useApi} from './use-api.js';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';

export class Launch extends React.Component {
    
    render () {
        const {data} = this.props.location;
        console.log(data);
        return (
            <FreeBarWrapped WrappedComponent={LaunchLoader} data={data}/>
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
    
    return (
            <Launch1
        data={data}/>
    );

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
          <Container fluid="lg">
             <Row>
                        <Col>
            <Card className="launchnotification"
            style={{backgroundColor: "lightyellow"}}>
            <div className="messagetext">
                <Info size={30}/> <br></br>{this.props.data.message}
            </div>
            </Card>
            </Col>
            </Row>
                      <Row>
                        <Col>
            <Card className="launchcardtwotop launchtopleft"
            style={{}}>
            <Notification
            no={this.props.data.read_notification}
            />
              <Link to={{pathname: "/read", data: this.props.data}}>
                   <div className="launchcontent" style={{color: "green"}}>
                <BookOpen/> <br></br>
    
                Daily Reading
               </div>
              </Link>
            </Card>
            </Col>
            <Col>
            <Card className="launchcardtwotop launchtopright"
            style={{}}>
                <Link to="/vocab">
            <div className="launchcontent" style={{color: "#261447"}}>
                <Type/> <br></br>
                My Vocab
            </div>
 </Link>
            </Card>
            </Col>
           </Row>
             <Row>
                        
            <Card className="launchcardtwo"
            style={{borderColor: "#aaf8ff"}}>
            <div className="launchprogress">
              <Progress
                data={this.props.data}
                />
                    </div>
            <div style={{position: "absolute", width: "70%", right: 0, marginTop: "2em"}}>
              <VocabGrid
                words={this.props.data.levelwords}/>
            </div>
            </Card>
           </Row>
            </Container>
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
                style={{height: "4rem", width: "9rem", marginRight: "0.3rem", marginLeft: "0.3rem", marginTop: "0.5rem", borderColor: colour}}>

                <div className="cardHeader"
                style={{textAlign: "center",
                      padding: "0.5rem"}}>
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

const LogoutButton = () => {
    
    const {logout} = useAuth0();
    
    return (
        
        <button onClick={() => logout({returnTo: window.location.origin})}>
        Log out
        </button>
    );
}
    
