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
    
    state = {chinese: false}

    constructor(props) {

	super(props);

 	this.myDivToFocus = React.createRef();

    }

    handleContact = () => {

        console.log("hemlo");
	this.myDivToFocus.current.scrollIntoView({
	    behaviour: "smooth"});

    }
    
    handleChinese = () => {
        this.setState({chinese: !this.state.chinese});
    }
        

    render () {

        return (
    
  <ReactFullpage
    anchors = {['section1', 'section2', 'section3', 'section4', 'section5', 'section6']}
    onLeave={(origin, destination, direction) => {
      console.log("onLeave event", { origin, destination, direction });
    }}
    render={({ state, fullpageApi }) => {
        console.log("render prop change", state, fullpageApi); // eslint-disable-line no-console


      return (
        <div>
          <DesktopHeader
          chinese={this.state.chinese}
handleChinese={this.handleChinese}
            handleContact = {this.handleContact}/>
	  <DesktopFaces
chinese={this.state.chinese}/>
          <DesktopSellingPoint
		    	bc={["#16537f", "#1b6696"]}
			heading={this.state.chinese ? "不愁脑子一片空白" : "Don't start from a blank page."}
			subheading={this.state.chinese ? "根据我们提供的提示和架构，学习如何清晰地表达自己对文段的见解" : "Build up answers to interpretation, analysis, and creative writing questions with our help."}
			order={1}
            chinese={this.state.chinese}
			example={<DesktopScaffold/>}/>
		    <DesktopSellingPoint
		    	bc={["#1b6696", "#1f79ae"]}
		      heading={this.state.chinese ? "活学活用，点滴积累" : "Learn vocab through usage"}
                      subheading={this.state.chinese ? "无论是新单词还是新的修辞手法，我们都希望通过运用和练习来掌握，再也不要背单词了" : "Acquire technical terms, connective words, and useful essay phrases to spruce up your writing."}
                      	example={<ExampleSentences/>}
			order={0}
            chinese={this.state.chinese}/>
		    <DesktopSellingPoint
		    	bc={["#1f79ae", "#228dc6"]}
			heading={this.state.chinese ? "课上讨论，灵活拓展" : "Analyse classic texts and poems"}
			subheading={this.state.chinese ? "在课前练习的基础上，进一步拓展，思考文章背景及作者观点，完成深层次理解" : "After working through exercises, discuss tricky texts with our tutors."}
		      order={1}
            example={<DeskAnalysisExercise/>}
            chinese={this.state.chinese}/>
          <ContactUs/>
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
        
        const heading1 = !this.props.chinese ? "Flexible tutoring. Regular exercises" : "灵活教学，一对一定制课程 以新的眼光看待学习英语"
        
        const heading2 = !this.props.chinese ? "Improve your English intelligently with our online courses." : "沉浸式学习方法，点滴积累，巧妙提高听说读写，你也可以融会贯通！"
        
        const heading3 = !this.props.chinese ? "→ Contact Alex to start learning with us." : "→ 联系Alex， 跟我们一起学英文"

	return (
	    <div className="section" style={{background: "linear-gradient(#083152, #104268)"}}>
		<nav className="navbar navbar-custom navbar-expand" style={{backgroundColor: "transparent", height: "10vh", width: "100%", position: "fixed", "top": 0, "zIndex": 2, overflow: "hidden", paddingLeft: "5vw", paddingRight:"5vw", color: "white"}}>
		    <a href="/" style={{fontSize: "2vw", color: "white"}}>RiceCake</a>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item signloglink">
              <Link onClick={this.props.handleChinese} style={{ marginRight: "1em", fontSize: "1.3vw", color: "white", cursor: "pointer"}}>{this.props.chinese ? "English" : "中文"}</Link>
          </li>
        </ul>
  </nav>
    <Row>
      <div style={{width: "40vw", marginLeft: "10vw", marginTop: "25vh"}}>
          <h2 className="masthead-heading mb-0" style={{fontSize: "4vw", color: "white"}}>{heading1}</h2>
        <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "2vw", color: "grey"}}>{heading2}</h3>
        <h3 href="#section6" className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "1.5vw", color: "grey"}}><a href="#section6">{heading3}</a></h3>

            <div align="left">
            </div>
      </div>
	<div style={{width: "40vw", height: "40vh", position: "absolute", left: "50vw", top: "50vh", transform: "translateY(-50%)", backgroundColor: "#f5f5f5", color: "black", padding: "1em", fontSize: "1.6vw", marginLeft: "5%", borderRadius: "10px"}}>{<HeaderSentences/>}</div>
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

class DesktopSellingPoint extends React.Component {

    render () {

        return (
        
	    <div className="section" style={{width: "100%", fontSize: "2vw", background: "linear-gradient(" + this.props.bc[0] + "," + this.props.bc[1] + ")", height: "30vh"}}>
		{this.props.order ? 
		 <Row>
                   <div style={{width: "40vw", marginTop: "50vh",transform: "translateY(-50%)", marginLeft: "10vw", paddingTop: "3vh"}}>
            <h2 className="masthead-heading mb-0" style={{fontSize: "2.5vw"}}>{this.props.heading}</h2>
            <h3 className="masthead-subheading mb-0" style={{marginTop: "3vh", fontSize: "2vw"}}>{this.props.subheading}</h3>
        </div>
		   <div style={{width: "40vw", height: "40vh", position: "absolute", left: "50vw", top: "50vh", transform: "translateY(-50%)", backgroundColor: "#f5f5f5", color: "black", padding: "1em", fontSize: "1.3vw", marginLeft: "5%", borderRadius: "10px"}}>{this.props.example}</div>
		</Row> :
		<Row>		   
		  <div style={{width: "40vw", marginTop: "50vh",transform: "translateY(-50%)", marginLeft: "10vw", paddingTop: "3vh", height: "40vh", backgroundColor: "#f5f5f5", color: "black", padding: "1em", fontSize: "1.3vw", borderRadius: "10px"}}>{this.props.example}</div>
		  <div style={{width: "40vw", marginLeft: "5%", position: "absolute", left: "50vw", top: "50vh", transform: "translateY(-50%)", paddingTop: "2vh"}}>
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

            <div className="section masthead" style={{color: "white", background: "linear-gradient(#228dc6, #228dc6)"}}>
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

            <div className="section" style={{background: "linear-gradient(#104268, #16537f)", paddingTop: "15vh", height: "100vh"}}>
            <Row style={{justifyContent: "center"}}>
              <DesktopFace
                  im={zhengtao}
                  bc={["#b5e7a0", "white"]}
                name={"Alex"}
                alma={this.props.chinese ? "剑桥大学, 克莱尔学院" : "Clare College, Cambridge graduate"}
                description={this.props.chinese ? "我擅长培养孩子的阅读能力，帮助他们进行条理清晰，层次分明的分析" : "I specialise in helping tutees form well-structured, developed analyses."}/>
                            <DesktopFace
				im={jacob}
				bc={["white", "#b5e7a0"]}
                              name={"Jacob"}
alma={this.props.chinese ? "剑桥大学 三一学院" : "Trinity College, Cambridge graduate"}
				description={"I build online exercises to help improve English systematically."}/>
                                    <DesktopFace
                                      im={lizzie}
					bc={["#b5e7a0", "white"]}
                              name={"Lizzie"}
alma={this.props.chinese ? "UCL 伦敦大学学院" : "UCL graduate"}
					description={this.props.chinese ? "我专注训练写作，通过结合孩子的积累，让他们的文字变得更加丰富" : "I focus on developing writing skills and using creativity to enhance students’ answers."}/>
    </Row>
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
            <div style={{width:"30vw", paddingBottom: "5vh"}}>
              <div style={{textAlign: "center", paddingTop: "2vh"}}>
                <div>
                    <img style={{width: "auto", "height": "30vh", borderRadius: "20px"}} src={this.props.im}/>
              </div>
		  <div style={{ color: "black"}}>
		      <div style={{textAlign: "center", fontSize: "1.5vw", marginTop: "5vh"}}>
			  <div style={{fontWeight: "bold"}}>{this.props.name}</div>
<div>{this.props.alma}</div>
<br></br>
			  <div>{this.props.description}</div>
		      </div>
		      
		  </div>
            </div>
            </div>
        );
    }
}

class HeaderSentences extends React.Component {
    
    state = {no: 0,
             counter: 0,
             synonyms: ["sad", "elated", "melancholy", "jubilant", "somber", "overjoyed", "dismal", "thrilled", "pessimistic", "ecstatic", "disconsolate", "delighted"]}
    
    componentDidMount = () => {
        
        let timerId = setInterval(() => this.handleStep(), 1000);
        
    }
    
    handleStep = () => {
        
        if (this.state.no == 0) {
            
            if (this.state.counter < this.state.synonyms.length - 1) {
                
                this.setState({counter: this.state.counter + 1});
                
            }
            
            else {
                
                this.setState({counter: 0});
                this.setState({no: 1});
                
            }
        } 
        
        if (this.state.no == 1) {
            
            this.setState({no: 0});
            
        }
            
    }
    render () {
        
        return (
            
             <div style={{fontFamily: "lora", fontSize: "2vw", position: "relative"}}>
            <div style={{position: "absolute", top: "10vh", transform: "translateY(-50%)"}}>
            The tone and word choice of the author indicate that the character was <span style={{color: this.state.counter % 2 == 0 ? "red": "green"}}> {this.state.no == 0 ? this.state.synonyms[this.state.counter] : ""}. </span>
        </div>
            </div>
        
        );
    }
}

            
            

class ExampleSentences extends React.Component {
    
    state = {word1s: ["ambivalent", "compliment"],
             word2s: ["ambiguous", "complement"],
             firstsens: [["A good scientist is ", " towards their conclusions, as long as the methodology is correct."], ["I guessed that the ", " was not sincere."]],
             secondsens: [["If the wording of the contract is ", ", ask for clarification."], ["The soundtrack was a perfect ", " to the action sequence."]],
             i: 3,
             j : 3,
             counter: 0,
             waiting: 0}
    
    componentDidMount = () => {
        
        let timerId2 = setInterval(() => this.handleCounts(), 200);
        
    }
    
    handleCounts = () => {
        var len1 = this.state.word1s[this.state.counter].length;
        var len2 = this.state.word2s[this.state.counter].length;
        
        if (this.state.i < len1) {
            this.setState({i: this.state.i + 1});
        } else if (this.state.waiting < 4 && this.state.j == 3) {
            this.setState({waiting: this.state.waiting + 1});
        } else if (this.state.j < len2) {
            this.setState({j : this.state.j + 1, waiting: 0});
        } else if (this.state.waiting < 7) {
             this.setState({waiting: this.state.waiting + 1});
        } else {
            this.setState({i: 3, j: 3, counter: (this.state.counter + 1) % (this.state.word1s.length), waiting: 0});
        }
    }
    
    render () {
        
        var firstsens = [["A good scientist is ", " towards their conclusions, as long as the methodology is correct."]];
        
        var secondsens = [["If the wording of the contract is ", ", ask for clarification."]];
        
        if (this.state.i >= this.state.word1s[this.state.counter].length) {
            
            var color1 = "green";
            
        } else {
            
            var color1 = "black";
        }
        
        if (this.state.j >= this.state.word2s[this.state.counter].length) {
            
            var color2 = "green";
            
        } else {
            
            var color2 = "black";
            
        }

        return (
        
            <div style={{fontFamily: "lora"}}>{this.state.firstsens[this.state.counter][0]}<input spellcheck="false" className="workinput" type="text"  key = {this.props.showDialog} autocomplete="off" value={this.state.word1s[this.state.counter].slice(0,this.state.i)} style={{backgroundColor: "transparent", outline: "0", wordBreak: "keep-all", flex: "none", display: "inline-block", border: "0", width: (this.state.word1s[this.state.counter].length).toString() + "ch", borderTop: "0", outlineTop: "0", lineHeight: "20px", borderBottom: "1px solid grey", textAlign: "left", color: color1}}/>{this.state.firstsens[this.state.counter][1]}<br></br> <br></br>
            {this.state.secondsens[this.state.counter][0]}<input spellcheck="false" className="workinput" type="text"  key = {this.props.showDialog} autocomplete="off" value={this.state.word2s[this.state.counter].slice(0,this.state.j)} style={{backgroundColor: "transparent", outline: "0", wordBreak: "keep-all", flex: "none", display: "inline-block", border: "0", width: (this.state.word2s[this.state.counter].length).toString() + "ch", borderTop: "0", outlineTop: "0", lineHeight: "20px", borderBottom: "1px solid grey", textAlign: "left", color: color2}}/>{this.state.secondsens[this.state.counter][1]}</div>

        );
}
}




