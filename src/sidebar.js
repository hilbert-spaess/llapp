import React from 'react';
import {Card, Button, Row, Col, Container} from 'react-bootstrap';
import {Home, Settings} from 'react-feather';
import {Link} from 'react-router-dom';

export const BarWrapped = ({WrappedComponent}) => (
    
                <Container fluid>
                            <Row>
                            <TopBar/>
                            </Row>
                                <Row className="mainrow">
                            <Col xs="auto" className="sidenav">
                        <Link to="/">
                        <Home color="green" size={30} style={{marginTop: "3rem"}}/>
                        </Link>
                        <Link to="/vocab">
                            <Settings color="green" size={30} style={{marginTop: "2em"}}/>
                        </Link>
                            </Col>
                                <Col>
                            <WrappedComponent/>
                                </Col>
                                </Row>
                   </Container>
);


export class Sidebar extends React.Component {

    render () {
	return (
	    <div className="sidenav">
		<SideNav/>
		</div>
	);
    }

}

class SideNav extends React.Component {

    render () {
	return (
		<p></p>
	);
    }
}

export class TopBar extends React.Component {

    render () {
	return (
		<div className="topnav">
		<TopNav/>
		</div>
	);
    }
}

class TopNav extends React.Component {

    render () {
	return (
		<p className="navlogo"> RiceCake </p>
	);
    }
}
	    
