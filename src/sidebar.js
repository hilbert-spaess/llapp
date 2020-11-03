import React from 'react';
import {Card, Button, Row, Col, Container, DropdownButton, Navbar, Nav, NavDropdown, Form, FormControl} from 'react-bootstrap';
import {Home, Settings, User} from 'react-feather';
import {Link} from 'react-router-dom';
import {useAuth0} from '@auth0/auth0-react';
import bookshelf from './bookshelf.png';
import sideim from './sideim.jpg';

export const FreeBarWrapped = ({WrappedComponent, data, ...args}) => (
    
    <>
    <Sidebar data={data}/>
                     <div style={{marginLeft: "15%", height: "100vh", overflow: "scroll"}}><WrappedComponent {...args} data={data}/>
                                
</div>
</>
);

export const FreeBarWrappedLaunch = ({WrappedComponent, data, ...args}) => (
    
    <>
    <Sidebar data={data}/>
                     <div style={{marginLeft: "15%", height: "100vh", overflow: "hidden"}}><WrappedComponent {...args} data={data}/>
                                
</div>
</>
);


export const FreeBarWrapped2 = ({WrappedComponent, data, ...args}) => (
    
     <>
    <Sidebar2/>
                     <div style={{marginLeft: "15%", height: "100vh", overflow: "scroll"}}><WrappedComponent {...args} data={data}/>
                                
</div>
</>
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
        <NavDropdown style={{fontSize: "1em", marginTop: "1em", marginLeft: "0.5em"}} title={<User size={50}/>} id="basic-nav-dropdown">
        <NavDropdown.Item onClick={() => logout({returnTo: window.location.origin})}>Log out</NavDropdown.Item>
      </NavDropdown>
    );
}


export class Sidebar extends React.Component {

    render () {
	return (
        
	    <div className="sidenav" style={{paddingTop: "1em", textAlign: "left",  backgroundColor: "transparent"}}>
		<div style={{textAlign: "left", marginLeft: "1em"}}><Link style={{marginTop: "40%", fontSize: "2em"}} to={{pathname: "/home", data: this.props.data}}>RiceCake</Link></div>
            <ProfileDropDown/> 
        <div className="sidelink" style={{marginTop: "0.5em", fontSize: "1.5em"}}><Link className="sideclick" to={{pathname: "/home", data: this.props.data}}><Home size={50} style={{marginLeft: "0.5em", marginRight: "1em"}}/></Link></div>
        <div className="sidelink" style={{marginTop: "0.5em", fontSize: "1.5em"}}><Link className="sideclick" to={{pathname: "/vocab", data: this.props.data}}><Settings size={50} style={{marginLeft: "0.5em", marginRight: "1em"}}/></Link></div>
		</div>
	);
    }

}

export class Sidebar2 extends React.Component {

    render () {
	return (
	    <div className="sidenav" style={{paddingTop: "1em", textAlign: "left"}}>
		<div style={{textAlign: "left", marginLeft: "1em"}}><Link style={{ marginTop: "40%", fontSize: "2em"}} to="/home">RiceCake</Link></div>
            <ProfileDropDown/>
        <div className="sidelink" style={{marginTop: "0.5em", fontSize: "1.5em", marginRight: "1em"}}><Link className="sideclick" to="/home"><Home size={50} style={{marginLeft: "0.5em", marginRight: "1em"}}/></Link></div>
       <div className="sidelink" style={{marginTop: "0.5em", fontSize: "1.5em", marginRight: "1em"}}><Link className="sideclick" to="/vocab" style={{marginTop: "1em"}}><Settings size={50} style={{marginLeft: "0.5em", marginRight: "1em"}}/></Link></div>
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
	    
