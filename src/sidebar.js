import React from 'react';
import {Card, Button, Row, Col, Container, DropdownButton, Navbar, Nav, NavDropdown, Form, FormControl} from 'react-bootstrap';
import {Home, Settings, User} from 'react-feather';
import {Link} from 'react-router-dom';
import {useAuth0} from '@auth0/auth0-react';
import bookshelf from './bookshelf.png';

export const FreeBarWrapped = ({WrappedComponent}) => (
    <div>
    <TopBar/>
                <Container fluid>
                                <Row className="mainrow">
                                <Col>
                            <WrappedComponent/>
                                </Col>
                                </Row>
                   </Container>
</div>
);

export const BarWrapped = ({WrappedComponent}) => (
    <div>
    <TopBar/>
                <Container fluid>
                                <Row className="mainrow">
                                <Col>
                            <WrappedComponent/>
                                </Col>
                                </Row>
                   </Container>
     <Navbar bg = "yellow" style={{backgroundColor: "#edeee8"}} fixed="bottom">
    {'\u00A9'} RiceCake 2020 </Navbar>
    
</div>
);

const Profile = () => {
    const {user} = useAuth0();
    
    return (
        <div>
        {user.email}
        <User size={20} style={{marginLeft: "0.5em"}}/>
    </div>
    );
}

const ProfileDropDown = () => {
    const {user, logout} = useAuth0();
    
    return (
        <NavDropdown title={user.email} id="basic-nav-dropdown">
        <NavDropdown.Item onClick={() => logout({returnTo: window.location.origin})}>Log out</NavDropdown.Item>
      </NavDropdown>
    );
}


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

            <Navbar bg="dark" variant="dark" expand="lg">
  <Link to="/"><Navbar.Brand href="/home">RiceCake</Navbar.Brand></Link>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Link to="/home"><Nav.Link href="/home"><Home/></Nav.Link></Link>
      <Link to="/vocab"><Nav.Link href="/vocab"><Settings/></Nav.Link></Link>
    </Nav>
    <Nav className ="mr-sm-2">
            <ProfileDropDown/>
     
    </Nav>
  </Navbar.Collapse>
</Navbar>
            
            );
    }
}

export class TopBar1 extends React.Component {

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
		<p className="navlogo"> <Profile/></p>
	);
    }
}
	    
