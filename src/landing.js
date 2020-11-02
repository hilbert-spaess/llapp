import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import {Stylesheet, css} from 'aphrodite';
import {Card, Container, Row, Col, Nav, Navbar, Form, FormControl, Popover, OverlayTrigger, Overlay, Toast} from 'react-bootstrap';
import {BarWrapped} from './sidebar.js';
import {Auth0Provider, useAuth0, withAuthenticationRequired} from '@auth0/auth0-react';
import {BookOpen, Type, FastForward, Clock, Edit} from 'react-feather';
import {useApi} from './use-api.js';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';
import img2 from './images/img2.png';
import img1 from './images/img1.png';
import img3 from './images/img3.png';

export class Landing2 extends React.Component {
    
    render () {
        return (
            <BarWrapped WrappedComponent={Landing1}/>
        );
    }
}

export const Landing = () => {
    
    const {user, isAuthenticated, isLoading} = useAuth0();
    
    if (isLoading) {
        return <div></div>;
    }
        
    
    if (isAuthenticated) {
        return <Redirect to="/home"/>;
    }
    
    return <Landing1/>;
}

export class WhyWorks extends React.Component {
        
    render () {
            
        var contentlist = [{"t": "Daily Reviews", "c": "Our Spaced Repetition System shows you exactly the text you need to see every day. Practise recalling words at regular intervals until you recall them instantly. Once you see a word with RiceCake, we guarantee you'll never forget it."}, {"t": "Real Text", "c": "Learn your vocab in the context of real English writing. From academic essays to newspaper articles, improve with real content at your level. We have a huge database of curated text samples."}, {"t": "Your Words", "c": "We suggest new words to meet your English goals. Alternatively, enter new words yourself and watch them turn up in your reading like magic!"}, {"t": "Interactive Reading", "c": "You get better at what you practise. Actively recalling words with interactive exercises means you'll be reaching for your new English skills whenever you write or speak."}, {"t": "Rapid Progress", "c": "Track your progress on your personal dashboard. Watch your vocabulary and grammar increase and solidify with every day's reviews."}]

        var contents = [];

        for (var i =0; i < contentlist.length; i++) {
            
            if (i==0) {
                var icon = {Clock};
            }
            else {
                var icon = <div></div>;
                }
            
            if (i==2) {
                var width="65%";
            } else {
                var width="40%";
            }

            contents.push(<WhyWorksCard data={contentlist[i]} width={width} id={i}/>);
        
        }

        return (
            <>
            <div style={{fontSize: "40px", marginTop: "2em"}}>RiceCake will level up your written English skills systematically and efficiently.</div>
<Container>
    <Row 
     style={{justifyContent: "space-around"}}>
            {contents}
</Row>
            </Container>
<div style={{marginBottom: "5em"}}/>
</>
            
        );
    }
}

class WhyWorksCard extends React.Component {
    
    render () {
        
        return (
            <Card className="whyworkscard" style={{backgroundColor: "#f5f5f5", width: this.props.width, zIndex: "0"}}>
                 <FadeInSection style={{display: "inline-block", zIndex: "1"}}>
                     {this.props.id==0 && <div style={{textAlign: "center"}}><Clock size={40} color="green"/></div>}
{this.props.id==1 && <div style={{textAlign: "center"}}><BookOpen size={40} color="green"/></div>}
{this.props.id==2 && <div style={{textAlign: "center"}}><Type size={40} color="green"/></div>}
{this.props.id==3 && <div style={{textAlign: "center"}}><Edit size={40} color="green"/></div>}
{this.props.id==4 && <div style={{textAlign: "center"}}><FastForward size={40} color="green"/></div>}
                <div className="whyworkstitle">{this.props.data.t}</div>
                <div className="whyworksbody">{this.props.data.c}</div>
</FadeInSection>
</Card>
        );
    }
}

class ForInstitutions extends React.Component {
    
    render () {
        
        return (
            <Container fluid="lg">
            <h1 style={{textAlign: "left", color: "black", marginTop: "1em"}}>RiceCake for Institutions.</h1>
            <div style={{color: "black", textAlign: "left"}}>
            Is the quality of written English a bottleneck for your students? <br></br>
            Would better vocabulary improve performance? <br></br>
            Is time a major constraint? <br></br>
            Find out how we can help you.
            </div>
            <Row style={{justifyContent: "space-evenly", marginTop: "4em"}}>
                <InstitutionCard t="Tailored Lists"/>
                <InstitutionCard t="Exemplar Text"/>
                <InstitutionCard t="Immediate Results"/></Row>
            </Container>
            );
    }
}

class InstitutionCard extends React.Component {
    
    render () {
        
        return (
            
            <Card style={{width: "25%", height: "40vh", borderColor: "white", color: "black"}}>
            <div className="institutiontitle">{this.props.t}</div>
            </Card>
        );
    }
}
            



function FadeInSection(props) {
  const [isVisible, setVisible] = React.useState(true);
  const domRef = React.useRef();
  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting));
    });
    observer.observe(domRef.current);
    return () => observer.unobserve(domRef.current);
  }, []);
  return (
    <div
      className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
      ref={domRef}
    >
      {props.children}
    </div>
  );
}



export class Landing1 extends React.Component {
    
    render () {
        return (
            <div style={{overflow: "scroll"}}>
              <nav class="navbar navbar-expand-sm navbar-dark navbar-custom ">
    <Container fluid="lg">
      <a class="navbar-brand" href="/">RiceCake</a>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item signloglink">
            <Link style={{color: "white", marginRight: "1em"}} to="/signup">Sign Up </Link>
          </li>
          <li class="nav-item signloglink">
            <Link style={{color: "white"}} to="/login">Log In</Link>
          </li>
        </ul>
</Container>
  </nav>
<header className="masthead text-center text-white">
    <div className="masthead-content">
      <Container fluid="lg">
        <h2 className="masthead-heading mb-0" style={{fontSize: "90px"}}>Better words. Better writing.</h2>
        <h3 className="masthead-subheading mb-0" style={{fontSize: "70px"}}>Improve your active vocabulary</h3>
        <h3 className="masthead-subheading mb-0" style={{fontSize: "70px"}}>with minutes of daily reviews.</h3>
            <div align="left">
        <Link align="left" to="/signup" className="btn btn-primary btn-xl rounded-pill mt-5">Sign up now</Link>
            </div>
      </Container>
    </div>
    <div className="bg-circle-1 bg-circle"></div>
    <div className="bg-circle-2 bg-circle"></div>
    <div className="bg-circle-3 bg-circle"></div>
    <div className="bg-circle-4 bg-circle"></div>
  </header>
<Container fluid="lg">
<WhyWorks style={{fontFamily: "roboto"}}/>
</Container>

            
           

 <footer className="py-5 bg-black">
    <div className="container">
      <p className="m-0 text-center text-white small">Copyright &copy; RiceCake 2020</p>
    </div>
  </footer>

            
   </div>         );
}
}
