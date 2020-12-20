import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import alexim from './zhengtao.jpg';
import lizzie from './lizzie.jpg';
import jacob from './jacob.jpg';
import {useApi} from './use-api.js';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';
import {Card, Container, Row, Col, Nav, Navbar, Form, FormControl, Popover, OverlayTrigger, Overlay, Toast} from 'react-bootstrap';
import {Auth0Provider, useAuth0, withAuthenticationRequired} from '@auth0/auth0-react';
import {ExampleSentences} from './landing.js';

export const Advert = () => {

    const {user, isAuthenticated, isLoading} = useAuth0();

    if (isLoading) {
        return <div></div>;
    }

    if (isAuthenticated) {
        return <Redirect to = "/home"/>;
    }

    return <Advert1/>;

}

class Advert1 extends React.Component {

    render () {

        const isMobile = window.innerWidth <= 1000;

        if (isMobile) {

            return (

                <MobileAdvert/>

            );
        } else {

            return (

                <DesktopAdvert/>

            );
        }

    }
}

class MobileAdvert extends React.Component {

    render () {

        return (

                <div style={{overflow: "scroll"}}>
		    <nav className="navbar navbar-custom navbar-expand" style={{backgroundColor: "#f5f5f5", height: "10vh", width: "100%", position: "fixed", "top": 0, "zIndex": 2, overflow: "hidden", paddingLeft: "5vw", paddingRight:"5vw"}}>
			      <a href="/" style={{fontSize: "6vw"}}>RiceCake</a>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item signloglink">
            <Link style={{color: "green", marginRight: "1em"}} to="/signup">Sign Up </Link>
          </li>
          <li className="nav-item signloglink">
            <Link style={{color: "green"}} to="/login">Log In</Link>
          </li>
        </ul>
  </nav>
                    <header className="masthead text-white" style={{"z":0}} >
    <div className="masthead-content">
    <Row>
      <div style={{width: "70vw", marginLeft: "10vw", marginTop: "15vh"}}>
        <h2 className="masthead-heading mb-0" style={{fontSize: "8vw"}}>Weekly tutoring. Daily exercises.</h2>
        <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "6vw"}}>Improve your written English quickly and intelligently.</h3>
            <div align="left">
        <Link align="left" to="/signup" className="btn btn-primary btn-xl rounded-pill mt-5">Sign up now</Link>
            </div>
        </div>
    </Row>
    </div>
    <div className="bg-circle-1 bg-circle"></div>
    <div className="bg-circle-2 bg-circle"></div>
    <div className="bg-circle-3 bg-circle"></div>
    <div className="bg-circle-4 bg-circle"></div>
                  </header>
                    <Faces/>
		    <SellingPoint
		    example={<ExampleSentences/>}
			title={"Vocabulary drills"}/>
		    <SellingPoint
	    example={<WritingExercise/>}
	    title={"Writing Exercises"}/>
		</div>
            
		    

        );
         }
      }

class SellingPoint extends React.Component {

    render () {

	return (

	    <div style={{width: "100%", height: "40vh", fontSize: "4vw", padding: "10px"}}>
		<div style={{fontSize: "6vw"}}>{this.props.title}</div>
		<div style={{width: "80%", marginLeft: "10%", borderRadius: "20px", backgroundColor: "white", marginTop: "2vh", padding: "20px"}}>
		    {this.props.example}
		</div>
	    </div>
	);
    }
}

class WritingExercise extends React.Component {

    render () {

	return (

	    <div style={{fontFamily: "lora"}}>
		Where was she going?
	    </div>
	);
    }
}
	    

class Faces extends React.Component {

    render () {

        return (

            <>
              <Face
                im={alexim}
                bc={"lightgreen"}
                name={"Alex"}
                description={["University of Cambridge", "Clare College","Natural Sciences degree"]}/>
                            <Face
                              im={jacob}
                              bc={"white"}
                              name={"Jacob"}
                              description={["University of Cambridge", "Clare College","Natural Sciences degree"]}/>
                                    <Face
                                      im={lizzie}
                                      bc={"lightblue"}
                              name={"Lizzie"}
                              description={["University of Cambridge", "Clare College","Natural Sciences degree"]}/>
            </>

        );
    }
}

class Face extends React.Component {

    render () {

        var Descriptions = [];

        for (var i =0; i < this.props.description.length; i++) {
            Descriptions.push(<div>{this.props.description[i]}</div>);
        }
            

        return (
            <div style={{backgroundColor: this.props.bc, overflow: "hidden", width:"100%", height: "30%", paddingBottom: "5vh"}}>
              <div style={{textAlign: "center", paddingTop: "5vh"}}>
                <div style={{float: "left",  width: "50%", paddingLeft: "10vw", textAlign:"left"}}>
                <img style={{width: "35vw", "height": "30vh"}} src={this.props.im}/>
              </div>
                <div style={{float: "right", paddingTop: "2vh", width: "50%", left: "50%"}}>
            <div style={{fontWeight: "bold", fontSize: "6vw"}}>{this.props.name}</div><div style={{marginTop: "1vh", fontSize: "4vw"}}>{Descriptions}</div>
            </div>
            </div>
            </div>
        );
    }
}

class DesktopAdvert extends React.Component {

    render () {

        return (

            <div>Hemlo</div>

        );
    }
}


