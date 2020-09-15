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
                <Container fluid>
                <Row>
                <TopBar/>
                </Row>
                    <Row className="mainrow">
                <Col xs="auto" className="sidenav">
                <div className="sidecontent"/>
                </Col>
                    <Col className="maintext">
              <Link to="/read">
                Start reading.
            
              </Link>
              <Link to="/vocab">
                  My Words	
            
              </Link>
              <div> Progress </div>
            </Col>
            </Row>
            </Container>
        );
    }
}
    
