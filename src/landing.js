import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import {Stylesheet, css} from 'aphrodite';
import {Card, Container, Row, Col, Nav, Navbar, Form, FormControl, Popover, OverlayTrigger, Overlay, Toast} from 'react-bootstrap';
import {BarWrapped} from './sidebar.js';
import {Auth0Provider, useAuth0, withAuthenticationRequired} from '@auth0/auth0-react';
import {BookOpen, Type, FastForward} from 'react-feather';
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
    

export class Landing1 extends React.Component {
    
    render () {
        return (
            <>
              <nav class="navbar navbar-expand-sm navbar-dark navbar-custom fixed-top">
    <div class="container">
      <a class="navbar-brand" href="/">RiceCake</a>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item signloglink">
            <Link style={{color: "white", marginRight: "1em"}} to="/signup">Sign Up </Link>
          </li>
          <li class="nav-item signloglink">
            <Link style={{color: "white"}} to="/login">Log In</Link>
          </li>
        </ul>
    </div>
  </nav>
<header className="masthead text-center text-white">
    <div className="masthead-content">
      <div className="container">
        <h2 className="masthead-heading mb-0">Read Smarter</h2>
        <h3 className="masthead-subheading mb-0">Interactive, targeted text.</h3>
        <h3 className="masthead-subheading mb-0">The vocab you want to learn.</h3>
            <div align="left">
        <Link align="left" to="/signup" className="btn btn-primary btn-xl rounded-pill mt-5">Sign up now</Link>
            </div>
      </div>
    </div>
    <div className="bg-circle-1 bg-circle"></div>
    <div className="bg-circle-2 bg-circle"></div>
    <div className="bg-circle-3 bg-circle"></div>
    <div className="bg-circle-4 bg-circle"></div>
  </header>

  <section>
    <div className="container">
            
     <div className="row align-items-center">
            <div className="col-lg-6 order-lg-1">
          <div className="p-5">
            <h2 className="display-4">Your goals. Our text.</h2>
            <p style={{fontSize: "20px", marginTop: "2rem"}}>We generate unlimited pieces of text at the level you want, featuring the words you need to learn.
                Helping your child advance their reading age? Studying for the TOEFL exam?
Decide on a personal curriculum, and we'll give you the daily reading sessions you need to master it. <br></br><br></br>
                    Or, show us your level and we'll suggest an ideal curriculum for you.</p>
          </div>
        </div>
        <div className="col-lg-6 order-lg-2">
          <div className="p-5">
            <img style={{padding: "5px"}} className="img-fluid" src={img2}/>
          </div>
        </div>
        
      </div>
    </div>
  </section>

  <section>
    <div className="container">
      <div className="row align-items-center">
        
        <div className="col-lg-6 order-lg-2">
          <div className="p-5">
            <h2 className="display-4">Interactive reading guarantees progress</h2>
            <p style={{fontSize: "20px", marginTop: "2rem"}}>Without intentional repetition, you forget most words you read. Our reading platform is interactive, improving your reading, writing, typing and spelling skills. Interacting with the text is perfect preparation for test-taking.
                </p>
          </div>
        </div>
<div className="col-lg-6 order-lg-1">
          <div className="p-5">
            <img className="img-fluid" src={img1} alt=""/>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section>
    <div className="container">
      <div className="row align-items-center">
      
        <div className="col-lg-6 order-lg-1">
          <div className="p-5">
            <h2 className="display-4">Learn vocab in context. Not with decks.</h2>
            <p style={{fontSize: "20px", marginTop: "2rem"}}>Drilling vocab cards is effective for memorisation, but is less helpful for recognising and using words in context. Our cutting-edge SRS algorithm schedules words to appear naturally in your daily reading. You won't even notice your vocabulary increasing, but you can watch your level grow with our vocabulary tracking tool.</p>
          </div>
        </div>
 <div className="col-lg-6 order-lg-2">
          <div className="p-5">
            <img className="img-fluid" src={img3} alt=""/>
          </div>
        </div>
      </div>
    </div>
  </section>
            
           

 <footer className="py-5 bg-black">
    <div className="container">
      <p className="m-0 text-center text-white small">Copyright &copy; RiceCake 2020</p>
    </div>
  </footer>

            
   </>         );
}
}
