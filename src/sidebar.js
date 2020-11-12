import React from 'react';
import {Card, Button, Row, Col, Container, DropdownButton, Navbar, Nav, NavDropdown, Form, FormControl} from 'react-bootstrap';
import {Home, Settings, User} from 'react-feather';
import {Link} from 'react-router-dom';
import {useAuth0} from '@auth0/auth0-react';
import bookshelf from './bookshelf.png';
import sideim from './sideim.jpg';

export const FreeBarWrapped = ({WrappedComponent, data, ...args}) => (
    
    <div className="launchwindow">
    <Sidebar data={data}/>
                     <div style={{marginLeft: "15vw", height: "100vh", overflow: "scroll"}}><WrappedComponent {...args} data={data}/>
                                
</div>
</div>
);



export const FreeBarWrappedLaunch = ({WrappedComponent, data, ...args}) => (
    
    <div className="launchwindow">
    <Sidebar data={data}/>
                     <div style={{marginLeft: "15vw", height: "100vh", overflow: "hidden"}}><WrappedComponent {...args} data={data}/>
                                
</div>
</div>
);


export const FreeBarWrapped2 = ({WrappedComponent, data, fade, onClick,onRedirect, ...args}) => (
    
     <div className="launchwindow">
    <Sidebar2 onClick={onClick}/>
                     <div className={fade ? "fadeout" : ""} style={{marginLeft: "15vw", height: "100vh", overflow: "hidden"}}><WrappedComponent {...args} data={data}/>
                                
</div>
</div>
);

export const BarWrapped = ({WrappedComponent}) => (
    <div>
    <Sidebar/>
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
        <div className="sidelink" style={{marginTop: "5vh", textAlign: "center"}}>
        <NavDropdown style={{fontSize: "1em"}} title={<User size="2vw"/>} id="basic-nav-dropdown">
        <NavDropdown.Item onClick={() => logout({returnTo: window.location.origin})}>Log out</NavDropdown.Item>
      </NavDropdown>
        </div>
    );
}


export class Sidebar extends React.Component {

    render () {
	return (
        
	    <div className="sidenav" style={{paddingTop: "1em", textAlign: "center",  backgroundColor: "transparent"}}>
		<div style={{textAlign: "center"}}><Link style={{marginTop: "40%", fontSize: "2vw", fontFamily: 'Montserrat', fontWeight: "600"}} to={{pathname: "/home", data: this.props.data}}>RiceCake</Link></div>
        <div className="sidelink" style={{textAlign: "center", fontSize: "1.5em", marginTop: "5vh"}}><Link className="sideclick" to={{pathname: "/home", data: this.props.data}}><Home size="2vw"/></Link></div>
        <ProfileDropDown/> 
		</div>
	);
    }

}

export class Sidebar2 extends React.Component {

    render () {
	return (
	    <div className="sidenav" style={{paddingTop: "1em", textAlign: "left"}}>
		<div style={{textAlign: "center"}}><Link style={{ marginTop: "40%", fontSize: "2vw", fontFamily: 'Montserrat', fontWeight: "600"}} to="/home">RiceCake</Link></div>
        <div className="sidelink" style={{textAlign: "center", fontSize: "1.5em", marginTop: "5vh"}}><div onClick={() => {this.props.onClick("/home")}} className="sideclick" to="/home"><Home size="2vw"/></div></div>
        <ProfileDropDown/>
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
  <Link to={{pathname: "/home", data: this.props.data}}><Navbar.Brand>RiceCake</Navbar.Brand></Link>
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

export class TopBar2 extends React.Component {
    
    render () {
        
        return (

            <Navbar bg="dark" variant="dark" expand="lg">
  <Link to="/home"><Navbar.Brand>RiceCake</Navbar.Brand></Link>
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
	    
