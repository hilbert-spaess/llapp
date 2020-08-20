import React from 'react';
import {Nav, Navbar, Form, FormControl} from 'react-bootstrap';

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
	    
