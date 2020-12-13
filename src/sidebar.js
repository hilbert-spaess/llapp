import React from 'react';
import {Card, Button, Row, Col, Container, DropdownButton, Navbar, Nav, NavDropdown, Form, FormControl} from 'react-bootstrap';
import {Home, Settings, User} from 'react-feather';
import {Link} from 'react-router-dom';
import {useAuth0} from '@auth0/auth0-react';
import bookshelf from './bookshelf.png';
import sideim from './sideim.jpg';

export const SidebarWrapped = ({WrappedComponent, data, doesRemember, thin, ...args}) => (
    
    <div className="launchwindow">
      <Sidebar data={data}
               doesRemember={doesRemember}
	       thin={thin}
      />
        <div className={thin ? "maincomponent maincomponentthin" : "maincomponent"}><WrappedComponent {...args} data={data}/>
                                
</div>
</div>
);

export class Sidebar extends React.Component {

    render () {

        var tohome = {pathname: "/home", data: this.props.data};
        if (this.props.doesRemember == false) {
            tohome = "/home";
        }
        
	return (
        
	    <div className={(this.props.thin == true) ? "sidenav sidenavthin" : "sidenav"}>
		<div className="sidelogo">{this.props.thin ? "R" : "RiceCake"} </div>
              <div className="sidelink">
                <Link className="sideclick" to={tohome}><Home size="2vw"/></Link>
              </div>
          <ProfileDropDown/> 
	</div>
	);
    }

}

const ProfileDropDown = () => {
    const {user, logout} = useAuth0();
    
    return (
        <div className="sidelink">
        <NavDropdown title={<User size="2vw"/>}>
        <NavDropdown.Item onClick={() => logout({returnTo: window.location.origin})}>Log out</NavDropdown.Item>
      </NavDropdown>
        </div>
    );
}

