import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import zhengtao from './zhengtao.jpg';
import lizzie from './lizzie.jpg';
import jacob from './jacob.jpg';
import {useApi} from './use-api.js';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';
import {Card, Container, Row, Col, Nav, Navbar, Form, FormControl, Popover, OverlayTrigger, Overlay, Toast} from 'react-bootstrap';
import {Auth0Provider, useAuth0, withAuthenticationRequired} from '@auth0/auth0-react';
import {ExampleSentences} from './landing.js';
import ReactFullpage from "@fullpage/react-fullpage";
import {ChevronUp, ChevronDown} from 'react-feather';

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

class DesktopAdvert extends React.Component {

    constructor(props) {

	super(props);

 	this.myDivToFocus = React.createRef();

    }

    handleContact = () => {

        console.log("hemlo");
	this.myDivToFocus.current.scrollIntoView({
	    behaviour: "smooth"});

    }
        

    render () {

        return (
    
  <ReactFullpage
    sectionsColor={["#282c34", "white", "#0798ec", "#282c34"]}
    onLeave={(origin, destination, direction) => {
      console.log("onLeave event", { origin, destination, direction });
    }}
    render={({ state, fullpageApi }) => {
        console.log("render prop change", state, fullpageApi); // eslint-disable-line no-console


      return (
        <div>
          <DesktopHeader
            handleContact = {this.handleContact}/>
	  <DesktopFaces/>
          <DesktopSellingPoints/>
          <div className="section" ref={this.myDivToFocus}>
          <ContactUs/>
          </div>
        </div>
      );
    }}
  />
        );
    }
}

class MobileAdvert extends React.Component {

    constructor(props) {

	super(props);

 	this.myDivToFocus = React.createRef();

    }

    handleContact = () => {

        console.log("hemlo");
	this.myDivToFocus.current.scrollIntoView({
	    behaviour: "smooth"});

    }
        

    render () {

        return (
    
  <ReactFullpage
    sectionsColor={["#282c34", "white", "#0798ec", "#282c34"]}
    onLeave={(origin, destination, direction) => {
      console.log("onLeave event", { origin, destination, direction });
    }}
    render={({ state, fullpageApi }) => {
        console.log("render prop change", state, fullpageApi); // eslint-disable-line no-console


      return (
        <div>
          <MobileHeader
            handleContact = {this.handleContact}/>
	  <DesktopFaces/>
          <DesktopSellingPoints/>
          <div className="section" ref={this.myDivToFocus}>
          <ContactUs/>
          </div>
        </div>
      );
    }}
  />
        );
    }
}

class DesktopHeader extends React.Component {

    handleContact = () => {

        this.props.handleContact();

    }

    render () {

	return (
	    <div className="section">
		<nav className="navbar navbar-custom navbar-expand" style={{backgroundColor: "transparent", height: "10vh", width: "100%", position: "fixed", "top": 0, "zIndex": 2, overflow: "hidden", paddingLeft: "5vw", paddingRight:"5vw", color: "white"}}>
		    <a href="/" style={{fontSize: "2vw", color: "white"}}>RiceCake</a>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item signloglink">
              <Link style={{marginRight: "1em", fontSize: "1vw", color: "white"}}>中文</Link>
          </li>
           <li className="nav-item signloglink">
              <Link style={{marginRight: "1em", fontSize: "1vw", color: "white"}}>Contact us</Link>
          </li>
        </ul>
  </nav>
    <Row>
      <div style={{width: "40vw", marginLeft: "10vw", marginTop: "25vh"}}>
          <h2 className="masthead-heading mb-0" style={{fontSize: "4vw", color: "white"}}>Flexible tutoring. Regular exercises.</h2>
        <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "2vw", color: "grey"}}>Improve your written English quickly and intelligently.</h3>
        <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "1.5vw", color: "grey"}}>Contact Alex to start learning with us.</h3>
        <h3 className="masthead-subheading mb-0" style={{marginTop: "1vh", fontSize: "1.5vw", color: "grey"}}>Wx: lzt_oxford</h3>

            <div align="left">
            </div>
      </div>
	<div style={{width: "40vw", height: "40vh", position: "absolute", left: "50vw", top: "50vh", transform: "translateY(-50%)", backgroundColor: "#f5f5f5", color: "black", padding: "1em", fontSize: "1.6vw", marginLeft: "5%", borderRadius: "10px"}}>{<ExampleSentences/>}</div>
    </Row>
    <div className="bg-circle-1 bg-circle"></div>
    <div className="bg-circle-2 bg-circle"></div>
    <div className="bg-circle-3 bg-circle"></div>
              <div className="bg-circle-4 bg-circle"></div>
              <div style={{color: "white", position: "absolute", bottom: "10vh", left: "50vw", transform: "translateY(-50%)"}}><ChevronDown size={30}/></div>
		</div>
	);
    }
}

class MobileHeader extends React.Component {

    handleContact = () => {

        this.props.handleContact();

    }

    render () {

	return (
	    <div className="section">
		<nav className="navbar navbar-custom navbar-expand" style={{backgroundColor: "transparent", height: "10vh", width: "100%", position: "fixed", "top": 0, "zIndex": 2, overflow: "hidden", paddingLeft: "5vw", paddingRight:"5vw", color: "white"}}>
		    <a href="/" style={{fontSize: "2vw", color: "white"}}>RiceCake</a>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item signloglink">
              <Link style={{marginRight: "1em", fontSize: "1vw", color: "white"}} onClick={this.handleContact}>Contact us</Link>
          </li>
        </ul>
  </nav>
    <Row>
      <div style={{width: "70vw", marginLeft: "10vw", marginTop: "25vh"}}>
          <h2 className="masthead-heading mb-0" style={{fontSize: "6vw", color: "white"}}>Flexible tutoring. Regular exercises.</h2>
        <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "3vw", color: "grey"}}>Improve your written English quickly and intelligently.</h3>
        <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "2vw", color: "grey"}}>Contact Alex to start learning with us.</h3>
        <h3 className="masthead-subheading mb-0" style={{marginTop: "1vh", fontSize: "2vw", color: "grey"}}>Alex 李政陶</h3>6
        <h3 className="masthead-subheading mb-0" style={{marginTop: "1vh", fontSize: "2vw", color: "grey"}}>Wx: lzt_oxford</h3>
            <div align="left">
            </div>
      </div>
    </Row>
    <div className="bg-circle-1 bg-circle"></div>
    <div className="bg-circle-2 bg-circle"></div>
    <div className="bg-circle-3 bg-circle"></div>
              <div className="bg-circle-4 bg-circle"></div>
              <div style={{color: "white", position: "absolute", bottom: "10vh", left: "50vw", transform: "translateY(-50%)"}}><ChevronDown size={30}/></div>
		</div>
	);
    }
}

	

class MySection extends React.Component {
  render() {
    return (
      <div className="section">
        <h3>{this.props.content}</h3>
      </div>
    );
  }
}

class MobileAdvert1 extends React.Component {

    constructor(props) {

	super(props);

	this.myDivToFocus = React.createRef();

    }

    handleContact = () => {

	console.log("hemlo");
	this.myDivToFocus.current.scrollIntoView({
	    behaviour: "smooth"});

    }

    render () {

        return (

                <div>
		    <nav className="navbar navbar-custom navbar-expand" style={{backgroundColor: "#f5f5f5", height: "10vh", width: "100%", position: "fixed", "top": 0, "zIndex": 2, overflow: "hidden", paddingLeft: "5vw", paddingRight:"5vw"}}>
			      <a href="/" style={{fontSize: "6vw"}}>RiceCake</a>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item signloglink">
              <Link style={{color: "green", marginRight: "1em", fontSize: "3vw"}} onClick={this.handleContact}>Contact us</Link>
          </li>
        </ul>
  </nav>
                    <header className="masthead text-white" style={{"z":0}} >
    <div className="masthead-content">
    <Row>
      <div style={{width: "70vw", marginLeft: "10vw", marginTop: "15vh"}}>
        <h2 className="masthead-heading mb-0" style={{fontSize: "8vw"}}>Weekly tutoring. Online exercises.</h2>
        <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "6vw"}}>Improve your written English quickly and intelligently.</h3>
            <div align="left">
		<Link align="left" onClick={this.handleContact} className="btn btn-primary btn-xl rounded-pill mt-5">Contact us</Link>
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
			bc={["white", "#b5e7a0"]}
			height={"40vh"}
		    example={<ExampleSentences/>}
			title={"Learn vocab through usage"}/>
		    <SellingPoint
			bc={["#b5e7a0", "white"]}
			height={"60vh"}
	    example={<AnalysisExercise/>}
			title={"Build confidence analysing text"}/>
		    <header className="masthead text-white" style={{"z":0}} >
    <div className="masthead-content">
    <Row>
	<div ref={this.myDivToFocus} style={{width: "70vw", marginLeft: "10vw", marginTop: "5vh"}}>
            <h2 className="masthead-heading mb-0" style={{fontSize: "8vw", marginTop: "5vh"}}>Get in touch with Alex to start learning with us.</h2>
	  <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "6vw"}}>Alex 李政陶</h3>
	  <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "6vw"}}>Wx: lzt_oxford</h3>
        </div>
    </Row>
    </div>
    <div className="bg-circle-1 bg-circle"></div>
    <div className="bg-circle-2 bg-circle"></div>
    <div className="bg-circle-3 bg-circle"></div>
    <div className="bg-circle-4 bg-circle"></div>
                </header>
		</div>
            
		    

        );
         }
}

class DesktopAdvert1 extends React.Component {

    constructor(props) {

	super(props);

	this.myDivToFocus = React.createRef();

    }

    handleContact = () => {

        this.props.handleContact();

	console.log("hemlo");
	this.myDivToFocus.current.scrollIntoView({
	    behaviour: "smooth"});

    }

    render () {

        return (

                <div>
		    <nav className="navbar navbar-custom navbar-expand" style={{backgroundColor: "transparent", width: "100%", "top": 0, "zIndex": 2, fontSize: "2.5vw", overflow: "hidden", paddingLeft: "5vw", paddingRight:"5vw"}}>
			      <a href="/" style={{fontSize: "20px"}}>RiceCake</a>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item signloglink">
              <Link style={{color: "green", marginRight: "1em"}} onClick={this.handleContact}>Contact us</Link>
          </li>
        </ul>
  </nav>
                    <header className="masthead text-white" style={{"z":0}} >
    <div className="masthead-content">
    <Row>
      <div style={{width: "70vw", marginLeft: "10vw"}}>
        <h2 className="masthead-heading mb-0" style={{fontSize: "3.5vw"}}>Regular tutoring. Online exercises.</h2>
        <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "2.5vw"}}>A fresh approach to improving written English and comprehension.</h3>
            <div align="left">
		<Link align="left" onClick={this.handleContact} className="btn btn-primary btn-xl rounded-pill mt-5">Contact us</Link>
            </div>
        </div>
    </Row>
    </div>
    <div className="bg-circle-1 bg-circle"></div>
    <div className="bg-circle-2 bg-circle"></div>
    <div className="bg-circle-3 bg-circle"></div>
    <div className="bg-circle-4 bg-circle"></div>
                  </header>
                    <DesktopFaces
			bc={["white", "#b5e7a0"]}/>
		    <DesktopSellingPoint
		    	bc={["white", "#b5e7a0"]}
			heading={"Don't start from a blank page."}
			subheading={"Build up your answers to questions with our help."}
			order={1}
			example={<ExampleSentences/>}/>
		    <DesktopSellingPoint
		    	bc={["white", "#b5e7a0"]}
			heading={"Learn vocab through usage"}
                      	example={<ExampleSentences/>}
			subheading={""}
			order={0}/>
		    <DesktopSellingPoint
		    	bc={["white", "#b5e7a0"]}
			heading={"Analyse classic texts and poems"}
			subheading={"Discuss tricky texts with our tutors weekly."}
		      order={1}
                      		      example={<DeskAnalysisExercise/>}/>
		    <header className="masthead text-white" style={{"z":0}} >
    <div className="masthead-content">
    <Row>
	<div ref={this.myDivToFocus} style={{width: "70vw", marginLeft: "10vw", marginTop: "5vh"}}>
            <h2 className="masthead-heading mb-0" style={{fontSize: "3vw", marginTop: "5vh"}}>Get in touch with Alex to start learning with us.</h2>
	  <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "2.5vw"}}>Alex 李政陶</h3>
	  <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "2.5vw"}}>Wx: lzt_oxford</h3>
        </div>
    </Row>
    </div>
    <div className="bg-circle-1 bg-circle"></div>
    <div className="bg-circle-2 bg-circle"></div>
    <div className="bg-circle-3 bg-circle"></div>
    <div className="bg-circle-4 bg-circle"></div>
                </header>
		</div>
            
		    

        );
         }
      }


class SellingPoint extends React.Component {

    render () {

	return (

	    <div style={{width: "100%", height: this.props.height, fontSize: "4vw", padding: "10px", background: "linear-gradient(0deg, " + this.props.bc[1] + " 0%, " + this.props.bc[0] + " 100%)"}}>
		<div style={{fontSize: "6vw"}}>{this.props.title}</div>
		<div style={{width: "80%", marginLeft: "10%", borderRadius: "20px", backgroundColor: "white", marginTop: "2vh", padding: "20px"}}>
		    {this.props.example}
		</div>
	    </div>
	);
    }
}

class DesktopSellingPoints extends React.Component {

    render () {

        return (
            <div className="section">
            <DesktopSellingPoint
		    	bc={["white", "#b5e7a0"]}
			heading={"Don't start from a blank page."}
			subheading={"Build up answers to interpretation, analysis, and creative writing questions with our help."}
			order={1}
			example={<DesktopScaffold/>}/>
		    <DesktopSellingPoint
		    	bc={["white", "#b5e7a0"]}
		      heading={"Learn vocab through usage"}
                      subheading={"Acquire technical terms, connective words, and useful essay phrases to spruce up your writing."}
                      	example={<ExampleSentences/>}
			order={0}/>
		    <DesktopSellingPoint
		    	bc={["white", "#b5e7a0"]}
			heading={"Analyse classic texts and poems"}
			subheading={"After working through exercises, discuss tricky texts with our tutors."}
		      order={1}
            example={<DeskAnalysisExercise/>}/>
            </div>
	);
    }
}

class DesktopSellingPoint extends React.Component {

    render () {

	return (

	    <div style={{width: "100%", fontSize: "2vw", background: "transparent", height: "30vh"}}>
		{this.props.order ? 
		 <Row>
                   <div style={{width: "40vw", marginLeft: "10vw", paddingTop: "3vh"}}>
            <h2 className="masthead-heading mb-0" style={{fontSize: "2.5vw"}}>{this.props.heading}</h2>
            <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "2vw"}}>{this.props.subheading}</h3>
        </div>
		   <div style={{width: "40vw", backgroundColor: "#f5f5f5", color: "black", padding: "1em", fontSize: "1.3vw", marginLeft: "5%", borderRadius: "10px", height: "80%"}}>{this.props.example}</div>
		</Row> :
		<Row>		   
		  <div style={{width: "40vw", marginLeft: "10vw", backgroundColor: "#f5f5f5", color: "black", padding: "1em", fontSize: "1.3vw", borderRadius: "10px"}}>{this.props.example}</div>
		  <div style={{width: "40vw", marginLeft: "7vw", paddingTop: "2vh"}}>
								<h2 className="masthead-heading mb-0" style={{fontSize: "2.5vw"}}>{this.props.heading}</h2>
								<h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "2vw"}}>{this.props.subheading}</h3>
        </div>
		</Row>}
	    </div>
	);
    }
}

class ContactUs extends React.Component {

    render () {

        return (

            <div className="masthead" style={{color: "white"}}>
              <Row style={{color: "white", position: "absolute", top: "50vh", transform: "translateY(-50%)"}}>
	<div ref={this.myDivToFocus} style={{width: "70vw", marginLeft: "10vw", marginTop: "5vh"}}>
          <h2 className="masthead-heading mb-0" style={{color: "white",fontSize: "3vw", marginTop: "5vh"}}>Get in touch with Alex to start learning with us.</h2>
	  <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "2.5vw"}}>Alex 李政陶</h3>
	  <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "2.5vw"}}>Wx: lzt_oxford</h3>
        </div>
                  </Row>
                  <div className="bg-circle-1 bg-circle"></div>
    <div className="bg-circle-2 bg-circle"></div>
    <div className="bg-circle-3 bg-circle"></div>
              <div className="bg-circle-4 bg-circle"></div>
              
            </div>
        );
    }
}

class Contact extends React.Component {

    render () {

	return (

	    <div style={{width: "100%"}}>
	    <div></div></div>

	);
    }
}

class AnalysisExercise extends React.Component {

    state = {val: "The repetition of the word \"grey\" and the fact that this colour was to be \"seen everywhere\" highlights the dullness of their surroundings. The colour epitomises the remoteness and uniformity of where they live."}

    render () {

	return (

	    <div style={{fontFamily: "lora"}}>
		<div style={{backgroundColor: "#f2eecb", fontSize: "3vw", marginBottom: "2vh"}}>
		    The sun had baked the plowed land into a grey mass, with little cracks running through it. Even the grass was not green, for the sun had burned the tops of the long blades until they were the same grey colour to be seen everywhere.
		    </div>
		{this.state.val}
	    </div>
	);
    }
}



class DeskAnalysisExercise extends React.Component {

    state = {val: "The repetition of the word \"grey\" and the fact that this colour was to be \"seen everywhere\" highlights the dullness of their surroundings. The colour epitomises the remoteness and uniformity of where they live."}

    render () {

	return (

	    <div style={{fontFamily: "lora"}}>
		<div style={{backgroundColor: "#f2eecb", fontSize: "1.3vw", marginBottom: "2vh"}}>
		    The sun had baked the plowed land into a grey mass, with little cracks running through it. Even the grass was not green, for the sun had burned the tops of the long blades until they were the same grey colour to be seen everywhere.
		    </div>
	    </div>
	);
    }
}

class DesktopScaffold extends React.Component {

    state = {val: 0}

    componentDidMount = () => {

        let timerId = setInterval(() => this.handleStep(), 3000);

    }

    handleStep = () => {

        if (this.state.val == 2){

            this.setState({val: 0});

        } else {

            this.setState({val: this.state.val + 1});

        }
    }

    render () {

        const vals = ["Watson presents Sherlock as precise and careful.", "Watson presents Sherlock as precise and careful, describing him as the \'most perfect reasoning and observing machine that the world has seen\'.", "Watson presents Sherlock as precise and careful, describing him as the \'most perfect reasoning and observing machine that the world has seen\'. The metaphor depicts Sherlock as an inanimate object, highlighting his inhuman abilities."];

        return (

            <div style={{fontFamily: "lora"}}>
              {vals[this.state.val]}
            </div>

        );
    }
}

	    

class Faces extends React.Component {

    render () {

        return (

            <div className="section">
              <Face
                  im={zhengtao}
                  bc={["#b5e7a0", "white"]}
                name={"Alex"}
                description={["University of Cambridge", "Clare College","Natural Sciences graduate"]}/>
                            <Face
				im={jacob}
				bc={["white", "#b5e7a0"]}
                              name={"Jacob"}
                              description={["University of Cambridge", "Trinity College","Maths graduate"]}/>
                                    <Face
                                      im={lizzie}
					bc={["#b5e7a0", "white"]}
                              name={"Lizzie"}
                              description={["UCL", "Geography graduate"]}/>
            </div>

        );
    }
}

class DesktopFaces extends React.Component {

    render () {

        return (

            <div className="section">
              <DesktopFace
                  im={zhengtao}
                  bc={["#b5e7a0", "white"]}
                name={"Alex"}
                description={" is a recent graduate of Clare College, Cambridge. He has designed our English curriculum, in particular our work on comprehension, interpretation and analysis. He has experience working with Chinese students adapting to a native curriculum. (fun stuff?)"}/>
                            <DesktopFace
				im={jacob}
				bc={["white", "#b5e7a0"]}
                              name={"Jacob"}
				description={" is a recent graduate of Trinity College, Cambridge. He runs our online English exercise platform, which delivers lesson content for tutors and tutees. He is interested in using Spaced Repetition techniques to improve vocabulary."}/>
                                    <DesktopFace
                                      im={lizzie}
					bc={["#b5e7a0", "white"]}
                              name={"Lizzie"}
					description={" is a recent graduate from UCL. She helps build and deliver our lesson content, in particular analysis of poetry."}/>
            </div>

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
            <div style={{background: "linear-gradient(0deg, " + this.props.bc[1] + " 0%, " + this.props.bc[0] + " 100%)", overflow: "hidden", width:"100%", height: "30%", paddingBottom: "5vh"}}>
              <div style={{textAlign: "center", paddingTop: "5vh"}}>
                <div style={{float: "left",  width: "50%", paddingLeft: "5vw", textAlign:"left"}}>
                    <img style={{width: "35vw", "height": "auto"}} src={this.props.im}/>
              </div>
                  <div style={{float: "right", paddingTop: "2vh", width: "50%", left: "50%", paddingRight: "5vw"}}>
            <div style={{fontWeight: "bold", fontSize: "6vw"}}>{this.props.name}</div><div style={{marginTop: "1vh", fontSize: "4vw"}}>{Descriptions}</div>
            </div>
            </div>
            </div>
        );
    }
}

class DesktopFace extends React.Component {

    render () {

        var Descriptions = [];

        for (var i =0; i < this.props.description.length; i++) {
            Descriptions.push(<div>{this.props.description[i]}</div>);
        }
            

        return (
            <div style={{ overflow: "hidden", width:"100%", height: "30vh", paddingBottom: "5vh"}}>
              <div style={{textAlign: "center", paddingTop: "2vh"}}>
                <div>
                    <img style={{paddingLeft: "5vw", float: "left", width: "auto", "height": "30vh"}} src={this.props.im}/>
              </div>
		  <div style={{paddingRight: "5vw", width: "80vw", float: "right", height: "30vh", color: "black"}}>
		      <div style={{textAlign: "left", fontSize: "1.5vw"}}>
			  <span style={{fontWeight:"bold"}}>{this.props.name}</span>
			  {this.props.description}
		      </div>
		      
		  </div>
            </div>
            </div>
        );
    }
}




