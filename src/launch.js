import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import {Stylesheet, css} from 'aphrodite';
import {Card, Container, Row, Col, Nav, Navbar, Form, FormControl} from 'react-bootstrap';
import {Sidebar, TopBar} from './sidebar.js'

export class Launch extends React.Component {

    state = {
	sidebarOpen: 1
    }

    onSetSidebarOpen = () => {
	this.setState({sidebarOpen: 1});
    }
    
    render () {
        return (
		<div>
		<Sidebar/>
		<TopBar/>
              <Link to="/read" className="split left">
                <div className = "centered"> 
                Start reading.
                </div>
              </Link>
              <Link to="/vocab" className = "split rightHigh">
                <div className = "centered">
                  My Words
            </div>		
              </Link>
              <div className="split rightLow">
<div className = "centered"> Progress </div>
              </div>
            </div>
        );
    }
}
    
